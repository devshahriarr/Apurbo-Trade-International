import { notFound } from "next/navigation";
import { getAdminUser, canAccessBusiness } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import PrintDocument from "@/components/admin/PrintDocument";

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAdminUser();
  if (!user) notFound();
  const document = await prisma.document.findFirst({ where: { id }, include: { items: { orderBy: { sortOrder: "asc" } }, template: true } });
  if (!document || !(await canAccessBusiness(user.id, document.businessId))) notFound();
  return <PrintDocument data={JSON.parse(JSON.stringify(document))}/>;
}
