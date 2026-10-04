import { getCompany } from "@/lib/data";

export default function AboutHero() {
  const company = getCompany();

  return (
    <section className="relative overflow-hidden bg-ati-navy py-20 text-white lg:py-28">
      {/* Background visual accents */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-ati-orange blur-3xl" />
      </div>

      <div className="ati-container relative z-10 text-center">
        <p className="mb-4 text-sm font-bold tracking-widest text-ati-orange uppercase">
          About {company.shortName}
        </p>
        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          Who We Are
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-white/80 md:text-xl">
          {company.tagline}
        </p>
      </div>
    </section>
  );
}
