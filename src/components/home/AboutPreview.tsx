import Image from "next/image";
import Link from "next/link";
import { getAbout } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export default function AboutPreview() {
  const about = getAbout();

  return (
    <section className="ati-section">
      <div className="ati-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          
          {/* Image Side */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ati-border lg:aspect-[3/4]">
            <Image
              src={about.image}
              alt="About Apurbo Trade International"
              fill
              className="object-cover"
            />
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -left-6 h-48 w-48 rounded-2xl border-8 border-white bg-ati-navy" />
          </div>

          {/* Content Side */}
          <div className="flex flex-col">
            <p className="mb-3 text-sm font-bold tracking-wider text-ati-orange uppercase">
              {about.shortTitle}
            </p>

            <h2 className="mb-6 text-3xl font-bold leading-tight text-ati-navy md:text-4xl">
              {about.title}
            </h2>

            <p className="mb-6 text-lg font-medium text-ati-dark">
              {about.shortDescription}
            </p>

            <p className="mb-8 leading-relaxed text-ati-muted">
              {about.description}
            </p>

            <Link
              href={about.cta.href}
              className="ati-focus inline-flex w-fit items-center gap-2 rounded-lg bg-ati-navy px-6 py-3 font-semibold text-white transition-colors hover:bg-ati-navy-light"
            >
              {about.cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}
