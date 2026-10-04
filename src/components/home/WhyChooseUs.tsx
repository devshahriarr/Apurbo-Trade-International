import { getWhyChooseUs } from "@/lib/data";
import { CheckCircle2 } from "lucide-react";

export default function WhyChooseUs() {
  const reasons = getWhyChooseUs();

  return (
    <section className="ati-section bg-ati-navy text-white">
      <div className="ati-container">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-bold tracking-wider text-ati-orange uppercase">
            The ATI Advantage
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            Why Choose Us
          </h2>
        </div>

        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.id} className="flex flex-col">
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-ati-orange" />
                <h3 className="text-lg font-bold">{reason.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/70">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
