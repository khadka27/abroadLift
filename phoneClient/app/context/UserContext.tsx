import React, { createContext, useContext, useState } from 'react';

type UserData = {
  country: string;
  flag: string;
  studyLevel: string;
  fieldOfStudy: string;
  score?: string;
  testType?: string;
  selectedUniversities: any[];
};

type UserContextType = {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  selectUniversity: (uni: any) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>({
    country: "USA",
    flag: "🇺🇸",
    studyLevel: "Master's",
    fieldOfStudy: "Computer Science",
    selectedUniversities: [],
  });

  const selectUniversity = (uni: any) => {
    setUserData(prev => ({
        ...prev,
        selectedUniversities: [uni, ...prev.selectedUniversities.filter(u => u.id !== uni.id)]
    }));
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, selectUniversity }}>
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
