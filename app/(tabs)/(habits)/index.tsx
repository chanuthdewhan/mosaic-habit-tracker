import ManageHabitCard from "@/components/habit/ManageHabitCard";
import { useHabits } from "@/context/HabitContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FILTERS = ["All", "Daily", "Weekly", "Monthly"];

/**
 * ManageHabitsScreen
 * Screen for viewing and managing all user habits.
 * Shows active habits with search and frequency filters
 * Displays paused/archived habits separately
 * Allows deleting a habit
 */
export default function ManageHabitsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { habits, loading, deleteHabit, getHabitStats } = useHabits();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Separate active and inactive habits for rendering sections
  const activeHabits = habits.filter((h) => h.isActive);
  const inactiveHabits = habits.filter((h) => !h.isActive);

  const filtered = useMemo(() => {
    return activeHabits.filter((h) => {
      const matchesSearch = h.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === "All" ||
        h.frequency.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [activeHabits, search, activeFilter]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${title}"? This will also delete all completion history.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHabit(id);
            } catch {
              Alert.alert("Error", "Failed to delete habit.");
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <View
        className="bg-background-light/90 dark:bg-background-dark/90 px-4 pb-3 border-b border-slate-100 dark:border-[#2d241c]"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-900 dark:text-white text-3xl font-bold">
            Manage Habits
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/add-habit")}
            className="size-10 rounded-full bg-primary/10 items-center justify-center"
          >
            <Ionicons name="add" size={22} color="#f48c25" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-slate-100 dark:bg-[#1c1c1e] rounded-xl px-3 mb-3 border border-slate-200 dark:border-[#2d241c]">
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search habits..."
            placeholderTextColor="#9ca3af"
            className="flex-1 py-3 px-2 text-sm text-gray-900 dark:text-white"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {FILTERS.map((filter) => {
            const isActive = filter === activeFilter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className="h-9 rounded-full px-5 items-center justify-center"
                style={{
                  backgroundColor: isActive ? "#f48c25" : undefined,
                }}
              >
                {!isActive && (
                  <View className="absolute inset-0 rounded-full bg-slate-200 dark:bg-[#2d241c]" />
                )}
                <Text
                  className="text-sm font-bold"
                  style={{ color: isActive ? "white" : "#9ca3af" }}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f48c25" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 16,
            gap: 24,
            paddingBottom: insets.bottom + 100,
          }}
        >
          <View className="gap-3">
            <Text className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest px-1">
              Active Habits{filtered.length > 0 ? ` (${filtered.length})` : ""}
            </Text>

            {filtered.length === 0 ? (
              <View className="items-center py-10 gap-2">
                <Ionicons name="leaf-outline" size={40} color="#9ca3af" />
                <Text className="text-gray-400 text-sm text-center">
                  {search
                    ? "No habits match your search"
                    : "No active habits yet.\nTap + to create one!"}
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {filtered.map((habit) => {
                  const stats = getHabitStats(habit.id);
                  return (
                    <ManageHabitCard
                      key={habit.id}
                      id={habit.id}
                      title={habit.title}
                      frequency={habit.frequency}
                      goal={habit.goal}
                      color={habit.color}
                      icon={habit.icon ?? ""}
                      isActive={habit.isActive}
                      streak={stats.currentStreak}
                      onPress={() => router.push(`/${habit.id}`)}
                      onDelete={() => handleDelete(habit.id, habit.title)}
                    />
                  );
                })}
              </View>
            )}
          </View>

          {inactiveHabits.length > 0 && (
            <View className="gap-3">
              <Text className="text-gray-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest px-1">
                Paused & Archived
              </Text>
              <View className="gap-3">
                {inactiveHabits.map((habit) => (
                  <ManageHabitCard
                    key={habit.id}
                    id={habit.id}
                    title={habit.title}
                    frequency={habit.frequency}
                    goal={habit.goal}
                    color={habit.color}
                    icon={habit.icon ?? ""}
                    isActive={false}
                    streak={0}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
