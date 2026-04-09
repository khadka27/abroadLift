import { useState } from "react";
import { ArrowRight, MapPin, Calendar, Award } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const countries = [
  { name: "Canada", flag: "🇨🇦", active: true },
  { name: "United-States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Ireland", flag: "🇮🇪" },
];

const universities = [
  {
    name: "University of Oxford",
    location: "Oxford, United Kingdom",
    rank: "#1 Global",
    tuition: "$39,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "/assets/university-melbourne.jpg",
  },
  {
    name: "University of Melbourne",
    location: "Melbourne, Australia",
    rank: "#7 Global",
    tuition: "$32,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "/assets/university-melbourne.jpg",
  },
  {
    name: "University of Singapore",
    location: "Singapore",
    rank: "#23 Global",
    tuition: "$17,000",
    intake: "Sep 2026",
    scholarship: false,
    img: "/assets/university-melbourne.jpg",
  },
];

const TrustedPartnersSection = () => {
  const [activeCountry, setActiveCountry] = useState("Canada");

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 text-center">
        <span className="text-primary font-semibold text-sm uppercase tracking-wider">
          TRUSTED PARTNERS
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-8">
          Trusted by 1,500+ Universities, Colleges
          <br />
          and Schools Worldwide
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {countries.map((c) => (
            <button
              key={c.name}
              onClick={() => setActiveCountry(c.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-colors ${
                activeCountry === c.name
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              <span className="text-lg">{c.flag}</span> {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {universities.map((u) => (
            <div
              key={u.name}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border"
            >
              <div className="relative h-48">
                <Image
                  src={u.img}
                  alt={u.name}
                  width={250}
                  height={200}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-card/90 backdrop-blur-sm text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3 text-primary" /> {u.rank}
                  </span>
                  {u.scholarship && (
                    <span className="bg-success text-success-foreground text-xs px-3 py-1 rounded-full">
                      Scholarship Available
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 text-left">
                <h3 className="font-bold text-lg text-foreground">{u.name}</h3>
                <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {u.location}
                </p>
                <div className="flex justify-between items-center mt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tuition/Year</span>
                    <p className="font-bold text-foreground">{u.tuition}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground">Next Intake</span>
                    <p className="font-medium text-foreground flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3" /> {u.intake}
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4 rounded-lg">View Details</Button>
              </div>
            </div>
          ))}
        </div>

        <Button size="lg" className="rounded-full px-8 gap-2">
          Explore More Canadian Institutions <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};

export default TrustedPartnersSection;
