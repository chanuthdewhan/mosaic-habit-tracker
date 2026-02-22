import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export type Habit = {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
  streak?: number;
  accentColor: string;
  iconBg: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
};

type HabitCardProps = {
  habit: Habit;
  onToggle?: (id: string) => void;
};

export default function HabitCard({ habit, onToggle }: HabitCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onToggle?.(habit.id)}
      activeOpacity={0.8}
      className="bg-white dark:bg-[#1a1a1a] rounded-xl flex-row items-center p-4 shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: habit.accentColor }}
    >
      {/* Icon */}
      <View
        className="size-10 rounded-full items-center justify-center mr-4 shrink-0"
        style={{ backgroundColor: habit.iconBg }}
      >
        <Ionicons name={habit.icon} size={20} color={habit.iconColor} />
      </View>

      {/* Text */}
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-0.5">
          <Text className="text-gray-900 dark:text-white text-base font-semibold">
            {habit.title}
          </Text>
          {habit.streak !== undefined && (
            <View
              className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${
                habit.completed
                  ? "bg-primary/20"
                  : "bg-gray-100 dark:bg-slate-800"
              }`}
            >
              <Text className="text-xs">🔥</Text>
              <Text
                className={`text-xs font-bold ${
                  habit.completed ? "text-primary" : "text-gray-500"
                }`}
              >
                {habit.streak}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-gray-500 dark:text-slate-400 text-sm">
          {habit.subtitle}
        </Text>
      </View>

      {/* Checkbox */}
      <View
        className={`size-8 rounded-full items-center justify-center shrink-0 ml-2 ${
          habit.completed
            ? "bg-primary"
            : "border-2 border-gray-300 dark:border-slate-700"
        }`}
      >
        {habit.completed && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
}
