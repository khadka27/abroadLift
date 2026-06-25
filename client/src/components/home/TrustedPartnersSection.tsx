import { useState, useEffect, useMemo } from "react";
import { ArrowRight, MapPin, Calendar, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const countries = [
  { name: "Canada", flag: "🇨🇦" },
  { name: "United-States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Ireland", flag: "🇮🇪" },
];

interface UniversityItem {
  id: string | number;
  name: string;
  location: string;
  rank: string;
  tuition: string;
  intake: string;
  scholarship: boolean;
  img: string;
  country: string;
}

const fallbackUniversities: UniversityItem[] = [
  // Canada
  {
    id: "ca-1",
    name: "University of Toronto",
    location: "Toronto, Canada",
    rank: "#21 Global",
    tuition: "$45,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    country: "Canada",
  },
  {
    id: "ca-2",
    name: "University of British Columbia",
    location: "Vancouver, Canada",
    rank: "#34 Global",
    tuition: "$40,050",
    intake: "Sep 2026",
    scholarship: true,
    img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
    country: "Canada",
  },
  {
    id: "ca-3",
    name: "McGill University",
    location: "Montreal, Canada",
    rank: "#30 Global",
    tuition: "$38,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    country: "Canada",
  },
  // United-States
  {
    id: "us-1",
    name: "Harvard University",
    location: "Cambridge, United States",
    rank: "#4 Global",
    tuition: "$55,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "https://images.unsplash.com/photo-1544144433-d50aff500b91?auto=format&fit=crop&q=80&w=800",
    country: "United-States",
  },
  {
    id: "us-2",
    name: "Stanford University",
    location: "Stanford, United States",
    rank: "#2 Global",
    tuition: "$58,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    country: "United-States",
  },
  // United Kingdom
  {
    id: "gb-1",
    name: "University of Oxford",
    location: "Oxford, United Kingdom",
    rank: "#1 Global",
    tuition: "$39,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    country: "United Kingdom",
  },
  {
    id: "gb-2",
    name: "University of Cambridge",
    location: "Cambridge, United Kingdom",
    rank: "#2 Global",
    tuition: "$42,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=800",
    country: "United Kingdom",
  },
  // Australia
  {
    id: "au-1",
    name: "University of Melbourne",
    location: "Melbourne, Australia",
    rank: "#7 Global",
    tuition: "$32,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800",
    country: "Australia",
  },
  {
    id: "au-2",
    name: "University of Sydney",
    location: "Sydney, Australia",
    rank: "#18 Global",
    tuition: "$34,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    country: "Australia",
  },
  // Germany
  {
    id: "de-1",
    name: "Technical University of Munich",
    location: "Munich, Germany",
    rank: "#37 Global",
    tuition: "Free",
    intake: "Oct 2026",
    scholarship: false,
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    country: "Germany",
  },
  // Ireland
  {
    id: "ie-1",
    name: "Trinity College Dublin",
    location: "Dublin, Ireland",
    rank: "#81 Global",
    tuition: "$25,000",
    intake: "Sep 2026",
    scholarship: true,
    img: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800",
    country: "Ireland",
  },
];

const TrustedPartnersSection = () => {
  const [activeCountry, setActiveCountry] = useState("Canada");
  const [liveUnis, setLiveUnis] = useState<UniversityItem[]>([]);

  useEffect(() => {
    const fetchFeaturedSchools = async () => {
      try {
        const res = await fetch("/api/schools");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const mapped = json.data.map((school: any) => ({
              id: school.school_id || school.id || Math.random(),
              name: school.name,
              location: `${school.city || ""}, ${school.country || ""}`,
              rank: school.school_rank ? `#${school.school_rank} Global` : "Featured",
              tuition: school.tuitionFee ? `$${parseInt(school.tuitionFee).toLocaleString()}` : "Varies",
              intake: "Sep 2026",
              scholarship: true,
              img: school.banner || school.logo || "/assets/university-melbourne.jpg",
              country: school.country || "",
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

  const filteredUniversities = useMemo(() => {
    const targetCountry = activeCountry.toLowerCase();
    
    // 1. Try to filter matches from the live schools loaded from API
    let matched = liveUnis.filter((u: any) => {
      const uCountry = (u.country || "").toLowerCase();
      const uLoc = (u.location || "").toLowerCase();
      return uCountry === targetCountry || uLoc.includes(targetCountry) || 
             (targetCountry === "united-states" && (uCountry === "usa" || uCountry === "united states" || uLoc.includes("usa"))) ||
             (targetCountry === "united kingdom" && (uCountry === "uk" || uCountry === "united kingdom" || uLoc.includes("uk")));
    });

    // 2. If no live matches, fall back to our detailed list matching the country
    if (matched.length === 0) {
      matched = fallbackUniversities.filter((u: any) => {
        const uCountry = (u.country || "").toLowerCase();
        return uCountry === targetCountry;
      });
    }

    // Return at most 3 top universities for the selected country
    return matched.slice(0, 3);
  }, [liveUnis, activeCountry]);

  return (
    <section className="py-24 bg-[#F8FAFF] -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12 relative overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto text-center relative z-10">
        <span className="text-[#3686FF] font-black tracking-[0.2em] uppercase text-xs">
          TRUSTED PARTNERS
        </span>
        <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold text-slate-900 mt-3 mb-8 tracking-tight">
          Trusted by 1,500+ Universities, Colleges
          <br />
          and Schools Worldwide
        </h2>

        {/* Interactive Country Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {countries.map((c) => {
            const isActive = activeCountry === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setActiveCountry(c.name)}
                className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all border ${
                  isActive
                    ? "bg-blue-50 border-[#3686FF] text-[#3686FF] shadow-md scale-105"
                    : "bg-[#F8FAFF] border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="text-xl leading-none">{c.flag}</span>
                <span>{c.name === "United-States" ? "USA" : c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Universities Grid (Showing Top 3 for Country) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {filteredUniversities.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-[32px] overflow-hidden shadow-[0_10px_35px_rgba(15,23,42,0.03)] border border-slate-100 text-left flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-300"
            >
              <div>
                <div className="relative h-48 bg-slate-50">
                  <Image
                    src={u.img}
                    alt={u.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Award className="w-3.5 h-3.5 text-blue-600" /> {u.rank}
                    </span>
                    {u.scholarship && (
                      <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                        Scholarship Available
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-extrabold text-[17px] text-slate-900 leading-snug line-clamp-1">{u.name}</h3>
                  <p className="text-slate-400 font-semibold text-xs flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" /> {u.location}
                  </p>
                  <div className="flex justify-between items-center mt-5 text-xs font-semibold">
                    <div>
                      <span className="text-slate-400">Tuition/Year</span>
                      <p className="font-bold text-slate-850 mt-0.5">{u.tuition}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Next Intake</span>
                      <p className="font-bold text-slate-850 flex items-center gap-1 justify-end mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {u.intake}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-0">
                <Link href={`/schools/${u.id}`} className="block w-full">
                  <Button className="w-full bg-[#3686FF] hover:bg-blue-600 px-4 py-3 rounded-2xl text-white font-bold text-xs shadow-md">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic CTA Button matching the selected Country */}
        <Link href="/search">
          <Button
            size="lg"
            className="rounded-2xl bg-[#3686FF] hover:bg-blue-600 px-6 py-4 gap-2 text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            Explore More {activeCountry === "United-States" ? "USA" : activeCountry} Institutions{" "}
            <ArrowRight className="w-4.5 h-4.5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default TrustedPartnersSection;
