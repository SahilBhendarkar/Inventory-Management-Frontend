type AppConfig = {
    ENVIRONMENT: string;
    BACKEND_URL: string;
    CONSOLE: boolean;
    PRODUCTION: boolean;
};

function toBoolean(value: string | undefined, fallback = "false"): boolean {
    return (value ?? fallback).toLowerCase() === "true";
}

export const CONFIG: AppConfig = {
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT ?? "dev",
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL ?? "",
    CONSOLE: toBoolean(import.meta.env.VITE_CONSOLE, "true"),
    PRODUCTION: toBoolean(import.meta.env.VITE_PRODUCTION, "false"),
};

