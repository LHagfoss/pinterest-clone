import * as Clipboard from "expo-clipboard";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { Copy, Heart, Star, Trash2 } from "lucide-react-native";
import { useCallback } from "react";
import { Alert, Pressable, View } from "react-native";
import Toast from "react-native-toast-message";

import { useIsFavorited, useToggleFavorite } from "@/src/hooks/favorites";
import { useIsLiked, useToggleLike } from "@/src/hooks/likes";
import { useDeletePin } from "@/src/hooks/pins/useUserPins";
import type { Pin } from "@/src/schemas";
import { useAuthStore } from "@/src/stores";

export const PinActionButtons = ({
    pin,
    disableDelete = true,
}: {
    pin: Pin;
    disableDelete?: boolean;
}) => {
    const router = useRouter();
    const { user } = useAuthStore();

    const { data: isLiked } = useIsLiked(pin.id);
    const { mutate: toggleLike } = useToggleLike();

    const { data: isFavorited } = useIsFavorited(pin.id);
    const { mutate: toggleFavorite } = useToggleFavorite();

    const { mutate: deletePin } = useDeletePin();

    const handleDelete = useCallback(() => {
        Alert.alert("Delete Pin", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    deletePin(pin.id);
                    router.back();
                },
            },
        ]);
    }, [deletePin, pin.id, router]);

    const copyToClipboard = useCallback(async () => {
        await Clipboard.setStringAsync(pin.id.toString());
        Toast.show({ type: "success", text1: "Copied ID" });
    }, [pin.id]);

    const deletePermission = disableDelete && user?.uid === pin.userId;

    return (
        <View className="flex-row gap-6">
            {/* Like Button */}
            <Pressable onPress={() => toggleLike(pin.id)} hitSlop={8}>
                <Heart
                    color={isLiked ? "#e60023" : "#ffffff"}
                    fill={isLiked ? "#e60023" : "transparent"}
                    size={20}
                />
            </Pressable>

            {/* Save/Favorite Button */}
            <Pressable onPress={() => toggleFavorite(pin)} hitSlop={8}>
                <Star
                    color={isFavorited ? "#FFD700" : "#ffffff"}
                    fill={isFavorited ? "#FFD700" : "transparent"}
                    size={20}
                />
            </Pressable>

            <Pressable onPress={copyToClipboard} hitSlop={8}>
                <Copy color="#ffffff" size={20} />
            </Pressable>

            {deletePermission && (
                <Pressable onPress={handleDelete} hitSlop={8}>
                    <Trash2 color="#e60023" size={20} />
                </Pressable>
            )}
        </View>
    );
};
