import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const businesses = await prisma.business.findMany({
    where: { members: { some: { userId: user.id } } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, nameBn: true, logo: true, address: true, phone: true, email: true, website: true, currency: true, isActive: true },
  });
  return NextResponse.json(businesses);
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await prisma.businessMember.findFirst({ where: { userId: user.id, role: { in: ["OWNER", "ADMIN"] } } });
  if (!data) return NextResponse.json({ error: "Only an owner or admin can add a business" }, { status: 403 });
  const parsed = z.object({ name: z.string().trim().min(2), nameBn: z.string().optional(), address: z.string().optional(), phone: z.string().optional(), email: z.string().email().optional().or(z.literal("")), website: z.string().url().optional().or(z.literal("")), currency: z.string().length(3).default("BDT") }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid business details", details: parsed.error.flatten() }, { status: 400 });
  const row = await prisma.$transaction(async (tx) => {
    const business = await tx.business.create({ data: { ...parsed.data, email: parsed.data.email || null, website: parsed.data.website || null } });
    await tx.businessMember.create({ data: { userId: user.id, businessId: business.id, role: "OWNER" } });
    return business;
  });
  return NextResponse.json(row, { status: 201 });
}
