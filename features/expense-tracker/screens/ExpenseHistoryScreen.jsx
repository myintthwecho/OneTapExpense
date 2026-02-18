import PrimaryButton from "@/components/ui/PrimaryButton";
import Spacer from "@/components/ui/Spacer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

export default function ExpenseHistoryScreen() {
  const router = useRouter();

  const handleOpenAddExpense = () => {
    router.push("/add-expense");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText title style={styles.heading}>
            Expense History
          </ThemedText>

          <Spacer height={20} />

          <ThemedText style={styles.description}>
            Your expense history will appear here. Track all your transactions
            in one place.
          </ThemedText>

          <Spacer height={30} />

          <ThemedText style={styles.placeholder}>
            No expenses recorded yet. Start by adding your first expense!
          </ThemedText>
        </ScrollView>

        {/* Add Expense Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton title="+ Add Expense" onPress={handleOpenAddExpense} />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 12,
  },
});
