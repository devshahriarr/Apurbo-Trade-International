import { getVisionMission } from "@/lib/data";
import { Target, Lightbulb } from "lucide-react";

export default function VisionMission() {
  const data = getVisionMission();

  return (
    <section className="ati-section bg-white">
      <div className="ati-container">
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Vision */}
          <div className="ati-card flex flex-col p-8 lg:p-12">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-ati-background text-ati-orange">
              <Lightbulb className="h-8 w-8" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-ati-navy">Our Vision</h3>
            <p className="text-lg leading-relaxed text-ati-muted">
              {data.vision}
            </p>
          </div>

          {/* Mission */}
          <div className="ati-card flex flex-col p-8 lg:p-12">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-ati-background text-ati-green">
              <Target className="h-8 w-8" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-ati-navy">Our Mission</h3>
            <p className="text-lg leading-relaxed text-ati-muted">
              {data.mission}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
