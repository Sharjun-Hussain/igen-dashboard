"use client";
import { SessionProvider } from "next-auth/react";
import { fetcher } from "../../../lib/fetcher";
import React from "react";
import { SWRConfig } from "swr";
import { CurrencyProvider } from "../context/CurrencyContext";
import { SearchProvider } from "../context/SearchContext";
import { GlobalSettingsProvider } from "../context/GlobalSettingsContext";


const AllProvider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <GlobalSettingsProvider>
        <SearchProvider>
          <CurrencyProvider>
          <SWRConfig
          value={{
            fetcher: (url) => fetcher(url, session?.accessToken),
            revalidateOnFocus: false,
            dedupingInterval: 5000,
          }}
        >
          {children}
        </SWRConfig>
      </CurrencyProvider>
    </SearchProvider>
  </GlobalSettingsProvider>
  </SessionProvider>
  );
};

export default AllProvider;
