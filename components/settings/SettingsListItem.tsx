import { Switch, Text, TouchableOpacity, View } from "react-native";

type SettingsListItemProps = {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  rightValue?: string;
  badge?: string;
  showChevron?: boolean;
  /** If provided, renders a toggle instead of chevron */
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  isLast?: boolean;
  destructive?: boolean;
};

export default function SettingsListItem({
  icon,
  label,
  onPress,
  rightValue,
  badge,
  showChevron = true,
  toggleValue,
  onToggleChange,
  isLast = false,
  destructive = false,
}: SettingsListItemProps) {
  const isToggle = toggleValue !== undefined;

  return (
    // <TouchableOpacity
    //   onPress={onPress}
    //   activeOpacity={isToggle ? 1 : 0.7}
    //   className={`flex-row items-center gap-4 px-4 min-h-[56px] justify-between ${
    //     !isLast ? "border-b border-gray-100 dark:border-white/5" : ""
    //   }`}
    // >

    // toggle rows: tapping anywhere on the row flips the switch
    <TouchableOpacity
      onPress={isToggle ? () => onToggleChange?.(!toggleValue) : onPress}
      activeOpacity={isToggle ? 1 : 0.7}
      className={`flex-row items-center gap-4 px-4 py-3 min-h-[56px] justify-between ${
        !isLast ? "border-b border-gray-100 dark:border-white/5" : ""
      }`}
    >
      {/* icon + label */}
      <View className="flex-row items-center gap-4 flex-1">
        <View className="shrink-0">{icon}</View>
        <Text
          className={`text-base font-medium flex-1 ${
            destructive ? "text-red-500" : "text-gray-900 dark:text-white"
          }`}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>

      {/* right side: switch or badge/chevron */}
      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{ false: "#d1d5db", true: "#f48c25" }}
          thumbColor="#ffffff"
          ios_backgroundColor="#d1d5db"
        />
      ) : (
        <View className="flex-row items-center gap-1">
          {badge && (
            <View className="bg-primary/20 rounded px-1.5 py-0.5">
              <Text className="text-primary text-[10px] font-bold uppercase">
                {badge}
              </Text>
            </View>
          )}
          {rightValue && (
            <Text className="text-gray-400 dark:text-gray-500 text-sm">
              {rightValue}
            </Text>
          )}
          {showChevron && (
            <Text className="text-gray-400 text-base ml-1">›</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
