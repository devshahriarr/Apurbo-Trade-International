import { getContactCTA } from "@/lib/data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  const cta = getContactCTA();

  return (
    <section className="relative overflow-hidden bg-ati-navy py-20 lg:py-24">
      {/* Decorative background elements */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-ati-orange/20 blur-3xl" />

      <div className="ati-container relative z-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {cta.title}
          </h2>
          
          <p className="mb-10 text-lg leading-relaxed text-white/80 md:text-xl">
            {cta.description}
          </p>
          
          <Link
            href={cta.buttonHref}
            className="ati-focus inline-flex items-center gap-2 rounded-lg bg-ati-orange px-8 py-4 text-lg font-semibold text-white transition-all hover:-translate-y-1 hover:bg-ati-orange-dark hover:shadow-xl"
          >
            {cta.buttonLabel}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
