import { Link, useRouter, useSegments } from "expo-router";
import { Ellipsis } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { PinImage } from "@/src/components/ui";
import type { Pin } from "@/src/schemas";

type ValidTab = "feed" | "profile";

interface PinItemProps {
    item: Pin;
}

export default function PinItem({ item }: Readonly<PinItemProps>) {
    const segments = useSegments();
    const currentTab = segments[1] as string;
    const router = useRouter();

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
                        pin: JSON.stringify({
                            ...item,
                            imageUrl: item.imageUrl,
                        }),
                    },
                }}
                asChild
            >
                <Pressable>
                    <Link.AppleZoom>
                        <PinImage
                            source={item.imageUrl}
                            width={item.width}
                            height={item.height}
                            style={{
                                width: "100%",
                                aspectRatio: item.width / item.height,
                                maxHeight: Math.min(item.height / 2),
                                borderRadius: 16,
                            }}
                        />
                    </Link.AppleZoom>
                </Pressable>
            </Link>

            <View className="flex-row items-start justify-end">
                {/*<View>
                    <AppText size="sm" className="text-primary-text">
                        {item.title}
                    </AppText>
                    <AppText size="xs" className="text-tertiary-text">
                        {item.tags?.[0]?.charAt(0).toUpperCase() +
                            item.tags?.[0]?.slice(1) || ""}
                    </AppText>
                </View>*/}

                <Pressable
                    hitSlop={8}
                    onPress={() =>
                        router.push({
                            pathname: "/(tabs)/feed/pin-options",
                            params: {
                                pin: JSON.stringify(item),
                            },
                        })
                    }
                >
                    <Ellipsis size={16} color="#ffffff" />
                </Pressable>
            </View>
        </View>
    );
}
