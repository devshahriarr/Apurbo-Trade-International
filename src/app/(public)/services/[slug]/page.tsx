import { getServices, getServiceBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import PageHero from "@/components/common/PageHero";
import ServiceDetail from "@/components/services/ServiceDetail";
import ContactCTA from "@/components/home/ContactCTA";

export async function generateStaticParams() {
  const services = getServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <PageHero 
        title={service.title} 
        description={service.summary}
      />
      <ServiceDetail service={service} />
      <ContactCTA />
    </>
  );
}
