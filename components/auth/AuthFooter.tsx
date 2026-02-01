import { Text, View } from "react-native";

interface AuthFooterProps {
  type?: "signin" | "signup";
}

export default function AuthFooter({ type = "signin" }: AuthFooterProps) {
  return (
    <View className="mt-12">
      <Text className="text-[11px] text-gray-400 dark:text-gray-500 text-center leading-relaxed px-6">
        By {type === "signin" ? "signing in" : "creating an account"}, you agree
        to our{" "}
        <Text className="text-primary font-medium">Terms of Service</Text> and{" "}
        <Text className="text-primary font-medium">Privacy Policy</Text>.
      </Text>
    </View>
  );
}
