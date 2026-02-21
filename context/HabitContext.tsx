import { useAuth } from "@/hooks/useAuth";
import { completionService, habitService } from "@/services/HabitService";
import { Habit, HabitCompletion, HabitContextType, HabitStats } from "@/types";
import { differenceInDays, endOfDay, isSameDay, startOfDay } from "date-fns";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = () => {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error("useHabits must be used within HabitProvider");
  return ctx;
};

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // subscribe to habits and completions in real-time, clean up on unmount/user change
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setCompletions([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const unsubHabits = habitService.subscribeToHabits(user.uid, (h) => {
      setHabits(h);
      setLoading(false);
    });

    const unsubCompletions = completionService.subscribeToCompletions(
      user.uid,
      (c) => setCompletions(c),
    );

    return () => {
      unsubHabits();
      unsubCompletions();
    };
  }, [user]);

  const createHabit = async (
    data: Omit<Habit, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => {
    if (!user) throw new Error("Not authenticated");
    setError(null);
    await habitService.createHabit(user.uid, data);
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    setError(null);
    await habitService.updateHabit(id, updates);
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;
    setError(null);
    await habitService.deleteHabit(id, user.uid);
  };

  const completeHabit = async (habitId: string, note?: string) => {
    if (!user) throw new Error("Not authenticated");
    setError(null);
    await completionService.completeHabit(user.uid, habitId, note);
  };

  const uncompleteHabit = async (habitId: string, date: Date) => {
    if (!user) throw new Error("Not authenticated");
    setError(null);
    await completionService.uncompleteHabit(habitId, user.uid, date);
  };

  const getTodayCompletions = (): HabitCompletion[] => {
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());
    return completions.filter(
      (c) => c.completedAt >= start && c.completedAt <= end,
    );
  };

  const isCompletedToday = (habitId: string): boolean =>
    getTodayCompletions().some((c) => c.habitId === habitId);

  const getHabitCompletions = (
    habitId: string,
    startDate?: Date,
    endDate?: Date,
  ): HabitCompletion[] => {
    let filtered = completions.filter((c) => c.habitId === habitId);
    if (startDate && endDate) {
      filtered = filtered.filter(
        (c) => c.completedAt >= startDate && c.completedAt <= endDate,
      );
    }
    return filtered;
  };

  const getHabitStats = (habitId: string): HabitStats => {
    const sorted = completions
      .filter((c) => c.habitId === habitId)
      .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());

    if (sorted.length === 0) {
      return {
        habitId,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        completionRate: 0,
      };
    }

    // walk backwards from today, count consecutive days
    let currentStreak = 0;
    let checkDate = startOfDay(new Date());
    for (let i = sorted.length - 1; i >= 0; i--) {
      const d = startOfDay(sorted[i].completedAt);
      if (isSameDay(d, checkDate)) {
        currentStreak++;
        checkDate = new Date(checkDate.setDate(checkDate.getDate() - 1));
      } else if (d < checkDate) break;
    }

    // diff === 1 means consecutive days, anything more resets the run
    let longest = 1;
    let temp = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = differenceInDays(
        startOfDay(sorted[i].completedAt),
        startOfDay(sorted[i - 1].completedAt),
      );
      if (diff === 1) {
        temp++;
        longest = Math.max(longest, temp);
      } else if (diff > 1) {
        temp = 1;
      }
    }

    // completion rate based on last 30 days only
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = sorted.filter((c) => c.completedAt >= thirtyDaysAgo);

    return {
      habitId,
      currentStreak,
      longestStreak: longest,
      totalCompletions: sorted.length,
      completionRate: Math.round((recent.length / 30) * 100),
      lastCompletedAt: sorted[sorted.length - 1]?.completedAt,
    };
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        completions,
        loading,
        error,
        createHabit,
        updateHabit,
        deleteHabit,
        completeHabit,
        uncompleteHabit,
        getHabitCompletions,
        getHabitStats,
        getTodayCompletions,
        isCompletedToday,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};
