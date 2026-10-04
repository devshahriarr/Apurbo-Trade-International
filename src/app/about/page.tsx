import AboutHero from "@/components/about/AboutHero";
import CompanyOverview from "@/components/about/CompanyOverview";
import BusinessActivities from "@/components/home/BusinessActivities";
import VisionMission from "@/components/home/VisionMission";
import CoreValues from "@/components/home/CoreValues";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ProprietorMessage from "@/components/home/ProprietorMessage";
import ContactCTA from "@/components/home/ContactCTA";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CompanyOverview />
      <BusinessActivities />
      <VisionMission />
      <CoreValues />
      <WhyChooseUs />
      <ProprietorMessage />
      <ContactCTA />
    </>
  );
}
