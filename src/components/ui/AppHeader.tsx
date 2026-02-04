import { BlurView } from "expo-blur";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@/src/components/ui/AppText";

interface AppHeaderProps {
    title?: string;
    description?: string;
    className?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    paddingTop?: boolean;
}

export function AppHeader({
    title,
    leftIcon,
    rightIcon,
    paddingTop = true,
}: Readonly<AppHeaderProps>) {
    const insets = useSafeAreaInsets();

    return (
        <BlurView
            intensity={80}
            tint="dark"
            style={[
                paddingTop
                    ? {
                          backgroundColor: "#00000099",
                          paddingTop: insets.top,
                          width: "100%",
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          gap: 8,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                      }
                    : undefined,
            ]}
        >
            {leftIcon && <View className="w-10 relative">{leftIcon}</View>}

            <View
                className={`flex-1 ${leftIcon ? "justify-center items-center" : "justify-center"}`}
            >
                <AppText
                    size={leftIcon ? "sm" : "lg"}
                    weight="bold"
                    className="text-foreground"
                >
                    {title}
                </AppText>
            </View>

            {rightIcon ? (
                <View className="w-10 h-10">{rightIcon}</View>
            ) : (
                <View className="w-10 h-10"></View>
            )}
        </BlurView>
    );
}
