import { create } from "zustand";

interface OnboardingState {
    age: number | null;
    birthday: string | null;
    username: string | null;
    profileImageUri: string | null;
    selectedCategories: string[];
    
    setAge: (age: number) => void;
    setBirthday: (date: string) => void;
    setUsername: (username: string) => void;
    setProfileImageUri: (uri: string | null) => void;
    setSelectedCategories: (categories: string[]) => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
    age: null,
    birthday: null,
    username: null,
    profileImageUri: null,
    selectedCategories: [],

    setAge: (age) => set({ age }),
    setBirthday: (birthday) => set({ birthday }),
    setUsername: (username) => set({ username }),
    setProfileImageUri: (uri) => set({ profileImageUri: uri }),
    setSelectedCategories: (categories) => set({ selectedCategories: categories }),
    reset: () => set({ 
        age: null, 
        birthday: null, 
        username: null, 
        profileImageUri: null, 
        selectedCategories: [] 
    }),
}));
