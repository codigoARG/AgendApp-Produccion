import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '../components/Container';
import { useEventStore } from '../store/useEventStore';
import { TrendingUp, CheckCircle, Clock, PieChart, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

const StatsScreen = () => {
    const router = useRouter();
    const getStats = useEventStore((state) => state.getStats);
    const stats = getStats();

    return (
        <Container safe className="pt-6">
            {/* Header */}
            <View className="flex-row items-center mb-8 px-4">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="white" size={24} />
                </TouchableOpacity>
                <Text className="text-white text-2xl font-bold">Rendimiento</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="px-4">
                {/* Main Score */}
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 500 }}
                    className="bg-primary-600 p-8 rounded-[40px] items-center mb-6"
                >
                    <Text className="text-white/60 font-medium mb-1">Productividad Total</Text>
                    <Text className="text-white text-6xl font-black">{stats.percentage}%</Text>
                    <View className="flex-row items-center mt-4 bg-white/20 px-4 py-2 rounded-full">
                        <TrendingUp color="white" size={16} />
                        <Text className="text-white ml-2 text-xs font-bold">+5% desde ayer</Text>
                    </View>
                </MotiView>

                {/* Quick Stats Grid */}
                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1 bg-card p-5 rounded-3xl border border-white/5">
                        <CheckCircle color="#10B981" size={20} />
                        <Text className="text-gray-400 text-xs mt-3">Completadas</Text>
                        <Text className="text-white text-2xl font-bold">{stats.completed}</Text>
                    </View>
                    <View className="flex-1 bg-card p-5 rounded-3xl border border-white/5">
                        <Clock color="#F59E0B" size={20} />
                        <Text className="text-gray-400 text-xs mt-3">Pendientes</Text>
                        <Text className="text-white text-2xl font-bold">{stats.pending}</Text>
                    </View>
                </View>

                {/* Activity Distribution */}
                <View className="bg-card p-6 rounded-3xl border border-white/5 mb-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-white text-lg font-bold">Distribución</Text>
                        <PieChart color="#8B5CF6" size={20} />
                    </View>

                    {Object.entries(stats.categories).length === 0 ? (
                        <Text className="text-gray-500 text-center py-4">Sin datos suficientes</Text>
                    ) : (
                        Object.entries(stats.categories).map(([category, count]: [string, any], index) => {
                            const perc = Math.round((count / stats.total) * 100);
                            return (
                                <View key={category} className="mb-4">
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-gray-300 font-medium">{category}</Text>
                                        <Text className="text-white font-bold">{perc}%</Text>
                                    </View>
                                    <View className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <View
                                            className="h-full bg-primary-500"
                                            style={{ width: `${perc}%` }}
                                        />
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>

                {/* Tips Section */}
                <View className="bg-primary-900/10 p-6 rounded-3xl border border-primary-500/20 mb-10">
                    <Text className="text-primary-400 font-bold mb-2">💡 AgendTip</Text>
                    <Text className="text-gray-400 text-sm leading-relaxed">
                        Completar tareas temprano en el día aumenta tu racha de productividad en un 20%. ¡Sigue así!
                    </Text>
                </View>
            </ScrollView>
        </Container>
    );
};

export default StatsScreen;
