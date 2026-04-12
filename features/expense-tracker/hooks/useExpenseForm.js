import expenseRepository from "@/features/expense-tracker/repositories/expenseRepository";
import { validateExpenseForm } from "@/features/expense-tracker/validation/expenseValidation";
import { useEffect, useMemo, useRef, useState } from "react";

function parseDateInput(rawDate) {
  if (!rawDate) {
    return new Date();
  }

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
}

function createExpenseInput({ amount, selectedCategory, note, selectedDate, parsedAmount }) {
  return {
    amount: parsedAmount,
    category: selectedCategory,
    note: note || "",
    date: selectedDate.toISOString(),
  };
}

export default function useExpenseForm({ params, user, onSaved }) {
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const hasInitialized = useRef(false);
  const isEditMode = Boolean(params?.expenseId);

  useEffect(() => {
    hasInitialized.current = false;
  }, [params?.expenseId]);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    if (isEditMode) {
      setAmount(params?.amount || "");
      setSelectedCategory(params?.category || null);
      setNote(params?.note || "");
      setSelectedDate(parseDateInput(params?.date));
    } else {
      setAmount("");
      setSelectedCategory(null);
      setNote("");
      setSelectedDate(new Date());
    }

    setErrors({});
    hasInitialized.current = true;
  }, [isEditMode, params]);

  const canSubmit = useMemo(() => {
    return !isSaving && Boolean(amount) && Boolean(selectedCategory);
  }, [isSaving, amount, selectedCategory]);

  const submitLabel = isSaving
    ? "Saving..."
    : isEditMode
      ? "Update Expense"
      : "Save Expense";

  const openDatePicker = () => {
    setShowPicker(true);
  };

  const handleDateChange = (nextDate, { shouldClosePicker = false } = {}) => {
    if (shouldClosePicker) {
      setShowPicker(false);
    }

    if (nextDate) {
      setSelectedDate(nextDate);
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const submit = async () => {
    if (!user?.uid) {
      return;
    }

    const { isValid, errors: nextErrors, parsedAmount } = validateExpenseForm({
      amount,
      selectedCategory,
      selectedDate,
    });

    if (!isValid) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSaving(true);
      setErrors({});

      const expenseInput = createExpenseInput({
        amount,
        selectedCategory,
        note,
        selectedDate,
        parsedAmount,
      });

      if (isEditMode && params?.expenseId) {
        await expenseRepository.updateExpense(user.uid, params.expenseId, expenseInput);
      } else {
        await expenseRepository.createExpense(user.uid, expenseInput);
      }

      onSaved?.();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error?.message || "Failed to save expense.",
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    amount,
    selectedCategory,
    note,
    selectedDate,
    showPicker,
    isSaving,
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
  };
}
