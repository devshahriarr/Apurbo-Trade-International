import { getTrustPoints } from "@/lib/data";

export default function TrustPoints() {
  const points = getTrustPoints();

  return (
    <section className="relative z-20 -mt-16 mb-16">
      <div className="ati-container">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {points.map((point, index) => (
            <div
              key={index}
              className="ati-card flex flex-col p-8 transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="mb-3 text-xl font-bold text-ati-navy">
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed text-ati-muted">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
