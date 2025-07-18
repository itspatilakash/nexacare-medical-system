import { QueryClient } from "@tanstack/react-query";
import { getAuthToken } from "./auth";
async function throwIfResNotOk(res) {
    if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
    }
}
export async function apiRequest(method, url, data) {
    const token = getAuthToken();
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    if (data) {
        headers["Content-Type"] = "application/json";
    }
    const res = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
    });
    await throwIfResNotOk(res);
    return res;
}
export const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
    const token = getAuthToken();
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(queryKey[0], {
        headers,
        credentials: "include",
    });
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
    }
    await throwIfResNotOk(res);
    return await res.json();
};
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: getQueryFn({ on401: "throw" }),
            refetchInterval: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});
