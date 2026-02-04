import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="edit-display-name"
                options={{
                    sheetAllowedDetents: "fitToContents",
                    presentation: "formSheet",
                    sheetGrabberVisible: true,
                    contentStyle: { backgroundColor: "#121212" },
                }}
            />
            <Stack.Screen
                name="edit-username"
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
