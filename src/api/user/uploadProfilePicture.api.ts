import storage from "@react-native-firebase/storage";

export const uploadProfilePicture = async (uid: string, uri: string): Promise<string> => {
    try {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const reference = storage().ref(`users/${uid}/profile_picture/${filename}`);
        
        // Use putFile for React Native - it handles the file upload natively
        await reference.putFile(uri);
        
        const downloadURL = await reference.getDownloadURL();
        return downloadURL;
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw error;
    }
};
