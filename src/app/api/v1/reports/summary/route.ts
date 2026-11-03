import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const businessId = new URL(request.url).searchParams.get("businessId");
  if (!businessId || !(await prisma.businessMember.findUnique({ where: { userId_businessId: { userId: user.id, businessId } } }))) return NextResponse.json({ error: "Business not found" }, { status: 404 });
  const [documents, invoices, challans, projects, recent] = await Promise.all([
    prisma.document.count({ where: { businessId } }),
    prisma.document.count({ where: { businessId, documentType: "INVOICE" } }),
    prisma.document.count({ where: { businessId, documentType: "DELIVERY_CHALLAN" } }),
    prisma.project.count({ where: { businessId } }),
    prisma.document.findMany({ where: { businessId }, include: { party: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 6 }),
  ]);
  return NextResponse.json({ documents, invoices, challans, projects, recent });
}
