import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/admin/login");
  return <AdminShell userName={session.user.name ?? "Administrator"}>{children}</AdminShell>;
}
