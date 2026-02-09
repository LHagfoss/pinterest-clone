import { Link, useRouter, useSegments } from "expo-router";
import { Ellipsis } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { AppText, PinImage } from "@/src/components/ui";
import type { Pin } from "@/src/schemas";
import { usePinStore } from "@/src/stores";

type ValidTab = "feed" | "profile";

interface PinItemProps {
    item: Pin;
}

export default function PinItem({ item }: Readonly<PinItemProps>) {
    const segments = useSegments();
    const currentTab = segments[1] as string;
    const router = useRouter();
    const { setSelectedPin } = usePinStore();

    const validTab: ValidTab =
        currentTab === "feed" || currentTab === "profile" ? currentTab : "feed";

    const pinDetailPath = `/(tabs)/${validTab}/pin/[id]` as const;

    return (
        <View className="p-1 gap-1">
            <Link
                href={{
                    pathname: pinDetailPath,
                    params: {
                        id: item.id,
                    },
                }}
                asChild
            >
                <Pressable onPress={() => setSelectedPin(item)}>
                    <Link.AppleZoom>
                        <PinImage
                            source={item.imageUrl}
                            style={{
                                width: "100%",
                                aspectRatio: item.width / item.height,
                                maxHeight: Math.min(item.height / 2),
                                borderRadius: 12,
                            }}
                        />
                    </Link.AppleZoom>
                </Pressable>
            </Link>

            <View className="flex-row justify-between items-center mb-2 px-1">
                <AppText size="xs">{item.title}</AppText>

                <Pressable
                    hitSlop={8}
                    onPress={() => {
                        setSelectedPin(item);
                        router.push({
                            pathname: "/(tabs)/feed/pin-options",
                            params: {
                                id: item.id,
                            },
                        });
                    }}
                >
                    <Ellipsis size={16} color="#ffffff" />
                </Pressable>
            </View>
        </View>
    );
}
