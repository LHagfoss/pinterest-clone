import { FlashList } from "@shopify/flash-list";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import * as React from "react";
import { useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PinActionButtons } from "@/src/components/PinActionButtons";
import PinItem from "@/src/components/PinItem";
import { AppBackButton, AppText } from "@/src/components/ui";
import { useGetRecommendedPins } from "@/src/hooks/pins/useGetRecommendedPins";
import type { Pin } from "@/src/schemas";

// eslint-disable-next-line react/display-name
const PinDetailImage = React.memo(
    ({
        imageUrl,
        width,
        height,
    }: {
        imageUrl: string;
        width: number;
        height: number;
    }) => {
        return (
            <Link.AppleZoomTarget>
                <View className="p-2">
                    <Image
                        source={{ uri: imageUrl }}
                        style={{
                            aspectRatio: width / height,
                            maxHeight: "100%",
                            marginHorizontal: "auto",
                            borderTopLeftRadius: 54,
                            borderTopRightRadius: 54,
                            borderRadius: 24,
                        }}
                        contentFit="cover"
                        transition={500}
                    />
                </View>
            </Link.AppleZoomTarget>
        );
    },
);

interface PinDetailScreenProps {
    pin: Pin;
}

export default function PinDetailScreen({
    pin,
}: Readonly<PinDetailScreenProps>) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { data: recommendedPins } = useGetRecommendedPins(
        pin.tags || [],
        pin.id,
    );

    const validPins = useMemo(
        () => recommendedPins?.filter((p): p is Pin => p != null) ?? [],
        [recommendedPins],
    );

    console.log(pin.imageUrl);

    const HeaderContent = useCallback(
        () => (
            <View className="w-full">
                <PinDetailImage
                    imageUrl={pin.imageUrl}
                    width={pin.width}
                    height={pin.height}
                />

                <View className="">
                    <View className="flex-row items-center justify-between">
                        <AppText
                            size="2xl"
                            weight="bold"
                            className="flex-1 text-primary-text px-4 pt-4"
                        >
                            {pin.title}
                        </AppText>

                        <PinActionButtons pin={pin} disableDelete={false} />
                    </View>

                    {pin.tags && pin.tags.length > 0 && (
                        <View className="px-4 flex-row flex-wrap gap-2 mb-4">
                            {pin.tags.map((tag) => (
                                <AppText
                                    key={tag}
                                    className="text-tertiary-text text-xs"
                                >
                                    #{tag}
                                </AppText>
                            ))}
                        </View>
                    )}

                    <AppText className="px-4 text-secondary-text text-base mb-6">
                        {pin.description}
                    </AppText>

                    <AppText
                        size="lg"
                        weight="semibold"
                        className="text-primary-text mb-4 px-4"
                    >
                        More like this
                    </AppText>
                </View>
            </View>
        ),
        [pin],
    );

    return (
        <View className="flex-1 bg-background">
            <View
                style={{ paddingTop: insets.top }}
                className="absolute left-6 z-10"
            >
                <AppBackButton background />
            </View>

            <FlashList
                data={validPins}
                numColumns={2}
                ListHeaderComponent={HeaderContent}
                masonry
                renderItem={({ item }) => <PinItem item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );
}
