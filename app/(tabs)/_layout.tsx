import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, useRouter, useSegments } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
  { name: "index", title: "Today", icon: "dashboard" },
  { name: "analytics", title: "Analytics", icon: "bar-chart" },
  { name: "(habits)", title: "Habits", icon: "checklist" },
  { name: "profile", title: "Profile", icon: "person" },
] as const;

const DashboardLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  // Hide FAB on profile screen
  const currentTab = segments[segments.length - 1];
  const showFAB = currentTab !== "profile";

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#f48c25",
        }}
      >
        {tabs.map(({ name, title, icon }: any) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title: title,
              tabBarStyle: name === "profile" ? { display: "none" } : undefined,
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name={icon} size={size} color={color} />
              ),
            }}
          />
        ))}
      </Tabs>

      {showFAB && (
        <TouchableOpacity
          onPress={() => router.push("/add-habit")}
          style={{
            position: "absolute",
            bottom: insets.bottom + 20,
            alignSelf: "center",
            width: 50,
            height: 50,
            borderRadius: 30,
            backgroundColor: "#f48c25",
            justifyContent: "center",
            alignItems: "center",
            elevation: 8,
            shadowColor: "#f48c25",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
          }}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DashboardLayout;
