import { getAbout, getCompany } from "@/lib/data";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function CompanyOverview() {
  const about = getAbout();
  const company = getCompany();

  return (
    <section className="ati-section bg-white">
      <div className="ati-container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Content Column */}
          <div className="flex flex-col">
            <p className="mb-2 text-sm font-bold tracking-wider text-ati-orange uppercase">
              Company Overview
            </p>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-ati-navy md:text-4xl">
              {about.title}
            </h2>
            
            <p className="mb-6 text-lg font-medium text-ati-dark">
              {company.foundedDescription}
            </p>
            
            <div className="mb-8 space-y-4 text-ati-muted leading-relaxed">
              <p>{about.description}</p>
              <p>{company.positioning}</p>
            </div>

            <div className="border-t border-ati-border pt-8">
              <h3 className="mb-6 text-xl font-bold text-ati-navy">
                Nature of Business
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {company.natureOfBusiness.map((nature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-ati-orange shrink-0" />
                    <span className="font-semibold text-ati-navy">{nature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-ati-border shadow-lg lg:aspect-square">
              <Image
                src={about.image}
                alt="About Apurbo Trade International"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative block */}
            <div className="absolute -bottom-6 -left-6 -z-10 h-full w-full rounded-2xl bg-ati-background border-2 border-ati-navy/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
