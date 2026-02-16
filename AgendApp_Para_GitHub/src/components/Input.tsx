import { View, Text, TextInput, TextInputProps } from 'react-native';
import React, { useState } from 'react';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={`mb-4 ${className}`}>
            {label && (
                <Text className="text-gray-400 text-sm mb-1 ml-1 font-medium">
                    {label}
                </Text>
            )}
            <View
                className={`bg-card h-14 rounded-2xl px-4 flex-row items-center border ${isFocused ? 'border-primary-500' : 'border-transparent'
                    } ${error ? 'border-red-500' : ''}`}
            >
                <TextInput
                    className="flex-1 text-white text-base"
                    placeholderTextColor="#64748B"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
            </View>
            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
            )}
        </View>
    );
};
