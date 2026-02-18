import SettingsIconBox from "@/components/settings/SettingsIconBox";
import SettingsListItem from "@/components/settings/SettingsListItem";
import SettingsSection from "@/components/settings/SettingsSection";
import { useAuth } from "@/hooks/useAuth";
import { useLoader } from "@/hooks/useLoader";
import { logout } from "@/services/authService";
import { getUserData } from "@/services/userService";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * ProfileScreen shows user info and app settings.
 * Covers preferences, account actions, and logout.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useColorScheme();
  const { isLoading, showLoader, hideLoader } = useLoader();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [statsWidget, setStatsWidget] = useState(false);

  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user?.uid) {
      getUserData(user.uid).then(setUserData);
    }
  }, [user?.uid]);

  const handleToggleTheme = async () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";

    setColorScheme(newTheme);

    try {
      await AsyncStorage.setItem("appTheme", newTheme);
    } catch (error) {
      console.error("Error saving theme to AsyncStorage:", error);
    }
  };

  // Confirm before logging out, then clear session and redirect
  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          if (isLoading) return; // prevent double taps
          try {
            showLoader();
            await logout();
            router.replace("/(auth)");
          } catch (error) {
            Alert.alert("Error", "Failed to log out. Please try again.");
          } finally {
            hideLoader();
          }
        },
      },
    ]);
  };

  // TODO: wire up actual account deletion endpoint
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {} },
      ],
    );
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <View className="flex-row items-center px-4 py-3 justify-between border-b border-gray-200 dark:border-white/5 bg-background-light/80 dark:bg-background-dark/80">
        <TouchableOpacity
          onPress={() => router.back()}
          className="size-10 items-center justify-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === "dark" ? "#ffffff" : "#111827"}
          />
        </TouchableOpacity>
        <Text className="text-gray-900 dark:text-white text-lg font-bold flex-1 text-center">
          Profile &amp; Settings
        </Text>
        {/* balances the back button so the title stays centered */}
        <View className="size-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        {/* Profile Header */}
        <View className="items-center px-8 pt-8 pb-4 gap-3">
          <View className="relative">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkWyE864Z9cKAF5RYYv3WG-xGFhI9swYTggjpVManyvTi7rJiLKBg4_du2TJW8y8UgOU_P0zzM_RfPRXiZTl3vp7Z1a-GSArlISLdAnEqtf1BEANJwS3m9ceQVubdU3DOWtmFj241fmEf_y4atjo9qc5pKPB9nSc11NHe1f7kITerrWeZuaO9Ehz4g8hLVBzGpa_anBSh3XbUKmo6Tgfg8Vkp_mP9lSL5t9FeqzEAuT0c6zhF8oR4NAdFoNkupkRuW-7fUQeXnt3w",
              }}
              className="w-32 h-32 rounded-full border-2 border-primary"
              resizeMode="cover"
            />
            {/* TODO: open image picker on press */}
            <TouchableOpacity
              className="absolute bottom-1 right-1 bg-primary p-1.5 rounded-full border-4 border-background-light dark:border-background-dark items-center justify-center"
              onPress={() => {}}
            >
              <Ionicons name="pencil" size={14} color="white" />
            </TouchableOpacity>
          </View>

          {/* hardcoded until user profile API is wired up */}
          <View className="items-center gap-1">
            <Text className="text-gray-900 dark:text-white text-2xl font-bold text-center">
              {userData
                ? `${userData.firstName} ${userData.lastName}`
                : (user?.displayName ?? "")}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-base text-center">
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Preferences */}
        <SettingsSection title="Preferences">
          <SettingsListItem
            icon={
              <SettingsIconBox variant="primary">
                <Ionicons
                  name={
                    colorScheme === "dark" ? "sunny-outline" : "moon-outline"
                  }
                  size={22}
                  color="#f48c25"
                />
              </SettingsIconBox>
            }
            label="Theme"
            rightValue={colorScheme === "dark" ? "Dark" : "Light"}
            onPress={handleToggleTheme}
          />
          <SettingsListItem
            icon={
              <SettingsIconBox variant="primary">
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#f48c25"
                />
              </SettingsIconBox>
            }
            label="Push Notifications"
            toggleValue={notificationsEnabled}
            onToggleChange={setNotificationsEnabled}
          />
          <SettingsListItem
            icon={
              <SettingsIconBox variant="primary">
                <Ionicons
                  name="phone-portrait-outline"
                  size={22}
                  color="#f48c25"
                />
              </SettingsIconBox>
            }
            label="Haptic Feedback"
            toggleValue={hapticEnabled}
            onToggleChange={setHapticEnabled}
          />
          <SettingsListItem
            icon={
              <SettingsIconBox variant="primary">
                <Ionicons name="analytics-outline" size={22} color="#f48c25" />
              </SettingsIconBox>
            }
            label="Show Stats Widget"
            toggleValue={statsWidget}
            onToggleChange={setStatsWidget}
            isLast
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account">
          <SettingsListItem
            icon={
              <SettingsIconBox variant="neutral">
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#9ca3af"
                />
              </SettingsIconBox>
            }
            label="Change Password"
            onPress={() => {}}
          />
          <SettingsListItem
            icon={
              <SettingsIconBox variant="neutral">
                <Ionicons name="share-outline" size={22} color="#9ca3af" />
              </SettingsIconBox>
            }
            label="Export Data"
            onPress={() => {}}
          />
          <SettingsListItem
            icon={
              <SettingsIconBox variant="destructive">
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </SettingsIconBox>
            }
            label="Delete Account"
            onPress={handleDeleteAccount}
            isLast
            destructive
          />
        </SettingsSection>

        <SettingsSection title="Login">
          <SettingsListItem
            icon={
              <SettingsIconBox variant="destructive">
                <Ionicons name="log-out-outline" size={22} color="#ef4444" />
              </SettingsIconBox>
            }
            label="Log Out"
            onPress={handleLogout}
            destructive
            showChevron={false}
            isLast
          />
        </SettingsSection>

        <View className="px-8 mt-12 items-center gap-4">
          <Text className="text-gray-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            Mosaic v2.4.1
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
