import Hero from "@/components/home/Hero";
import TrustPoints from "@/components/home/TrustPoints";
import AboutPreview from "@/components/home/AboutPreview";
import BusinessActivities from "@/components/home/BusinessActivities";
import ServicesPreview from "@/components/home/ServicesPreview";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import VisionMission from "@/components/home/VisionMission";
import CoreValues from "@/components/home/CoreValues";
import ProprietorMessage from "@/components/home/ProprietorMessage";
import CredentialsPreview from "@/components/home/CredentialsPreview";
import ContactCTA from "@/components/home/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustPoints />
      <AboutPreview />
      <BusinessActivities />
      <ServicesPreview />
      <FeaturedProjects />
      <WhyChooseUs />
      <VisionMission />
      <CoreValues />
      <ProprietorMessage />
      <CredentialsPreview />
      <ContactCTA />
    </>
  );
}