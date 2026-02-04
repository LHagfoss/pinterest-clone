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

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { isInitialized, isLoggedIn, subscribeToAuthChanges } =
        useAuthStore();
    const segments = useSegments();
    const router = useRouter();
    const [isSplashAnimationFinished, setIsSplashAnimationFinished] =
        useState(false);

    const [fontsLoaded] = useFonts({
        // 'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    });

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges();
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!isInitialized) return;

        const inAuthGroup = segments[0] === "(auth)";
        const allowedPublicRoutes = ["(auth)", "privacy-policy"];
        const isPublicRoute = allowedPublicRoutes.includes(segments[0]);

        if (isLoggedIn && inAuthGroup) {
            router.replace("/(tabs)/feed");
        } else if (!isLoggedIn && !isPublicRoute) {
            router.replace("/(auth)/sign-in");
        }
    }, [isLoggedIn, isInitialized, segments]);

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
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="(auth)" />
                            <Stack.Screen name="+not-found" />
                        </Stack>

                        <Toast config={toastConfig} />
                    </QueryProvider>
                </KeyboardProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
