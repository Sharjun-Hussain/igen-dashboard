"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState("LKR");
    const [symbol, setSymbol] = useState("Rs.");

    useEffect(() => {
        const savedCurrency = localStorage.getItem("app_currency");
        const savedSymbol = localStorage.getItem("app_currency_symbol");
        if (savedCurrency) setCurrency(savedCurrency);
        if (savedSymbol) setSymbol(savedSymbol);
    }, []);

    const updateCurrency = (code, sym) => {
        setCurrency(code);
        setSymbol(sym);
        localStorage.setItem("app_currency", code);
        localStorage.setItem("app_currency_symbol", sym);
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
