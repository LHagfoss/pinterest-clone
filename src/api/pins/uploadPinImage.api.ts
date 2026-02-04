import storage from "@react-native-firebase/storage";

export const uploadPinImage = async (
    userId: string,
    pinId: string,
    uri: string,
): Promise<{ url: string; width: number; height: number }> => {
    try {
        const filename = uri.substring(uri.lastIndexOf("/") + 1);
        const reference = storage().ref(
            `pins/${pinId}/${Date.now()}_${filename}`,
        );

        await reference.putFile(uri);
        const url = await reference.getDownloadURL();

        return { url, width: 0, height: 0 };
    } catch (error) {
        console.error("Error uploading pin image:", error);
        throw error;
    }
};
