import Colors from "@/constants/Colors";
import ExpenseHistoryScreen from "@/features/expense-tracker/screens/ExpenseHistoryScreen";
import SummaryScreen from "@/features/expense-tracker/screens/SummaryScreen";
import SettingsScreen from "@/features/settings/screens/SettingsScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "react-native";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarStyle: {
          backgroundColor: themeColors.navBackground,
          borderTopColor: themeColors.border,
          borderTopWidth: 1,
          paddingBottom: 12,
          paddingTop: 12,
          height: 90,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: themeColors.iconColour,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: themeColors.navBackground,
          borderBottomColor: themeColors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: themeColors.text,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "history") {
            iconName = focused ? "history" : "history";
          } else if (route.name === "summary") {
            iconName = focused ? "chart-pie" : "chart-pie";
          } else if (route.name === "settings") {
            iconName = focused ? "cog" : "cog-outline";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen
        name="history"
        component={ExpenseHistoryScreen}
        options={{
          title: "History",
        }}
      />
      <Tab.Screen
        name="summary"
        component={SummaryScreen}
        options={{
          title: "Summary",
        }}
      />
      <Tab.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
    </Tab.Navigator>
  );
}
