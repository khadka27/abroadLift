"use client";
import { Globe2, Building2, GraduationCap, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Globe2, label: "160+ Countries" },
  { icon: Building2, label: "1000+ Universities" },
  { icon: GraduationCap, label: "5000+ Students" },
  { icon: Headphones, label: "24/7 Support" },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const StatsBar = () => (
  <section className="relative z-20 px-6 lg:px-12 -mt-10 mb-10">
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="max-w-[1280px] mx-auto"
    >
      <div className="glass bg-white/80 backdrop-blur-xl border border-white rounded-[32px] sm:rounded-full py-6 px-8 sm:px-12 shadow-[0_20px_40px_rgba(0,0,0,0.08)] flex flex-col items-center w-full">
        <div className="w-full grid grid-cols-2 md:flex md:flex-wrap md:justify-between items-center gap-y-8 gap-x-4">
          {stats.map((stat) => (
            <motion.div 
              key={stat.label} 
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              className="flex items-center gap-3 sm:gap-4 group cursor-default"
            >
              <div className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] rounded-full bg-gradient-to-br from-[#3686FF] to-[#254bdb] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <stat.icon className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-[#0f172a] text-[14px] sm:text-[18px] lg:text-[20px] tracking-tight whitespace-nowrap group-hover:text-[#3686FF] transition-colors">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </section>
);

export default StatsBar;
