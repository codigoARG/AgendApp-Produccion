import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Goal {
    id: string;
    title: string;
    targetCount: number;
    currentCount: number;
    type: 'daily' | 'weekly' | 'monthly';
    category: string;
    reward?: string;
    completed: boolean;
}

interface GoalState {
    goals: Goal[];
    addGoal: (goal: Goal) => void;
    updateGoalProgress: (id: string, delta: number) => void;
    deleteGoal: (id: string) => void;
    streak: number;
    lastCompletionDate: string | null;
    updateStreak: () => void;
}

export const useGoalStore = create<GoalState>()(
    persist(
        (set, get) => ({
            goals: [],
            streak: 0,
            lastCompletionDate: null,
            addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
            updateGoalProgress: (id, delta) => set((state) => ({
                goals: state.goals.map((g) => {
                    if (g.id === id) {
                        const newCount = Math.min(g.targetCount, Math.max(0, g.currentCount + delta));
                        return { ...g, currentCount: newCount, completed: newCount >= g.targetCount };
                    }
                    return g;
                }),
            })),
            deleteGoal: (id) => set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
            updateStreak: () => {
                const today = new Date().toISOString().split('T')[0];
                const lastDate = get().lastCompletionDate;

                if (lastDate === today) return;

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastDate === yesterdayStr) {
                    set((state) => ({ streak: state.streak + 1, lastCompletionDate: today }));
                } else {
                    set((state) => ({ streak: 1, lastCompletionDate: today }));
                }
            },
        }),
        {
            name: 'goal-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
