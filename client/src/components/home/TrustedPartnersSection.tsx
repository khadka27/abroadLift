import { useState, useEffect } from "react";
import { ArrowRight, MapPin, Calendar, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const countries = [
  { name: "Canada", flag: "🇨🇦", active: true },
  { name: "United-States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Ireland", flag: "🇮🇪" },
];

const fallbackUniversities = [
  {
    id: 1,
    name: "University of Oxford",
    location: "Oxford, United Kingdom",
    rank: "#1 Global",
    tuition: "$39,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "/assets/university-melbourne.jpg",
  },
  {
    id: 2,
    name: "University of Melbourne",
    location: "Melbourne, Australia",
    rank: "#7 Global",
    tuition: "$32,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "/assets/university-melbourne.jpg",
  },
  {
    id: 3,
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
  const [liveUnis, setLiveUnis] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeaturedSchools = async () => {
      try {
        const res = await fetch("/api/schools?limit=3");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.length > 0) {
            const mapped = json.data.map((school: any) => ({
              id: school.school_id,
              name: school.name,
              location: `${school.city || ""}, ${school.country || ""}`,
              rank: school.school_rank ? `#${school.school_rank} Global` : "Featured",
              tuition: "Varies",
              intake: "Sep 2026",
              scholarship: true,
              img: school.banner?.url || "/assets/university-melbourne.jpg",
            }));
            setLiveUnis(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load live universities on homepage:", err);
      }
    };

    fetchFeaturedSchools();
  }, []);

  const universities = liveUnis.length > 0 ? liveUnis : fallbackUniversities;

  return (
    <section className="py-24 bg-[#F8FAFF] -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto text-center relative z-10">
        <span className="text-[#3686FF] font-medium text-[14px] uppercase tracking-wider">
          TRUSTED PARTNERS
        </span>
        <h2 className="text-[32px] sm:text-[36px] lg:text-[40px] font-bold text-foreground mt-3 mb-8">
          Trusted by 1,500+ Universities, Colleges
          <br />
          and Schools Worldwide
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {countries.map((c) => (
            <button
              key={c.name}
              onClick={() => setActiveCountry(c.name)}
              className={`flex items-center gap-2 px-[24px] py-[16px] rounded-[10px]  text-[14px] font-regular transition-colors shadow-sm bg-[#F5F5F5] text-[#0f172a]`}
            >
              <span className="text-lg">{c.flag}</span> {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {universities.map((u) => (
            <div
              key={u.name}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border text-left flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48">
                  <Image
                    src={u.img}
                    alt={u.name}
                    width={250}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized
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
                <div className="p-5">
                  <h3 className="font-bold text-lg text-foreground line-clamp-1">{u.name}</h3>
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
                </div>
              </div>
              
              <div className="p-5 pt-0">
                <Link href={`/schools/${u.id}`} className="block w-full">
                  <Button className="w-full bg-[#3686FF] px-[24px] py-[12px] rounded-[10px] text-white">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <Link href="/search">
          <Button
            size="lg"
            className="rounded-[10px] bg-[#3686FF] hover:bg-[#3686FF] px-[24px] py-[12px] gap-2 text-white"
          >
            Explore More Canadian Institutions{" "}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default TrustedPartnersSection;

