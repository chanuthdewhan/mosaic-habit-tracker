import CompletionBarChart from "@/components/analytics/CompletionBarChart";
import HabitBreakdown, {
  HabitStat,
} from "@/components/analytics/HabitBreakdown";
import KpiCards from "@/components/analytics/KpiCards";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PERIODS = ["This Week", "Last Week", "This Month", "Last 30 Days"];

// TODO: replace with real data from HabitContext
const CHART_DATA = [
  { label: "M", completed: 0.8, missed: 0.1 },
  { label: "T", completed: 1.0, missed: 0.0 },
  { label: "W", completed: 0.6, missed: 0.3 },
  { label: "T", completed: 0.95, missed: 0.05 },
  { label: "F", completed: 0.75, missed: 0.2 },
  { label: "S", completed: 0.4, missed: 0.5 },
  { label: "S", completed: 0.5, missed: 0.4 },
];

const HABIT_STATS: HabitStat[] = [
  {
    id: "1",
    name: "Morning Meditation",
    goal: "Goal: 15 min daily",
    percentage: 92,
    icon: "leaf-outline",
    color: "#f48c25",
  },
  {
    id: "2",
    name: "Hydration",
    goal: "Goal: 2.5L daily",
    percentage: 75,
    icon: "water-outline",
    color: "#3b82f6",
  },
  {
    id: "3",
    name: "Deep Reading",
    goal: "Goal: 20 pages daily",
    percentage: 45,
    icon: "book-outline",
    color: "#a855f7",
  },
  {
    id: "4",
    name: "Gym Session",
    goal: "Goal: 3x per week",
    percentage: 33,
    icon: "barbell-outline",
    color: "#10b981",
  },
];

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-row items-center px-4 py-3 justify-between border-b border-slate-200 dark:border-[#2d2d2d]">
        <View className="size-10" />
        <Text className="text-gray-900 dark:text-white text-lg font-bold">
          Analytics Insights
        </Text>
        <TouchableOpacity className="size-10 items-center justify-center">
          <Ionicons name="share-outline" size={22} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        <View className="items-center py-4">
          <TouchableOpacity
            onPress={() => setShowPeriodModal(true)}
            className="flex-row items-center gap-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2d2d2d] rounded-full px-4 py-2 shadow-sm"
            activeOpacity={0.7}
          >
            <Text className="text-gray-900 dark:text-white text-sm font-semibold">
              {selectedPeriod}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#f48c25" />
          </TouchableOpacity>
        </View>

        <KpiCards
          cards={[
            { label: "Active", value: "8" },
            {
              label: "Rate",
              value: "84%",
              sub: "+5.2%",
              subIcon: "trending-up",
              subColor: "#22c55e",
            },
            {
              label: "Streak",
              value: "12d",
              sub: "Best!",
              subIcon: "flame",
              subColor: "#f48c25",
            },
          ]}
        />

        <CompletionBarChart
          data={CHART_DATA}
          title="Daily Completion"
          subtitle="Avg 6/8 habits per day"
        />

        <HabitBreakdown habits={HABIT_STATS} onViewAll={() => {}} />
      </ScrollView>

      {/* period picker — rendered as a modal so it overlays the scroll */}
      <Modal
        visible={showPeriodModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPeriodModal(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/40 items-center justify-center"
          activeOpacity={1}
          onPress={() => setShowPeriodModal(false)}
        >
          <View className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden w-64 border border-slate-200 dark:border-[#2d2d2d]">
            {PERIODS.map((period, idx) => (
              <TouchableOpacity
                key={period}
                onPress={() => {
                  setSelectedPeriod(period);
                  setShowPeriodModal(false);
                }}
                className={`px-6 py-4 ${
                  idx < PERIODS.length - 1
                    ? "border-b border-slate-100 dark:border-[#2d2d2d]"
                    : ""
                } ${selectedPeriod === period ? "bg-primary/5" : ""}`}
              >
                <Text
                  className={`text-base font-semibold ${
                    selectedPeriod === period
                      ? "text-primary"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
