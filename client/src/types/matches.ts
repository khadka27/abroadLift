/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Form {
  nationality: string;
  currentCountry: string;
  countries: string[];
  degree: string;
  field: string;
  program: string;
  testType: string;
  testScore: string;
  ielsReading: string;
  ielsWriting: string;
  ielsListening: string;
  ielsSpeaking: string;
  toeflReading: string;
  toeflWriting: string;
  toeflListening: string;
  toeflSpeaking: string;
  pteReading: string;
  pteWriting: string;
  pteListening: string;
  pteSpeaking: string;
  duoLiteracy: string;
  duoComprehension: string;
  duoConversation: string;
  duoProduction: string;
  greVerbal: string;
  greQuant: string;
  greAwa: string;
  gmatTotal: string;
  backlogs: string;
  studyGap: string;
  gpa: string;
  bankBalance: string;
  sponsorType: string;
  sponsorIncome: string;
  univType: string;
  cityType: string;
  duration: string;
  budget: string;
  currency: string;
  intake: string;
  aptitudeTest: string;
  programTags: string[];
  scholarship: boolean;
  name: string;
  email: string;
  highestEducation: string;
  passingYear: string;
  hasEnglishTest: boolean | null;
  passportReady: boolean;
  testDone: boolean;
  docsReady: boolean;
}

export interface Match {
  currency: string;
  logo: any;
  id: string | number;
  name: string;
  location?: string;
  countryCode?: string;
  tuitionFee?: number;
  englishReq?: number;
  website?: string;
  admissionRate?: number;
  rankingWorld?: number;
  rankingNational?: number;
  scholarships?: { name: string; value: string }[];
  description?: string;
  type?: string;
  founded?: number;
  studentPopulation?: number;
  popularPrograms?: string[];
  applicationDeadline?: string;
  gpaRequirement?: number;
  matchType?: string;
  internationalPercentage?: number;
  salaryMedian?: number;
  deadline?: string;
  banner?: string;
}

export interface ChecklistItem {
  id: number;
  text: string;
  status: "complete" | "loading" | "pending";
}

export interface DataIndicator {
  text: string;
  count: number;
  active: boolean;
}
