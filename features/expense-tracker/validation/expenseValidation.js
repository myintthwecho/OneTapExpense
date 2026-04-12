function parseAmount(amount) {
  if (!amount || typeof amount !== "string") {
    return null;
  }

  const normalized = amount.replace(/,/g, "").trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function validateExpenseForm({ amount, selectedCategory, selectedDate }) {
  const errors = {};
  const parsedAmount = parseAmount(amount);

  if (!parsedAmount) {
    errors.amount = "Enter a valid amount greater than 0.";
  }

  if (!selectedCategory) {
    errors.category = "Choose a category.";
  }

  if (!(selectedDate instanceof Date) || Number.isNaN(selectedDate.getTime())) {
    errors.date = "Choose a valid date.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    parsedAmount,
  };
}
