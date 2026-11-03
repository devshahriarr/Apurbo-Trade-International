import PageHero from "@/components/common/PageHero";
import ServicesGrid from "@/components/services/ServicesGrid";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ContactCTA from "@/components/home/ContactCTA";

export default function ServicesPage() {
  return (
    <>
      <PageHero 
        title="Our Services" 
        description="Professional contracting, engineering, procurement and supply solutions for modern infrastructure."
        eyebrow="What We Do"
      />
      <ServicesGrid />
      <WhyChooseUs />
      <ContactCTA />
    </>
  );
}
