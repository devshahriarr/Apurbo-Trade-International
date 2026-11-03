import { NextResponse } from "next/server";
import { z } from "zod";
import { canAccessBusiness, getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const businessId = new URL(request.url).searchParams.get("businessId");
  if (!businessId || !(await canAccessBusiness(user.id, businessId))) return NextResponse.json({ error: "Business not found" }, { status: 404 });
  return NextResponse.json(await prisma.documentTemplate.findMany({ where: { businessId }, orderBy: [{ documentType: "asc" }, { name: "asc" }] }));
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = z.object({ businessId: z.string().uuid(), documentType: z.enum(["INVOICE", "DELIVERY_CHALLAN", "CASH_MEMO", "MONEY_RECEIPT", "QUOTATION", "PURCHASE_ORDER", "WORK_ORDER", "OTHER"]), name: z.string().trim().min(2), designVariant: z.enum(["ORIGINAL", "MODERN"]), pageSize: z.enum(["A4", "A5", "LETTER", "CUSTOM"]).default("A4"), isDefault: z.boolean().default(false) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid template details", details: parsed.error.flatten() }, { status: 400 });
  const membership = await canAccessBusiness(user.id, parsed.data.businessId);
  if (!membership) return NextResponse.json({ error: "Business not found" }, { status: 404 });
  if (["VIEWER", "OPERATOR"].includes(membership.role)) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  const row = await prisma.documentTemplate.create({ data: { ...parsed.data, config: { showLogo: true, showHeader: true, copiesPerPage: 1 } } });
  return NextResponse.json(row, { status: 201 });
}
