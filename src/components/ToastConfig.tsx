import { View } from "react-native";
import type { BaseToastProps } from "react-native-toast-message";
import { AppText } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";

interface ToastBannerProps {
    text1?: string;
    text2?: string;
    type: "success" | "error" | "info";
}

const ToastBanner = ({ text1, text2, type }: Readonly<ToastBannerProps>) => {
    return (
        <View
            className={cn(
                "w-[90%] p-4 rounded-xl flex-row items-center mt-6 bg-dark-background",
            )}
        >
            <View className="flex-1 flex-row items-center gap-2">
                <View
                    className={cn(
                        "rounded-full",
                        type === "success" && "bg-success",
                        type === "error" && "bg-danger",
                        type === "info" && "bg-secondary",
                    )}
                ></View>

                <AppText variant="primary" size="md" weight="semibold">
                    {text1}
                </AppText>
                {text2 && (
                    <AppText
                        variant="primary"
                        size="sm"
                        weight="normal"
                        className="mt-1"
                    >
                        {text2}
                    </AppText>
                )}
            </View>
        </View>
    );
};

export const toastConfig = {
    success: (props: BaseToastProps) => (
        <ToastBanner type="success" text1={props.text1} text2={props.text2} />
    ),
    error: (props: BaseToastProps) => (
        <ToastBanner type="error" text1={props.text1} text2={props.text2} />
    ),
    info: (props: BaseToastProps) => (
        <ToastBanner type="info" text1={props.text1} text2={props.text2} />
    ),
};
