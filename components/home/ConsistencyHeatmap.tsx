import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// TODO: replace with real completion data
const generateHeatmapData = () => {
  const opacities = [0.1, 0.2, 0.4, 0.6, 0.8, 1.0];
  return Array.from(
    { length: 7 * 18 },
    () => opacities[Math.floor(Math.random() * opacities.length)],
  );
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ConsistencyHeatmapProps = {
  onViewStats?: () => void;
};

export default function ConsistencyHeatmap({
  onViewStats,
}: ConsistencyHeatmapProps) {
  const data = generateHeatmapData();

  // split into columns of 7 (one per week)
  const weeks: number[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between px-6 pb-3">
        <Text className="text-gray-900 dark:text-white text-lg font-bold">
          Your Consistency
        </Text>
        <TouchableOpacity onPress={onViewStats}>
          <Text className="text-primary text-sm font-semibold">View Stats</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 4 }}
      >
        <View className="flex-row gap-1.5">
          <View
            className="flex-col gap-1.5 mr-1 justify-between"
            style={{ paddingTop: 2 }}
          >
            {DAYS.map((day) => (
              <Text
                key={day}
                className="text-gray-400 dark:text-slate-500 text-[9px] font-bold"
                style={{ width: 20, height: 12, lineHeight: 12 }}
              >
                {day}
              </Text>
            ))}
          </View>
          {weeks.map((week, wIdx) => (
            <View key={wIdx} className="flex-col gap-1.5">
              {week.map((opacity, dIdx) => (
                <View
                  key={dIdx}
                  className="rounded-sm"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: `rgba(244, 140, 37, ${opacity})`,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
