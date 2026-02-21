import { Pressable, Text, View } from "react-native";

const SEGMENTS = ["Daily", "Weekly", "Monthly"];

type FrequencyPickerProps = {
  selected: string;
  onSelect: (value: string) => void;
};

export default function FrequencyPicker({
  selected,
  onSelect,
}: FrequencyPickerProps) {
  return (
    <View className="bg-slate-100 dark:bg-[#1c1c1e] p-1 rounded-xl flex-row gap-1">
      {SEGMENTS.map((seg) => {
        const isActive = seg === selected;
        return (
          <Pressable
            key={seg}
            onPress={() => onSelect(seg)}
            className={`flex-1 py-2.5 rounded-lg items-center justify-center ${
              isActive ? "bg-white dark:bg-white/10" : ""
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                isActive
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-slate-400"
              }`}
            >
              {seg}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
