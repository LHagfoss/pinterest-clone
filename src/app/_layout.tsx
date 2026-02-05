/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import "@/src/global.css";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
    initialWindowMetrics,
    SafeAreaProvider,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { QueryProvider } from "@/src/api/queryClient";
import { toastConfig } from "@/src/components/ToastConfig";
import { useAuthStore } from "@/src/stores";
import { useGetUser } from "@/src/hooks/user";

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

SplashScreen.preventAutoHideAsync();

function AppContent() {
    const { isInitialized, isLoggedIn, subscribeToAuthChanges, user } =
        useAuthStore();
    const { data: userProfile, isLoading: isUserLoading } = useGetUser(user?.uid);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges();
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!isInitialized || isUserLoading) return;

        const inAuthGroup = segments[0] === "(auth)";
        const inOnboardingGroup = segments[0] === "(onboarding)";
        const allowedPublicRoutes = ["(auth)", "privacy-policy"];
        const isPublicRoute = allowedPublicRoutes.includes(segments[0]);

        if (isLoggedIn) {
            if (!userProfile?.isOnboardingCompleted) {
                if (!inOnboardingGroup) {
                    router.replace("/(onboarding)");
                }
            } else if (inAuthGroup || inOnboardingGroup) {
                router.replace("/(tabs)/feed");
            }
        } else if (!isLoggedIn && !isPublicRoute) {
            router.replace("/(auth)/sign-in");
        }
    }, [isLoggedIn, isInitialized, segments, userProfile?.isOnboardingCompleted, isUserLoading]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}

export default function RootLayout() {
    const { isInitialized } = useAuthStore();
    const [fontsLoaded] = useFonts({
        // 'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded && isInitialized) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, isInitialized]);

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000000" }}>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <KeyboardProvider>
                    <QueryProvider>
                        <AppContent />
                        <Toast config={toastConfig} />
                    </QueryProvider>
                </KeyboardProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
