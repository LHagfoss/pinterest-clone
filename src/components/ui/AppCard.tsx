import { View } from "react-native";
import { cn } from "@/src/lib/cn";

interface AppCardProps {
    children: React.ReactNode;
    className?: string;
    style?: object;
}

export function AppCard({
    children,
    style,
    className,
}: Readonly<AppCardProps>) {
    const defaultClasses = "p-4 bg-secondary rounded-lg";

    const combinedClasses = cn(defaultClasses, className);

    return (
        <View style={style} className={combinedClasses}>
            {children}
        </View>
    );
}
