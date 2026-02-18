import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";

// Keep splash screen visible until fonts are ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  // State to track when AsyncStorage is finished
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

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

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("appTheme");
        if (savedTheme === "light" || savedTheme === "dark") {
          setColorScheme(savedTheme);
        }
      } catch (error) {
        console.error("Error loading theme from AsyncStorage:", error);
      } finally {
        setIsThemeLoaded(true);
      }
    };

    loadTheme();
  }, []);

  // Hide splash screen once fonts and themes are ready
  useEffect(() => {
    if (fontsLoaded && isThemeLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isThemeLoaded]);

  // Wait for fonts and theme before showing app
  if (!fontsLoaded || !isThemeLoaded) {
    return null;
  }

  return (
    <LoaderProvider>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <View
            className="flex-1 bg-background-light dark:bg-background-dark"
            style={{ marginTop: insets.top }}
          >
            {/* Set status bar style based on theme */}
            <StatusBar
              style={colorScheme === "dark" ? "light" : "dark"}
              backgroundColor={colorScheme === "dark" ? "#121212" : "#f8f7f5"}
            />
            {/* Renders current route */}
            <Slot />
          </View>
        </ThemeProvider>
      </AuthProvider>
    </LoaderProvider>
  );
}
