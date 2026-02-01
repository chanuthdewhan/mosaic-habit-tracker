import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";

// Keep splash screen visible until fonts are ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  // Load Inter font family before rendering
  const [fontsLoaded, error] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  // Stop rendering if fonts fail to load
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide splash screen once fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Wait for fonts before showing app
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1" style={{ marginTop: insets.top }}>
      {/* Set status bar style based on theme */}
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      {/* Renders current route */}
      <Slot />
    </View>
  );
}
