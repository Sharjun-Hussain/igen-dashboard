import { signOut } from "next-auth/react";

export const fetcher = async (url, accessToken, options = {}) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
        },
    });

    if (res.status === 401) {
        signOut({ callbackUrl: "/login" });
        // Return a promise that never resolves to stop further execution in the component
        return new Promise(() => { });
    }

    const data = await res.json();
    if (!res.ok) {
        const error = new Error(data.message || "An error occurred");
        error.status = res.status;
        error.info = data;
        throw error;
    }
    return data;
};
