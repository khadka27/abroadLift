"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Calculator,
  MapPin,
  TrendingUp,
  Home,
  Utensils,
  Bus,
  BookOpen,
  DollarSign,
  ArrowRight,
  RefreshCw,
  Info,
  Heart,
  FileText,
  CreditCard,
  Plane,
  ShoppingBag,
  Wifi,
  Phone,
  Shield,
  Activity,
  Check,
  Globe,
  Building2,
  ExternalLink,
  Search,
  Download,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatNPRDevanagari, formatLakhCrore } from "@/lib/currency";
import { COUNTRY_COSTS_DATA, CostItem } from "@/lib/countryCosts";

interface StudyCostResponse {
  city: string;
  country: string;
  exchange_rate: number;
  tuition_npr: number;
  living_npr: number;
  housing_npr: number;
  food_npr: number;
  transport_npr: number;
  healthcare_npr: number;
  education_npr: number;
  total_npr: number;
  monthly_npr: number;
  local_currency?: {
    code: string;
    symbol: string;
    rate_vs_usd: number;
    tuition: number;
    living: number;
    housing: number;
    food: number;
    transport: number;
    healthcare: number;
    total: number;
    monthly: number;
  };
}

interface UniversityRecommendation {
  id: string | number;
  name: string;
  location: string;
  tuition: string | number;
  acceptanceRate: number;
  website: string;
  country: string;
}

const COUNTRIES = [
  {
    code: "US",
    name: "USA",
    flag: "🇺🇸",
    cities: ["New York", "Boston", "San Francisco", "Chicago", "Los Angeles"],
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    cities: ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"],
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  },
  {
    code: "GB",
    name: "UK",
    flag: "🇬🇧",
    cities: ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow"],
  },
  {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    cities: ["Dublin", "Cork", "Galway", "Limerick", "Waterford"],
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  },
  {
    code: "MT",
    name: "Malta",
    flag: "🇲🇹",
    cities: ["Valletta", "Sliema", "St. Julian's", "Birkirkara", "Qormi"],
  },
];

const ICON_MAP: Record<string, any> = {
  passport: FileText,
  visa: CreditCard,
  permit: CreditCard,
  biometrics: CreditCard,
  sevis: Activity,
  ihs: Shield,
  aps: FileText,
  exams: BookOpen,
  medical: Heart,
  vaccines: Heart,
  "health-insurance-init": Shield,
  flight: Plane,
  "airport-transport": Bus,
  baggage: Bus,
  "acc-deposit": Home,
  "sec-deposit": Shield,
  "rent-1": Home,
  "bank-setup": CreditCard,
  sim: Wifi,
  "travel-insurance": Shield,
  "misc-dep": Info,
  "shopping-dep": ShoppingBag,
  accommodation: Home,
  utilities: Home,
  internet: Wifi,
  mobile: Phone,
  food: Utensils,
  transport: Bus,
  insurance: Shield,
  books: BookOpen,
  personal: Info,
  entertainment: Heart,
  laundry: Activity,
  "misc-living": Info,
  "tuition-deposit": BookOpen,
  "university-app-fee": CreditCard,
};

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  passport: { bg: "bg-slate-500/10", text: "text-slate-600" },
  visa: { bg: "bg-blue-500/10", text: "text-blue-600" },
  permit: { bg: "bg-blue-500/10", text: "text-blue-600" },
  biometrics: { bg: "bg-blue-500/10", text: "text-blue-600" },
  sevis: { bg: "bg-indigo-500/10", text: "text-indigo-600" },
  ihs: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  aps: { bg: "bg-slate-500/10", text: "text-slate-600" },
  exams: { bg: "bg-orange-500/10", text: "text-orange-600" },
  medical: { bg: "bg-rose-500/10", text: "text-rose-600" },
  vaccines: { bg: "bg-rose-500/10", text: "text-rose-600" },
  "health-insurance-init": { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  flight: { bg: "bg-sky-500/10", text: "text-sky-600" },
  "airport-transport": { bg: "bg-violet-500/10", text: "text-violet-600" },
  baggage: { bg: "bg-violet-500/10", text: "text-violet-600" },
  "acc-deposit": { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  "sec-deposit": { bg: "bg-teal-500/10", text: "text-teal-600" },
  "rent-1": { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  "bank-setup": { bg: "bg-slate-500/10", text: "text-slate-600" },
  sim: { bg: "bg-pink-500/10", text: "text-pink-600" },
  "travel-insurance": { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  "misc-dep": { bg: "bg-slate-500/10", text: "text-slate-600" },
  "shopping-dep": { bg: "bg-pink-500/10", text: "text-pink-600" },
  accommodation: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  utilities: { bg: "bg-amber-500/10", text: "text-amber-600" },
  internet: { bg: "bg-cyan-500/10", text: "text-cyan-600" },
  mobile: { bg: "bg-pink-500/10", text: "text-pink-600" },
  food: { bg: "bg-orange-500/10", text: "text-orange-600" },
  transport: { bg: "bg-violet-500/10", text: "text-violet-600" },
  insurance: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  books: { bg: "bg-orange-500/10", text: "text-orange-600" },
  personal: { bg: "bg-slate-500/10", text: "text-slate-600" },
  entertainment: { bg: "bg-rose-500/10", text: "text-rose-600" },
  laundry: { bg: "bg-slate-500/10", text: "text-slate-600" },
  "misc-living": { bg: "bg-slate-500/10", text: "text-slate-600" },
  "tuition-deposit": { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  "university-app-fee": { bg: "bg-blue-500/10", text: "text-blue-600" },
};

export default function CostingPage() {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [city, setCity] = useState(COUNTRIES[0].cities[0]);
  
  // Custom interactive cost adjustments
  const [customValues, setCustomValues] = useState<Record<string, number>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  // General Page state
  const [data, setData] = useState<StudyCostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<"Before Departure" | "First 6 Months" | "Overall Cost of Living">("Before Departure");
  const [duration, setDuration] = useState<number>(4); // default to 4 years study duration

  // University and program selection state
  const [universities, setUniversities] = useState<any[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [selectedUni, setSelectedUni] = useState<any | null>(null);
  const [uniSearchQuery, setUniSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [programs, setPrograms] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  const [manualTuition, setManualTuition] = useState("");
  const [manualAppFee, setManualAppFee] = useState("");

  const [recommendations, setRecommendations] = useState<UniversityRecommendation[]>([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  // Reinitialize range-based cost values when the country changes
  useEffect(() => {
    const items = COUNTRY_COSTS_DATA[country.code] || [];
    const initialVals: Record<string, number> = {};
    const initialIncluded: Record<string, boolean> = {};

    items.forEach((item) => {
      initialVals[item.id] = Math.round((item.min + item.max) / 2);
      initialIncluded[item.id] = true;
    });

    setCustomValues(initialVals);
    setSelectedItems(initialIncluded);
    setManualTuition("");
    setManualAppFee("");
    setSelectedUni(null);
    setSelectedProgram(null);
    setUniSearchQuery("");
  }, [country]);

  // Click away listener for searchable combobox
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch live exchange rates from the costing API
  const fetchEstimate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/cost-estimate?city=${encodeURIComponent(city)}&country=${country.code}&tuition_usd=20000`,
      );
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [city, country.code]);

  // Load universities in selected country
  const loadUniversities = useCallback(async () => {
    setLoadingUnis(true);
    try {
      const res = await fetch(`/api/schools?country_code=${country.code}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUniversities(json.data);
      } else {
        setUniversities([]);
      }
    } catch (e) {
      console.error(e);
      setUniversities([]);
    } finally {
      setLoadingUnis(false);
    }
  }, [country.code]);

  // Fetch recommended universities to show at the bottom
  const fetchRecommendations = useCallback(async () => {
    setRecommendationLoading(true);
    try {
      const res = await fetch(
        `/api/universities/search?countries=${encodeURIComponent(country.name)}`,
      );
      const json = await res.json();
      setRecommendations(
        Array.isArray(json?.results) ? json.results.slice(0, 4) : [],
      );
    } catch (e) {
      console.error(e);
      setRecommendations([]);
    } finally {
      setRecommendationLoading(false);
    }
  }, [country.name]);

  useEffect(() => {
    fetchEstimate();
    loadUniversities();
    fetchRecommendations();
  }, [fetchEstimate, loadUniversities, fetchRecommendations]);

  // Load programs once a university is selected
  useEffect(() => {
    if (!selectedUni) {
      setPrograms([]);
      setSelectedProgram(null);
      return;
    }

    async function loadPrograms() {
      setLoadingPrograms(true);
      try {
        const res = await fetch(`/api/programs/school/${selectedUni.school_id}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPrograms(json.data);
        } else {
          setPrograms([]);
        }
      } catch (err) {
        console.error(err);
        setPrograms([]);
      } finally {
        setLoadingPrograms(false);
      }
    }
    loadPrograms();

    if (selectedUni.city) {
      setCity(selectedUni.city);
    }
  }, [selectedUni]);

  // Client-side calculations of tuition and application fee values
  const averageTuition = useMemo(() => {
    if (programs.length === 0) return 0;
    const validFees = programs
      .map((p) => parseFloat(p.tuition))
      .filter((t) => !isNaN(t) && t > 0);
    if (validFees.length === 0) return 0;
    return Math.round(validFees.reduce((a, b) => a + b, 0) / validFees.length);
  }, [programs]);

  const averageAppFee = useMemo(() => {
    if (programs.length === 0) return 0;
    const validFees = programs
      .map((p) => parseFloat(p.application_fee))
      .filter((f) => !isNaN(f) && f > 0);
    if (validFees.length === 0) return 0;
    return Math.round(validFees.reduce((a, b) => a + b, 0) / validFees.length);
  }, [programs]);

  const schoolCurrency = selectedUni?.currency || "USD";
  const exchangeRate = data?.exchange_rate || 134.5;
  const localRate = data?.local_currency?.rate_vs_usd || 1.0;

  const defaultTuitionUsd = useMemo(() => {
    let localTuition = 20000; // Global fallback
    if (selectedProgram) {
      localTuition = parseFloat(selectedProgram.tuition) || 0;
    } else if (selectedUni && averageTuition > 0) {
      localTuition = averageTuition;
    } else if (selectedUni && selectedUni.cost_of_living) {
      localTuition = parseFloat(selectedUni.cost_of_living) || 20000;
    }
    
    if (schoolCurrency === "USD" || !localRate) return localTuition;
    return Math.round(localTuition / localRate);
  }, [selectedUni, selectedProgram, averageTuition, schoolCurrency, localRate]);

  const defaultAppFeeUsd = useMemo(() => {
    let localAppFee = 0;
    if (selectedProgram) {
      localAppFee = parseFloat(selectedProgram.application_fee) || 0;
    } else if (selectedUni && averageAppFee > 0) {
      localAppFee = averageAppFee;
    }
    
    if (localAppFee === 0) return 100; // Default fallback

    if (schoolCurrency === "USD" || !localRate) return localAppFee;
    return Math.round(localAppFee / localRate);
  }, [selectedUni, selectedProgram, averageAppFee, schoolCurrency, localRate]);

  // Sync manual fields with university change
  useEffect(() => {
    if (selectedUni) {
      setManualTuition(defaultTuitionUsd.toString());
      setManualAppFee(defaultAppFeeUsd.toString());
    }
  }, [selectedUni, defaultTuitionUsd, defaultAppFeeUsd]);

  const annualTuitionUsd = manualTuition !== "" ? parseFloat(manualTuition) || 0 : (selectedUni ? defaultTuitionUsd : 20000);
  const uniAppFeeUsd = manualAppFee !== "" ? parseFloat(manualAppFee) || 0 : (selectedUni ? defaultAppFeeUsd : 100);

  // Dynamic Before Departure cost compilation
  const beforeDepItems = useMemo(() => {
    const tuitionDepositVal = customValues["tuition-deposit"] !== undefined
      ? customValues["tuition-deposit"]
      : Math.round(annualTuitionUsd * 0.5);

    const appFeeVal = customValues["university-app-fee"] !== undefined
      ? customValues["university-app-fee"]
      : uniAppFeeUsd;

    const cashInHandVal = customValues["cash-in-hand"] !== undefined
      ? customValues["cash-in-hand"]
      : 1500;

    const baseList = [
      {
        id: "tuition-deposit",
        label: "Tuition Deposit (1st Semester)",
        category: "Before Departure" as const,
        description: "Initial deposit or first semester installment payment to secure I-20 / Visa Letter",
        min: Math.round(annualTuitionUsd * 0.3),
        max: Math.round(annualTuitionUsd * 0.7),
        value: tuitionDepositVal,
      },
      {
        id: "university-app-fee",
        label: "University Application Fee",
        category: "Before Departure" as const,
        description: "Application evaluation fee charged by the university/college",
        min: uniAppFeeUsd > 0 ? uniAppFeeUsd : 50,
        max: uniAppFeeUsd > 0 ? uniAppFeeUsd : 150,
        value: appFeeVal,
      },
      {
        id: "cash-in-hand",
        label: "Cash In Hand",
        category: "Before Departure" as const,
        description: "FOREX cash in hand for immediate use upon arrival in country",
        min: 1000,
        max: 2000,
        value: cashInHandVal,
      },
      ...(COUNTRY_COSTS_DATA[country.code]?.filter(item => item.category === "Before Departure") || [])
    ];
    return baseList;
  }, [country.code, annualTuitionUsd, uniAppFeeUsd, customValues]);

  // Dynamic 6 Months Living Cost compilation
  const livingItems = useMemo(() => {
    return COUNTRY_COSTS_DATA[country.code]?.filter(item => item.category === "First 6 Months") || [];
  }, [country.code]);

  // Compute calculated totals in USD
  const beforeDepartureTotalUsd = useMemo(() => {
    let sum = 0;
    beforeDepItems.forEach(item => {
      const included = selectedItems[item.id] !== false;
      const val = customValues[item.id] !== undefined ? customValues[item.id] : Math.round((item.min + item.max) / 2);
      if (included) sum += val;
    });
    return sum;
  }, [beforeDepItems, selectedItems, customValues]);

  const beforeDepartureTotalNoDepositUsd = useMemo(() => {
    let sum = 0;
    beforeDepItems.forEach(item => {
      if (item.id === "tuition-deposit") return; // exclude tuition deposit
      const included = selectedItems[item.id] !== false;
      const val = customValues[item.id] !== undefined ? customValues[item.id] : Math.round((item.min + item.max) / 2);
      if (included) sum += val;
    });
    return sum;
  }, [beforeDepItems, selectedItems, customValues]);

  const first6MonthsTotalUsd = useMemo(() => {
    let sum = 0;
    livingItems.forEach(item => {
      const included = selectedItems[item.id] !== false;
      const val = customValues[item.id] !== undefined ? customValues[item.id] : Math.round((item.min + item.max) / 2);
      if (included) sum += val;
    });
    return sum;
  }, [livingItems, selectedItems, customValues]);

  // Currency converters
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const combinedTotalUsd = useMemo(() => {
    if (period === "Before Departure") return beforeDepartureTotalUsd;
    if (period === "First 6 Months") return first6MonthsTotalUsd;
    
    // Overall Cost of Living = Pre-departure (no deposit) + Tuition * duration + Living * 2 * duration
    const tuitionTotal = selectedItems["tuition-deposit"] !== false ? (annualTuitionUsd * duration) : 0;
    const livingTotal = first6MonthsTotalUsd * 2 * duration;
    return beforeDepartureTotalNoDepositUsd + tuitionTotal + livingTotal;
  }, [period, beforeDepartureTotalUsd, first6MonthsTotalUsd, beforeDepartureTotalNoDepositUsd, selectedItems, annualTuitionUsd, duration]);

  const formatLocal = (val: number) => {
    const symbol = data?.local_currency?.symbol || "$";
    const code = data?.local_currency?.code || "USD";
    return `${symbol}${Math.round(val * localRate).toLocaleString()} ${code}`;
  };

  const activeItems = useMemo(() => {
    if (period === "Before Departure") return beforeDepItems;
    if (period === "First 6 Months") return livingItems;
    
    // Overall Cost of Living: scale living items and tuition deposit
    const scaledBeforeDep = beforeDepItems.map(item => {
      if (item.id === "tuition-deposit") {
        return {
          ...item,
          label: `Total Tuition Fees (${duration} Years)`,
          description: `Annual tuition fees of ${formatUSD(annualTuitionUsd)} scaled for ${duration}-year study duration`,
          min: Math.round(item.min * 2 * duration),
          max: Math.round(item.max * 2 * duration),
          value: annualTuitionUsd * duration,
        };
      }
      return item;
    });

    const scaledLiving = livingItems.map(item => {
      const scaleFactor = 2 * duration;
      const value = customValues[item.id] !== undefined ? customValues[item.id] : Math.round((item.min + item.max) / 2);
      return {
        ...item,
        label: `${item.label} (${duration} Years)`,
        description: `${item.description} (originally ${formatUSD(value)} per 6 months, scaled for ${duration} years)`,
        min: item.min * scaleFactor,
        max: item.max * scaleFactor,
        value: value * scaleFactor
      };
    });

    return [...scaledBeforeDep, ...scaledLiving];
  }, [period, beforeDepItems, livingItems, duration, annualTuitionUsd, customValues]);

  const filteredUnis = useMemo(() => {
    return universities.filter(uni =>
      uni.name.toLowerCase().includes(uniSearchQuery.toLowerCase())
    );
  }, [universities, uniSearchQuery]);

  // PDF report downloader
  const generatePDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const fmtUsd = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
      const fmtNpr = (v: number) => "Rs " + formatLakhCrore(Math.round(v * exchangeRate));
      const fmtLocal = (v: number) => {
        const symbol = data?.local_currency?.symbol || "$";
        const code = data?.local_currency?.code || "USD";
        return `${symbol}${Math.round(v * localRate).toLocaleString()} ${code}`;
      };

      const PW = 210;
      const ML = 14;
      const MR = 14;
      const CW = PW - ML - MR;
      let y = 0;

      const checkPage = (needed: number) => {
        if (y + needed > 275) {
          doc.addPage();
          y = 16;
        }
      };

      // Header Band
      doc.setFillColor(16, 185, 129); // Emerald green primary color
      doc.rect(0, 0, PW, 28, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Study Abroad Custom Cost Report", ML, 11);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const subText = `${country.flag} ${country.name} (${city}) · University: ${selectedUni ? selectedUni.name : "Custom"} · Generated on ${new Date().toLocaleDateString()}`;
      doc.text(subText, ML, 18);

      // Grand total top-right
      doc.setFontSize(8);
      doc.text(period === "Overall Cost of Living" ? "OVERALL COST OF LIVING" : "COMBINED TOTAL", PW - MR, 9, { align: "right" });
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(fmtUsd(combinedTotalUsd), PW - MR, 17, { align: "right" });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`${fmtNpr(combinedTotalUsd)} / ${fmtLocal(combinedTotalUsd)}`, PW - MR, 23, { align: "right" });

      y = 36;

      // Summary Cards
      const cards = [
        { label: "Before Departure", usd: beforeDepartureTotalUsd },
        { label: "First 6 Months", usd: first6MonthsTotalUsd },
        { label: period === "Overall Cost of Living" ? "Overall Cost of Living" : "Combined Total", usd: combinedTotalUsd },
      ];
      const cardW = CW / 3 - 3;
      cards.forEach((card, i) => {
        const cx = ML + i * (cardW + 4.5);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(cx, y, cardW, 20, 3, 3, "FD");
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(card.label.toUpperCase(), cx + 4, y + 6);
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.text(fmtUsd(card.usd), cx + 4, y + 13);
        doc.setFontSize(7);
        doc.setTextColor(16, 185, 129);
        doc.text(fmtNpr(card.usd), cx + 4, y + 18);
      });
      y += 28;

      // Draw cost lists
      const drawTable = (title: string, items: any[], subtotal: number, accentColor: [number, number, number]) => {
        if (items.length === 0) return;
        checkPage(18);

        // Section title bar
        doc.setFillColor(...accentColor);
        doc.rect(ML, y, 4, 7, "F");
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(title, ML + 7, y + 5.5);
        y += 12;

        // Header row
        doc.setFillColor(241, 245, 249);
        doc.rect(ML, y, CW, 7, "F");
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(7);
        doc.text("ITEM", ML + 2, y + 4.8);
        doc.text("USD", ML + CW - 65, y + 4.8, { align: "right" });
        doc.text("LOCAL CURRENCY", ML + CW - 30, y + 4.8, { align: "right" });
        doc.text("NPR", ML + CW - 2, y + 4.8, { align: "right" });
        y += 8;

        items.forEach((item, idx) => {
          checkPage(10);
          if (idx % 2 === 0) {
            doc.setFillColor(252, 252, 253);
            doc.rect(ML, y - 1, CW, 8, "F");
          }
          doc.setTextColor(30, 41, 59);
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.text(item.label, ML + 2, y + 4);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.text(fmtUsd(item.value), ML + CW - 65, y + 4, { align: "right" });
          doc.text(fmtLocal(item.value), ML + CW - 30, y + 4, { align: "right" });
          doc.setTextColor(16, 185, 129);
          doc.setFont("helvetica", "bold");
          doc.text(fmtNpr(item.value), ML + CW - 2, y + 4, { align: "right" });

          // Separator line
          doc.setDrawColor(241, 245, 249);
          doc.line(ML, y + 7, ML + CW, y + 7);
          y += 8;
        });

        // Subtotal row
        checkPage(10);
        doc.setFillColor(241, 245, 249);
        doc.rect(ML, y, CW, 9, "F");
        doc.setDrawColor(...accentColor);
        doc.setLineWidth(0.5);
        doc.line(ML, y, ML + CW, y);
        doc.setLineWidth(0.2);
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`${title} Subtotal`, ML + 2, y + 6);
        doc.text(fmtUsd(subtotal), ML + CW - 65, y + 6, { align: "right" });
        doc.text(fmtLocal(subtotal), ML + CW - 30, y + 6, { align: "right" });
        doc.setTextColor(16, 185, 129);
        doc.text(fmtNpr(subtotal), ML + CW - 2, y + 6, { align: "right" });
        y += 14;
      };

      const selectedBeforeDep = beforeDepItems.filter(item => selectedItems[item.id] !== false);
      const selectedLiving = livingItems.filter(item => selectedItems[item.id] !== false);

      if (period === "Overall Cost of Living") {
        const preDepNoDeposit = selectedBeforeDep.filter(item => item.id !== "tuition-deposit");
        const getItemValue = (item: any) => {
          if (item.value !== undefined) return item.value;
          return customValues[item.id] !== undefined ? customValues[item.id] : Math.round((item.min + item.max) / 2);
        };
        const preDepNoDepositSubtotal = preDepNoDeposit.reduce((sum: number, item: any) => sum + getItemValue(item), 0);

        const tuitionItem = {
          label: `Total Tuition Fees (${duration} Years)`,
          value: annualTuitionUsd * duration,
        };

        const scaledLivingItems = selectedLiving.map(item => ({
          label: `${item.label} (${duration} Years)`,
          value: (customValues[item.id] !== undefined ? customValues[item.id] : Math.round((item.min + item.max) / 2)) * 2 * duration,
        }));

        // For the PDF table, map preDepNoDeposit items to have a value field
        const preDepForPdf = preDepNoDeposit.map((item: any) => ({
          ...item,
          label: item.label,
          value: getItemValue(item),
        }));

        drawTable("Before Departure (One-Time Setup)", preDepForPdf, preDepNoDepositSubtotal, [59, 130, 246]); // Blue-500
        drawTable(`Tuition Fees (${duration} Years)`, [tuitionItem], annualTuitionUsd * duration, [168, 85, 247]); // Purple-500
        drawTable(`Living Expenses (${duration} Years)`, scaledLivingItems, first6MonthsTotalUsd * 2 * duration, [16, 185, 129]); // Emerald-500
      } else {
        drawTable("Before Departure Costs", selectedBeforeDep, beforeDepartureTotalUsd, [59, 130, 246]); // Blue-500
        drawTable("First 6 Months Living Costs", selectedLiving, first6MonthsTotalUsd, [16, 185, 129]); // Emerald-500
      }

      // Grand Total Row
      checkPage(14);
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(ML, y, CW, 13, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(period === "Overall Cost of Living" ? `Overall Cost of Living (${duration} Years)` : "Grand Total (Before Departure + 6 Months)", ML + 4, y + 8.5);
      doc.text(fmtUsd(combinedTotalUsd), ML + CW - 65, y + 8.5, { align: "right" });
      doc.text(fmtLocal(combinedTotalUsd), ML + CW - 30, y + 8.5, { align: "right" });
      doc.setTextColor(16, 185, 129);
      doc.text(fmtNpr(combinedTotalUsd), ML + CW - 2, y + 8.5, { align: "right" });
      y += 20;

      // Footer disclaimer
      checkPage(14);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(ML, y, ML + CW, y);
      y += 5;
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(
        `This custom costing estimate was generated using AbroadLift. Actual costs vary by city, university, exchange rates, and personal lifestyle. Exchange rate used: 1 USD = ${exchangeRate.toFixed(2)} NPR. Always verify with official sources before planning.`,
        ML,
        y,
        { maxWidth: CW }
      );

      const filename = `AbroadLift_Cost_Estimate_${country.name.replace(/\s+/g, "_")}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error("PDF generation failed", err);
    }
  };

  const tuitionPct = Math.round((Math.max(0, annualTuitionUsd) / Math.max(1, combinedTotalUsd)) * 100);
  const departurePct = Math.round(((beforeDepartureTotalUsd - (selectedItems["tuition-deposit"] ? Math.round(annualTuitionUsd * 0.5) : 0)) / Math.max(1, combinedTotalUsd)) * 100);
  const livingPct = 100 - tuitionPct - departurePct;

  let costBand = "Balanced";
  if (combinedTotalUsd * exchangeRate < 3000000) {
    costBand = "Budget Friendly";
  } else if (combinedTotalUsd * exchangeRate > 6000000) {
    costBand = "Premium";
  }

  return (
    <div
      className="min-h-screen bg-[#f8fafc] pb-24"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Upper Navigation Header */}
      <header className="pt-6 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors group"
          >
            <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            <span>Back to Home</span>
          </Link>
          <div className="w-12 h-12 rounded-full bg-[#FFF7E8] border border-[#F7E8C6] flex items-center justify-center text-[#F6C56E] shadow-sm">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mt-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Intro Banner */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            Interactive Country Budgeting
          </span>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              Study Abroad <span className="text-emerald-500">Cost Calculator</span>
            </h1>
            <p className="mt-2 text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              Calculate your entire study abroad budget based on real-world cost ranges from Nepal. 
              Search universities to auto-load actual tuition and application fees.
            </p>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Inputs (4/12 Width) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 space-y-6">
              
              {/* Destination Selector */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Select Destination
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCountry(c);
                        setCity(c.cities[0]);
                      }}
                      className={`py-2 px-1 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                        country.code === c.code
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                          : "bg-white border-slate-100 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-[10px] font-black">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* University Selector Searchable Combobox */}
              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Select University / College
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={selectedUni ? selectedUni.name : uniSearchQuery}
                    onChange={(e) => {
                      setUniSearchQuery(e.target.value);
                      if (selectedUni) setSelectedUni(null);
                    }}
                    placeholder={loadingUnis ? "Loading universities..." : "Type school name to search..."}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-10 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    onFocus={() => setShowDropdown(true)}
                  />
                  {selectedUni && (
                    <button
                      onClick={() => {
                        setSelectedUni(null);
                        setUniSearchQuery("");
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {showDropdown && !selectedUni && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredUnis.length > 0 ? (
                      filteredUnis.map((uni) => (
                        <button
                          key={uni.school_id}
                          onClick={() => {
                            setSelectedUni(uni);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 font-medium text-sm border-b border-slate-100 last:border-0"
                        >
                          {uni.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-400">
                        No universities found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Program Selector */}
              {selectedUni && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Select Program / Course
                  </label>
                  <select
                    value={selectedProgram ? selectedProgram.program_id : ""}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      const prog = programs.find((p) => p.program_id === id);
                      setSelectedProgram(prog || null);
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-slate-900 font-bold focus:outline-none text-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat"
                  >
                    <option value="">All Programs (Average Cost)</option>
                    {programs.map((p) => (
                      <option key={p.program_id} value={p.program_id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Selected University details summary card */}
              {selectedUni && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-slate-200/60 p-4 bg-slate-50 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    {selectedUni.logo?.url || selectedUni.logo?.url_thumbnail ? (
                      <img
                        src={selectedUni.logo?.url || selectedUni.logo?.url_thumbnail}
                        alt={selectedUni.name}
                        className="w-12 h-12 rounded-lg bg-white p-1 border object-contain shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-200 border flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-slate-900 truncate leading-snug">
                        {selectedUni.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {selectedUni.city}, {selectedUni.province || selectedUni.country}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600 border-t pt-2">
                    <div>Rank: <span className="text-slate-950 font-black">#{selectedUni.school_rank || "N/A"}</span></div>
                    <div>Acceptance: <span className="text-slate-950 font-black">~{Math.min(95, Math.max(25, 98 - Math.round(Math.log10((selectedUni.school_rank || 500) + 1) * 15)))}%</span></div>
                  </div>
                </motion.div>
              )}

              {/* Annual Tuition (USD) override */}
              <div className="space-y-2">
                <label htmlFor="tuition-override-input" className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Annual Tuition (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="tuition-override-input"
                    type="number"
                    value={manualTuition}
                    onChange={(e) => setManualTuition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    placeholder={selectedUni ? defaultTuitionUsd.toString() : "e.g. 20000"}
                  />
                </div>
              </div>

              {/* University Application Fee override */}
              <div className="space-y-2">
                <label htmlFor="app-fee-override-input" className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Admissions Application Fee (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="app-fee-override-input"
                    type="number"
                    value={manualAppFee}
                    onChange={(e) => setManualAppFee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    placeholder={selectedUni ? defaultAppFeeUsd.toString() : "e.g. 100"}
                  />
                </div>
              </div>

              {/* Study Duration */}
              <div className="space-y-2">
                <label htmlFor="study-duration-select" className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Study Duration
                </label>
                <select
                  id="study-duration-select"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 4)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat"
                >
                  <option value={1}>1 Year (Certificate / Diploma)</option>
                  <option value={2}>2 Years (Masters / Associate)</option>
                  <option value={3}>3 Years (Bachelors UK / Europe)</option>
                  <option value={4}>4 Years (Bachelors USA / Canada)</option>
                </select>
              </div>

            </div>

            {/* Pro Tip Card */}
            <div className="bg-blue-50/50 rounded-3xl p-6 flex gap-4 border border-blue-100/50">
              <Info className="w-6 h-6 text-blue-500 shrink-0" />
              <p className="text-blue-700/80 text-xs leading-relaxed font-medium">
                <span className="font-bold">Before Departure Shopping</span> has been added to pre-departure costs. Adjust the sliders to fit your actual spending on bags, jackets, adapters, and electronics.
              </p>
            </div>
          </div>

          {/* Right Column: Results Dashboard (8/12 Width) */}
          <div className="lg:col-span-8 relative min-h-[500px]">
            {loading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[40px]">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
              </div>
            )}

            {data ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                
                {/* Result Header Banner */}
                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <TrendingUp className="w-36 h-36" />
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                        {country.flag}
                      </div>
                      <div>
                        <p className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-0.5">
                          Selected Destination
                        </p>
                        <h2 className="text-2xl font-black text-white leading-tight">
                          {city}, {country.name}
                        </h2>
                        <p className="text-slate-400 text-xs">
                          Detailed cost ranges from Nepal loaded
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-2 font-bold text-slate-200 backdrop-blur-xs">
                        Tuition: {formatUSD(annualTuitionUsd)}
                      </div>
                      <div className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-2 font-bold text-slate-200 backdrop-blur-xs">
                        Band: {costBand}
                      </div>
                      <Link
                        href="/matches"
                        className="rounded-xl bg-emerald-600 px-4 py-2 font-black text-white shadow-md hover:bg-emerald-700 transition-colors"
                      >
                        Find Matches
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 3-Card Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Card 1: NPR Total Estimate */}
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.03)] space-y-4">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.18em] text-slate-400 uppercase">
                        NPR Budget Equivalent
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        / {period === "First 6 Months" ? "first 6 months" : period === "Before Departure" ? "pre-departure" : `${duration}-year overall cost`}
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <p className="text-2xl font-black text-slate-950 leading-none">
                          Rs {formatLakhCrore(combinedTotalUsd * exchangeRate)}
                        </p>
                        <p className="text-[11px] font-bold text-slate-500 mt-1 leading-snug">
                          {formatNPRDevanagari(combinedTotalUsd * exchangeRate)} NPR
                        </p>
                      </div>

                      {/* Local Currency equivalent */}
                      {data.local_currency && (
                        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {country.name} Currency
                          </p>
                          <p className="text-sm font-black text-emerald-600 mt-0.5">
                            {formatLocal(combinedTotalUsd)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 2: Cost Mix */}
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.03)] flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.18em] text-slate-400 uppercase">
                        Cost Breakdown Mix
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Percentage share of total</p>
                    </div>

                    <div className="space-y-3 mt-4 flex-1 flex flex-col justify-center">
                      {[
                        { label: "Tuition Fee Share", value: tuitionPct, color: "bg-blue-500" },
                        { label: "Before Departure Prep", value: departurePct, color: "bg-amber-500" },
                        { label: "First 6 Months Living", value: livingPct, color: "bg-emerald-500" },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                            <span>{item.label}</span>
                            <span>{Math.max(0, Math.min(100, item.value))}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.color} transition-all duration-500`}
                              style={{ width: `${Math.max(0, Math.min(100, item.value))}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Live Exchange Rates */}
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.03)] space-y-4">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.18em] text-slate-400 uppercase">
                        Live Exchange Rate
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Sync status: Active</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-base font-black text-slate-800 leading-tight">
                          1 USD = {exchangeRate.toFixed(2)} NPR
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Real-time conversions</p>
                      </div>

                      {data.local_currency && data.local_currency.code !== "USD" && (
                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            1 USD = {localRate.toFixed(2)} {data.local_currency.code}
                          </p>
                          <p className="text-[10px] text-slate-400">Local currency rate</p>
                        </div>
                      )}

                      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-900 block mb-0.5">Calculated Total in USD:</span>
                        {formatUSD(combinedTotalUsd)}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Detailed Expense Categories */}
                <div className="rounded-3xl border border-slate-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.04)] p-6 md:p-8 space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Detailed Budget Items
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Select items to include and slide to customize costs.
                      </p>
                    </div>
                    
                    {/* Period Selector Tabs */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                      {["Before Departure", "First 6 Months", "Overall Cost of Living"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setPeriod(tab as any)}
                          className={`h-9 rounded-lg px-4 text-xs font-black transition-all ${
                            period === tab
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Breakdown Category List */}
                  <div className="space-y-4">
                    {activeItems.map((item) => {
                      const Icon = ICON_MAP[item.id] || Info;
                      const colors = COLOR_MAP[item.id] || { bg: "bg-slate-100", text: "text-slate-600" };
                      const isIncluded = selectedItems[item.id] !== false;
                      const valUsd = customValues[item.id] !== undefined ? customValues[item.id] : Math.round((item.min + item.max) / 2);

                      // App fees application is fixed if university selected
                      const isFixedCost = item.min === item.max;

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isIncluded
                              ? "border-slate-100 bg-slate-50/50 hover:border-emerald-200"
                              : "border-slate-100/50 bg-slate-50/10 opacity-60"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            
                            {/* Checkbox + Icon + Details */}
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <input
                                type="checkbox"
                                checked={isIncluded}
                                onChange={() => {
                                  setSelectedItems(prev => ({
                                    ...prev,
                                    [item.id]: !isIncluded
                                  }));
                                }}
                                className="mt-1 h-4.5 w-4.5 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors.bg}`}>
                                <Icon className={`w-4 h-4 ${colors.text}`} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-black text-slate-900 truncate">
                                    {item.label}
                                  </p>
                                  <span className="inline-block text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-500">
                                    {item.category === "Before Departure" ? "Pre-Departure" : "6 Months"}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            {/* Range display & adjusted value inputs */}
                            <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0 pl-7 sm:pl-0">
                              <div className="text-right">
                                <p className="text-xs font-semibold text-slate-400">
                                  Range: {formatUSD(item.min)} - {formatUSD(item.max)}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {formatNPRDevanagari(item.min * exchangeRate)} - {formatNPRDevanagari(item.max * exchangeRate)}
                                </p>
                              </div>

                              {/* Adjusted values */}
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-900 w-16 text-right">
                                  {formatUSD(valUsd)}
                                </span>
                                <input
                                  type="number"
                                  disabled={!isIncluded}
                                  value={valUsd}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setCustomValues(prev => ({ ...prev, [item.id]: val }));
                                  }}
                                  className="w-16 bg-white border border-slate-200 rounded-lg p-1 text-xs font-bold text-center text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>

                            </div>
                          </div>

                          {/* Slider for range control */}
                          {isIncluded && !isFixedCost && (
                            <div className="mt-3 pl-7 flex items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-400">{formatUSD(item.min)}</span>
                              <input
                                type="range"
                                min={item.min}
                                max={item.max}
                                value={valUsd}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  setCustomValues(prev => ({ ...prev, [item.id]: val }));
                                }}
                                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                              />
                              <span className="text-[10px] font-bold text-slate-400">{formatUSD(item.max)}</span>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                  {/* Explanatory Info Alert */}
                  <div className="rounded-2xl border border-indigo-100 bg-[#F6F7FF] p-4 text-xs text-indigo-600 shadow-[0_8px_20px_rgba(99,102,241,0.04)] flex items-start gap-2.5">
                    <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold mb-0.5">Custom Budget Summary</p>
                      <p className="leading-relaxed text-indigo-500/90 font-medium">
                        Your pre-departure budget totals {formatUSD(beforeDepartureTotalUsd)} ({formatNPRDevanagari(beforeDepartureTotalUsd * exchangeRate)}) and first 6 months living costs are {formatUSD(first6MonthsTotalUsd)} ({formatNPRDevanagari(first6MonthsTotalUsd * exchangeRate)}).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommended Universities list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Recommended Universities
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Matched institutions in {country.name} based on your preliminary budget
                      </p>
                    </div>
                    <Link
                      href="/matches"
                      className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
                    >
                      See All <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {recommendationLoading && recommendations.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((idx) => (
                        <div
                          key={idx}
                          className="h-64 rounded-3xl border border-slate-100 bg-white animate-pulse"
                        />
                      ))}
                    </div>
                  ) : recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {recommendations.map((uni) => {
                        const uniTuitionUsd = typeof uni.tuition === "number" ? uni.tuition : Number(uni.tuition);
                        const tuitionKnown = Number.isFinite(uniTuitionUsd) && uniTuitionUsd > 0;
                        const uniTuitionNpr = tuitionKnown ? uniTuitionUsd * exchangeRate : 0;
                        
                        let fitLabel = "Fee on request";
                        let fitColorClass = "bg-slate-50 text-slate-600";
                        if (tuitionKnown && uniTuitionUsd <= annualTuitionUsd) {
                          fitLabel = "Within budget";
                          fitColorClass = "bg-emerald-50 text-emerald-700 border border-emerald-100";
                        } else if (tuitionKnown) {
                          fitLabel = "Stretch budget";
                          fitColorClass = "bg-amber-50 text-amber-700 border border-amber-100";
                        }

                        const fitScore = tuitionKnown
                          ? Math.max(58, Math.min(97, Math.round(100 - (Math.abs(uniTuitionUsd - annualTuitionUsd) / Math.max(annualTuitionUsd || 1, 1)) * 20 + (uni.acceptanceRate || 0) / 3)))
                          : Math.max(60, Math.min(94, Math.round(uni.acceptanceRate || 72)));

                        return (
                          <div
                            key={uni.id}
                            className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs flex flex-col hover:border-slate-300 transition-colors"
                          >
                            {/* University Card Header Banner */}
                            <div className="p-4 relative bg-slate-900 text-white min-h-[90px] flex flex-col justify-end overflow-hidden">
                              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent_45%)]" />
                              <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                {fitScore}% Fit
                              </span>
                              <p className="text-[9px] font-black tracking-[0.15em] uppercase text-slate-400">
                                {uni.country}
                              </p>
                              <h4 className="font-black text-xs md:text-sm mt-0.5 truncate">
                                {uni.name}
                              </h4>
                            </div>

                            {/* Card Details */}
                            <div className="p-4 flex flex-col flex-1 gap-3.5">
                              <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {uni.location}
                              </p>

                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2">
                                  <span className="text-slate-400 font-semibold uppercase block text-[9px] tracking-wide">Tuition</span>
                                  <span className="font-black text-slate-900 mt-0.5 block">
                                    {tuitionKnown ? formatUSD(uniTuitionUsd) : "Check site"}
                                  </span>
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2">
                                  <span className="text-slate-400 font-semibold uppercase block text-[9px] tracking-wide">Acceptance</span>
                                  <span className="font-black text-slate-900 mt-0.5 block">
                                    {Math.round(uni.acceptanceRate || 0)}%
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1 text-[10px] font-bold">
                                <span className={`rounded-lg px-2 py-1 self-start text-[10px] font-black ${fitColorClass}`}>
                                  {fitLabel}
                                </span>
                                {tuitionKnown && (
                                  <span className="text-slate-500 mt-1 block">
                                    {formatNPRDevanagari(uniTuitionNpr)} / year
                                  </span>
                                )}
                              </div>

                              <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
                                <a
                                  href={uni.website || "/matches"}
                                  target={uni.website ? "_blank" : undefined}
                                  rel={uni.website ? "noreferrer" : undefined}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-[10px] py-2 rounded-lg text-center transition-colors"
                                >
                                  Website
                                </a>
                                <button
                                  onClick={() => {
                                    // Set this university as selected
                                    setSelectedUni(uni);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] py-2 rounded-lg text-center transition-colors shadow-xs"
                                >
                                  Select
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500 text-sm font-medium">
                      Live university recommendations will appear here once matching results load for {country.name}.
                    </div>
                  )}
                </div>

                {/* Bottom Report Button */}
                <button
                  onClick={generatePDF}
                  className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-500" /> Download Custom Budget Report
                </button>

              </div>
            ) : (
              // Empty State Placeholder
              <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-center p-12 min-h-[500px]">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 shadow-sm border border-slate-100/50">
                  <TrendingUp className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Ready to calculate your study budget?
                </h3>
                <p className="max-w-md text-sm text-slate-500 leading-relaxed font-medium">
                  Enter your destination country, select a university/program, and adjust the cost sliders to generate a customized budget report.
                </p>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
