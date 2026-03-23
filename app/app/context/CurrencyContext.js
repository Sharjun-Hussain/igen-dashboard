"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const { data: session } = useSession();
    const [currency, setCurrency] = useState("LKR");
    const [symbol, setSymbol] = useState("Rs.");

    const getUserKey = (baseKey) => {
        return session?.user?.id ? `${baseKey}_${session.user.id}` : baseKey;
    };

    useEffect(() => {
        if (!session?.user?.id) return;
        const savedCurrency = localStorage.getItem(getUserKey("app_currency"));
        const savedSymbol = localStorage.getItem(getUserKey("app_currency_symbol"));
        if (savedCurrency) setCurrency(savedCurrency);
        if (savedSymbol) setSymbol(savedSymbol);
    }, [session]);

    const updateCurrency = (code, sym) => {
        setCurrency(code);
        setSymbol(sym);
        if (session?.user?.id) {
            localStorage.setItem(getUserKey("app_currency"), code);
            localStorage.setItem(getUserKey("app_currency_symbol"), sym);
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, symbol, updateCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
};
