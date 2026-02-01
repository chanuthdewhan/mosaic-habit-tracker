import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
}

export const Input = ({ label, isPassword, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-col gap-2 mb-4">
      <Text className="text-background-dark dark:text-gray-200 text-sm font-semibold px-1">
        {label}
      </Text>
      <View className="relative">
        <TextInput
          className="w-full px-4 h-14 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg text-background-dark dark:text-white focus:border-primary"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
