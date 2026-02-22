import { HABIT_ICONS } from "@/components/habit/IconPicker";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ManageHabitCardProps = {
  id: string;
  title: string;
  frequency: string;
  goal: number;
  color: string;
  icon: string;
  isActive: boolean;
  streak: number;
  onPress?: () => void;
  onDelete?: () => void;
};

function getIconName(key: string): keyof typeof Ionicons.glyphMap {
  const found = HABIT_ICONS.find((i) => i.key === key);
  return found?.icon ?? "checkmark-circle-outline";
}

const ACTION_WIDTH = 80;
const SWIPE_THRESHOLD = -50;

export default function ManageHabitCard({
  title,
  frequency,
  goal,
  color,
  icon,
  isActive,
  streak,
  onPress,
  onDelete,
}: ManageHabitCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dy) < 15,
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) translateX.setValue(Math.max(g.dx, -ACTION_WIDTH));
      },
      onPanResponderRelease: (_, g) => {
        Animated.spring(translateX, {
          toValue: g.dx < SWIPE_THRESHOLD ? -ACTION_WIDTH : 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const closeSwipe = () =>
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

  return (
    <View className="rounded-xl overflow-hidden">
      {/* Delete action revealed on swipe */}
      <View className="absolute inset-0 flex-row justify-end items-stretch bg-red-500 rounded-xl">
        <TouchableOpacity
          onPress={() => {
            closeSwipe();
            onDelete?.();
          }}
          className="items-center justify-center gap-1 w-20"
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text className="text-white text-[10px] font-bold uppercase">
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable foreground card */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...(isActive ? panResponder.panHandlers : {})}
      >
        <TouchableOpacity
          onPress={() => {
            closeSwipe();
            onPress?.();
          }}
          activeOpacity={0.85}
          className="bg-white dark:bg-[#1c1c1e] p-4 flex-row items-center gap-4 border border-slate-100 dark:border-[#2d241c]"
          style={{ opacity: isActive ? 1 : 0.55 }}
        >
          {/* Icon box */}
          <View
            className="size-12 rounded-lg items-center justify-center shrink-0"
            style={{ backgroundColor: isActive ? `${color}18` : "#9ca3af18" }}
          >
            <Ionicons
              name={getIconName(icon)}
              size={24}
              color={isActive ? color : "#9ca3af"}
            />
          </View>

          {/* Title + subtitle */}
          <View className="flex-1">
            <Text className="text-gray-900 dark:text-white font-bold text-base">
              {title}
            </Text>
            <Text className="text-gray-500 dark:text-slate-400 text-xs font-medium capitalize">
              {frequency} • goal: {goal}
            </Text>
          </View>

          {/* Streak or archive icon */}
          {isActive ? (
            <View className="items-end gap-0.5">
              <View className="flex-row items-center gap-1">
                <Text className="text-2xl font-bold" style={{ color }}>
                  {streak}
                </Text>
                <Ionicons name="flame" size={16} color={color} />
              </View>
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                Streak
              </Text>
            </View>
          ) : (
            <Ionicons name="archive-outline" size={20} color="#9ca3af" />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
