const steps = [
  { num: "1", title: "Create Profile", desc: "Add your academic background, study preferences, and budget.", active: true },
  { num: "2", title: "Get Matched", desc: "Explore colleges and universities that fit your profile.", active: true },
  { num: "3", title: "Review Key Insights", desc: "See cost estimates, admission chances, and visa readiness in one view.", active: true },
  { num: "4", title: "Move Forward", desc: "Shortlist your options and follow guided steps to self-apply with confidence.", active: false },
];

const HowItWorksSection = () => (
  <section className="py-20 bg-card">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">How AbroadLift Works</h2>
      <p className="text-muted-foreground mb-16">You can get started in just a few clicks and some basic details.</p>

      <div className="relative max-w-4xl mx-auto">
        {/* Line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-success hidden md:block" style={{ top: "2rem" }} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 relative z-10 ${
                s.active
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}>
                {s.num}
              </div>
              <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
