import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, type ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface AppBackButtonProps {
    style?: ViewStyle;
    color?: string;
    size?: number;
    background?: boolean;
}

export const AppBackButton = ({
    style,
    color = "white",
    size = 28,
    background = false,
}: AppBackButtonProps) => {
    const router = useRouter();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Pressable
            className={
                background ? "bg-dark-background rounded-xl" : "bg-transparent"
            }
            onPressIn={() => {
                scale.value = withSpring(0.9);
            }}
            onPressOut={() => {
                scale.value = withSpring(1);
            }}
            hitSlop={12}
            onPress={() => router.back()}
            style={[
                {
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingRight: 2,
                },
                style,
            ]}
        >
            <Animated.View style={animatedStyle}>
                <ChevronLeft color={color} size={size} />
            </Animated.View>
        </Pressable>
    );
};
