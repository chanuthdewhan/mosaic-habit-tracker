import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" />

      <Stack.Screen
        name="sign-in"
        options={{
          title: "Sign In",
        }}
      />

      <Stack.Screen
        name="sign-up"
        options={{
          title: "Sign Up",
        }}
      />
    </Stack>
  );
}
