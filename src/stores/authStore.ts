import {
    type FirebaseAuthTypes,
    GoogleAuthProvider,
    getAuth,
    onAuthStateChanged,
    signInWithCredential,
    signOut,
} from "@react-native-firebase/auth";
import { serverTimestamp } from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { create } from "zustand";
import type { UserProfile } from "@/src/schemas";
import { createUser, getUser } from "../api/user";

interface AuthState {
    user: FirebaseAuthTypes.User | null;
    userProfile: UserProfile | null;
    isInitialized: boolean;
    isLoggedIn: boolean;

    subscribeToAuthChanges: () => () => void;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    userProfile: null,
    isInitialized: false,
    isLoggedIn: false,

    subscribeToAuthChanges: () => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // 1. Try to get existing DB profile
                    let profile = await getUser(firebaseUser.uid);

                    // 2. If new user, create DB profile with ALGO fields
                    if (!profile) {
                        const newProfileData = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || "",
                            displayName: firebaseUser.displayName || null,
                            photoURL: firebaseUser.photoURL || null,
                            createdAt: serverTimestamp(),

                            // --- ALGORITHM INIT ---
                            tagAffinity: {},
                            seenPinIds: [],
                            username: firebaseUser.email?.split("@")[0] || "user",
                        };

                        await createUser(newProfileData);
                        profile = newProfileData as UserProfile;
                    }

                    // 3. Save both to store
                    set({
                        user: firebaseUser,
                        userProfile: profile, // <--- Now accessible in useFeed
                        isLoggedIn: true,
                        isInitialized: true,
                    });
                } else {
                    set({
                        user: null,
                        userProfile: null,
                        isLoggedIn: false,
                        isInitialized: true,
                    });
                }
            } catch (error) {
                console.error("Auth state change error:", error);
                // Fallback to logged out state on error to ensure app initialization completes
                set({
                    user: null,
                    userProfile: null,
                    isLoggedIn: false,
                    isInitialized: true,
                });
            }
        });
        return unsubscribe;
    },

    signInWithGoogle: async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();

            const idToken = response.data?.idToken;
            if (!idToken) throw new Error("No ID token found");

            const credential = GoogleAuthProvider.credential(idToken);
            const auth = getAuth();
            await signInWithCredential(auth, credential);
        } catch (error: any) {
            if (error.code === "SIGN_IN_CANCELLED" || error.code === "-5") {
                console.log("User cancelled sign-in");
                return;
            }
            console.error("Google Sign-In Error:", error);
            throw error;
        }
    },

    signOut: async () => {
        try {
            await GoogleSignin.signOut();
            const auth = getAuth();
            await signOut(auth);
            set({ user: null, userProfile: null, isLoggedIn: false });
        } catch (error) {
            console.error("Sign Out Error:", error);
        }
    },

    // Helper to refresh data after they like a post
    refreshProfile: async () => {
        const currentUser = get().user;
        if (currentUser) {
            const profile = await getUser(currentUser.uid);
            if (profile) set({ userProfile: profile });
        }
    },
}));
