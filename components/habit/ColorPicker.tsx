import { Text, TouchableOpacity, View } from "react-native";

export const HABIT_COLORS = [
  "#f48c25",
  "#3b82f6",
  "#10b981",
  "#a855f7",
  "#f43f5e",
  "#f59e0b",
  "#22d3ee",
  "#6366f1",
  "#2dd4bf",
  "#e879f9",
];

type ColorPickerProps = {
  selectedColor: string;
  onSelect: (color: string) => void;
};

export default function ColorPicker({
  selectedColor,
  onSelect,
}: ColorPickerProps) {
  return (
    <View>
      <Text className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1 mb-4">
        Visual Theme
      </Text>
      <View className="flex-row flex-wrap gap-4">
        {HABIT_COLORS.map((color) => {
          const isSelected = color === selectedColor;
          return (
            <TouchableOpacity
              key={color}
              onPress={() => onSelect(color)}
              activeOpacity={0.8}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: color,
                borderWidth: isSelected ? 3 : 0,
                borderColor: color,
                // ring effect via shadow
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isSelected ? 0.5 : 0,
                shadowRadius: isSelected ? 6 : 0,
                elevation: isSelected ? 4 : 0,
                transform: [{ scale: isSelected ? 1.1 : 1 }],
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
