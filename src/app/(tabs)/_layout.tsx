import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { House, SquarePlus, User } from "lucide-react-native";
import type React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useGetUser } from "@/src/hooks/user";
import { useAuthStore } from "@/src/stores";

const TabButton = ({
    isFocused,
    options,
    onPress,
    onLongPress,
    IconComponent,
    label,
    photoURL,
}: {
    isFocused: boolean;
    options: any;
    onPress: () => void;
    onLongPress: () => void;
    route: any;
    IconComponent: any;
    label: string;
    photoURL?: string;
}) => {
    return (
        <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
        >
            {photoURL ? (
                <Image
                    source={{ uri: photoURL }}
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: 32,
                        borderWidth: isFocused ? 2 : 0,
                        borderColor: "#e60023",
                    }}
                />
            ) : (
                <IconComponent
                    color={isFocused ? "#e60023" : "#999999"}
                    size={24}
                />
            )}
            <Text
                style={{
                    color: isFocused ? "#e60023" : "#999999",
                    fontSize: 10,
                    marginTop: 4,
                    fontWeight: "600",
                }}
            >
                {label}
            </Text>
        </Pressable>
    );
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { user } = useAuthStore();
    const { data: userProfile } = useGetUser(user?.uid);

    return (
        <View style={styles.container}>
            <BlurView tint="dark" intensity={25} style={styles.blurView}>
                <View style={styles.tabRow}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                  ? options.title
                                  : route.name;

                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: "tabLongPress",
                                target: route.key,
                            });
                        };

                        const icons: Record<string, React.ElementType> = {
                            feed: House,
                            create: SquarePlus,
                            profile: User,
                        };

                        const IconComponent = icons[route.name];

                        return (
                            <TabButton
                                key={route.key}
                                isFocused={isFocused}
                                options={options}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                route={route}
                                IconComponent={IconComponent}
                                label={label as string}
                                photoURL={
                                    route.name === "profile"
                                        ? (userProfile?.photoURL ?? undefined)
                                        : undefined
                                }
                            />
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: "#000000" },
            }}
        >
            <Tabs.Screen name="feed" options={{ title: "Feed" }} />
            <Tabs.Screen name="create" options={{ title: "Create" }} />
            <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    blurView: {
        backgroundColor: "rgba(0,0,0,0.90)",
        width: "100%",
        paddingBottom: Platform.OS === "ios" ? 30 : 10,
    },
    tabRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        flex: 1,
    },
});
