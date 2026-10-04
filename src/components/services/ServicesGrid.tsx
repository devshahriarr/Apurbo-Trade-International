import { getServices } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ServicesGrid() {
  const services = getServices();

  return (
    <section className="ati-section bg-ati-background">
      <div className="ati-container">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-ati-navy md:text-4xl">
            Comprehensive Industry Solutions
          </h2>
          <p className="mt-4 text-ati-muted text-lg">
            We deliver professional contracting, engineering, and procurement 
            support tailored to your project requirements.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md border border-transparent hover:border-ati-navy/10"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-ati-border">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-grow flex-col p-6 lg:p-8">
                <span className="mb-3 inline-block text-xs font-bold tracking-wider text-ati-orange uppercase">
                  {service.category}
                </span>
                <h3 className="mb-3 text-xl font-bold text-ati-navy">
                  {service.title}
                </h3>
                
                <p className="mb-6 flex-grow text-sm leading-relaxed text-ati-muted">
                  {service.summary}
                </p>

                <Link
                  href={`/services/${service.slug}`}
                  className="ati-focus mt-auto inline-flex items-center gap-2 text-sm font-semibold text-ati-orange transition-colors hover:text-ati-orange-dark"
                >
                  Explore Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
