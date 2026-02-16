import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Container } from '../components/Container';
import { useGoalStore, Goal } from '../store/useGoalStore';
import { Trophy, Target, Star, Plus, CheckCircle2, Flame, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';

const GoalsScreen = () => {
    const router = useRouter();
    const { goals, addGoal, updateGoalProgress, streak } = useGoalStore();

    const handleAddGoal = () => {
        // Logic for adding a quick goal for demo
        addGoal({
            id: Math.random().toString(36).substring(7),
            title: "Completar tareas",
            targetCount: 5,
            currentCount: 0,
            type: 'daily',
            category: 'Productividad',
            completed: false
        });
    };

    return (
        <Container safe className="pt-6">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8 px-4">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="white" size={24} />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">Mis Metas</Text>
                </View>
                <TouchableOpacity
                    onPress={handleAddGoal}
                    className="bg-primary-600/20 p-2 rounded-full border border-primary-500/30"
                >
                    <Plus color="#8B5CF6" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="px-4">
                {/* Streak Banner */}
                <MotiView
                    from={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-card p-6 rounded-3xl border border-white/5 flex-row items-center justify-between mb-8"
                >
                    <View>
                        <Text className="text-gray-400 text-sm font-medium">Racha Actual</Text>
                        <View className="flex-row items-center mt-1">
                            <Flame color="#F59E0B" fill="#F59E0B" size={24} />
                            <Text className="text-white text-3xl font-black ml-2">{streak} Días</Text>
                        </View>
                    </View>
                    <View className="bg-primary-600/10 p-4 rounded-full border border-primary-500/20">
                        <Trophy color="#8B5CF6" size={32} />
                    </View>
                </MotiView>

                {/* Goals Progress */}
                <View className="mb-10">
                    <View className="flex-row items-center mb-6">
                        <Target color="#8B5CF6" size={20} />
                        <Text className="text-white text-xl font-bold ml-2">En progreso</Text>
                    </View>

                    {goals.length === 0 ? (
                        <View className="bg-card/50 p-10 rounded-3xl border border-dashed border-white/10 items-center">
                            <Star color="#4B5563" size={40} />
                            <Text className="text-gray-500 text-center mt-4">¿No tienes metas aún?{"\n"}¡Crea la primera para empezar!</Text>
                        </View>
                    ) : (
                        goals.map((goal) => (
                            <MotiView
                                key={goal.id}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                className="bg-card p-5 rounded-3xl border border-white/5 mb-4"
                            >
                                <View className="flex-row justify-between items-center mb-3">
                                    <View>
                                        <Text className="text-white font-bold text-lg">{goal.title}</Text>
                                        <Text className="text-gray-500 text-xs">{goal.category} • {goal.type}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => updateGoalProgress(goal.id, 1)}
                                        className={`p-2 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-primary-600/20'}`}
                                    >
                                        <CheckCircle2 color={goal.completed ? 'white' : '#8B5CF6'} size={24} />
                                    </TouchableOpacity>
                                </View>

                                <View className="h-3 bg-white/5 rounded-full overflow-hidden mb-2">
                                    <View
                                        className={`h-full ${goal.completed ? 'bg-green-500' : 'bg-primary-500'}`}
                                        style={{ width: `${(goal.currentCount / goal.targetCount) * 100}%` }}
                                    />
                                </View>
                                <Text className="text-gray-400 text-xs text-right font-medium">
                                    {goal.currentCount} / {goal.targetCount} completado
                                </Text>
                            </MotiView>
                        ))
                    )}
                </View>

                {/* Achievements Preview */}
                <View className="mb-10">
                    <Text className="text-white text-xl font-bold mb-6">Logros Desbloqueados</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                        {['Primer Paso', 'Madrugador', 'Inalcanzable'].map((badge, i) => (
                            <View key={i} className="mr-4 items-center opacity-40">
                                <View className="bg-card w-20 h-20 rounded-full border border-white/5 items-center justify-center mb-2">
                                    <Star color="#9CA3AF" size={32} />
                                </View>
                                <Text className="text-gray-500 text-xs font-medium">{badge}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </Container>
    );
};

export default GoalsScreen;
