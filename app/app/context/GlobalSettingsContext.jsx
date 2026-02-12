"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const GlobalSettingsContext = createContext();

export const GlobalSettingsProvider = ({ children }) => {
  const { data: session } = useSession();
  
  // Default values
  const [settings, setSettings] = useState({
    businessName: "IgenShop",
    logoUrl: null,
    footerText: "© 2026 IgenShop LK. All rights reserved.",
    adminEmail: "admin@igen.com",
    adminName: "Admin User",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch settings from API
  const fetchSettings = async () => {
    if (!session?.accessToken) return;
    
    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/admin/settings`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const data = await response.json();
      
      if (data?.success && data?.data) {
        setSettings({
          businessName: data.data.business_name || "IgenShop",
          logoUrl: data.data.logo_url || null,
          footerText: data.data.footer_text || "© 2026 IgenShop LK. All rights reserved.",
          adminEmail: data.data.admin_email || "admin@igen.com",
          adminName: data.data.admin_name || "Admin User",
        });
      }
    } catch (error) {
      console.error("Failed to fetch global settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [session?.accessToken]);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <GlobalSettingsContext.Provider 
      value={{ 
        ...settings, 
        isLoading, 
        updateSettings, 
        refreshSettings: fetchSettings 
      }}
    >
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettings = () => {
  const context = useContext(GlobalSettingsContext);
  if (context === undefined) {
    throw new Error("useGlobalSettings must be used within a GlobalSettingsProvider");
  }
  return context;
};
