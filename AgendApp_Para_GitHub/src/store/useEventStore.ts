import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncEventToFirestore, deleteEventFromFirestore } from '../services/syncService';
import { useAuthStore } from './useAuthStore';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    category: string;
    priority: Priority;
    color: string;
    reminderSent: boolean;
    completed: boolean;
    recurring?: 'daily' | 'weekly' | 'monthly' | 'none';
}

interface EventState {
    events: Event[];
    addEvent: (event: Event) => void;
    updateEvent: (id: string, updates: Partial<Event>) => void;
    deleteEvent: (id: string) => void;
    toggleComplete: (id: string) => void;
    setEvents: (events: Event[]) => void;
    getStats: () => {
        total: number;
        completed: number;
        pending: number;
        percentage: number;
        categories: { [key: string]: number };
    };
}

export const useEventStore = create<EventState>()(
    persist(
        (set, get) => ({
            events: [],
            setEvents: (events) => set({ events }),
            addEvent: async (event) => {
                set((state) => ({ events: [...state.events, event] }));
                const user = useAuthStore.getState().user;
                if (user) await syncEventToFirestore(user.uid, event);
            },
            updateEvent: async (id, updates) => {
                set((state) => ({
                    events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
                }));
                const user = useAuthStore.getState().user;
                const updatedEvent = get().events.find(e => e.id === id);
                if (user && updatedEvent) await syncEventToFirestore(user.uid, updatedEvent);
            },
            deleteEvent: async (id) => {
                set((state) => ({
                    events: state.events.filter((e) => e.id !== id),
                }));
                const user = useAuthStore.getState().user;
                if (user) await deleteEventFromFirestore(user.uid, id);
            },
            toggleComplete: async (id) => {
                set((state) => ({
                    events: state.events.map((e) =>
                        e.id === id ? { ...e, completed: !e.completed } : e
                    ),
                }));
                const user = useAuthStore.getState().user;
                const updatedEvent = get().events.find(e => e.id === id);
                if (user && updatedEvent) await syncEventToFirestore(user.uid, updatedEvent);
            },
            getStats: () => {
                const events = get().events;
                const total = events.length;
                const completed = events.filter(e => e.completed).length;
                const pending = total - completed;
                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                // Group by category (basic)
                const categories = events.reduce((acc: { [key: string]: number }, event) => {
                    acc[event.category] = (acc[event.category] || 0) + 1;
                    return acc;
                }, {});

                return { total, completed, pending, percentage, categories };
            }
        }),
        {
            name: 'event-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
