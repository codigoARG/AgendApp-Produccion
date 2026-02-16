import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { Container } from "../components/Container";
import { EventCard } from "../components/EventCard";
import { useEventStore } from "../store/useEventStore";
import { useGoalStore } from "../store/useGoalStore";
import { logout } from "../services/authService";
import { Plus, Calendar, Settings, TrendingUp, LogOut, Trophy } from "lucide-react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

const Dashboard = () => {
    const router = useRouter();
    const events = useEventStore((state) => state.events);

    // Filter for today's events (simplified for now)
    const todayEvents = events.filter(e => !e.completed);

    return (
        <Container safe className="pt-6">
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
                <View>
                    <Text className="text-gray-400 text-sm font-medium">Hola, Exequiel 👋</Text>
                    <Text className="text-white text-3xl font-bold">Tu Agenda</Text>
                </View>
                <View className="flex-row items-center space-x-2">
                    <TouchableOpacity
                        onPress={() => logout()}
                        className="bg-card p-3 rounded-2xl border border-white/5 mr-2"
                    >
                        <LogOut color="#EF4444" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-card p-3 rounded-2xl border border-white/5">
                        <Settings color="white" size={20} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats Cards */}
            <View className="flex-row space-x-4 mb-8">
                <TouchableOpacity
                    onPress={() => router.push("/stats")}
                    className="flex-1 bg-primary-600 p-4 rounded-3xl"
                >
                    <TrendingUp color="white" size={20} />
                    <Text className="text-white/70 text-xs mt-2 font-medium">Rendimiento</Text>
                    <Text className="text-white text-2xl font-bold">{useEventStore.getState().getStats().percentage}%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push("/goals")}
                    className="flex-1 bg-card p-4 rounded-3xl border border-white/5"
                >
                    <Trophy color="#8B5CF6" size={20} />
                    <Text className="text-gray-400 text-xs mt-2 font-medium">Metas Activas</Text>
                    <Text className="text-white text-2xl font-bold">{useGoalStore.getState().goals.length}</Text>
                </TouchableOpacity>
            </View>

            {/* Events List */}
            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-white text-xl font-bold">Próximos Eventos</Text>
                    <TouchableOpacity>
                        <Text className="text-primary-400 text-sm font-medium">Ver todo</Text>
                    </TouchableOpacity>
                </View>

                {todayEvents.length === 0 ? (
                    <View className="flex-1 items-center justify-center pb-20">
                        <Text className="text-gray-500 text-center">No tienes eventos pendientes para hoy.</Text>
                        <Text className="text-primary-500 mt-2 font-bold">¡Disfruta tu tiempo libre!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={todayEvents}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <EventCard
                                event={item}
                                onPress={() => console.log('Edit', item.id)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity
                onPress={() => router.push("/create")}
                className="absolute bottom-10 right-6 bg-primary-600 w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-primary-900"
            >
                <Plus color="white" size={32} />
            </TouchableOpacity>
        </Container>
    );
};

export default Dashboard;
