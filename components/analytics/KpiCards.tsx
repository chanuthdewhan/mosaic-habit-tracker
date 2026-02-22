import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type KpiCard = {
  label: string;
  value: string;
  sub?: string;
  subIcon?: keyof typeof Ionicons.glyphMap;
  subColor?: string;
};

type KpiCardsProps = {
  cards: KpiCard[];
};

export default function KpiCards({ cards }: KpiCardsProps) {
  return (
    <View className="flex-row gap-3 px-4 mb-6 flex-wrap">
      {cards.map((card) => (
        <View
          key={card.label}
          className="flex-1 min-w-[100px] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2d2d2d] rounded-xl p-4 items-center"
        >
          <Text className="text-gray-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            {card.label}
          </Text>
          <Text className="text-gray-900 dark:text-white text-xl font-bold">
            {card.value}
          </Text>
          {card.sub && (
            <View className="flex-row items-center gap-1 mt-1">
              {card.subIcon && (
                <Ionicons
                  name={card.subIcon}
                  size={12}
                  color={card.subColor ?? "#f48c25"}
                />
              )}
              <Text
                className="text-xs font-bold"
                style={{ color: card.subColor ?? "#f48c25" }}
              >
                {card.sub}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
