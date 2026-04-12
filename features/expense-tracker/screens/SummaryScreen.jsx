import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { db } from "@/services/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const categoryMap = {
  food: "🍜",
  transport: "🚆",
  entertainment: "🎮",
  bills: "💡",
};

export default function SummaryScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const expensesRef = collection(db, "users", user.uid, "expenses");
    const q = query(expensesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedExpenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(loadedExpenses);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const parseExpenseDate = (dateString) => {
    return new Date(dateString);
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses.filter((expense) => {
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
      acc[expense.category] = {
        amount: 0,
        emoji: categoryMap[expense.category] || "📝",
      };
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
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
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
        )}
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
