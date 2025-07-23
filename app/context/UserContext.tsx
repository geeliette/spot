// app/context/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

type UserProfile = {
  name: string;
  avatar: string;
  age: number;
  location: string;
  workoutFrequency: string;
  athleteType: string;
  level: string;
  description: string;
  instagramHandle: string;
  isProfessional: boolean;
};

type Ctx = {
  user: UserProfile;
  updateUser: (u: Partial<UserProfile>) => void;
};

const defaultUser: UserProfile = {
  name: 'Jordan Smith',
  avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
  age: 28,
  location: 'New York, NY',
  workoutFrequency: '5x per week',
  athleteType: 'Bodybuilder',
  level: 'Intermediate',
  description:
    'Passionate about fitness and helping others reach their goals. Looking for consistent workout partners for strength training.',
  instagramHandle: '@jordanfitness',
  isProfessional: false,
};

const UserContext = createContext<Ctx | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside <UserProvider>');
  return ctx;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const updateUser = (patch: Partial<UserProfile>) =>
    setUser((u) => ({ ...u, ...patch }));

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
