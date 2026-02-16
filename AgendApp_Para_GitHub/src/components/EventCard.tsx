import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Event, Priority } from '../store/useEventStore';
import { Clock, Tag, ChevronRight } from 'lucide-react-native';

interface EventCardProps {
    event: Event;
    onPress?: () => void;
}

const priorityColors: Record<Priority, string> = {
    low: 'bg-blue-500/20 text-blue-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-orange-500/20 text-orange-400',
    urgent: 'bg-red-500/20 text-red-400',
};

export const EventCard = ({ event, onPress }: EventCardProps) => {
    const priorityStyle = priorityColors[event.priority];

    return (
        <TouchableOpacity
            className="bg-card mb-4 p-4 rounded-3xl flex-row items-center border border-white/5"
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View
                className="w-1.5 h-12 rounded-full mr-4"
                style={{ backgroundColor: event.color || '#6D28D9' }}
            />

            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-white text-lg font-bold" numberOfLines={1}>
                        {event.title}
                    </Text>
                    <View className={`px-2 py-0.5 rounded-lg ${priorityStyle.split(' ')[0]}`}>
                        <Text className={`text-[10px] font-bold uppercase ${priorityStyle.split(' ')[1]}`}>
                            {event.priority}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center space-x-4">
                    <View className="flex-row items-center">
                        <Clock size={14} color="#94A3B8" />
                        <Text className="text-gray-400 text-xs ml-1">{event.time}</Text>
                    </View>
                    <View className="flex-row items-center ml-3">
                        <Tag size={14} color="#94A3B8" />
                        <Text className="text-gray-400 text-xs ml-1">{event.category}</Text>
                    </View>
                </View>
            </View>

            <ChevronRight size={20} color="#334155" />
        </TouchableOpacity>
    );
};
