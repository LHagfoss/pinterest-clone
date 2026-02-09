import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

interface PinImageProps {
    style?: object;
    source: string;
}

export function PinImage({ style, source }: Readonly<PinImageProps>) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <View style={[style, { overflow: "hidden" }]} className="bg-secondary">
            <Image
                source={{ uri: source }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={500}
                onLoad={() => setIsLoading(false)}
            />
            {isLoading && <View className="absolute inset-0 bg-secondary" />}
        </View>
    );
}
