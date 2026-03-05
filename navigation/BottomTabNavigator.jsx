import Colors from "@/constants/Colors";
import ExpenseHistoryScreen from "@/features/expense-tracker/screens/ExpenseHistoryScreen";
import SummaryScreen from "@/features/expense-tracker/screens/SummaryScreen";
import SettingsScreen from "@/features/settings/screens/SettingsScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, useColorScheme } from "react-native";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.navBackground,
          borderTopColor: themeColors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.select({ web: 8, default: 12 }),
          paddingTop: Platform.select({ web: 8, default: 12 }),
          height: Platform.select({ web: 70, default: 90 }),
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: themeColors.iconColour,
        tabBarLabelStyle: {
          fontSize: Platform.select({ web: 14, default: 12 }),
          fontWeight: "600",
          marginTop: Platform.select({ web: 2, default: 4 }),
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

          // Increase icon size on web for better visibility
          const iconSize = Platform.select({ web: size + 4, default: size });

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={iconSize}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="history"
        component={ExpenseHistoryScreen}
        options={{ tabBarLabel: "History" }}
      />
      <Tab.Screen
        name="summary"
        component={SummaryScreen}
        options={{ tabBarLabel: "Summary" }}
      />
      <Tab.Screen
        name="settings"
        component={SettingsScreen}
        options={{ tabBarLabel: "Settings" }}
      />
    </Tab.Navigator>
  );
}
