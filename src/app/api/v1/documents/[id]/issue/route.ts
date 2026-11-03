import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { canAccessBusiness, getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const prefixes: Record<string, string> = { INVOICE: "INV", DELIVERY_CHALLAN: "DC", CASH_MEMO: "CM", MONEY_RECEIPT: "MR", QUOTATION: "QT", PURCHASE_ORDER: "PO", WORK_ORDER: "WO", OTHER: "DOC" };
const shortBusiness = (name: string) => name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3) || "BIZ";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const document = await prisma.document.findFirst({ where: { id } });
  if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  const membership = await canAccessBusiness(user.id, document.businessId);
  if (!membership) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  if (["VIEWER", "OPERATOR"].includes(membership.role)) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  if (document.status !== "DRAFT") return NextResponse.json({ error: "Only drafts can be issued" }, { status: 409 });
  const businessName = (document.businessSnapshot as { name?: string }).name ?? "Business";
  const year = "ALL";
  const sequenceKey = { businessId_documentType_fiscalYear: { businessId: document.businessId, documentType: document.documentType, fiscalYear: year } };
  try {
    let issued;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
       issued = await prisma.$transaction(async (tx) => {
      const sequence = await tx.documentSequence.upsert({
        where: sequenceKey,
        create: { businessId: document.businessId, documentType: document.documentType, fiscalYear: year, prefix: `${shortBusiness(businessName)}-${prefixes[document.documentType]}`, lastNumber: 1, padding: 4 },
        update: { lastNumber: { increment: 1 } },
      });
      const number = `${sequence.prefix}-${String(sequence.lastNumber).padStart(sequence.padding, "0")}`;
      const updated = await tx.document.updateMany({ where: { id, businessId: document.businessId, status: "DRAFT", documentNumber: null }, data: { documentNumber: number, status: "ISSUED", issuedAt: new Date() } });
      if (updated.count !== 1) throw new Error("Document changed before issue");
      await tx.auditLog.create({ data: { userId: user.id, documentId: id, action: "DOCUMENT_ISSUED", details: { number } } });
      return tx.document.findUniqueOrThrow({ where: { id }, include: { items: true } });
       }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
       break;
      } catch (error) {
       if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034" && attempt < 2) continue;
       throw error;
      }
    }
    return NextResponse.json(issued);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && ["P2002", "P2034"].includes(error.code)) return NextResponse.json({ error: "Numbering conflict; please retry issuing" }, { status: 409 });
    console.error("Document issue failed", error);
    return NextResponse.json({ error: "Unable to issue document" }, { status: 409 });
  }
}
