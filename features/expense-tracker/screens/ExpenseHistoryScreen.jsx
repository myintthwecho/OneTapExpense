import PrimaryButton from "@/components/ui/PrimaryButton";
import Spacer from "@/components/ui/Spacer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { db } from "@/services/firebase";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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

const formatExpenseDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  if (dateOnly.getTime() === todayOnly.getTime()) return "Today";
  if (dateOnly.getTime() === yesterdayOnly.getTime()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function ExpenseHistoryScreen() {
  const router = useRouter();
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

  const dummyExpenses =
    expenses.length > 0
      ? expenses
      : [
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

  const handleEditExpense = (expense) => {
    router.push({
      pathname: "/add-expense",
      params: {
        expenseId: expense.id,
        amount: expense.amount.toString(),
        category: expense.category,
        note: expense.note || "",
        date: expense.date,
      },
    });
  };

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(
                doc(db, "users", user.uid, "expenses", expenseId),
              );
            } catch (error) {
              console.error("Error deleting expense:", error);
              Alert.alert(
                "Error",
                "Failed to delete expense. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {expenses.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 100,
                }}
              >
                <ThemedText style={{ fontSize: 16, textAlign: "center" }}>
                  No expenses yet.{"\n"}Tap below to add one!
                </ThemedText>
              </View>
            ) : (
              expenses.map((expense) => (
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
                      <ThemedText style={styles.emoji}>
                        {categoryMap[expense.category] || "📝"}
                      </ThemedText>
                      <ThemedText style={styles.categoryName}>
                        {expense.category}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.amount}>
                      ฿{expense.amount.toFixed(2)}
                    </ThemedText>
                  </View>
                  <View style={styles.cardDivider} />
                  <View style={styles.cardRow}>
                    <ThemedText style={styles.note}>
                      {expense.note || "No note"}
                    </ThemedText>
                    <ThemedText style={styles.date}>
                      {formatExpenseDate(expense.date)}
                    </ThemedText>
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { borderColor: themeColors.border },
                      ]}
                      onPress={() => handleEditExpense(expense)}
                    >
                      <ThemedText style={styles.actionText}>✏️ Edit</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteExpense(expense.id)}
                    >
                      <ThemedText
                        style={[styles.actionText, { color: "#FF7B7B" }]}
                      >
                        🗑️ Delete
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            <Spacer height={100} />
          </ScrollView>
        )}

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
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    borderColor: "#FF7B7B",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
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
