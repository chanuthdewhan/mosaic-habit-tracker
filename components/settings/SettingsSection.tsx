import { Text, View } from "react-native";

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  return (
    <View className="px-4 mt-6">
      <Text className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest px-1 pb-2 pt-2">
        {title}
      </Text>
      <View className="bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden border border-gray-100 dark:border-white/5">
        {children}
      </View>
    </View>
  );
}
