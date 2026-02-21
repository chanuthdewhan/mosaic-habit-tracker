import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export type HabitIcon = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

export const HABIT_ICONS: HabitIcon[] = [
  { key: "water", icon: "water-outline", label: "Hydrate" },
  { key: "fitness", icon: "barbell-outline", label: "Workout" },
  { key: "book", icon: "book-outline", label: "Read" },
  { key: "sleep", icon: "moon-outline", label: "Sleep" },
  { key: "zen", icon: "leaf-outline", label: "Zen" },
  { key: "code", icon: "code-slash-outline", label: "Code" },
  { key: "food", icon: "nutrition-outline", label: "Eat" },
  { key: "walk", icon: "walk-outline", label: "Walk" },
];

type IconPickerProps = {
  selectedKey: string;
  selectedColor: string;
  onSelect: (key: string) => void;
};

export default function IconPicker({
  selectedKey,
  selectedColor,
  onSelect,
}: IconPickerProps) {
  return (
    <View>
      <Text className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1 mb-4">
        Select Icon
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4, gap: 16 }}
      >
        {HABIT_ICONS.map((item) => {
          const isSelected = item.key === selectedKey;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => onSelect(item.key)}
              activeOpacity={0.7}
              className="items-center gap-2"
            >
              <View className="size-14 rounded-full items-center justify-center">
                {/* selected bg uses the habit color, unselected falls back to slate */}
                {isSelected ? (
                  <View
                    className="size-14 rounded-full bg-slate-100 dark:bg-[#1c1c1e] items-center justify-center absolute"
                    style={{
                      backgroundColor: isSelected ? selectedColor : undefined,
                    }}
                  />
                ) : (
                  <View className="size-14 rounded-full bg-slate-100 dark:bg-[#1c1c1e] items-center justify-center absolute" />
                )}
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={isSelected ? "#ffffff" : "#9ca3af"}
                />
              </View>

              <Text
                className="text-[11px] font-medium dark:text-white"
                style={{ opacity: isSelected ? 1 : 0.5 }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
