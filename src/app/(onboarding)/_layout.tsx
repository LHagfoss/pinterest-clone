import { Stack } from "expo-router";

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    contentStyle: { backgroundColor: "#000000" },
                }}
            />
            <Stack.Screen
                name="profile-picture"
                options={{
                    contentStyle: { backgroundColor: "#000000" },
                }}
            />
            <Stack.Screen
                name="username"
                options={{
                    contentStyle: { backgroundColor: "#000000" },
                }}
            />
            <Stack.Screen
                name="interests"
                options={{
                    contentStyle: { backgroundColor: "#000000" },
                }}
            />
        </Stack>
    );
}
