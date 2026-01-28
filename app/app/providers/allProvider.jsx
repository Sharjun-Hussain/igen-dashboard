"use client";
import { SessionProvider } from "next-auth/react";
import { fetcher } from "../../../lib/fetcher";
import React from "react";
import { SWRConfig } from "swr";
import { CurrencyProvider } from "../context/CurrencyContext";


const AllProvider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  );
};

export default AllProvider;
