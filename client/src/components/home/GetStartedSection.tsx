import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Users,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const paths = [
  {
    badge: "Most Popular",
    badgeIcon: Crown,
    title: "Student",
    desc: "Are you ready to pursue your international education dreams? Join our platform and access opportunities worldwide.",
    points: [
      "Free university search & comparison",
      "Expert counseling & guidance",
      "Application & visa assistance",
    ],
    cta: "Sign Up For Free",
    img: "/assets/students-group.jpg",
  },
  {
    badge: "For Agents",
    badgeIcon: Users,
    title: "Recruitment Partner",
    desc: "Expand your reach and streamline student recruitment with our comprehensive partner network.",
    points: [
      "Access to global institutions",
      "Advanced management tools",
      "Commission tracking system",
    ],
    cta: "Become a Recruitment Partner",
    img: "/assets/agents-office.jpg",
  },
  {
    badge: "For Institutions",
    badgeIcon: GraduationCap,
    title: "Partner Institution",
    desc: "Connect with quality students globally and grow your international enrollment effectively.",
    points: [
      "1,500+ partner institutions",
      "Qualified student applications",
      "Dedicated support team",
    ],
    cta: "Become a Partner Institution",
    img: "/assets/institution-office.jpg",
  },
];

const GetStartedSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-6 text-center">
      <span className="inline-block border border-border px-4 py-1.5 rounded-full text-sm font-medium text-foreground mb-4">
        CHOOSE YOUR PATH
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
        Get Started With NextDegree
      </h2>
      <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
        Join thousands of students, partners, and institutions transforming
        international education worldwide
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paths.map((p) => (
          <div
            key={p.title}
            className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm text-left"
          >
            <div className="relative h-48">
              <Image
                src={p.img}
                alt={p.title}
                width={250}
                height={200}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                <p.badgeIcon className="w-3 h-3 text-primary" /> {p.badge}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">
                {p.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">{p.desc}</p>
              <ul className="space-y-3 mb-6">
                {p.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full rounded-full gap-2">
                {p.cta} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default GetStartedSection;
