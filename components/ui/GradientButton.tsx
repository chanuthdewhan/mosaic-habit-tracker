import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
}

export const GradientButton = ({ title, ...props }: GradientButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      {...props}
      className="shadow-lg shadow-primary/20 mt-4"
    >
      <LinearGradient
        colors={["#f48c25", "#e67e15"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full h-14 rounded-lg items-center justify-center"
      >
        <Text className="text-white font-bold text-lg">{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
