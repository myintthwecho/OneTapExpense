import PrimaryButton from "@/components/ui/PrimaryButton";
import Spacer from "@/components/ui/Spacer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import useExpenseForm from "@/features/expense-tracker/hooks/useExpenseForm";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
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
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

  const handleSaved = useCallback(() => {
    router.back();
  }, [router]);

  const {
    amount,
    selectedCategory,
    note,
    selectedDate,
    showPicker,
    isEditMode,
    submitLabel,
    canSubmit,
    errors,
    setAmount,
    setSelectedCategory,
    setNote,
    openDatePicker,
    handleDateChange,
    setShowPicker,
    submit,
  } = useExpenseForm({ params, user, onSaved: handleSaved });

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
          {!!errors.amount && (
            <ThemedText style={styles.errorText}>{errors.amount}</ThemedText>
          )}

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
          {!!errors.category && (
            <ThemedText style={styles.errorText}>{errors.category}</ThemedText>
          )}

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
            onPress={openDatePicker}
          >
            <ThemedText style={styles.dateButtonText}>
              {formatDate(selectedDate)}
            </ThemedText>
          </TouchableOpacity>
          {!!errors.date && (
            <ThemedText style={styles.errorText}>{errors.date}</ThemedText>
          )}

          {!!errors.submit && (
            <>
              <Spacer height={12} />
              <ThemedText style={styles.errorText}>{errors.submit}</ThemedText>
            </>
          )}

          <Spacer height={32} />

          {/* Save Button */}
          <PrimaryButton
            title={submitLabel}
            onPress={submit}
            disabled={!canSubmit}
          />
        </ScrollView>
      </ThemedView>

      {/* Date/Time Picker */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            if (Platform.OS === "android") {
              setShowPicker(false);
            }

            if (date) {
              handleDateChange(date, {
                shouldClosePicker: Platform.OS === "android",
              });
            }
          }}
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
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: "#d93025",
  },
});
