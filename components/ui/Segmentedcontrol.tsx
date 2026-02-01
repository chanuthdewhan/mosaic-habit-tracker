import { Text, TouchableOpacity, View } from "react-native";

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export default function SegmentedControl({
  options,
  selectedIndex,
  onChange,
}: SegmentedControlProps) {
  return (
    <View className="flex-row p-1 bg-gray-200 dark:bg-[#1e1e1e] rounded-xl">
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          className={`flex-1 h-10 items-center justify-center rounded-lg ${
            selectedIndex === index
              ? "bg-white dark:bg-[#2e2e2e] shadow-sm"
              : ""
          }`}
          onPress={() => onChange(index)}
        >
          <Text
            className={`text-sm font-semibold ${
              selectedIndex === index
                ? "text-background-dark dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
