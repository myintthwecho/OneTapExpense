import PrimaryButton from "@/components/ui/PrimaryButton";
import Spacer from "@/components/ui/Spacer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExpenseHistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;
  //dummpy expenses for testing, will be replaced with real data from storage in future iterations
  const dummyExpenses = [
    {
      id: 1,
      category: "food",
      emoji: "🍜",
      amount: "12.50",
      date: "Today",
      note: "Lunch at cafe",
    },
    {
      id: 2,
      category: "transport",
      emoji: "🚆",
      amount: "5.00",
      date: "Today",
      note: "Bus fare",
    },
    {
      id: 3,
      category: "entertainment",
      emoji: "🎮",
      amount: "15.99",
      date: "Yesterday",
      note: "Movie ticket",
    },
    {
      id: 4,
      category: "bills",
      emoji: "💡",
      amount: "45.00",
      date: "Feb 17",
      note: "Electric bill",
    },
    {
      id: 5,
      category: "food",
      emoji: "🍜",
      amount: "8.75",
      date: "Feb 17",
      note: "Dinner",
    },
    {
      id: 6,
      category: "transport",
      emoji: "🚆",
      amount: "3.50",
      date: "Feb 16",
      note: "Train ticket",
    },
    {
      id: 7,
      category: "entertainment",
      emoji: "🎮",
      amount: "25.00",
      date: "Feb 16",
      note: "Concert ticket",
    },
    {
      id: 8,
      category: "food",
      emoji: "🍜",
      amount: "6.25",
      date: "Feb 15",
      note: "Breakfast",
    },
    {
      id: 9,
      category: "bills",
      emoji: "💡",
      amount: "20.00",
      date: "Feb 15",
      note: "Internet bill",
    },
    {
      id: 10,
      category: "transport",
      emoji: "🚆",
      amount: "4.50",
      date: "Feb 14",
      note: "Taxi",
    },
    {
      id: 11,
      category: "entertainment",
      emoji: "🎮",
      amount: "12.00",
      date: "Feb 14",
      note: "Game purchase",
    },
    {
      id: 12,
      category: "food",
      emoji: "🍜",
      amount: "22.00",
      date: "Feb 13",
      note: "Dinner with friends",
    },
  ];

  const handleOpenAddExpense = () => {
    router.push("/add-expense");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* <ThemedText title style={styles.heading}>
            Expense History
          </ThemedText> */}

          {/* Expense Cards */}
          {dummyExpenses.map((expense) => (
            <View
              key={expense.id}
              style={[
                styles.expenseCard,
                {
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.cardBackground,
                },
              ]}
            >
              <View style={styles.cardRow}>
                <View style={styles.categorySection}>
                  <ThemedText style={styles.emoji}>{expense.emoji}</ThemedText>
                  <ThemedText style={styles.categoryName}>
                    {expense.category}
                  </ThemedText>
                </View>
                <ThemedText style={styles.amount}>฿{expense.amount}</ThemedText>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardRow}>
                <ThemedText style={styles.note}>{expense.note}</ThemedText>
                <ThemedText style={styles.date}>{expense.date}</ThemedText>
              </View>
            </View>
          ))}

          <Spacer height={100} />
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
  expenseCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categorySection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  emoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 8,
  },
  note: {
    fontSize: 13,
    flex: 1,
  },
  date: {
    fontSize: 12,
    marginLeft: 6,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    paddingTop: 12,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
});
