import {
    buildCurrencyStorageKey,
    DEFAULT_CURRENCY_CODE,
    getCurrencyOption,
} from "@/utils/currency";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";

export default function useCurrencyPreference(userId) {
  const storageKey = useMemo(() => buildCurrencyStorageKey(userId), [userId]);
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY_CODE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadCurrencyPreference = async () => {
      setIsLoading(true);

      try {
        const savedCurrencyCode = await AsyncStorage.getItem(storageKey);

        if (!isActive) {
          return;
        }

        if (getCurrencyOption(savedCurrencyCode)) {
          setCurrencyCode(savedCurrencyCode);
        } else {
          setCurrencyCode(DEFAULT_CURRENCY_CODE);
        }
      } catch {
        if (isActive) {
          setCurrencyCode(DEFAULT_CURRENCY_CODE);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadCurrencyPreference();

    return () => {
      isActive = false;
    };
  }, [storageKey]);

  const setCurrencyPreference = async (nextCurrencyCode) => {
    const resolvedCurrencyCode = getCurrencyOption(nextCurrencyCode)
      ? nextCurrencyCode
      : DEFAULT_CURRENCY_CODE;

    setCurrencyCode(resolvedCurrencyCode);

    try {
      await AsyncStorage.setItem(storageKey, resolvedCurrencyCode);
    } catch {
      // Ignore storage write failures and keep the in-memory preference.
    }
  };

  const currency = getCurrencyOption(currencyCode) || getCurrencyOption(DEFAULT_CURRENCY_CODE);

  return {
    currencyCode,
    currency,
    isLoading,
    setCurrencyPreference,
  };
}
