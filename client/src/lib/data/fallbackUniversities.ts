/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FallbackSchool {
  school_id: number;
  name: string;
  country: string;
  country_code: string;
  city: string;
  province?: string;
  school_rank: number;
  institution_type: string;
  founded_in: number;
  total_number_of_students: number;
  number_of_international_students: number;
  tuition: number;
  website: string;
  logo?: { url: string };
  banner?: { url: string };
  about?: string;
  programs: Array<{
    id: string;
    school_id: number;
    name: string;
    level: string;
    level_text: string;
    cip_code?: string;
    tuition: number;
    requirements?: {
      min_gpa?: number;
      min_ielts_average?: number;
      min_toefl_total?: number;
      min_pte_overall?: number;
      min_duolingo_score?: number;
    };
  }>;
}

export const FALLBACK_SCHOOLS: FallbackSchool[] = [
  // ─── AUSTRALIA (AU) ──────────────────────────────────────────────────────────
  {
    school_id: 9001,
    name: "University of Melbourne",
    country: "Australia",
    country_code: "AU",
    city: "Melbourne",
    province: "Victoria",
    school_rank: 14,
    institution_type: "Public",
    founded_in: 1853,
    total_number_of_students: 52000,
    number_of_international_students: 21000,
    tuition: 21500,
    website: "https://www.unimelb.edu.au",
    about: "The University of Melbourne is a public research university located in Melbourne, Australia. Founded in 1853, it is Australia's second oldest university and ranked #14 globally.",
    programs: [
      {
        id: "au-melb-cs",
        school_id: 9001,
        name: "Master of Computer Science",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "11.0701",
        tuition: 22500,
        requirements: { min_gpa: 3.2, min_ielts_average: 6.5, min_toefl_total: 79, min_pte_overall: 58 }
      },
      {
        id: "au-melb-ds",
        school_id: 9001,
        name: "Master of Data Science",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "30.7001",
        tuition: 23000,
        requirements: { min_gpa: 3.2, min_ielts_average: 6.5, min_toefl_total: 79, min_pte_overall: 58 }
      },
      {
        id: "au-melb-mba",
        school_id: 9001,
        name: "Master of Business Administration (MBA)",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "52.0201",
        tuition: 26000,
        requirements: { min_gpa: 3.0, min_ielts_average: 7.0, min_toefl_total: 94, min_pte_overall: 65 }
      },
      {
        id: "au-melb-bcs",
        school_id: 9001,
        name: "Bachelor of Science - Computing & Software Systems",
        level: "bachelors",
        level_text: "4-Year Bachelor's Degree",
        cip_code: "11.0101",
        tuition: 21000,
        requirements: { min_gpa: 3.0, min_ielts_average: 6.5, min_toefl_total: 79, min_pte_overall: 58 }
      },
      {
        id: "au-melb-bcom",
        school_id: 9001,
        name: "Bachelor of Commerce - Finance & Accounting",
        level: "bachelors",
        level_text: "4-Year Bachelor's Degree",
        cip_code: "52.0301",
        tuition: 21500,
        requirements: { min_gpa: 3.0, min_ielts_average: 6.5, min_toefl_total: 79, min_pte_overall: 58 }
      },
      {
        id: "au-melb-eng",
        school_id: 9001,
        name: "Master of Engineering (Mechatronics & Civil)",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "14.0101",
        tuition: 23500,
        requirements: { min_gpa: 3.1, min_ielts_average: 6.5, min_toefl_total: 79, min_pte_overall: 58 }
      },
      {
        id: "au-melb-med",
        school_id: 9001,
        name: "Master of Public Health & Medicine",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "51.2201",
        tuition: 24000,
        requirements: { min_gpa: 3.3, min_ielts_average: 7.0, min_toefl_total: 94, min_pte_overall: 65 }
      }
    ]
  },
  {
    school_id: 9002,
    name: "University of Sydney",
    country: "Australia",
    country_code: "AU",
    city: "Sydney",
    province: "New South Wales",
    school_rank: 18,
    institution_type: "Public",
    founded_in: 1850,
    total_number_of_students: 60000,
    number_of_international_students: 24000,
    tuition: 22000,
    website: "https://www.sydney.edu.au",
    about: "The University of Sydney is an Australian public research university in Sydney, Australia. Founded in 1850, it is Australia's first university and is regarded as one of the world's leading universities.",
    programs: [
      {
        id: "au-syd-cs",
        school_id: 9002,
        name: "Master of Information Technology / Computer Science",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "11.0101",
        tuition: 22500,
        requirements: { min_gpa: 3.0, min_ielts_average: 6.5, min_toefl_total: 85, min_pte_overall: 61 }
      },
      {
        id: "au-syd-bus",
        school_id: 9002,
        name: "Master of Commerce - Digital Business & Marketing",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "52.0201",
        tuition: 23000,
        requirements: { min_gpa: 3.0, min_ielts_average: 7.0, min_toefl_total: 96, min_pte_overall: 68 }
      },
      {
        id: "au-syd-bcs",
        school_id: 9002,
        name: "Bachelor of Advanced Computing",
        level: "bachelors",
        level_text: "4-Year Bachelor's Degree",
        cip_code: "11.0701",
        tuition: 21500,
        requirements: { min_gpa: 2.9, min_ielts_average: 6.5, min_toefl_total: 85, min_pte_overall: 61 }
      },
      {
        id: "au-syd-arch",
        school_id: 9002,
        name: "Master of Architecture & Urban Design",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "04.0201",
        tuition: 22000,
        requirements: { min_gpa: 3.0, min_ielts_average: 6.5, min_toefl_total: 85, min_pte_overall: 61 }
      }
    ]
  },
  {
    school_id: 9003,
    name: "Monash University",
    country: "Australia",
    country_code: "AU",
    city: "Melbourne",
    province: "Victoria",
    school_rank: 42,
    institution_type: "Public",
    founded_in: 1958,
    total_number_of_students: 70000,
    number_of_international_students: 27000,
    tuition: 20500,
    website: "https://www.monash.edu",
    about: "Monash University is a public research university based in Melbourne, Victoria, Australia. Named for prominent World War I general Sir John Monash, it was founded in 1958.",
    programs: [
      {
        id: "au-mon-eng",
        school_id: 9003,
        name: "Master of Professional Engineering",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "14.0101",
        tuition: 21500,
        requirements: { min_gpa: 2.8, min_ielts_average: 6.5, min_toefl_total: 79, min_pte_overall: 58 }
      },
      {
        id: "au-mon-ai",
        school_id: 9003,
        name: "Master of Artificial Intelligence & Data Science",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "11.0102",
        tuition: 22000,
        requirements: { min_gpa: 2.9, min_ielts_average: 6.5, min_toefl_total: 79, min_pte_overall: 58 }
      },
      {
        id: "au-mon-pharm",
        school_id: 9003,
        name: "Bachelor of Pharmacy & Health Sciences",
        level: "bachelors",
        level_text: "4-Year Bachelor's Degree",
        cip_code: "51.2001",
        tuition: 20000,
        requirements: { min_gpa: 3.0, min_ielts_average: 6.5, min_toefl_total: 79, min_pte_overall: 58 }
      }
    ]
  },
  {
    school_id: 9004,
    name: "University of Queensland",
    country: "Australia",
    country_code: "AU",
    city: "Brisbane",
    province: "Queensland",
    school_rank: 43,
    institution_type: "Public",
    founded_in: 1909,
    total_number_of_students: 55000,
    number_of_international_students: 20000,
    tuition: 20000,
    website: "https://www.uq.edu.au",
    about: "The University of Queensland is a public research university located primarily in Brisbane, Queensland, Australia. Founded in 1909, UQ is one of Australia's founding universities.",
    programs: [
      {
        id: "au-uq-agri",
        school_id: 9004,
        name: "Master of Agricultural Science & Environmental Management",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "01.0000",
        tuition: 19500,
        requirements: { min_gpa: 2.8, min_ielts_average: 6.5, min_toefl_total: 87, min_pte_overall: 64 }
      },
      {
        id: "au-uq-cs",
        school_id: 9004,
        name: "Bachelor of Computer Science / Software Engineering",
        level: "bachelors",
        level_text: "4-Year Bachelor's Degree",
        cip_code: "11.0701",
        tuition: 20500,
        requirements: { min_gpa: 2.8, min_ielts_average: 6.5, min_toefl_total: 87, min_pte_overall: 64 }
      }
    ]
  },
  {
    school_id: 9005,
    name: "University of Technology Sydney (UTS)",
    country: "Australia",
    country_code: "AU",
    city: "Sydney",
    province: "New South Wales",
    school_rank: 90,
    institution_type: "Public",
    founded_in: 1988,
    total_number_of_students: 45000,
    number_of_international_students: 15000,
    tuition: 18500,
    website: "https://www.uts.edu.au",
    about: "University of Technology Sydney is a public research university located in Sydney, Australia. UTS is known for its practical, industry-integrated learning model.",
    programs: [
      {
        id: "au-uts-it",
        school_id: 9005,
        name: "Master of Information Technology & Cybersecurity",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "11.0101",
        tuition: 19000,
        requirements: { min_gpa: 2.7, min_ielts_average: 6.5, min_toefl_total: 79, min_pte_overall: 58 }
      },
      {
        id: "au-uts-des",
        school_id: 9005,
        name: "Bachelor of Design in Architecture & Visual Communication",
        level: "bachelors",
        level_text: "3-Year Bachelor's Degree",
        cip_code: "04.0201",
        tuition: 18000,
        requirements: { min_gpa: 2.7, min_ielts_average: 6.0, min_toefl_total: 75, min_pte_overall: 54 }
      }
    ]
  },

  // ─── GERMANY (DE) ────────────────────────────────────────────────────────────
  {
    school_id: 9010,
    name: "Technical University of Munich (TUM)",
    country: "Germany",
    country_code: "DE",
    city: "Munich",
    province: "Bavaria",
    school_rank: 37,
    institution_type: "Public",
    founded_in: 1868,
    total_number_of_students: 50000,
    number_of_international_students: 18000,
    tuition: 3300,
    website: "https://www.tum.de",
    about: "Technical University of Munich is a public research university in Munich, Garching and Freising-Weihenstephan, Germany. TUM is consistently ranked among Germany's premier engineering institutes.",
    programs: [
      {
        id: "de-tum-cs",
        school_id: 9010,
        name: "M.Sc. Computer Science & Software Engineering",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "11.0701",
        tuition: 3300,
        requirements: { min_gpa: 3.3, min_ielts_average: 6.5, min_toefl_total: 88, min_pte_overall: 62 }
      },
      {
        id: "de-tum-ai",
        school_id: 9010,
        name: "M.Sc. Data Engineering and Analytics / AI",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "30.7001",
        tuition: 3500,
        requirements: { min_gpa: 3.3, min_ielts_average: 6.5, min_toefl_total: 88, min_pte_overall: 62 }
      },
      {
        id: "de-tum-eng",
        school_id: 9010,
        name: "M.Sc. Automotive & Mechanical Engineering",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "14.1901",
        tuition: 3300,
        requirements: { min_gpa: 3.2, min_ielts_average: 6.5, min_toefl_total: 88, min_pte_overall: 62 }
      },
      {
        id: "de-tum-bcs",
        school_id: 9010,
        name: "B.Sc. Information Systems & Technology",
        level: "bachelors",
        level_text: "3-Year Bachelor's Degree",
        cip_code: "11.0101",
        tuition: 3000,
        requirements: { min_gpa: 3.0, min_ielts_average: 6.5, min_toefl_total: 88, min_pte_overall: 62 }
      }
    ]
  },
  {
    school_id: 9011,
    name: "Ludwig Maximilian University of Munich (LMU)",
    country: "Germany",
    country_code: "DE",
    city: "Munich",
    province: "Bavaria",
    school_rank: 54,
    institution_type: "Public",
    founded_in: 1472,
    total_number_of_students: 52000,
    number_of_international_students: 10000,
    tuition: 1600,
    website: "https://www.lmu.de",
    about: "Ludwig-Maximilians-Universität München is a public research university located in Munich, Germany. Founded in 1472, it is Germany's sixth-oldest university in continuous operation.",
    programs: [
      {
        id: "de-lmu-bus",
        school_id: 9011,
        name: "M.Sc. Management & Digital Business",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "52.0201",
        tuition: 1600,
        requirements: { min_gpa: 3.1, min_ielts_average: 6.5, min_toefl_total: 80, min_pte_overall: 60 }
      },
      {
        id: "de-lmu-med",
        school_id: 9011,
        name: "M.Sc. Molecular Medicine & Public Health",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "51.1401",
        tuition: 1600,
        requirements: { min_gpa: 3.2, min_ielts_average: 7.0, min_toefl_total: 92, min_pte_overall: 65 }
      }
    ]
  },
  {
    school_id: 9012,
    name: "RWTH Aachen University",
    country: "Germany",
    country_code: "DE",
    city: "Aachen",
    province: "North Rhine-Westphalia",
    school_rank: 106,
    institution_type: "Public",
    founded_in: 1870,
    total_number_of_students: 47000,
    number_of_international_students: 14000,
    tuition: 1600,
    website: "https://www.rwth-aachen.de",
    about: "RWTH Aachen University is a public research university located in Aachen, North Rhine-Westphalia, Germany. It is the largest technical university in Germany.",
    programs: [
      {
        id: "de-rwth-mech",
        school_id: 9012,
        name: "M.Sc. Mechanical Engineering & Production",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "14.1901",
        tuition: 1600,
        requirements: { min_gpa: 3.0, min_ielts_average: 6.0, min_toefl_total: 80, min_pte_overall: 56 }
      },
      {
        id: "de-rwth-cs",
        school_id: 9012,
        name: "M.Sc. Software Systems & Computer Science",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "11.0701",
        tuition: 1600,
        requirements: { min_gpa: 3.0, min_ielts_average: 6.0, min_toefl_total: 80, min_pte_overall: 56 }
      }
    ]
  },
  {
    school_id: 9013,
    name: "IU International University of Applied Sciences",
    country: "Germany",
    country_code: "DE",
    city: "Berlin",
    province: "Berlin",
    school_rank: 500,
    institution_type: "Private",
    founded_in: 1998,
    total_number_of_students: 100000,
    number_of_international_students: 35000,
    tuition: 7200,
    website: "https://www.iu.org",
    about: "IU International University of Applied Sciences is a state-accredited private university based in Germany offering online and campus-based bachelor's and master's degrees taught in English.",
    programs: [
      {
        id: "de-iu-mba",
        school_id: 9013,
        name: "MBA in International Management & Analytics",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "52.0201",
        tuition: 7200,
        requirements: { min_gpa: 2.5, min_ielts_average: 6.0, min_toefl_total: 75, min_pte_overall: 54 }
      },
      {
        id: "de-iu-cs",
        school_id: 9013,
        name: "B.Sc. Applied Computer Science & Data Science",
        level: "bachelors",
        level_text: "3-Year Bachelor's Degree",
        cip_code: "11.0101",
        tuition: 6800,
        requirements: { min_gpa: 2.5, min_ielts_average: 6.0, min_toefl_total: 75, min_pte_overall: 54 }
      }
    ]
  },

  // ─── UNITED KINGDOM (UK / GB) ────────────────────────────────────────────────
  {
    school_id: 9020,
    name: "University College London (UCL)",
    country: "United Kingdom",
    country_code: "UK",
    city: "London",
    province: "England",
    school_rank: 9,
    institution_type: "Public",
    founded_in: 1826,
    total_number_of_students: 43000,
    number_of_international_students: 21000,
    tuition: 36000,
    website: "https://www.ucl.ac.uk",
    about: "University College London is a public research university in London, England. It is a member institution of the federal University of London and ranked top 10 globally.",
    programs: [
      {
        id: "uk-ucl-cs",
        school_id: 9020,
        name: "MSc Computer Science & Artificial Intelligence",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "11.0701",
        tuition: 37000,
        requirements: { min_gpa: 3.3, min_ielts_average: 7.0, min_toefl_total: 96, min_pte_overall: 68 }
      },
      {
        id: "uk-ucl-bus",
        school_id: 9020,
        name: "MSc Management & Finance",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "52.0201",
        tuition: 36000,
        requirements: { min_gpa: 3.3, min_ielts_average: 7.0, min_toefl_total: 96, min_pte_overall: 68 }
      },
      {
        id: "uk-ucl-bsc",
        school_id: 9020,
        name: "BSc Computer Science",
        level: "bachelors",
        level_text: "3-Year Bachelor's Degree",
        cip_code: "11.0701",
        tuition: 35000,
        requirements: { min_gpa: 3.2, min_ielts_average: 6.5, min_toefl_total: 92, min_pte_overall: 62 }
      }
    ]
  },
  {
    school_id: 9021,
    name: "University of Edinburgh",
    country: "United Kingdom",
    country_code: "UK",
    city: "Edinburgh",
    province: "Scotland",
    school_rank: 22,
    institution_type: "Public",
    founded_in: 1582,
    total_number_of_students: 35000,
    number_of_international_students: 15000,
    tuition: 33500,
    website: "https://www.ed.ac.uk",
    about: "The University of Edinburgh is a public research university based in Edinburgh, Scotland. Founded by the city council in 1582, it is one of Scotland's four ancient universities.",
    programs: [
      {
        id: "uk-edin-inf",
        school_id: 9021,
        name: "MSc Informatics & Data Science",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "11.0101",
        tuition: 34000,
        requirements: { min_gpa: 3.2, min_ielts_average: 6.5, min_toefl_total: 92, min_pte_overall: 62 }
      },
      {
        id: "uk-edin-bus",
        school_id: 9021,
        name: "MSc International Business & Strategy",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "52.0201",
        tuition: 33000,
        requirements: { min_gpa: 3.1, min_ielts_average: 7.0, min_toefl_total: 96, min_pte_overall: 68 }
      }
    ]
  },

  // ─── NEW ZEALAND (NZ) ────────────────────────────────────────────────────────
  {
    school_id: 9030,
    name: "University of Auckland",
    country: "New Zealand",
    country_code: "NZ",
    city: "Auckland",
    province: "Auckland",
    school_rank: 68,
    institution_type: "Public",
    founded_in: 1883,
    total_number_of_students: 40000,
    number_of_international_students: 10000,
    tuition: 22000,
    website: "https://www.auckland.ac.nz",
    about: "The University of Auckland is a public research university based in Auckland, New Zealand. It is the largest, most comprehensive and highest-ranked university in New Zealand.",
    programs: [
      {
        id: "nz-auck-cs",
        school_id: 9030,
        name: "Master of Information Technology",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "11.0101",
        tuition: 22500,
        requirements: { min_gpa: 3.0, min_ielts_average: 6.5, min_toefl_total: 90, min_pte_overall: 58 }
      },
      {
        id: "nz-auck-bus",
        school_id: 9030,
        name: "Master of Management & Professional Accounting",
        level: "masters_degree",
        level_text: "Master's Degree",
        cip_code: "52.0201",
        tuition: 21500,
        requirements: { min_gpa: 2.9, min_ielts_average: 6.5, min_toefl_total: 90, min_pte_overall: 58 }
      }
    ]
  }
];
