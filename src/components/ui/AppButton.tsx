import type React from "react";
import {
    ActivityIndicator,
    TouchableOpacity,
    type TouchableOpacityProps,
    View,
} from "react-native";
import { cn } from "@/src/lib/cn";
import { AppText, type AppTextProps } from "./AppText";

type AppButtonProps = {
    variant?: "primary" | "secondary" | "ghost" | "outline" | "danger" | "none";
    size?: "none" | "xs" | "sm" | "md" | "lg";
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    loading?: boolean;
    flex?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    textClassName?: string;
    weight?: AppTextProps["weight"];
} & TouchableOpacityProps;

export function AppButton({
    variant = "none",
    size = "none",
    rounded = "full",
    loading = false,
    flex = false,
    fullWidth = false,
    className,
    textClassName,
    children,
    icon,
    disabled,
    weight = "normal",
    ...props
}: AppButtonProps) {
    const baseStyles =
        "flex-row items-center justify-center transition-opacity";

    const variants = {
        primary: "bg-primary",
        secondary: "bg-secondary",
        ghost: "bg-transparent",
        outline: "bg-transparent border border-border",
        danger: "bg-danger",
        none: "",
    };

    const textVariants = {
        primary: "text-primary-foreground",
        secondary: "text-secondary-foreground",
        ghost: "text-foreground",
        outline: "text-foreground",
        danger: "text-danger-foreground",
        none: "",
    };

    const sizes = {
        xs: "h-7 px-3",
        sm: "h-9 px-4",
        md: "h-12 px-6",
        lg: "h-14 px-8",
        none: "",
    };

    const roundedVariants = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={disabled || loading}
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                roundedVariants[rounded],
                flex && "flex-1",
                fullWidth ? "w-full" : "self-start",
                disabled && "opacity-50",
                className,
            )}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={
                        variant === "primary" || variant === "danger"
                            ? "black"
                            : "black"
                    }
                />
            ) : (
                <>
                    {icon && <View className="mr-2">{icon}</View>}
                    {children && (
                        <AppText
                            className={cn(textVariants[variant], textClassName)}
                            weight={weight}
                        >
                            {children}
                        </AppText>
                    )}
                </>
            )}
        </TouchableOpacity>
    );
}
