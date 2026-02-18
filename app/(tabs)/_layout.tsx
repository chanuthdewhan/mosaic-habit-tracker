import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const tabs = [
  { name: "index", title: "Today", icon: "dashboard" },
  { name: "profile", title: "Profile", icon: "person" },
] as const;

const DashboardLayout = () => {
  return (
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
  );
};

export default DashboardLayout;
