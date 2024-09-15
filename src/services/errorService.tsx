// services/errorService.ts
export function logErrorToService(error: Error, errorInfo: any) {
    // Example: Log error to an external monitoring service (e.g., Sentry, LogRocket)
    console.error('Logging error to external service:', error, errorInfo);
    // Sentry.captureException(error);
    // LogRocket.captureException(error);
}
