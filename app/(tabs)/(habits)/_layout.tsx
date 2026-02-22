import { Stack } from "expo-router";
import React from "react";

const HabbitLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Habit List" }} />
      <Stack.Screen name="[habitId]" options={{ title: "Habit Details" }} />
    </Stack>
  );
};

export default HabbitLayout;
