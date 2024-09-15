import { useState, useEffect, useRef } from 'react';

// Define the types for data, error, and fetch options
interface FetchOptions extends RequestInit {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: BodyInit | null;
}

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export default function useFetch<T>(url: string, options: FetchOptions = {}, retryCount: number = 3) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });
    const cache = useRef<Record<string, T>>({}); // Cache to avoid duplicate fetch requests
    const controller = useRef<AbortController | null>(null); // For request cancellation

    useEffect(() => {
        async function fetchData(attempts: number) {
            setState((prevState) => ({ ...prevState, loading: true, error: null }));

            if (cache.current[url]) {
                // If data is cached, use it and skip fetch
                setState({ data: cache.current[url], loading: false, error: null });
                return;
            }

            controller.current = new AbortController();
            const { signal } = controller.current;

            try {
                const response = await fetch(url, { ...options, signal });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const result: T = await response.json();
                cache.current[url] = result; // Cache the result

                setState({ data: result, loading: false, error: null });
            } catch (err) {
                if (err instanceof Error) {
                    // Handle the error properly if it's an instance of Error
                    if (err.name === 'AbortError') {
                        console.log('Fetch request aborted');
                        return;
                    }

                    if (attempts > 1) {
                        console.log(`Retrying... attempts left: ${attempts - 1}`);
                        fetchData(attempts - 1); // Retry fetch request
                    } else {
                        setState({ data: null, loading: false, error: err.message });
                    }
                } else {
                    // If it's not an instance of Error (which shouldn't happen often), set a generic message
                    setState({ data: null, loading: false, error: 'An unknown error occurred' });
                }
            }
        }

        fetchData(retryCount);

        // Cleanup function to abort fetch on component unmount
        return () => {
            if (controller.current) {
                controller.current.abort();
            }
        };
    }, [url, options, retryCount]);

    return { ...state };
}
