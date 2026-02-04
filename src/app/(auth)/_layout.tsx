import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="sign-in" />
            <Stack.Screen
                name="more-details"
                options={{
                    sheetAllowedDetents: "fitToContents",
                    presentation: "formSheet",
                    sheetGrabberVisible: true,
                    contentStyle: { backgroundColor: "#121212" },
                }}
            />
        </Stack>
    );
}
