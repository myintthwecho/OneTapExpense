import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native";
import { useColorScheme } from "react-native";

export default function SummaryScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
        <ThemedText title style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
          Summary
        </ThemedText>
        <ThemedText style={{ fontSize: 16, textAlign: "center" }}>
          Expense summary and analytics coming soon...
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
