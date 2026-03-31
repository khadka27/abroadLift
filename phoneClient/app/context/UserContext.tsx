import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserData = {
  name: string;
  username: string;
  profileImage: string | null;
  country: string;
  flag: string;
  studyLevel: string;
  fieldOfStudy: string;
  recentAcademicField?: string;
  cgpa?: string;
  englishLevel?: string;
  score?: string;
  testType?: string;
  passoutYear?: string;
  selectedUniversities: any[];
};

type UserContextType = {
  userData: UserData;
  setUserData: (data: UserData | ((prev: UserData) => UserData)) => void;
  selectUniversity: (uni: any) => void;
  isLoading: boolean;
};

const DEFAULT_USER_DATA: UserData = {
  name: "New Student",
  username: "@student",
  profileImage: null,
  country: "",
  flag: "",
  studyLevel: "",
  fieldOfStudy: "",
  recentAcademicField: "",
  cgpa: "",
  englishLevel: "",
  score: "",
  testType: "",
  passoutYear: "",
  selectedUniversities: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, _setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user_data');
        if (jsonValue != null) {
          _setUserData(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Error loading user data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Wrapper for setUserData that also saves to AsyncStorage
  const setUserData = async (data: UserData | ((prev: UserData) => UserData)) => {
    try {
      const newData = typeof data === 'function' ? data(userData) : data;
      _setUserData(newData);
      await AsyncStorage.setItem('@user_data', JSON.stringify(newData));
    } catch (e) {
      console.error("Error saving user data:", e);
    }
  };

  const selectUniversity = (uni: any) => {
    setUserData(prev => ({
        ...prev,
        selectedUniversities: [uni, ...prev.selectedUniversities.filter(u => u.id !== uni.id)]
    }));
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, selectUniversity, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
