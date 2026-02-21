export type HabitFrequency = "daily" | "weekly" | "monthly";

export type Habit = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  icon?: string;
  color: string;
  frequency: HabitFrequency;
  goal: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type HabitCompletion = {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Date;
  note?: string | null;
};

export type HabitStats = {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
  lastCompletedAt?: Date;
};

export type HabitContextType = {
  habits: Habit[];
  completions: HabitCompletion[];
  loading: boolean;
  error: string | null;
  createHabit: (
    data: Omit<Habit, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  completeHabit: (habitId: string, note?: string) => Promise<void>;
  uncompleteHabit: (habitId: string, date: Date) => Promise<void>;
  getHabitCompletions: (
    habitId: string,
    startDate?: Date,
    endDate?: Date,
  ) => HabitCompletion[];
  getHabitStats: (habitId: string) => HabitStats;
  getTodayCompletions: () => HabitCompletion[];
  isCompletedToday: (habitId: string) => boolean;
};
