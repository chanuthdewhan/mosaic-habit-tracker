import { View } from "react-native";

// bg tint per variant: primary --> primary/10, neutral --> gray/5, destructive --> red/10
type SettingsIconBoxProps = {
  children: React.ReactNode;
  variant?: "primary" | "neutral" | "destructive";
};

export default function SettingsIconBox({
  children,
  variant = "primary",
}: SettingsIconBoxProps) {
  const bgClass =
    variant === "primary"
      ? "bg-primary/10"
      : variant === "destructive"
        ? "bg-red-500/10"
        : "bg-gray-100 dark:bg-white/5";

  return (
    <View
      className={`size-10 rounded-lg items-center justify-center shrink-0 ${bgClass}`}
    >
      {children}
    </View>
  );
}
