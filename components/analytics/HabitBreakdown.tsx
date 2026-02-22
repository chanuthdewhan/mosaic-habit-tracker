import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export type HabitStat = {
  id: string;
  name: string;
  goal: string;
  percentage: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

type HabitBreakdownProps = {
  habits: HabitStat[];
  onViewAll?: () => void;
};

export default function HabitBreakdown({
  habits,
  onViewAll,
}: HabitBreakdownProps) {
  return (
    <View className="px-4 pb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-gray-900 dark:text-white text-lg font-bold">
          Habit Performance
        </Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-primary text-sm font-bold">View all</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="gap-3">
        {habits.map((habit) => (
          <View
            key={habit.id}
            className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2d2d2d] rounded-xl p-4 gap-3"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className="size-10 rounded-lg items-center justify-center"
                  style={{ backgroundColor: `${habit.color}20` }}
                >
                  <Ionicons name={habit.icon} size={20} color={habit.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 dark:text-white font-bold text-sm">
                    {habit.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-slate-400 text-xs">
                    {habit.goal}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-900 dark:text-white font-bold text-sm">
                {habit.percentage}%
              </Text>
            </View>

            {/* progress bar */}
            <View className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${habit.percentage}%`,
                  backgroundColor: habit.color,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
