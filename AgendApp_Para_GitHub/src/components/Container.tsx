import { View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps extends ViewProps {
    safe?: boolean;
}

export const Container = ({ children, className, safe = true, ...props }: ContainerProps) => {
    const Component = safe ? SafeAreaView : View;

    return (
        <Component
            className={`flex-1 bg-dark px-4 ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
};
