import { getServices } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ServicesPreview() {
  const services = getServices();

  return (
    <section className="ati-section bg-ati-background">
      <div className="ati-container">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-bold tracking-wider text-ati-orange uppercase">
              Our Capabilities
            </p>
            <h2 className="text-3xl font-bold text-ati-navy md:text-4xl">
              Professional Services
            </h2>
          </div>
          <Link
            href="/services"
            className="ati-focus inline-flex w-fit items-center gap-2 font-semibold text-ati-navy hover:text-ati-navy-light"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
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
