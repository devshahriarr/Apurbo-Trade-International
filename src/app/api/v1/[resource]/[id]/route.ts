import { NextResponse } from "next/server";
import { z } from "zod";
import { canAccessBusiness, getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const allowed = new Set(["parties", "projects", "products", "documents"]);
const patchSchema = z.object({ name: z.string().trim().min(1).optional(), companyName: z.string().nullable().optional(), phone: z.string().nullable().optional(), email: z.string().email().nullable().optional(), address: z.string().nullable().optional(), notes: z.string().nullable().optional(), description: z.string().nullable().optional(), unit: z.string().nullable().optional(), sku: z.string().nullable().optional(), defaultRate: z.coerce.number().nonnegative().nullable().optional(), partyType: z.enum(["CUSTOMER", "SUPPLIER", "CONTRACTOR", "BOTH", "OTHER"]).optional(), projectType: z.enum(["TENDER", "LOCAL"]).optional(), status: z.enum(["PLANNING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(), tenderNumber: z.string().nullable().optional(), documentType: z.enum(["INVOICE", "DELIVERY_CHALLAN", "CASH_MEMO", "MONEY_RECEIPT", "QUOTATION", "PURCHASE_ORDER", "WORK_ORDER", "OTHER"]).optional(), subject: z.string().nullable().optional() }).strict();

export async function PATCH(request: Request, context: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await context.params;
  if (!allowed.has(resource)) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  const idField: string = id;
  const data = parsed.data;
  const record = resource === "parties" ? await prisma.party.findFirst({ where: { id: idField } }) : resource === "projects" ? await prisma.project.findFirst({ where: { id: idField } }) : resource === "products" ? await prisma.product.findFirst({ where: { id: idField } }) : await prisma.document.findFirst({ where: { id: idField } });
  if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });
  const membership = await canAccessBusiness(user.id, record.businessId);
  if (!membership) return NextResponse.json({ error: "Record not found" }, { status: 404 });
  if (membership.role === "VIEWER") return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  if (resource === "documents") return NextResponse.json({ error: "Documents can only be edited while draft through the document editor" }, { status: 400 });
  if (resource === "parties") return NextResponse.json(await prisma.party.update({ where: { id: idField }, data }));
  if (resource === "projects") return NextResponse.json(await prisma.project.update({ where: { id: idField }, data }));
  return NextResponse.json(await prisma.product.update({ where: { id: idField }, data }));
}

export async function DELETE(request: Request, context: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await context.params;
  if (!["parties", "projects", "products"].includes(resource)) return NextResponse.json({ error: "Deletion is not allowed for this resource" }, { status: 405 });
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const record = resource === "parties" ? await prisma.party.findFirst({ where: { id } }) : resource === "projects" ? await prisma.project.findFirst({ where: { id } }) : await prisma.product.findFirst({ where: { id } });
  if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });
  const membership = await canAccessBusiness(user.id, record.businessId);
  if (!membership) return NextResponse.json({ error: "Record not found" }, { status: 404 });
  if (["VIEWER", "OPERATOR"].includes(membership.role)) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  if (resource === "parties") await prisma.party.update({ where: { id }, data: { isActive: false } });
  else if (resource === "projects") await prisma.project.update({ where: { id }, data: { status: "CANCELLED" } });
  else await prisma.product.update({ where: { id }, data: { isActive: false } });
  return new Response(null, { status: 204 });
}
