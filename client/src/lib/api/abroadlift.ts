/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.ABROADLIFT_API_URL || "https://api.abroadlift.com";
const API_KEY = process.env.ABROADLIFT_API_KEY || "vl0i3A4W7DxG1fJohzI2qmbedgp4EAYT";

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("X-API-Key", API_KEY);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`AbroadLift API Error (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface School {
  _id: string;
  school_id: number;
  name: string;
  about?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  country_code?: string;
  founded_in?: number;
  institution_type?: string;
  logo?: {
    url?: string;
    url_thumbnail?: string;
  };
  banner?: {
    url?: string;
    url_thumbnail?: string;
  };
  total_number_of_students?: number;
  number_of_international_students?: number;
  school_rank?: number;
  cost_of_living?: string | number;
  website?: string;
  photos?: Array<{
    id: number;
    url: string;
    url_thumbnail: string;
    url_optimized: string;
    url_optimized_small: string;
  }>;
  [key: string]: any;
}

export interface Program {
  _id: string;
  program_id: number;
  school_id: number;
  name: string;
  description?: string;
  level?: string;
  level_text?: string;
  length_breakdown?: string;
  delivery_method?: string;
  tuition?: string | number;
  application_fee?: string | number;
  requirements?: {
    min_gpa?: string | number;
    min_ielts_average?: string | number;
    min_toefl_total?: string | number;
    min_duolingo_score?: string | number;
    other_requirements?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Scholarship {
  _id: string;
  scholarship_id: number;
  title: string;
  description?: string;
  automatically_applied?: boolean;
  award_amount_currency_code?: string;
  award_amount_currency_symbol?: string;
  award_amount_from?: string | number;
  award_amount_to?: string | number;
  award_amount_type?: string;
  eligible_levels?: string[];
  eligible_nationalities?: string[];
  slug?: string;
  source_url?: string;
  school_group_name?: string;
  [key: string]: any;
}

export interface ProfilePayload {
  name: string;
  gpa: number;
  english_score: number;
  gap_years: number;
  backlogs: number;
  work_experience: number;
  available_funds: number;
  sponsor_type: string;
}

export const abroadliftApi = {
  /**
   * Health Check
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const res = await fetch(`${API_URL}/api/health`);
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  },

  /**
   * Schools / Campuses
   */
  async getSchools(page = 1, limit = 20): Promise<PaginatedResponse<School>> {
    return apiRequest<PaginatedResponse<School>>(`/api/schools?page=${page}&limit=${limit}`);
  },

  async getSchoolById(schoolId: string | number): Promise<{ success: boolean; data: School }> {
    return apiRequest<{ success: boolean; data: School }>(`/api/schools/${schoolId}`);
  },

  /**
   * Programs
   */
  async getPrograms(page = 1, limit = 20): Promise<PaginatedResponse<Program>> {
    return apiRequest<PaginatedResponse<Program>>(`/api/programs?page=${page}&limit=${limit}`);
  },

  async getProgramsBySchool(schoolId: string | number): Promise<PaginatedResponse<Program>> {
    return apiRequest<PaginatedResponse<Program>>(`/api/programs/school/${schoolId}`);
  },

  async getProgramById(programId: string | number): Promise<{ success: boolean; data: Program }> {
    return apiRequest<{ success: boolean; data: Program }>(`/api/programs/${programId}`);
  },

  /**
   * Scholarships
   */
  async getScholarships(page = 1, limit = 20): Promise<PaginatedResponse<Scholarship>> {
    return apiRequest<PaginatedResponse<Scholarship>>(`/api/scholarships?page=${page}&limit=${limit}`);
  },

  /**
   * Student Profiles
   */
  async saveStudentProfile(profileData: ProfilePayload): Promise<any> {
    return apiRequest<any>("/api/profiles", {
      method: "POST",
      body: JSON.stringify(profileData),
    });
  },
};
