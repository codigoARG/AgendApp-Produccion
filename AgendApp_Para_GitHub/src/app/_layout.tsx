import { Stack } from "expo-router";
import "../styles/global.css";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { registerForPushNotificationsAsync } from "../services/notificationService";

import { subscribeToAuthChanges } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter, useSegments } from "expo-router";
import { subscribeToEvents } from "../services/syncService";
import { useEventStore } from "../store/useEventStore";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const { user, loading, setUser } = useAuthStore();
    const setEvents = useEventStore((state) => state.setEvents);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        registerForPushNotificationsAsync();

        let unsubscribeEvents: () => void;

        const unsubscribeAuth = subscribeToAuthChanges((u) => {
            setUser(u as any);

            // Re-subscribe to events if user changes
            if (unsubscribeEvents) unsubscribeEvents();

            if (u) {
                unsubscribeEvents = subscribeToEvents(u.uid, (events) => {
                    setEvents(events);
                });
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeEvents) unsubscribeEvents();
        };
    }, []);

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === "login";

        if (!user && !inAuthGroup) {
            router.replace("/login");
        } else if (user && inAuthGroup) {
            router.replace("/");
        }
    }, [user, loading, segments]);

    if (loading) return null;

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
                },
                headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#0F172A',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="create" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
    );
}
