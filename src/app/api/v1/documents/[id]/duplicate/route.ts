import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { canAccessBusiness, getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const source = await prisma.document.findFirst({ where: { id }, include: { items: { orderBy: { sortOrder: "asc" } } } });
  if (!source || !(await canAccessBusiness(user.id, source.businessId))) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  const copy = await prisma.document.create({ data: {
    businessId: source.businessId, createdById: user.id, documentType: source.documentType, documentDate: new Date(), validUntil: source.validUntil, referenceNumber: source.referenceNumber, subject: source.subject, partyRole: source.partyRole, partyId: source.partyId, projectId: source.projectId, templateId: source.templateId,
    businessSnapshot: JSON.parse(JSON.stringify(source.businessSnapshot)) as Prisma.InputJsonValue, partySnapshot: source.partySnapshot == null ? Prisma.JsonNull : JSON.parse(JSON.stringify(source.partySnapshot)) as Prisma.InputJsonValue, subtotal: source.subtotal ?? undefined, discountType: source.discountType, discountValue: source.discountValue ?? undefined, discountAmount: source.discountAmount ?? undefined, taxRate: source.taxRate ?? undefined, taxAmount: source.taxAmount ?? undefined, totalAmount: source.totalAmount ?? undefined, amountInWords: source.amountInWords, notes: source.notes, terms: source.terms, customFields: JSON.parse(JSON.stringify(source.customFields)) as Prisma.InputJsonValue,
    items: { create: source.items.map(({ productId, description, quantity, unit, rate, amount, remarks, sortOrder }) => ({ productId, description, quantity, unit, rate, amount, remarks, sortOrder })) },
    auditLogs: { create: { userId: user.id, action: "DOCUMENT_DUPLICATED", details: { sourceDocumentId: source.id } } },
  }, include: { items: true } });
  return NextResponse.json(copy, { status: 201 });
}
