import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "ATI Administrator";
  if (!email || !password || password.length < 12) throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters before seeding.");

  const ati = await prisma.business.upsert({
    where: { id: "f5f5a340-5416-49cc-a3dc-53dbe5f0d001" },
    update: {},
    create: { id: "f5f5a340-5416-49cc-a3dc-53dbe5f0d001", name: "Apurbo Trade International", phone: "01680-966570, 01627-631140", currency: "BDT" },
  });
  const arj = await prisma.business.upsert({
    where: { id: "f5f5a340-5416-49cc-a3dc-53dbe5f0d002" },
    update: {},
    create: { id: "f5f5a340-5416-49cc-a3dc-53dbe5f0d002", name: "ARJ Tex Accessories", address: "House #43/2, Dohadia Molla Para, Dakshinkhan, Uttara, Dhaka-1230", phone: "01680966570, 01715 659 599", email: "arjtexaccessories@gmail.com", currency: "BDT" },
  });
  const user = await prisma.user.upsert({ where: { email }, update: { name, passwordHash: await hash(password, 12), isActive: true }, create: { name, email, passwordHash: await hash(password, 12) } });
  for (const business of [ati, arj]) await prisma.businessMember.upsert({ where: { userId_businessId: { userId: user.id, businessId: business.id } }, update: { role: UserRole.OWNER }, create: { userId: user.id, businessId: business.id, role: UserRole.OWNER } });
}

main().finally(() => prisma.$disconnect());
