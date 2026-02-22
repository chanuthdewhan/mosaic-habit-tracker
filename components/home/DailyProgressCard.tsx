import { Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

type DailyProgressCardProps = {
  completed: number;
  total: number;
  streakDays?: number;
};

export default function DailyProgressCard({
  completed,
  total,
  streakDays = 12,
}: DailyProgressCardProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // circle geometry for the SVG progress ring
  const size = 96;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View className="mx-4 my-4 bg-white/70 dark:bg-white/5 rounded-xl p-6 border border-white/30 dark:border-white/8 flex-row items-center justify-between overflow-hidden">
      <View className="flex-1 gap-1">
        <Text className="text-primary text-xs font-bold uppercase tracking-widest">
          Daily Progress
        </Text>
        <Text className="text-gray-900 dark:text-white text-3xl font-bold">
          {completed} of {total}
        </Text>
        <Text className="text-gray-500 dark:text-slate-400 text-sm">
          Habits completed today
        </Text>
        {streakDays > 0 && (
          <Text className="text-gray-400 dark:text-slate-500 text-xs mt-1">
            🔥 {streakDays}-day streak!
          </Text>
        )}
      </View>

      <View
        className="relative items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <Stop offset="0%" stopColor="#f48c25" />
              <Stop offset="100%" stopColor="#ffb347" />
            </LinearGradient>
          </Defs>
          {/* track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* progress arc, rotated so it starts from the top */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-gray-900 dark:text-white text-xl font-bold">
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
}
