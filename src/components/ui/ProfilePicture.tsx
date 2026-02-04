import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useGetUser } from "@/src/hooks/user";
import { useAuthStore } from "@/src/stores";

export function ProfilePicture() {
    const { user } = useAuthStore();
    const { data: userProfile } = useGetUser(user?.uid);
    const router = useRouter();

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/profile")}
            className="rounded-full overflow-hidden w-10 h-10"
        >
            <Image
                source={{ uri: userProfile?.photoURL ?? undefined }}
                style={{
                    height: "100%",
                    width: "100%",
                }}
                contentFit="cover"
            />
        </TouchableOpacity>
    );
}
