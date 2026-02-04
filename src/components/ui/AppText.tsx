import { Text, type TextProps } from "react-native";
import { cn } from "@/src/lib/cn";

type Variant = "primary" | "secondary" | "danger" | "success" | "muted";
type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
type Weight = "normal" | "medium" | "semibold" | "bold" | "extrabold";
type Align = "left" | "center" | "right" | "justify";

export interface AppTextProps extends TextProps {
    variant?: Variant;
    size?: Size;
    weight?: Weight;
    align?: Align;
    className?: string;
}

export function AppText({
    children,
    variant = "primary",
    size = "md",
    weight = "normal",
    align = "left",
    className,
    style,
    ...props
}: Readonly<AppTextProps>) {
    const variants: Record<Variant, string> = {
        primary: "text-foreground",
        secondary: "text-secondary-foreground",
        danger: "text-danger",
        success: "text-success",
        muted: "text-placeholder",
    };

    const sizes: Record<Size, string> = {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
    };

    const weights: Record<Weight, string> = {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
    };

    const aligns: Record<Align, string> = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
    };

    return (
        <Text
            className={cn(
                variants[variant],
                sizes[size],
                weights[weight],
                aligns[align],
                className,
            )}
            style={style}
            {...props}
        >
            {children}
        </Text>
    );
}
