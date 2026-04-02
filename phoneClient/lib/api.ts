import { Platform } from 'react-native';

const API_BASE_URL = Platform.OS === 'android' ? 'http://192.168.1.68:3000/api' : 'http://localhost:3000/api';
// Fallback local IP for Expo Go on physical device if neither of the above works:
// const API_BASE_URL = 'http://192.168.1.68:3000/api';

export interface UniversityResult {
  id: string | number;
  name: string;
  location: string;
  tuition: string | number;
  acceptanceRate: number;
  website: string;
  country: string;
  // Fallbacks for the UI formatting
  course?: string;
  image?: string;
  rank?: string;
  duration?: string;
  tuitionValue?: number;
  admissionChance?: string;
  matchRating?: string;
  city?: string;
  recommended?: boolean;
}

import { fetchWorqnowUniversities, WorqnowUniversity } from './worqnow';

export const login = async (identifier: string, password: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/mobile/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    return data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const register = async (userData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    return data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

export const getProfile = async (token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch profile");
    return data;
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    throw error;
  }
};

export const updateProfile = async (userData: any, token: string): Promise<any> => {
  try {
    // Map mobile field names to backend field names if they differ
    const payload = {
      ...userData,
      nationality: userData.country,
      currentCountry: userData.country,
      degreeLevel: userData.studyLevel,
      gpa: userData.cgpa,
      englishScore: userData.score,
    };

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Profile update failed");
    return data;
  } catch (error) {
    console.error("Profile Update Error:", error);
    throw error;
  }
};

export const searchUniversities = async (query: string, countries: string = "All"): Promise<UniversityResult[]> => {

  try {
    // If "All" countries, we'll default to a popular one or a list for demo
    // The web client usually specifies a country.
    const countryToFetch = countries === "All" ? "uk" : countries.toLowerCase();
    
    console.log(`[API Search] Redirecting search to direct WorqNow client for ${countryToFetch}...`);
    const results: WorqnowUniversity[] = await fetchWorqnowUniversities(countryToFetch);
    
    let filtered = results;
    if (query) {
      const q = query.toLowerCase();
      filtered = results.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.city?.toLowerCase().includes(q)
      );
    }

    return processResults(filtered, countries);
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
};

const processResults = (results: any[], searchCountry: string): UniversityResult[] => {
  if (!results) return [];
  return results.map((res: any) => {
    // WorqNow uses 'code' as the unique ID
    const uniqueId = res.code || res.id || `temp-${Math.random().toString(36).substr(2, 9)}`;
    
    // Attempt to extract numerical tuition
    let tuitionValue = 35000;
    if (typeof res.tuition === 'number') {
      tuitionValue = res.tuition;
    } else if (typeof res.tuition === 'string') {
      const match = res.tuition.replace(/[^0-9.]/g, '');
      if (match) tuitionValue = parseInt(match, 10);
    }

    // Attempt to map acceptance rate to chance string
    let chance = "Moderate";
    const rate = res.acceptanceRate || 50;
    if (rate >= 60) chance = "High";
    else if (rate <= 30) chance = "Low";

    // Fallback country name if API doesn't provide it
    const displayCountry = res.country || (searchCountry !== "All" ? searchCountry : "Global");

    return {
      id: String(uniqueId),
      name: res.name || "Unknown University",
      course: res.course || "Various Courses", // API returns institutions, not specific courses
      location: res.location || (res.city ? `${res.city}, ${displayCountry}` : `Various Locations, ${displayCountry}`),
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800", // Default image
      rank: res.ranking_world ? `#${res.ranking_world} Global` : (res.rank || "N/A"),
      duration: "Check Website",
      tuition: typeof res.tuition === 'number' ? `$${res.tuition.toLocaleString()} / yr` : (res.tuition || "Check Website"),
      tuitionValue,
      acceptanceRate: rate,
      admissionChance: chance,
      matchRating: "4.0",
      country: displayCountry,
      city: res.city || res.location?.split(',')[0] || "",
      recommended: false, 
      website: res.website || "",
      ...res // Allow overrides if API changes
    };
  });
};
