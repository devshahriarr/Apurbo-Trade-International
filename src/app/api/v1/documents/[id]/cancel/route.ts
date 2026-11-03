import { NextResponse } from "next/server";
import { z } from "zod";
import { canAccessBusiness, getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = z.object({ reason: z.string().trim().min(3).max(500) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "A cancellation reason is required" }, { status: 400 });
  const document = await prisma.document.findFirst({ where: { id } });
  if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  const membership = await canAccessBusiness(user.id, document.businessId);
  if (!membership) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  if (["VIEWER", "OPERATOR"].includes(membership.role)) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  if (document.status !== "ISSUED") return NextResponse.json({ error: "Only issued documents can be cancelled" }, { status: 409 });
  const [updated] = await prisma.$transaction([
    prisma.document.update({ where: { id }, data: { status: "CANCELLED", cancelledAt: new Date(), cancellationReason: parsed.data.reason } }),
    prisma.auditLog.create({ data: { userId: user.id, documentId: id, action: "DOCUMENT_CANCELLED", details: { reason: parsed.data.reason } } }),
  ]);
  return NextResponse.json(updated);
}
