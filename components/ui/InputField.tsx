import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export default function InputField({
  label,
  error,
  isPassword = false,
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="gap-2">
      <Text className="text-background-dark dark:text-gray-200 text-sm font-semibold px-1">
        {label}
      </Text>
      <View className="relative">
        <TextInput
          className={`w-full px-4 h-14 bg-white dark:bg-[#1e1e1e] border ${
            error ? "border-red-500" : "border-gray-200 dark:border-gray-800"
          } rounded-lg text-background-dark dark:text-white ${
            isPassword ? "pr-12" : ""
          }`}
          placeholderTextColor="#9ca3af"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-xs px-1">{error}</Text>}
    </View>
  );
}
