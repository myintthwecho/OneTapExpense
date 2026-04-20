import { useAuth } from "@/features/auth/context/AuthContext";
import {
  buildCurrencyStorageKey,
  DEFAULT_CURRENCY_CODE,
  getCurrencyOption,
} from "@/utils/currency";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CurrencyContext = createContext(undefined);

export function CurrencyProvider({ children }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY_CODE);
  const [isLoading, setIsLoading] = useState(true);

  const storageKey = useMemo(
    () => buildCurrencyStorageKey(user?.uid),
    [user?.uid],
  );

  useEffect(() => {
    let isActive = true;

    const loadCurrencyPreference = async () => {
      if (isAuthLoading) {
        return;
      }

      if (!user?.uid) {
        setCurrencyCode(DEFAULT_CURRENCY_CODE);
        setIsLoading(false);
        return;
      }

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
  }, [isAuthLoading, storageKey, user?.uid]);

  const setCurrencyPreference = async (nextCurrencyCode) => {
    const resolvedCurrencyCode = getCurrencyOption(nextCurrencyCode)
      ? nextCurrencyCode
      : DEFAULT_CURRENCY_CODE;

    setCurrencyCode(resolvedCurrencyCode);

    if (!user?.uid) {
      return;
    }

    try {
      await AsyncStorage.setItem(storageKey, resolvedCurrencyCode);
    } catch {
      // Keep the in-memory preference if persistence fails.
    }
  };

  const currency = getCurrencyOption(currencyCode) ||
    getCurrencyOption(DEFAULT_CURRENCY_CODE);

  const value = useMemo(
    () => ({
      currencyCode,
      currency,
      isLoading,
      setCurrencyPreference,
    }),
    [currencyCode, currency, isLoading],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrencyPreference() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrencyPreference must be used inside CurrencyProvider");
  }

  return context;
}
