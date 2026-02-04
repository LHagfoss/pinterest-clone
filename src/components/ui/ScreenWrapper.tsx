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
};

export function ScreenWrapper({
    children,
    className,
    headerProps,
    headerOptions,
    contentContainerClassName,
    paddingTop,
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
            <View className="absolute z-10">{headerComponent}</View>
            <View
                className={`px-4 flex-1 rounded-xl overflow-hidden ${contentContainerClassName}`}
            >
                {children}
            </View>
        </View>
    );
}
