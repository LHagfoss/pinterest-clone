import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfilePicture, updateUser } from "@/src/api/user";
import { useAuthStore } from "@/src/stores";
import Toast from "react-native-toast-message";

export const useUpdateProfilePicture = () => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);

    const mutation = useMutation({
        mutationFn: async (uri: string) => {
            if (!user?.uid) throw new Error("No user logged in");
            const downloadURL = await uploadProfilePicture(user.uid, uri);
            await updateUser(user.uid, { photoURL: downloadURL });
            return downloadURL;
        },
        onSuccess: (downloadURL) => {
            if (user?.uid) {
                queryClient.setQueryData(["user", user.uid], (oldData: any) => ({
                    ...oldData,
                    photoURL: downloadURL,
                }));
            }
            Toast.show({
                type: "success",
                text1: "Profile picture updated",
            });
        },
        onError: (error) => {
            console.error("Failed to update profile picture", error);
            Toast.show({
                type: "error",
                text1: "Failed to update profile picture",
            });
        },
    });

    const pickAndUploadImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets[0].uri) {
                setUploading(true);
                await mutation.mutateAsync(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
        } finally {
            setUploading(false);
        }
    };

    return {
        pickAndUploadImage,
        uploading: uploading || mutation.isPending,
    };
};
