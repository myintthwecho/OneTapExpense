import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCurrencyPreference } from "@/features/currency/context/CurrencyContext";
import { db } from "@/services/firebase";
import { formatCurrencyAmount } from "@/utils/currency";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
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
  const { currencyCode } = useCurrencyPreference(user?.uid);
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

  const monthlySummaries = useMemo(() => {
    const referenceDate = new Date();

    return [0, 1, 2].map((offset) => {
      const monthDate = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth() - offset,
        1,
      );
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();

      const monthExpenses = expenses.filter((expense) => {
        const date = parseExpenseDate(expense.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });

      const categoryTotals = monthExpenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = {
            amount: 0,
            emoji: categoryMap[expense.category] || "📝",
          };
        }
        acc[expense.category].amount += Number(expense.amount);
        return acc;
      }, {});

      return {
        key: `${year}-${month}`,
        label:
          offset === 0
            ? "This Month"
            : offset === 1
              ? "Previous Month"
              : "2 Months Ago",
        monthLabel: monthDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        total: monthExpenses
          .reduce((sum, expense) => sum + Number(expense.amount), 0)
          .toFixed(2),
        categoryRows: Object.entries(categoryTotals).map(
          ([category, data]) => ({
            category,
            emoji: data.emoji,
            amount: data.amount.toFixed(2),
          }),
        ),
      };
    });
  }, [expenses]);

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
            <ThemedText style={styles.pageTitle}>
              Last 3 Months Summary
            </ThemedText>

            {monthlySummaries.map((summary) => (
              <View key={summary.key} style={styles.monthSection}>
                <ThemedText style={styles.sectionTitle}>
                  {summary.label} - {summary.monthLabel}
                </ThemedText>

                <View
                  style={[
                    styles.totalCard,
                    {
                      borderColor: themeColors.border,
                      backgroundColor: themeColors.cardBackground,
                    },
                  ]}
                >
                  <ThemedText style={styles.totalLabel}>Total Spent</ThemedText>
                  <ThemedText style={styles.totalAmount}>
                    {formatCurrencyAmount(summary.total, currencyCode)}
                  </ThemedText>
                </View>

                <ThemedText style={styles.byCategoryLabel}>
                  By Category
                </ThemedText>

                {summary.categoryRows.length === 0 ? (
                  <View
                    style={[
                      styles.emptyStateCard,
                      {
                        borderColor: themeColors.border,
                        backgroundColor: themeColors.cardBackground,
                      },
                    ]}
                  >
                    <ThemedText style={styles.emptyStateText}>
                      No expenses recorded for this month.
                    </ThemedText>
                  </View>
                ) : (
                  summary.categoryRows.map((row) => (
                    <View
                      key={`${summary.key}-${row.category}`}
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
                        {formatCurrencyAmount(row.amount, currencyCode)}
                      </ThemedText>
                    </View>
                  ))
                )}
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
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
  },
  monthSection: {
    marginBottom: 24,
  },
  totalCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 10,
  },
  byCategoryLabel: {
    fontSize: 13,
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
  emptyStateCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  emptyStateText: {
    fontSize: 13,
  },
});
