import { View, type ViewProps } from "react-native";
import { AppHeader } from "@/src/components/ui/AppHeader";
import { cn } from "@/src/lib/cn";

type HeaderOptions = {
    title?: string;
    showHeader?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
} & Omit<React.ComponentProps<typeof AppHeader>, "title">;

type ScreenWrapperProps = ViewProps & {
    children: React.ReactNode;
    className?: string;
    contentContainerClassName?: string;
    paddingTop?: boolean;
    headerOptions?: HeaderOptions;
    headerProps?: React.ComponentProps<typeof AppHeader>;
    rounded?: boolean;
};

export function ScreenWrapper({
    children,
    className,
    headerProps,
    headerOptions,
    contentContainerClassName,
    paddingTop,
    rounded = false,
    ...restProps
}: Readonly<ScreenWrapperProps>) {
    const defaultClasses = "bg-background flex-1";
    const combinedClasses = cn(defaultClasses, className);

    const shouldShowHeader = headerOptions?.showHeader;
    const finalTitle = headerOptions?.title;

    const headerComponent = shouldShowHeader ? (
        <AppHeader
            title={finalTitle}
            paddingTop={paddingTop}
            leftIcon={headerOptions?.leftIcon}
            rightIcon={headerOptions?.rightIcon}
            {...headerProps}
        />
    ) : null;

    return (
        <View {...restProps} className={combinedClasses}>
            <View className="absolute z-10 w-full">{headerComponent}</View>
            <View
                className={cn(
                    "flex-1 overflow-hidden px-4",
                    rounded && "rounded-xl",
                    contentContainerClassName
                )}
            >
                {children}
            </View>
        </View>
    );
}
