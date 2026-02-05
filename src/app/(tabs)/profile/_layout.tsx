import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="edit-profile"
                options={{
                    presentation: "formSheet",
                    sheetGrabberVisible: true,
                    contentStyle: { backgroundColor: "#121212" },
                }}
            />
            <Stack.Screen name="settings/index" />
            <Stack.Screen name="settings/privacy-policy" />
            <Stack.Screen name="settings/terms-of-service" />
        </Stack>
    );
}
