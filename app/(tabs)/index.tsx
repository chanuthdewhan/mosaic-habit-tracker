import { HABIT_ICONS } from "@/components/habit/IconPicker";
import ConsistencyHeatmap from "@/components/home/ConsistencyHeatmap";
import DailyProgressCard from "@/components/home/DailyProgressCard";
import HabitCard from "@/components/home/HabitCard";
import { useHabits } from "@/context/HabitContext";
import { useAuth } from "@/hooks/useAuth";
import { getUserData } from "@/services/userService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const getIconName = (key: string): keyof typeof Ionicons.glyphMap => {
  const found = HABIT_ICONS.find((i) => i.key === key);
  return found?.icon ?? "checkmark-circle-outline";
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    habits,
    loading,
    completeHabit,
    uncompleteHabit,
    isCompletedToday,
    getHabitStats,
  } = useHabits();

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user?.uid) {
      getUserData(user.uid).then(setUserData);
    }
  }, [user?.uid]);

  const completedCount = habits.filter((h) => isCompletedToday(h.id)).length;

  // highest current streak across all habits
  const bestStreak = habits.reduce((max, h) => {
    const stats = getHabitStats(h.id);
    return Math.max(max, stats.currentStreak);
  }, 0);

  const handleToggle = async (habitId: string) => {
    try {
      if (isCompletedToday(habitId)) {
        await uncompleteHabit(habitId, new Date());
      } else {
        await completeHabit(habitId);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update habit");
    }
  };

  // firstName from Firestore takes priority over Firebase Auth displayName
  const displayName = userData?.firstName ?? user?.displayName ?? "there";
  const photoURL = user?.photoURL ?? null;

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <View
        className="flex-row items-center justify-between px-6 pb-3 bg-background-light/80 dark:bg-background-dark/80"
        style={{ paddingTop: insets.top }}
      >
        <View>
          <Text className="text-gray-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
            {getTodayLabel()}
          </Text>
          <Text className="text-gray-900 dark:text-white text-xl font-bold">
            {getGreeting()}, {displayName}!
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="size-10 rounded-full bg-gray-200 dark:bg-[#1a1a1a] items-center justify-center"
            onPress={() => {}}
          >
            <Ionicons name="notifications-outline" size={22} color="#9ca3af" />
            <View className="absolute top-2 right-2 size-2 bg-primary rounded-full border border-background-light dark:border-background-dark" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className="size-10 rounded-full border-2 border-primary/30 overflow-hidden bg-gray-200 dark:bg-[#1a1a1a] items-center justify-center"
          >
            {photoURL ? (
              <Image
                source={{ uri: photoURL }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person-outline" size={20} color="#9ca3af" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f48c25" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        >
          <DailyProgressCard
            completed={completedCount}
            total={habits.length}
            streakDays={bestStreak}
          />
          <ConsistencyHeatmap onViewStats={() => {}} />
          <View className="mt-8 px-4">
            <Text className="text-gray-900 dark:text-white text-lg font-bold mb-3">
              Today's Habits
            </Text>
            {habits.length === 0 ? (
              <View className="items-center py-12 gap-3">
                <Ionicons name="leaf-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-400 dark:text-slate-500 text-base text-center">
                  No habits yet.{"\n"}Tap the + button to create one!
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {habits.map((habit) => {
                  const stats = getHabitStats(habit.id);
                  return (
                    <HabitCard
                      key={habit.id}
                      habit={{
                        id: habit.id,
                        title: habit.title,
                        subtitle:
                          habit.description ??
                          `${habit.frequency} • goal: ${habit.goal}`,
                        completed: isCompletedToday(habit.id),
                        streak: stats.currentStreak,
                        accentColor: habit.color,
                        iconBg: `${habit.color}20`,
                        icon: getIconName(habit.icon ?? ""),
                        iconColor: habit.color,
                      }}
                      onToggle={handleToggle}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
