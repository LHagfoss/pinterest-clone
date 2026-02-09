import { Stack } from "expo-router";

export default function UserLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="[id]" />
            <Stack.Screen
                name="pin-options"
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
