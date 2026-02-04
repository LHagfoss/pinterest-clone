import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ImageManipulator,
    manipulateAsync,
    SaveFormat,
} from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image } from "react-native";
import ImageColors from "react-native-image-colors";
import Toast from "react-native-toast-message";
import { createPin, uploadPinImage } from "@/src/api/pins";
import { useAuthStore } from "@/src/stores";
import {
    collection,
    doc,
    getFirestore,
} from "@react-native-firebase/firestore";

export const useCreatePin = () => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);

    const mutation = useMutation({
        mutationFn: async ({
            title,
            description,
            imageUri,
            tags,
            width: providedWidth,
            height: providedHeight,
            ratio: providedRatio,
        }: {
            title: string;
            description: string;
            imageUri: string;
            tags: string[];
            width?: number;
            height?: number;
            ratio?: number;
        }) => {
            if (!user?.uid) throw new Error("No user logged in");

            const db = getFirestore();
            const pinId = doc(collection(db, "pins")).id;

            let width = providedWidth;
            let height = providedHeight;
            let ratio = providedRatio;
            let dominantColor = "#000000";

            const sizePromise = new Promise<{ width: number; height: number }>(
                (resolve, reject) => {
                    if (width && height) resolve({ width, height });
                    else
                        Image.getSize(
                            imageUri,
                            (w, h) => resolve({ width: w, height: h }),
                            reject,
                        );
                },
            );

            const colorPromise = ImageColors.getColors(imageUri, {
                fallback: "#000000",
                cache: true,
                key: imageUri,
            });

            const [size, colors] = await Promise.all([
                sizePromise,
                colorPromise,
            ]);

            if (colors.platform === "android") dominantColor = colors.dominant;
            if (colors.platform === "ios") dominantColor = colors.primary;

            console.log(dominantColor);

            width = size.width;
            height = size.height;

            // --- 2. MANIPULATE IMAGE ---
            const manipulatedResult = await manipulateAsync(
                imageUri,
                [{ resize: { height: Math.min(height!, 1200) } }],
                { compress: 0.8, format: SaveFormat.JPEG },
            );

            // Update final dimensions
            width = manipulatedResult.width;
            height = manipulatedResult.height;
            ratio = width / height;

            // --- 3. UPLOAD TO STORAGE ---
            const { url } = await uploadPinImage(
                user.uid,
                pinId,
                manipulatedResult.uri,
            );

            // --- 4. CREATE DATABASE RECORD ---
            await createPin({
                id: pinId,
                userId: user.uid,
                title,
                description,
                imageUrl: url,
                width,
                height,
                ratio,
                tags,
                dominantColor: dominantColor,
            });
        },
        onMutate: async (newPin) => {
            await queryClient.cancelQueries({ queryKey: ["pins"] });

            const previousPins = queryClient.getQueryData(["pins"]);

            queryClient.setQueryData(["pins"], (old: any[] = []) => {
                const optimisticPin = {
                    id: Math.random().toString(),
                    userId: user?.uid,
                    title: newPin.title,
                    description: newPin.description,
                    imageUrl: newPin.imageUri,
                    width: newPin.width || 0,
                    height: newPin.height || 0,
                    ratio: newPin.ratio || 1,
                    dominantColor: "#000000",
                    tags: newPin.tags,
                    stats: {
                        likes: 0,
                        views: 0,
                        clicks: 0,
                        score: 0,
                    },
                    createdAt: {
                        seconds: Date.now() / 1000,
                        nanoseconds: 0,
                    },
                };
                return [optimisticPin, ...old];
            });

            return { previousPins };
        },
        onError: (error, newPin, context) => {
            console.error("Failed to create pin", error);
            if (context?.previousPins) {
                queryClient.setQueryData(["pins"], context.previousPins);
            }
            Toast.show({
                type: "error",
                text1: "Failed to create pin",
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["pins"] });
        },
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Pin created successfully!",
            });
        },
    });

    return {
        createPin: mutation.mutateAsync,
        isCreating: mutation.isPending || uploading,
    };
};
