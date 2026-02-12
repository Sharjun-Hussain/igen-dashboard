"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDebounce } from "../hooks/useDebounce";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [results, setResults] = useState({
        products: [],
        categories: [],
        brands: [],
        coupons: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
                setResults({ products: [], categories: [], brands: [], coupons: [] });
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const token = session?.accessToken;
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

                if (!token) return;

                // Fetch from multiple endpoints in parallel
                const [prodRes, catRes, brandRes, couponRes] = await Promise.all([
                    fetch(`${baseUrl}/admin/products?search=${debouncedSearchTerm}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((r) => r.json()),
                    fetch(`${baseUrl}/admin/categories?search=${debouncedSearchTerm}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((r) => r.json()),
                    fetch(`${baseUrl}/admin/brands?search=${debouncedSearchTerm}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((r) => r.json()),
                    fetch(`${baseUrl}/admin/coupons?search=${debouncedSearchTerm}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((r) => r.json()),
                ]);

                setResults({
                    products: prodRes?.data?.data || [],
                    categories: catRes?.data?.data || [],
                    brands: brandRes?.data?.data || [],
                    coupons: couponRes?.data?.data || [],
                });
            } catch (error) {
                console.error("Global search failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedSearchTerm, session]);

    const clearSearch = () => {
        setSearchTerm("");
        setResults({ products: [], categories: [], brands: [], coupons: [] });
        setIsOpen(false);
    };

    return (
        <SearchContext.Provider
            value={{
                searchTerm,
                setSearchTerm,
                results,
                isLoading,
                isOpen,
                setIsOpen,
                clearSearch
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
};
