import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { ChevronLeftIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

export const AppBackButton = () => {
    const router = useRouter();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <GlassView
            style={{
                borderRadius: 64,
                width: 48,
                height: 48,
                justifyContent: "center",
                alignItems: "center",
            }}
            isInteractive
        >
            <Pressable
                onPressIn={() => {
                    scale.value = withSpring(0.9);
                }}
                onPressOut={() => {
                    scale.value = withSpring(1);
                }}
                hitSlop={8}
                onPress={() => router.back()}
            >
                <Animated.View style={animatedStyle}>
                    <ChevronLeftIcon color="white" size={32} />
                </Animated.View>
            </Pressable>
        </GlassView>
    );
};
