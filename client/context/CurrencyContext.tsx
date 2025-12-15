"use client";
import { getCurrencies } from "@/lib/apis/currency";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Currency {
  id: number;
  name: string;
  symbol: string;
  exchangeRate: number;
}

interface CurrencyContextType {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  changeCurrency: (currency: Currency) => void;
  convertPrice: (price: number) => number;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );

  // Persist choice in local storage or cookie.
  // Simple approach: LocalStorage or Default to first one found.

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const res = await getCurrencies();
      if (res.success && res.data.length > 0) {
        setCurrencies(res.data);

        // Load from local storage
        const saved = localStorage.getItem("selectedCurrency");
        if (saved) {
          const parsed = JSON.parse(saved);
          // Verify it exists in new list
          const found = res.data.find((c: Currency) => c.id === parsed.id);
          setSelectedCurrency(
            found ||
            res.data.find((c: Currency) => c.exchangeRate === 1) ||
            res.data[0]
          );
        } else {
          const defaultCyp =
            res.data.find((c: Currency) => c.exchangeRate === 1) || res.data[0];
          setSelectedCurrency(defaultCyp);
        }
      }
    } catch (error) {
      console.error("Failed to fetch currencies", error);
    }
  };

  const changeCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem("selectedCurrency", JSON.stringify(currency));
  };

  const convertPrice = (price: number) => {
    if (!selectedCurrency || selectedCurrency.exchangeRate === 0) return price;
    // Assuming exchangeRate is "How many Base Units are in 1 Selected Unit" (e.g. 1 USD = 121 BDT)
    // And store prices are in Base Units (BDT).
    // So converted = price / exchangeRate
    return price / selectedCurrency.exchangeRate;
  };

  const formatPrice = (price: number) => {
    if (!selectedCurrency) return price.toString();
    const converted = convertPrice(price);
    return `${selectedCurrency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        selectedCurrency,
        changeCurrency,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
