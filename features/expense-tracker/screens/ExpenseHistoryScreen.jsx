import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import Spacer from "@/components/ui/Spacer";

export default function ExpenseHistoryScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText title style={styles.heading}>
            Expense History
          </ThemedText>

          <Spacer height={20} />

          <ThemedText style={styles.description}>
            Your expense history will appear here. Track all your transactions in one place.
          </ThemedText>

          <Spacer height={30} />

          <ThemedText style={styles.placeholder}>
            No expenses recorded yet. Start by adding your first expense!
          </ThemedText>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  placeholder: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
});
