import { NextResponse } from "next/server";
import { z } from "zod";
import { canAccessBusiness, getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const businessPatch = z.object({ name: z.string().trim().min(2).optional(), nameBn: z.string().nullable().optional(), logo: z.string().url().nullable().or(z.literal("")).optional(), address: z.string().nullable().optional(), phone: z.string().nullable().optional(), email: z.string().email().nullable().or(z.literal("")).optional(), website: z.string().url().nullable().or(z.literal("")).optional(), footerText: z.string().nullable().optional(), currency: z.string().trim().length(3).optional(), isActive: z.boolean().optional() }).strict();

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const membership = await canAccessBusiness(user.id, id);
  if (!membership) return NextResponse.json({ error: "Business not found" }, { status: 404 });
  if (!["OWNER", "ADMIN"].includes(membership.role)) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  const parsed = businessPatch.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid business profile", details: parsed.error.flatten() }, { status: 400 });
  const row = await prisma.business.update({ where: { id }, data: { ...parsed.data, logo: parsed.data.logo || null, email: parsed.data.email || null, website: parsed.data.website || null } });
  return NextResponse.json(row);
}
