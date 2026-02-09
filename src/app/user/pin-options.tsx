import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Copy, Download, Heart, Star } from "lucide-react-native";
import type * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import { AppText } from "@/src/components/ui";
import { useIsFavorited, useToggleFavorite } from "@/src/hooks/favorites";
import { useIsLiked, useToggleLike } from "@/src/hooks/likes";
import { useGetPin } from "@/src/hooks/pins";
import type { Pin } from "@/src/schemas";
import { usePinStore } from "@/src/stores";

export default function PinOptions() {
    const { id } = useLocalSearchParams();
    const { selectedPin } = usePinStore();
    const [pin, setPin] = useState<Pin | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (selectedPin && selectedPin.id === id) {
            setPin(selectedPin);
        }
    }, [selectedPin, id]);

    const { data: fetchedPin } = useGetPin(pin ? undefined : (id as string));

    useEffect(() => {
        if (fetchedPin) {
            setPin(fetchedPin);
        }
    }, [fetchedPin]);

    const { data: isLiked } = useIsLiked(pin?.id || "");
    const { mutate: toggleLike } = useToggleLike();

    const { data: isFavorited } = useIsFavorited(pin?.id || "");
    const { mutate: toggleFavorite } = useToggleFavorite();

    const toggleFavoritePin = () => {
        if (pin) {
            toggleFavorite(pin);
            router.dismiss();
        }
    };

    const toggleLikePin = () => {
        if (pin) {
            toggleLike(pin.id);
            router.dismiss();
        }
    };

    const copyToClipboard = useCallback(async () => {
        if (pin) {
            await Clipboard.setStringAsync(pin.id.toString());
            Toast.show({ type: "success", text1: "Copied ID" });
            router.dismiss();
        }
    }, [pin, router]);

    if (!pin) {
        return null;
    }

    return (
        <View className="pt-8 px-8 gap-4 w-full">
            <BottomSheetButtons
                icon={<Copy color="#ffffff" />}
                title="Copy pin ID"
                onPress={copyToClipboard}
            />
            <BottomSheetButtons
                icon={<Star color="#ffffff" />}
                title={
                    isFavorited ? "Unfavourite this pin" : "Favourite this pin"
                }
                onPress={toggleFavoritePin}
            />
            <BottomSheetButtons
                icon={<Heart color="#ffffff" />}
                title={isLiked ? "Unlike this pin" : "Like this pin"}
                onPress={toggleLikePin}
            />
            <BottomSheetButtons
                icon={<Download color="#ffffff" />}
                title="Download image"
                onPress={() => {
                    Toast.show({
                        type: "info",
                        text1: "Download not implemented",
                    });
                }}
            />
        </View>
    );
}

const BottomSheetButtons = ({
    icon,
    title,
    onPress,
}: {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
}) => {
    return (
        <Pressable
            className="flex-row items-center gap-4 p-2"
            hitSlop={8}
            onPress={onPress}
        >
            {icon}
            <AppText>{title}</AppText>
        </Pressable>
    );
};
