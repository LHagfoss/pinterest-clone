import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { AppText } from "@/src/components/ui";
import { useGetUser } from "@/src/hooks/user";

const PinCreatorProfile = ({ userId }: { userId: string }) => {
    const { data: user } = useGetUser(userId);
    const router = useRouter();

    if (!user) return null;

    return (
        <Pressable
            onPress={() => router.push(`/user/${userId}`)}
            className="flex-row items-center gap-2 mb-2"
        >
            <View className="h-4 w-4 rounded-full overflow-hidden bg-background-700">
                {user.photoURL ? (
                    <Image
                        source={{ uri: user.photoURL }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                    />
                ) : (
                    <View className="flex-1 items-center justify-center bg-background-800">
                        <AppText className="text-sm font-bold uppercase text-foreground">
                            {user.displayName?.[0] || user.email?.[0] || "?"}
                        </AppText>
                    </View>
                )}
            </View>
            <AppText className="text-secondary-text" size="xs">
                {user.displayName || user.username || "Unknown User"}
            </AppText>
        </Pressable>
    );
};

export default PinCreatorProfile;
