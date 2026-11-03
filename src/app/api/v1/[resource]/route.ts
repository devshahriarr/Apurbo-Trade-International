import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma, DocumentType, PartyType, ProjectType, ProjectStatus } from "@prisma/client";
import { canAccessBusiness, getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { amountInWords } from "@/features/documents/amount-words";

const resourceSchema = z.enum(["parties", "projects", "products", "documents"]);
const base = z.object({ businessId: z.string().uuid() });
const itemSchema = z.object({ productId: z.string().uuid().optional().nullable(), description: z.string().trim().min(1), quantity: z.coerce.number().positive(), unit: z.string().optional().nullable(), rate: z.coerce.number().nonnegative().optional().nullable(), remarks: z.string().optional().nullable() });
const recordSchema = z.discriminatedUnion("resource", [
  z.object({ resource: z.literal("parties"), ...base.shape, name: z.string().trim().min(1), companyName: z.string().optional().nullable(), partyType: z.nativeEnum(PartyType).default(PartyType.CUSTOMER), contactPerson: z.string().optional().nullable(), phone: z.string().optional().nullable(), email: z.string().email().optional().or(z.literal("")), address: z.string().optional().nullable(), taxId: z.string().optional().nullable(), notes: z.string().optional().nullable(), isActive: z.boolean().optional() }),
  z.object({ resource: z.literal("projects"), ...base.shape, name: z.string().trim().min(1), projectType: z.nativeEnum(ProjectType), partyId: z.string().uuid().optional().nullable(), tenderNumber: z.string().optional().nullable(), tenderId: z.string().optional().nullable(), workOrderNumber: z.string().optional().nullable(), department: z.string().optional().nullable(), location: z.string().optional().nullable(), description: z.string().optional().nullable(), status: z.nativeEnum(ProjectStatus).optional() }),
  z.object({ resource: z.literal("products"), ...base.shape, name: z.string().trim().min(1), description: z.string().optional().nullable(), sku: z.string().optional().nullable(), unit: z.string().optional().nullable(), defaultRate: z.coerce.number().nonnegative().optional().nullable(), isActive: z.boolean().optional() }),
  z.object({ resource: z.literal("documents"), ...base.shape, documentType: z.nativeEnum(DocumentType), partyId: z.string().uuid().optional().nullable(), projectId: z.string().uuid().optional().nullable(), templateId: z.string().uuid().optional().nullable(), documentDate: z.coerce.date().optional(), validUntil: z.coerce.date().optional().nullable(), referenceNumber: z.string().optional().nullable(), subject: z.string().optional().nullable(), notes: z.string().optional().nullable(), terms: z.string().optional().nullable(), partyRole: z.enum(["CUSTOMER", "SUPPLIER", "CONTRACTOR", "RECEIVER", "OTHER"]).optional(), discountType: z.enum(["FIXED", "PERCENTAGE"]).optional().nullable(), discountValue: z.coerce.number().nonnegative().optional().nullable(), taxRate: z.coerce.number().nonnegative().optional().nullable(), items: z.array(itemSchema).default([]), customFields: z.record(z.string(), z.unknown()).default({}) }),
]);

async function access(request: Request) {
  const user = await getAdminUser();
  if (!user) return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const url = new URL(request.url);
  const businessId = url.searchParams.get("businessId");
  if (!businessId) return { response: NextResponse.json({ error: "businessId is required" }, { status: 400 }) };
  const membership = await canAccessBusiness(user.id, businessId);
  if (!membership) return { response: NextResponse.json({ error: "Business not found" }, { status: 404 }) };
  return { user, businessId, role: membership.role };
}

export async function GET(request: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource } = await context.params;
  const parsedResource = resourceSchema.safeParse(resource);
  if (!parsedResource.success) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const auth = await access(request);
  if ("response" in auth) return auth.response;
  const { businessId } = auth;
  const params = new URL(request.url).searchParams;
  const q = params.get("q")?.trim();
  if (resource === "parties") return NextResponse.json(await prisma.party.findMany({ where: { businessId, ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { companyName: { contains: q, mode: "insensitive" } }] } : {}) }, orderBy: { name: "asc" } }));
  if (resource === "projects") return NextResponse.json(await prisma.project.findMany({ where: { businessId, ...(q ? { name: { contains: q, mode: "insensitive" } } : {}) }, include: { party: { select: { name: true } } }, orderBy: { updatedAt: "desc" } }));
  if (resource === "products") return NextResponse.json(await prisma.product.findMany({ where: { businessId, ...(q ? { name: { contains: q, mode: "insensitive" } } : {}) }, orderBy: { name: "asc" } }));
  const filters = z.object({ type: z.nativeEnum(DocumentType).optional(), status: z.enum(["DRAFT", "ISSUED", "CANCELLED"]).optional(), partyId: z.string().uuid().optional(), projectId: z.string().uuid().optional(), from: z.coerce.date().optional(), to: z.coerce.date().optional() }).safeParse({ type: params.get("type") || undefined, status: params.get("status") || undefined, partyId: params.get("partyId") || undefined, projectId: params.get("projectId") || undefined, from: params.get("from") || undefined, to: params.get("to") || undefined });
  if (!filters.success) return NextResponse.json({ error: "Invalid document filter" }, { status: 400 });
  const { type, status, partyId, projectId, from, to } = filters.data;
  return NextResponse.json(await prisma.document.findMany({ where: { businessId, documentType: type, status, partyId, projectId, ...(from || to ? { documentDate: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}), ...(q ? { OR: [{ documentNumber: { contains: q, mode: "insensitive" } }, { subject: { contains: q, mode: "insensitive" } }] } : {}) }, include: { party: { select: { name: true } }, project: { select: { name: true } }, _count: { select: { items: true } } }, orderBy: { updatedAt: "desc" }, take: 100 }));
}

export async function POST(request: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource } = await context.params;
  const parsedResource = resourceSchema.safeParse(resource);
  if (!parsedResource.success) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const auth = await access(request);
  if ("response" in auth) return auth.response;
  if (["VIEWER"].includes(auth.role)) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = recordSchema.safeParse({ ...body, resource });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.businessId !== auth.businessId) return NextResponse.json({ error: "Business mismatch" }, { status: 400 });

  try {
    if (parsed.data.resource === "parties") {
      const { resource: _r, businessId, ...data } = parsed.data;
      void _r;
      const row = await prisma.party.create({ data: { ...data, email: data.email || null, businessId } });
      return NextResponse.json(row, { status: 201 });
    }
    if (parsed.data.resource === "projects") {
      const { resource: _r, businessId, ...data } = parsed.data;
      void _r;
      if (data.partyId && !(await prisma.party.findFirst({ where: { id: data.partyId, businessId } }))) return NextResponse.json({ error: "Party not found in this business" }, { status: 400 });
      return NextResponse.json(await prisma.project.create({ data: { ...data, businessId } }), { status: 201 });
    }
    if (parsed.data.resource === "products") {
      const { resource: _r, businessId, ...data } = parsed.data;
      void _r;
      return NextResponse.json(await prisma.product.create({ data: { ...data, businessId, defaultRate: data.defaultRate == null ? null : new Prisma.Decimal(data.defaultRate) } }), { status: 201 });
    }
    const data = parsed.data;
    const [business, party, project, template, items] = await Promise.all([
      prisma.business.findFirst({ where: { id: data.businessId, members: { some: { userId: auth.user.id } } } }),
      data.partyId ? prisma.party.findFirst({ where: { id: data.partyId, businessId: data.businessId } }) : null,
      data.projectId ? prisma.project.findFirst({ where: { id: data.projectId, businessId: data.businessId } }) : null,
      data.templateId ? prisma.documentTemplate.findFirst({ where: { id: data.templateId, businessId: data.businessId } }) : null,
      Promise.resolve(data.items),
    ]);
    if (!business || (data.partyId && !party) || (data.projectId && !project) || (data.templateId && !template)) return NextResponse.json({ error: "Related record not found in this business" }, { status: 400 });
    const productIds = [...new Set(items.flatMap((item) => item.productId ? [item.productId] : []))];
    if (productIds.length && await prisma.product.count({ where: { businessId: data.businessId, id: { in: productIds } } }) !== productIds.length) return NextResponse.json({ error: "Every selected product must belong to this business" }, { status: 400 });
    const financial = data.documentType !== DocumentType.DELIVERY_CHALLAN && data.documentType !== DocumentType.WORK_ORDER && data.documentType !== DocumentType.MONEY_RECEIPT;
    if (financial && items.some((item) => item.rate == null)) return NextResponse.json({ error: "A rate is required for each financial line item" }, { status: 400 });
    const subtotal = financial ? items.reduce((sum, item) => sum.plus(new Prisma.Decimal(item.quantity).mul(item.rate ?? 0)), new Prisma.Decimal(0)).toDecimalPlaces(2) : null;
    const discount = subtotal && data.discountValue ? data.discountType === "PERCENTAGE" ? subtotal.mul(data.discountValue).div(100) : new Prisma.Decimal(data.discountValue) : new Prisma.Decimal(0);
    const roundedDiscount = discount.toDecimalPlaces(2);
    if (subtotal && roundedDiscount.greaterThan(subtotal)) return NextResponse.json({ error: "Discount cannot exceed subtotal" }, { status: 400 });
    const tax = subtotal ? subtotal.minus(roundedDiscount).mul(data.taxRate ?? 0).div(100).toDecimalPlaces(2) : new Prisma.Decimal(0);
    const total = subtotal ? subtotal.minus(roundedDiscount).plus(tax).toDecimalPlaces(2) : null;
    const amountInput = Number(data.customFields.amount ?? 0);
    if (data.documentType === DocumentType.MONEY_RECEIPT && (!Number.isFinite(amountInput) || amountInput <= 0 || !data.customFields.purpose)) return NextResponse.json({ error: "Money receipts need a positive amount and purpose" }, { status: 400 });
    const receiptAmount = data.documentType === DocumentType.MONEY_RECEIPT ? new Prisma.Decimal(String(data.customFields.amount)) : null;
    const row = await prisma.document.create({ data: {
      businessId: data.businessId, createdById: auth.user.id, documentType: data.documentType, partyId: data.partyId, projectId: data.projectId, templateId: data.templateId,
      documentDate: data.documentDate, validUntil: data.validUntil, referenceNumber: data.referenceNumber, subject: data.subject, notes: data.notes, terms: data.terms, partyRole: data.partyRole,
      discountType: data.discountType, discountValue: data.discountValue == null ? null : new Prisma.Decimal(data.discountValue), discountAmount: subtotal ? roundedDiscount : null,
      subtotal, taxRate: data.taxRate == null ? null : new Prisma.Decimal(data.taxRate), taxAmount: subtotal ? tax : null, totalAmount: receiptAmount ?? total,
      amountInWords: receiptAmount ? amountInWords(receiptAmount.toString()) : total ? amountInWords(total.toString()) : null,
      businessSnapshot: { name: business.name, nameBn: business.nameBn, logo: business.logo, address: business.address, phone: business.phone, email: business.email, footerText: business.footerText, currency: business.currency },
      partySnapshot: party ? { name: party.name, companyName: party.companyName, address: party.address, phone: party.phone, email: party.email } : Prisma.JsonNull,
      customFields: JSON.parse(JSON.stringify(data.customFields)) as Prisma.InputJsonObject,
      items: { create: items.map((item, sortOrder) => ({ productId: item.productId, description: item.description, quantity: new Prisma.Decimal(item.quantity), unit: item.unit, rate: item.rate == null ? null : new Prisma.Decimal(item.rate), amount: item.rate == null ? null : new Prisma.Decimal(item.quantity).mul(item.rate), remarks: item.remarks, sortOrder })) },
      auditLogs: { create: { userId: auth.user.id, action: "DOCUMENT_CREATED", details: { status: "DRAFT", documentType: data.documentType } } },
    }, include: { items: true } });
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "A record with this unique value already exists" }, { status: 409 });
    console.error("Admin resource create failed", error);
    return NextResponse.json({ error: "Unable to save this record" }, { status: 500 });
  }
}
