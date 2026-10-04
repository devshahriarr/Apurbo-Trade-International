import { getProprietorMessage } from "@/lib/data";
import Image from "next/image";

export default function ProprietorMessage() {
  const proprietor = getProprietorMessage();

  return (
    <section className="ati-section bg-ati-background">
      <div className="ati-container">
        <div className="ati-card mx-auto overflow-hidden lg:max-w-5xl">
          <div className="grid lg:grid-cols-5">
            {/* Image */}
            <div className="relative aspect-square lg:col-span-2 lg:aspect-auto">
              <Image
                src={proprietor.image}
                alt={proprietor.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-8 lg:col-span-3 lg:p-12">
              <h2 className="mb-6 text-3xl font-bold text-ati-navy md:text-4xl">
                {proprietor.title}
              </h2>

              <p className="mb-4 text-lg font-medium text-ati-dark">
                {proprietor.intro}
              </p>

              <p className="mb-8 leading-relaxed text-ati-muted">
                {proprietor.message}
              </p>

              <p className="mb-8 font-medium leading-relaxed text-ati-navy">
                "{proprietor.closing}"
              </p>

              <div>
                <p className="font-bold text-ati-navy">{proprietor.name}</p>
                <p className="text-sm font-medium text-ati-orange">
                  {proprietor.designation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
