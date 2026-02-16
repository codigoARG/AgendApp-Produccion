import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import React from 'react';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    loading?: boolean;
}

export const Button = ({
    title,
    variant = 'primary',
    loading = false,
    className,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-primary-600',
        secondary: 'bg-secondary',
        outline: 'bg-transparent border border-primary-600',
        ghost: 'bg-transparent',
    };

    const textVariants = {
        primary: 'text-white',
        secondary: 'text-white',
        outline: 'text-primary-600',
        ghost: 'text-primary-600',
    };

    return (
        <TouchableOpacity
            className={`h-14 rounded-2xl items-center justify-center px-6 flex-row ${variants[variant]} ${props.disabled ? 'opacity-50' : ''} ${className}`}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#7C3AED' : 'white'} />
            ) : (
                <Text className={`text-lg font-semibold ${textVariants[variant]}`}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};
