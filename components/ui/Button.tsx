import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "outline";
  icon?: React.ReactNode;
}

export default function Button({
  title,
  variant = "primary",
  icon,
  ...props
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <TouchableOpacity
        className="w-full h-14 rounded-lg overflow-hidden"
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={["#f48c25", "#e67e15"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full h-full items-center justify-center flex-row gap-2"
        >
          {icon}
          <Text className="text-white font-bold text-lg">{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className="w-full h-14 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-transparent flex-row items-center justify-center gap-3"
      activeOpacity={0.7}
      {...props}
    >
      {icon}
      <Text className="text-background-dark dark:text-white font-semibold">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
