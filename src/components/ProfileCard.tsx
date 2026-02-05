import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Camera } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { AppCard, AppText } from "@/src/components/ui";

interface ProfileCardProps {
    photoURL: string | undefined | null;
    displayName: string | undefined | null;
    email: string | undefined | null;
    userName: string | undefined | null;
    imageOnPress: () => void;
}

export default function ProfileCard({
    photoURL,
    displayName,
    email,
    userName,
    imageOnPress,
}: Readonly<ProfileCardProps>) {
    return (
        <AppCard className="flex-row gap-4 rounded-3xl w-full items-center">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={imageOnPress}
                className="relative w-18 h-18"
            >
                <Image
                    source={{ uri: photoURL ?? undefined }}
                    style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "100%",
                    }}
                    contentFit="cover"
                />

                <View className="absolute bottom-0 right-0 rounded-full overflow-hidden h-6 w-6">
                    <BlurView
                        className="w-full h-full items-center justify-center"
                        intensity={40}
                    >
                        <Camera size={16} color="#fff" />
                    </BlurView>
                </View>
            </TouchableOpacity>
            <View>
                <AppText size="xl" className="text-primary-text">
                    {displayName}
                </AppText>

                <AppText className="text-tertiary-text">{email}</AppText>
            </View>
        </AppCard>
    );
}
