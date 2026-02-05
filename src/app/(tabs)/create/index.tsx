import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Upload } from "lucide-react-native";
import { useRef, useState } from "react";
import { Animated, Image, Pressable, type TextInput, View } from "react-native";
import {
    KeyboardAwareScrollView,
    type KeyboardAwareScrollViewRef,
    KeyboardToolbar,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    AppButton,
    AppInput,
    AppText,
    ScreenWrapper,
} from "@/src/components/ui";
import { useCreatePin } from "@/src/hooks/pins";

export default function CreateScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { createPin, isCreating } = useCreatePin();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const scrollViewRef = useRef<KeyboardAwareScrollViewRef>(null);
    const titleRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const tagsRef = useRef<TextInput>(null);

    const handleFocus = () => {
        scrollViewRef.current?.assureFocusedInputVisible();
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
            speed: 20,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 4,
        }).start();
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            setImageSize({
                width: result.assets[0].width,
                height: result.assets[0].height,
            });
        }
    };

    const handleSubmit = async () => {
        if (!imageUri || !title || !imageSize) return;

        try {
            await createPin({
                title,
                description,
                imageUri,
                tags: tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                width: imageSize.width,
                height: imageSize.height,
                ratio: imageSize.width / imageSize.height,
            });
            setTitle("");
            setDescription("");
            setTags("");
            setImageUri(null);
            setImageSize(null);
            router.push("/(tabs)/feed");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <ScreenWrapper
                headerOptions={{
                    title: "Create Pin",
                    showHeader: true,
                }}
            >
                <KeyboardAwareScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{
                        paddingTop: insets.top + 64,
                        paddingBottom: 100,
                    }}
                    className="flex-1 px-4"
                    showsVerticalScrollIndicator={false}
                    bottomOffset={100}
                >
                    {/* Image Picker Area */}
                    <Pressable
                        onPress={pickImage}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <Animated.View
                            className={`w-full bg-secondary rounded-3xl mb-6 items-center justify-center overflow-hidden border-2  ${!imageUri ? "aspect-3/2 border-dashed border-border" : "border-transparent"}`}
                            style={[
                                { transform: [{ scale: scaleAnim }] },
                                imageSize
                                    ? {
                                          aspectRatio:
                                              imageSize.width /
                                              imageSize.height,
                                      }
                                    : undefined,
                            ]}
                        >
                            {imageUri ? (
                                <Image
                                    source={{ uri: imageUri }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="items-center gap-2">
                                    <View className="w-12 h-12 bg-dark-background rounded-full items-center justify-center">
                                        <Upload
                                            size={24}
                                            className="text-tertiary-text"
                                            color="#767676"
                                        />
                                    </View>
                                    <AppText className="text-tertiary-text">
                                        Tap to upload image
                                    </AppText>
                                </View>
                            )}
                        </Animated.View>
                    </Pressable>

                    <View className="gap-4 mb-12">
                        <AppInput
                            ref={titleRef}
                            label="Title"
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Add a title"
                            variant="filled"
                            onFocus={handleFocus}
                        />

                        <AppInput
                            ref={descriptionRef}
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Add a detailed description"
                            multiline
                            variant="filled"
                            onFocus={handleFocus}
                        />

                        <AppInput
                            ref={tagsRef}
                            label="Tags (comma separated)"
                            value={tags}
                            onChangeText={setTags}
                            placeholder="e.g. nature, travel, view"
                            variant="filled"
                            className="mb-4"
                            onFocus={handleFocus}
                        />

                        <AppButton
                            onPress={handleSubmit}
                            loading={isCreating}
                            disabled={!imageUri || !title.trim()}
                            fullWidth
                            size="lg"
                            className="bg-foreground"
                            textClassName="text-foreground-text"
                        >
                            Create Pin
                        </AppButton>
                    </View>
                </KeyboardAwareScrollView>
            </ScreenWrapper>

            <KeyboardToolbar />
        </>
    );
}
