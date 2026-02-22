import { Text, View } from "react-native";

type BarData = {
  label: string;
  completed: number; // 0-1
  missed: number; // 0-1
};

type CompletionBarChartProps = {
  data: BarData[];
  title: string;
  subtitle?: string;
};

export default function CompletionBarChart({
  data,
  title,
  subtitle,
}: CompletionBarChartProps) {
  const CHART_HEIGHT = 128;

  return (
    <View className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2d2d2d] rounded-2xl p-5 mx-4 mb-6">
      <View className="flex-row justify-between items-start mb-6">
        <View>
          <Text className="text-gray-900 dark:text-white text-base font-bold mb-0.5">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-gray-500 dark:text-slate-400 text-sm">
              {subtitle}
            </Text>
          )}
        </View>
        <View className="gap-1">
          <View className="flex-row items-center gap-1.5">
            <View className="size-2 rounded-full bg-primary" />
            <Text className="text-[10px] text-gray-400 font-medium">Done</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="size-2 rounded-full bg-slate-200 dark:bg-slate-700" />
            <Text className="text-[10px] text-gray-400 font-medium">
              Missed
            </Text>
          </View>
        </View>
      </View>

      <View
        className="flex-row items-end gap-2"
        style={{ height: CHART_HEIGHT + 24 }}
      >
        {data.map((item, index) => (
          <View
            key={`${item.label}-${index}`}
            className="flex-1 items-center gap-2"
          >
            <View
              className="w-full overflow-hidden rounded-lg flex-col-reverse"
              style={{ height: CHART_HEIGHT }}
            >
              <View
                className="w-full bg-primary"
                style={{ height: `${item.completed * 100}%` }}
              />
              <View
                className="w-full bg-slate-200 dark:bg-slate-700"
                style={{ height: `${item.missed * 100}%` }}
              />
            </View>
            <Text className="text-[10px] font-bold text-gray-400">
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
