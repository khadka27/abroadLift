const steps = [
  { num: "1", title: "Create Profile", desc: "Add your academic background, study preferences, and budget.", active: true },
  { num: "2", title: "Get Matched", desc: "Explore colleges and universities that fit your profile.", active: true },
  { num: "3", title: "Review Key Insights", desc: "See cost estimates, admission chances, and visa readiness in one view.", active: true },
  { num: "4", title: "Move Forward", desc: "Shortlist your options and follow guided steps to self-apply with confidence.", active: false },
];

const HowItWorksSection = () => (
  <section className="py-24 bg-white relative">
    <div className="container max-w-[1280px] mx-auto px-6 text-center">
      <h2 className="text-[34px] md:text-[36px] font-bold text-[#0B1A30] mb-4 tracking-tight">
        How AbroadLift Works
      </h2>
      <p className="text-[#475569] text-[16px] font-regular mb-20">
        You can get started in just a few clicks and some basic details.
      </p>

      <div className="relative max-w-[1100px] mx-auto">
        {/* Background Connecting Lines */}
        <div className="absolute top-[35px] left-[0%] right-[0%] h-[3px] hidden md:block z-0">
          <div className="w-full h-full flex">
            {/* Active dark line spanning from node 1 to node 3 */}
            <div className="h-full bg-[#0B1A30]" style={{ width: '75%' }}></div>
            {/* Inactive gray line spanning from node 3 to node 4 */}
            <div className="h-full bg-[#E2E8F0]" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center text-center">
              <div 
                className={`w-[70px] h-[70px] rounded-full flex items-center justify-center text-[22px] font-bold mb-6 transition-all ${
                  s.active
                    ? "bg-[#0B1A30] text-white shadow-[0_15px_30px_rgb(11,26,48,0.2)]"
                    : "bg-[#F1F5F9] text-[#64748B]"
                }`}
              >
                {s.num}
              </div>
              <h3 className="font-bold text-[#0B1A30] text-[17px] mb-3">
                {s.title}
              </h3>
              <p className="text-[#475569] text-[14px] font-regular leading-relaxed max-w-[240px]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
