import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type GoalStepperProps = {
  value: number;
  frequency: string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

// formats the goal count into a readable label e.g. "3 times per week"
function getGoalLabel(value: number, frequency: string) {
  const unit =
    frequency === "Daily" ? "day" : frequency === "Weekly" ? "week" : "month";
  return `${value === 1 ? "Once" : `${value} times`} per ${unit}`;
}

export default function GoalStepper({
  value,
  frequency,
  onChange,
  min = 1,
  max = 20,
}: GoalStepperProps) {
  return (
    <View>
      <Text className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1 mb-4">
        Daily Goal
      </Text>
      <View className="bg-slate-100 dark:bg-[#1c1c1e] rounded-xl p-5 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => onChange(Math.max(min, value - 1))}
          activeOpacity={0.7}
          className="size-12 rounded-lg bg-white dark:bg-white/5 items-center justify-center"
        >
          <Ionicons name="remove" size={22} color="#9ca3af" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-gray-900 dark:text-white text-3xl font-bold">
            {value}
          </Text>
          <Text className="text-gray-500 dark:text-slate-400 text-sm font-medium mt-0.5">
            {getGoalLabel(value, frequency)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onChange(Math.min(max, value + 1))}
          activeOpacity={0.7}
          className="size-12 rounded-lg bg-primary/20 items-center justify-center"
        >
          <Ionicons name="add" size={22} color="#f48c25" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
