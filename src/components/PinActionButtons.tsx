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
        <GlassContainer
            spacing={8}
            style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                position: "absolute",
                top: -72,
                padding: 16,
                width: "100%",
                justifyContent: "flex-end",
            }}
        >
            {/* Like Button */}
            <GlassView
                style={{ borderRadius: 64 }}
                isInteractive={true}
                hitSlop={8}
            >
                <Pressable
                    onPress={() => toggleLike(pin.id)}
                    hitSlop={8}
                    className="p-2"
                >
                    <Heart
                        color={isLiked ? "#e60023" : "#ffffff"}
                        fill={isLiked ? "#e60023" : "transparent"}
                        size={24}
                    />
                </Pressable>
            </GlassView>

            {/* Save/Favorite Button */}
            <GlassView
                style={{ borderRadius: 64 }}
                isInteractive={true}
                hitSlop={8}
            >
                <Pressable
                    onPress={() => toggleFavorite(pin)}
                    hitSlop={8}
                    className="p-2"
                >
                    <Star
                        color={isFavorited ? "#FFD700" : "#ffffff"}
                        fill={isFavorited ? "#FFD700" : "transparent"}
                        size={24}
                    />
                </Pressable>
            </GlassView>

            <GlassView
                style={{ borderRadius: 64 }}
                isInteractive={true}
                hitSlop={8}
            >
                <Pressable
                    onPress={copyToClipboard}
                    hitSlop={8}
                    className="p-2"
                >
                    <Copy color="#ffffff" size={24} />
                </Pressable>
            </GlassView>

            {deletePermission && (
                <GlassView
                    style={{ borderRadius: 64 }}
                    isInteractive={true}
                    hitSlop={8}
                >
                    <Pressable
                        onPress={handleDelete}
                        hitSlop={8}
                        className="p-2"
                    >
                        <Trash2 color="#e60023" size={24} />
                    </Pressable>
                </GlassView>
            )}
        </GlassContainer>
    );
};
