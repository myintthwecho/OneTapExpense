import PrimaryButton from "@/components/ui/PrimaryButton";
import Spacer from "@/components/ui/Spacer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { db } from "@/services/firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const categories = [
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "transport", label: "Transport", emoji: "🚆" },
  { id: "entertainment", label: "Entertainment", emoji: "🎮" },
  { id: "bills", label: "Bills", emoji: "💡" },
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

  const isEditMode = !!params.expenseId;

  useEffect(() => {
    if (isEditMode && params) {
      setAmount(params.amount || "");
      setSelectedCategory(params.category || null);
      setNote(params.note || "");
      if (params.date) {
        setSelectedDate(new Date(params.date));
      }
    }
  }, [isEditMode, params]);

  const formatDate = (date) => {
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
      year: "numeric",
    });
  };

  const [showPicker, setShowPicker] = useState(false);

  const handleDatePress = () => {
    setShowPicker(true);
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSaveExpense = async () => {
    if (!amount || !selectedCategory || !user) {
      return;
    }

    try {
      setIsSaving(true);
      const now = new Date().toISOString();

      if (isEditMode && params.expenseId) {
        const expenseRef = doc(
          db,
          "users",
          user.uid,
          "expenses",
          params.expenseId,
        );

        // Wait for update to complete
        await updateDoc(expenseRef, {
          amount: parseFloat(amount),
          category: selectedCategory,
          note: note || "",
          date: selectedDate.toISOString(),
          updatedAt: now,
        });

        // Navigate back after successful save
        router.back();
      } else {
        const expensesRef = collection(db, "users", user.uid, "expenses");

        // Wait for save to complete
        await addDoc(expensesRef, {
          userId: user.uid,
          amount: parseFloat(amount),
          category: selectedCategory,
          note: note || "",
          date: selectedDate.toISOString(),
          createdAt: now,
          updatedAt: now,
        });

        // Navigate back after successful save
        router.back();
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Bottom Card Panel */}
      <ThemedView
        style={[
          styles.cardPanel,
          { borderWidth: 1, borderColor: themeColors.border },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <ThemedText title style={styles.title}>
            {isEditMode ? "Edit Expense" : "Add Expense"}
          </ThemedText>

          <Spacer height={24} />

          {/* Amount Input */}
          <ThemedText style={styles.label}>Amount</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.inputBackground,
              },
            ]}
            placeholder="0.00"
            placeholderTextColor={themeColors.iconColour}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Spacer height={24} />

          {/* Note Input */}
          <ThemedText style={styles.label}>Note (Optional)</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.inputBackground,
              },
            ]}
            placeholder="Add a note..."
            placeholderTextColor={themeColors.iconColour}
            value={note}
            onChangeText={setNote}
          />

          <Spacer height={24} />

          {/* Category Section */}
          <ThemedText style={styles.label}>Choose Category</ThemedText>

          <Spacer height={12} />

          {/* Category Buttons */}
          <View style={styles.categoryGrid}>
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;

              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: isSelected
                        ? Colors.primary
                        : themeColors.cardBackground,
                      borderColor: isSelected
                        ? Colors.primary
                        : themeColors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <ThemedText
                    title={isSelected}
                    style={[
                      styles.categoryEmoji,
                      isSelected && { color: "#FFFFFF" },
                    ]}
                  >
                    {category.emoji}
                  </ThemedText>
                  <ThemedText
                    title={isSelected}
                    style={[
                      styles.categoryLabel,
                      isSelected && { color: "#FFFFFF" },
                    ]}
                  >
                    {category.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          <Spacer height={24} />

          {/* Date Button */}
          <ThemedText style={styles.label}>Date</ThemedText>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                borderColor: themeColors.border,
                backgroundColor: themeColors.inputBackground,
              },
            ]}
            onPress={handleDatePress}
          >
            <ThemedText style={styles.dateButtonText}>
              {formatDate(selectedDate)}
            </ThemedText>
          </TouchableOpacity>

          <Spacer height={32} />

          {/* Save Button */}
          <PrimaryButton
            title={
              isSaving
                ? "Saving..."
                : isEditMode
                  ? "Update Expense"
                  : "Save Expense"
            }
            onPress={handleSaveExpense}
            disabled={isSaving || !amount || !selectedCategory}
          />
        </ScrollView>
      </ThemedView>

      {/* Date/Time Picker */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardPanel: {
    height: "70%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "500",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  categoryButton: {
    width: "48%",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "500",
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
