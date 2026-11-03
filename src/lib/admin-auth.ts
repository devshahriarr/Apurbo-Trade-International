import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAdminUser() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;
  return prisma.user.findFirst({ where: { id: userId, isActive: true } });
}

export async function canAccessBusiness(userId: string, businessId: string) {
  const membership = await prisma.businessMember.findUnique({
    where: { userId_businessId: { userId, businessId } },
    select: { role: true },
  });
  return membership;
}
