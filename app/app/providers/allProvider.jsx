"use client";
import { SessionProvider } from "next-auth/react";
import { fetcher } from "../../../lib/fetcher";
import React from "react";
import { SWRConfig } from "swr";


const AllProvider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          fetcher: (url) => fetcher(url, session?.accessToken),
          revalidateOnFocus: false,
          dedupingInterval: 5000,
        }}
      >
        {children}
      </SWRConfig>
    </SessionProvider>
  );
};

export default AllProvider;
