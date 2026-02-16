import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Container } from '../components/Container';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useEventStore, Priority } from '../store/useEventStore';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { scheduleNotification } from '../services/notificationService';

const CreateEvent = () => {
    const router = useRouter();
    const addEvent = useEventStore((state) => state.addEvent);

    const [form, setForm] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        category: 'Personal',
        priority: 'medium' as Priority,
        color: '#6D28D9',
    });

    const handleSave = async () => {
        if (!form.title) return;

        // Simple date/time parsing for notification
        const triggerDate = new Date(`${form.date}T${form.time}:00`);

        if (triggerDate > new Date()) {
            await scheduleNotification(
                `Recordatorio: ${form.title}`,
                form.description || 'Tienes un evento programado ahora.',
                triggerDate
            );
        }

        addEvent({
            id: Math.random().toString(36).substring(7),
            ...form,
            completed: false,
            reminderSent: false,
        });

        router.back();
    };

    return (
        <Container safe className="pt-4">
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-white text-2xl font-bold">Nuevo Evento</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <X color="white" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Input
                    label="Título"
                    placeholder="¿Qué tienes planeado?"
                    value={form.title}
                    onChangeText={(text) => setForm({ ...form, title: text })}
                />

                <Input
                    label="Descripción"
                    placeholder="Detalles adicionales..."
                    multiline
                    numberOfLines={3}
                    value={form.description}
                    onChangeText={(text) => setForm({ ...form, description: text })}
                    className="h-24"
                />

                <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1">
                        <Input
                            label="Fecha"
                            value={form.date}
                            onChangeText={(text) => setForm({ ...form, date: text })}
                        />
                    </View>
                    <View className="flex-1 ml-4">
                        <Input
                            label="Hora"
                            value={form.time}
                            onChangeText={(text) => setForm({ ...form, time: text })}
                        />
                    </View>
                </View>

                <Text className="text-gray-400 text-sm mb-2 ml-1 font-medium">Prioridad</Text>
                <View className="flex-row space-x-2 mb-6">
                    {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
                        <TouchableOpacity
                            key={p}
                            onPress={() => setForm({ ...form, priority: p })}
                            className={`flex-1 h-10 rounded-xl items-center justify-center border ${form.priority === p ? 'bg-primary-600 border-primary-600' : 'bg-card border-white/5'
                                } mr-2`}
                        >
                            <Text className={`text-xs font-bold uppercase ${form.priority === p ? 'text-white' : 'text-gray-400'}`}>
                                {p}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Button title="Crear Evento" onPress={handleSave} className="mt-4" />
            </ScrollView>
        </Container>
    );
};

export default CreateEvent;
