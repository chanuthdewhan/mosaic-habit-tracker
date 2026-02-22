import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Habit() {
  const { habitId } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center ">
      <Text className="text-xl font-bold text-primary">
        Habit ID: {habitId}
      </Text>
    </View>
  );
}
