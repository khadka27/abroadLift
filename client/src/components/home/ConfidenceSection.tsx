import { Wrench, ListChecks, ShieldCheck, Smartphone } from "lucide-react";
import Image from "next/image";

const ConfidenceSection = () => (
  <section className="py-20 bg-blue-50/50 -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
    <div className="w-full max-w-[1280px] mx-auto relative z-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12 gap-8">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Apply on Your Own with Confidence
          </h2>
          <p className="text-muted-foreground">
            Instead of depending on scattered advice, spreadsheets, or endless
            follow-ups, you get one guided experience that helps you explore,
            decide, prepare, and apply with confidence.
          </p>
        </div>
        <div className="flex items-center  gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-muted border-2 border-card"
              />
            ))}
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground border-2 border-card flex items-center justify-center text-xs font-bold">
              +15k
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Trusted by 15,000+ students globally.
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 - Blue tall */}
        <div className="bg-primary rounded-2xl p-8 text-primary-foreground row-span-2 flex flex-col justify-between">
          <div>
            <Wrench className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-3">
              Step-by-step application support
            </h3>
            <p className="text-primary-foreground/80 text-sm">
              Guided assistance through every stage of your application process,
              making it simple and stress-free.
            </p>
          </div>
          <Image
            src="/assets/library-interior.jpg"
            alt="Library"
            width={200}
            height={150}
            className="rounded-xl mt-6 w-full h-40 object-cover grayscale"
          />
        </div>

        {/* Card 2 - Light */}
        <div className="bg-muted rounded-2xl p-8">
          <ListChecks className="w-8 h-8 text-foreground mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            Required document checklist
          </h3>
          <p className="text-muted-foreground text-sm">
            A clear, organized list of all necessary documents to ensure nothing
            is missed.
          </p>
        </div>

        {/* Card 3 - Mint */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "hsl(var(--mint))" }}
        >
          <ShieldCheck className="w-8 h-8 text-foreground mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            Application progress tracking
          </h3>
          <p className="text-muted-foreground text-sm">
            Easily monitor the status of your application from start to finish
            in one place.
          </p>
        </div>

        {/* Card 4 - Dark navy spanning 2 cols */}
        <div
          className="md:col-span-2 rounded-2xl p-8 flex items-center justify-between"
          style={{ background: "hsl(var(--navy))" }}
        >
          <div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: "hsl(var(--navy-foreground))" }}
            >
              Built for web and mobile
            </h3>
            <p
              className="text-sm opacity-70"
              style={{ color: "hsl(var(--navy-foreground))" }}
            >
              Seamlessly accessible across devices, so you can manage your
              application anytime, anywhere.
            </p>
          </div>
          <Smartphone
            className="w-20 h-20 opacity-30"
            style={{ color: "hsl(var(--navy-foreground))" }}
          />
        </div>
      </div>
    </div>
  </section>
);

export default ConfidenceSection;
