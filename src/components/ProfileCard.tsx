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
                className="bg-dark-background rounded-full overflow-hidden relative w-18 h-18"
            >
                <View className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Camera color="white" />
                </View>

                <Image
                    source={{ uri: photoURL ?? undefined }}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    contentFit="cover"
                />
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
