import type React from "react";
import { forwardRef, useRef } from "react";
import { Pressable, TextInput, type TextInputProps, View } from "react-native";
import { cn } from "@/src/lib/cn";
import { AppText } from "./AppText";

type AppInputProps = {
    variant?: "default" | "outline" | "filled" | "ghost";
    size?: "sm" | "md" | "lg";
    rounded?: "none" | "sm" | "md" | "lg" | "full";
    fullWidth?: boolean;
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    inputClassName?: string;
} & TextInputProps;

export const AppInput = forwardRef<TextInput, AppInputProps>(
    (
        {
            variant = "default",
            size = "md",
            rounded = "lg",
            fullWidth = true,
            label,
            error,
            leftIcon,
            rightIcon,
            className,
            containerClassName,
            inputClassName,
            editable = true,
            ...props
        },
        ref,
    ) => {
        const internalRef = useRef<TextInput>(null);
        const inputRef = (ref as React.RefObject<TextInput>) || internalRef;

        const baseStyles = "flex-row items-center border";

        const variants = {
            default: "bg-background border-border",
            outline: "bg-transparent border-border",
            filled: "bg-secondary border-transparent",
            ghost: "bg-transparent border-transparent",
        };

        const sizes = {
            sm: "h-9 px-3",
            md: "h-12 px-4",
            lg: "h-14 px-5",
        };

        const roundedVariants = {
            none: "rounded-none",
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            full: "rounded-full",
        };

        const handlePress = () => {
            inputRef.current?.focus();
        };

        return (
            <View className={cn(fullWidth && "w-full", containerClassName)}>
                {label && (
                    <AppText
                        size="sm"
                        weight="medium"
                        className="mb-2 text-foreground"
                    >
                        {label}
                    </AppText>
                )}

                <Pressable
                    onPress={handlePress}
                    className={cn(
                        baseStyles,
                        variants[variant],
                        !props.multiline && sizes[size],
                        props.multiline && "h-auto min-h-38 p-4",
                        roundedVariants[rounded],
                        error && "border-danger",
                        !editable && "opacity-50",
                        className,
                    )}
                >
                    {leftIcon && <View className="mr-2">{leftIcon}</View>}

                    <TextInput
                        ref={inputRef}
                        className={cn(
                            "flex-1 text-foreground text-base py-0 text-[18px]",
                            props.multiline && "h-full",
                            inputClassName,
                        )}
                        placeholderTextColor="#9CA3AF"
                        editable={editable}
                        textAlignVertical={props.multiline ? "top" : "center"}
                        {...props}
                    />

                    {rightIcon && <View className="ml-2">{rightIcon}</View>}
                </Pressable>

                {error && (
                    <AppText size="sm" variant="danger" className="mt-1">
                        {error}
                    </AppText>
                )}
            </View>
        );
    },
);

AppInput.displayName = "AppInput";
