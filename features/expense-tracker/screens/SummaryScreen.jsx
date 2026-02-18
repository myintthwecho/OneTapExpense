import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SummaryScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

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

  const parseExpenseDate = (dateLabel) => {
    const today = new Date();

    if (dateLabel === "Today") return today;
    if (dateLabel === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday;
    }

    const parsed = new Date(`${dateLabel} ${today.getFullYear()}`);
    return Number.isNaN(parsed.getTime()) ? today : parsed;
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = dummyExpenses.filter((expense) => {
    const date = parseExpenseDate(expense.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const totalThisMonth = monthlyExpenses
    .reduce((sum, expense) => sum + Number(expense.amount), 0)
    .toFixed(2);

  const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = { amount: 0, emoji: expense.emoji };
    }
    acc[expense.category].amount += Number(expense.amount);
    return acc;
  }, {});

  const categoryRows = Object.entries(categoryTotals).map(
    ([category, data]) => ({
      category,
      emoji: data.emoji,
      amount: data.amount.toFixed(2),
    }),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View
            style={[
              styles.totalCard,
              {
                borderColor: themeColors.border,
                backgroundColor: themeColors.cardBackground,
              },
            ]}
          >
            <ThemedText style={styles.totalLabel}>
              Total Spent This Month
            </ThemedText>
            <ThemedText style={styles.totalAmount}>
              ฿{totalThisMonth}
            </ThemedText>
          </View>

          <ThemedText style={styles.sectionTitle}>By Category</ThemedText>

          {categoryRows.map((row) => (
            <View
              key={row.category}
              style={[
                styles.categoryCard,
                {
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.cardBackground,
                },
              ]}
            >
              <View style={styles.categoryLeft}>
                <ThemedText style={styles.categoryEmoji}>
                  {row.emoji}
                </ThemedText>
                <ThemedText style={styles.categoryName}>
                  {row.category}
                </ThemedText>
              </View>
              <ThemedText style={styles.categoryAmount}>
                ฿{row.amount}
              </ThemedText>
            </View>
          ))}
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  totalCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  categoryCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
