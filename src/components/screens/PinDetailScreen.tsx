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
import PinCreatorProfile from "@/src/components/UserProfileCard";
import {
    AppBackButton,
    AppButton,
    AppText,
    ProfilePicture,
    ScreenWrapper,
} from "@/src/components/ui";
import { useGetRecommendedPins } from "@/src/hooks/pins/useGetRecommendedPins";
import { useGetUser } from "@/src/hooks/user";
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
                <View className="px-1">
                    <Image
                        source={{ uri: imageUrl }}
                        style={{
                            aspectRatio: width / height,
                            maxHeight: "100%",
                            marginHorizontal: "auto",
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const BodyContent = useCallback(
        () => (
            <View className="w-full" style={{ paddingTop: insets.top }}>
                <PinDetailImage
                    imageUrl={pin.imageUrl}
                    width={pin.width}
                    height={pin.height}
                />

                <View
                    style={{ paddingTop: insets.top }}
                    className="absolute left-4 top-4"
                >
                    <AppBackButton background />
                </View>

                <View className="p-4">
                    <View className="flex-row items-center justify-between mb-2">
                        <PinActionButtons pin={pin} disableDelete={false} />

                        <AppButton
                            variant="primary"
                            size="md"
                            rounded="2xl"
                            weight="bold"
                        >
                            Save
                        </AppButton>
                    </View>

                    <View className="gap-2">
                        <PinCreatorProfile userId={pin.userId} />

                        <AppText
                            size="2xl"
                            weight="bold"
                            className="flex-1 text-primary-text"
                        >
                            {pin.title}
                        </AppText>

                        <AppText className="text-secondary-text text-base mb-6">
                            {pin.description}
                        </AppText>
                    </View>

                    {pin.tags && pin.tags.length > 0 && (
                        <View className="flex-row flex-wrap gap-2 mb-4">
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

                    <AppText
                        size="lg"
                        weight="semibold"
                        className="text-primary-text mb-4"
                    >
                        More like this
                    </AppText>
                </View>
            </View>
        ),
        [pin],
    );

    return (
        <ScreenWrapper
            headerOptions={{
                showHeader: false,
            }}
            contentContainerClassName="px-0"
        >
            <FlashList
                data={validPins}
                numColumns={2}
                ListHeaderComponent={BodyContent}
                masonry
                renderItem={({ item }) => <PinItem item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </ScreenWrapper>
    );
}
