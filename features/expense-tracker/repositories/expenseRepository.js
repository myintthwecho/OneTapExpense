import { db } from "@/services/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

export async function createExpense(userId, expenseInput) {
  const now = new Date().toISOString();
  const expensesRef = collection(db, "users", userId, "expenses");

  const payload = {
    userId,
    ...expenseInput,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(expensesRef, payload);
  return { id: docRef.id, ...payload };
}

export async function updateExpense(userId, expenseId, expenseInput) {
  const expenseRef = doc(db, "users", userId, "expenses", expenseId);

  const payload = {
    ...expenseInput,
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(expenseRef, payload);
  return payload;
}

const expenseRepository = {
  createExpense,
  updateExpense,
};

export default expenseRepository;
