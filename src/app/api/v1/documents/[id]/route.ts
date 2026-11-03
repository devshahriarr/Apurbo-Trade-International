import { NextResponse } from "next/server";
import { Prisma, DocumentType } from "@prisma/client";
import { z } from "zod";
import { canAccessBusiness, getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { amountInWords } from "@/features/documents/amount-words";

const itemSchema = z.object({ productId: z.string().uuid().optional().nullable(), description: z.string().trim().min(1), quantity: z.coerce.number().positive(), unit: z.string().optional().nullable(), rate: z.coerce.number().nonnegative().optional().nullable(), remarks: z.string().optional().nullable() });
const patchSchema = z.object({ partyId: z.string().uuid().nullable().optional(), projectId: z.string().uuid().nullable().optional(), templateId: z.string().uuid().nullable().optional(), documentDate: z.coerce.date().optional(), validUntil: z.coerce.date().nullable().optional(), referenceNumber: z.string().nullable().optional(), subject: z.string().nullable().optional(), notes: z.string().nullable().optional(), terms: z.string().nullable().optional(), discountType: z.enum(["FIXED", "PERCENTAGE"]).nullable().optional(), discountValue: z.coerce.number().nonnegative().nullable().optional(), taxRate: z.coerce.number().nonnegative().nullable().optional(), items: z.array(itemSchema).optional(), customFields: z.record(z.string(), z.unknown()).optional() });

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const row = await prisma.document.findFirst({ where: { id }, include: { party: true, project: true, template: true, items: { orderBy: { sortOrder: "asc" } } } });
  if (!row || !(await canAccessBusiness(user.id, row.businessId))) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  const document = await prisma.document.findFirst({ where: { id } });
  if (!document || !(await canAccessBusiness(user.id, document.businessId))) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  if (["VIEWER", "OPERATOR"].includes((await canAccessBusiness(user.id, document.businessId))?.role ?? "VIEWER")) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  if (document.status !== "DRAFT") return NextResponse.json({ error: "Issued and cancelled documents cannot be edited" }, { status: 409 });
  const data = parsed.data;
  for (const [model, value] of [["party", data.partyId], ["project", data.projectId], ["template", data.templateId]] as const) {
    if (!value) continue;
    const found = model === "party" ? await prisma.party.findFirst({ where: { id: value, businessId: document.businessId } }) : model === "project" ? await prisma.project.findFirst({ where: { id: value, businessId: document.businessId } }) : await prisma.documentTemplate.findFirst({ where: { id: value, businessId: document.businessId } });
    if (!found) return NextResponse.json({ error: `Selected ${model} does not belong to this business` }, { status: 400 });
  }
  const partyId = data.partyId === undefined ? document.partyId : data.partyId;
  const party = partyId ? await prisma.party.findUnique({ where: { id: partyId } }) : null;
  const items = data.items;
  if (items) {
    const productIds = [...new Set(items.flatMap((item) => item.productId ? [item.productId] : []))];
    if (productIds.length && await prisma.product.count({ where: { businessId: document.businessId, id: { in: productIds } } }) !== productIds.length) return NextResponse.json({ error: "Every selected product must belong to this business" }, { status: 400 });
  }
  const type = document.documentType;
  const financial = type !== DocumentType.DELIVERY_CHALLAN && type !== DocumentType.WORK_ORDER && type !== DocumentType.MONEY_RECEIPT;
  if (financial && items?.some((item) => item.rate == null)) return NextResponse.json({ error: "A rate is required for each financial line item" }, { status: 400 });
  const subtotal = financial ? items ? items.reduce((sum, item) => sum.plus(new Prisma.Decimal(item.quantity).mul(item.rate ?? 0)), new Prisma.Decimal(0)).toDecimalPlaces(2) : document.subtotal : null;
  const discountValue = data.discountValue === undefined ? document.discountValue : data.discountValue == null ? null : new Prisma.Decimal(data.discountValue);
  const discountType = data.discountType === undefined ? document.discountType : data.discountType;
  const discount = subtotal ? (discountValue ? discountType === "PERCENTAGE" ? subtotal.mul(discountValue).div(100) : new Prisma.Decimal(discountValue) : new Prisma.Decimal(0)).toDecimalPlaces(2) : undefined;
  if (subtotal && discount && discount.greaterThan(subtotal)) return NextResponse.json({ error: "Discount cannot exceed subtotal" }, { status: 400 });
  const taxRate = data.taxRate === undefined ? document.taxRate : data.taxRate == null ? null : new Prisma.Decimal(data.taxRate);
  const tax = subtotal ? subtotal.minus(discount ?? 0).mul(taxRate ?? 0).div(100).toDecimalPlaces(2) : null;
  const total = subtotal ? subtotal.minus(discount ?? 0).plus(tax ?? 0).toDecimalPlaces(2) : null;
  const currentFields = document.customFields && typeof document.customFields === "object" && !Array.isArray(document.customFields) ? document.customFields as Record<string, unknown> : {};
  const customFields = { ...currentFields, ...data.customFields };
  const receiptInput = Number(customFields.amount ?? 0);
  if (type === DocumentType.MONEY_RECEIPT && (!Number.isFinite(receiptInput) || receiptInput <= 0 || !customFields.purpose)) return NextResponse.json({ error: "Money receipts need a positive amount and purpose" }, { status: 400 });
  const receiptTotal = type === DocumentType.MONEY_RECEIPT ? new Prisma.Decimal(String(customFields.amount)) : null;
  try {
    const updated = await prisma.$transaction(async (tx) => {
      const row = await tx.document.update({ where: { id }, data: {
        partyId: data.partyId, projectId: data.projectId, templateId: data.templateId, documentDate: data.documentDate, validUntil: data.validUntil, referenceNumber: data.referenceNumber, subject: data.subject, notes: data.notes, terms: data.terms,
        discountType, discountValue, subtotal, discountAmount: discount, taxRate, taxAmount: tax, totalAmount: receiptTotal ?? total, amountInWords: receiptTotal ? amountInWords(receiptTotal.toString()) : total ? amountInWords(total.toString()) : null,
        ...(data.partyId !== undefined ? { partySnapshot: party ? { name: party.name, companyName: party.companyName, address: party.address, phone: party.phone, email: party.email } : Prisma.JsonNull } : {}),
        ...(data.items ? { items: { deleteMany: {}, create: data.items.map((item, sortOrder) => ({ productId: item.productId, description: item.description, quantity: new Prisma.Decimal(item.quantity), unit: item.unit, rate: item.rate == null ? null : new Prisma.Decimal(item.rate), amount: item.rate == null ? null : new Prisma.Decimal(item.quantity).mul(item.rate).toDecimalPlaces(2), remarks: item.remarks, sortOrder })) } } : {}),
        ...(data.customFields ? { customFields: JSON.parse(JSON.stringify(customFields)) as Prisma.InputJsonObject } : {}),
      }, include: { items: { orderBy: { sortOrder: "asc" } } } });
      await tx.auditLog.create({ data: { userId: user.id, documentId: id, action: "DRAFT_UPDATED", details: { changedFields: Object.keys(data) } } });
      return row;
    });
    return NextResponse.json(updated);
  } catch (error) { console.error("Draft update failed", error); return NextResponse.json({ error: "Unable to update this draft" }, { status: 500 }); }
}
