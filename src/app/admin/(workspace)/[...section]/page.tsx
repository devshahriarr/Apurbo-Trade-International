import { notFound } from "next/navigation";
import AdminPage from "@/components/admin/AdminPage";

const sections = new Set(["businesses", "parties", "projects", "products", "documents", "templates", "reports", "settings"]);
export default async function SectionPage({ params }: { params: Promise<{ section: string[] }> }) {
  const { section } = await params;
  if (!sections.has(section[0]) || section.length > 1) notFound();
  return <AdminPage section={section[0]}/>;
}
