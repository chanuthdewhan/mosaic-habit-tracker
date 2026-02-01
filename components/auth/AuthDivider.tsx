import { Text, View } from "react-native";

export default function AuthDivider() {
  return (
    <View className="flex-row items-center gap-4 my-8">
      <View className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800" />
      <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        or
      </Text>
      <View className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800" />
    </View>
  );
}
