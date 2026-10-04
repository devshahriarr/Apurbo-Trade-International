import { Service } from "@/types";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function ServiceDetail({ service }: { service: Service }) {
  return (
    <section className="ati-section bg-white">
      <div className="ati-container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          
          <div className="flex flex-col">
            <span className="mb-3 inline-block text-sm font-bold tracking-wider text-ati-orange uppercase">
              {service.category}
            </span>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-ati-navy md:text-4xl">
              {service.title}
            </h2>
            
            <div className="mb-8 space-y-4 text-ati-dark leading-relaxed text-lg">
              <p>{service.description}</p>
            </div>

            <div className="border-t border-ati-border pt-8">
              <h3 className="mb-6 text-xl font-bold text-ati-navy">
                Key Capabilities & Offerings
              </h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                {service.capabilities.map((capability, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-ati-orange shrink-0 mt-0.5" />
                    <span className="font-medium text-ati-navy/80">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-24 relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-ati-border shadow-lg">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
