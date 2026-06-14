"use client";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  {
    title: "Product-first guidance",
    desc: "Clear insights instead of confusing information",
  },
  {
    title: "Best-fit college matching",
    desc: "Find options that match your goals and profile",
  },
  { title: "Cost clarity", desc: "Estimate expenses before making decisions" },
  {
    title: "Admission confidence",
    desc: "Understand where your are more likely to succeed",
  },
  {
    title: "Visa progress tracking",
    desc: "Stay ready with a simple checklist-driven experience",
  },
  {
    title: "Web-mobile access",
    desc: "Explore and manage your journey from anywhere",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const SolutionsSection = () => (
  <section className="relative py-16 lg:py-24 bg-[#F8FAFC] overflow-hidden px-6 lg:px-12">
    {/* Left Splash Decoration */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 35 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="absolute top-[18%] left-[2%] lg:left-[8%] pointer-events-none hidden sm:block"
    >
      <svg width="58" height="58" viewBox="0 0 48 48" fill="#3366FF">
        <path d="M12,24 C22,18 40,22 46,24 C40,26 22,30 12,24 Z" />
        <path d="M16,14 C26,6 42,12 44,16 C34,14 22,12 16,14 Z" />
        <path
          d="M18,34 C26,42 42,36 44,32 C34,34 22,36 18,34 Z"
          opacity="0.8"
        />
      </svg>
    </motion.div>

    <div className="w-full max-w-[1280px] mx-auto relative z-10 text-center">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold text-[#0f172a] leading-[1.1] mb-6 tracking-tight"
      >
        Find Every Solution, From Applications{" "}
        <span className="text-[#3366FF]">to Accommodations</span>
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-[#475569] max-w-[800px] mx-auto font-medium mb-16 text-[16px] sm:text-[18px] leading-[1.6]"
      >
        Access our full 360 Solutions, covering everything from application to
        arrival. Get instant language test vouchers, explore financial services,
        and invest in your future with flexible student loans. It&apos;s all here.
      </motion.p>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1100px] mx-auto mb-16"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-[24px] px-8 py-10 text-center shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(51,102,255,0.1)] transition-all duration-300 border border-white flex flex-col items-center group cursor-default"
          >
            <div className="w-[56px] h-[56px] rounded-2xl bg-blue-50 flex items-center justify-center mb-6 shrink-0 group-hover:scale-110 group-hover:bg-[#3366FF] transition-all duration-300">
              <FileText
                className="w-[24px] h-[24px] text-[#3366FF] group-hover:text-white transition-colors duration-300"
                strokeWidth={2}
              />
            </div>
            <h3 className="font-bold text-[#0f172a] text-[18px] mb-3 tracking-tight group-hover:text-[#3366FF] transition-colors">
              {f.title}
            </h3>
            <p className="text-[#64748b] font-medium text-[15px] leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <Link href="/register">
          <Button className="bg-[#3366FF] text-white px-[32px] py-[24px] rounded-[16px] font-bold text-[16px] shadow-[0_10px_30px_rgb(51,102,255,0.3)] transition-all hover:scale-105 hover:bg-[#254bdb]">
            Register as a Student <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default SolutionsSection;
