import { Component, ReactNode, ErrorInfo } from 'react';
import { logErrorToService } from '../services/errorService'; // Assume this logs errors to an external service

interface ErrorBoundaryProps {
    children: ReactNode;
    fallbackUI?: ReactNode; // Allow customizable fallback UI
    reportError?: boolean;  // Enable error reporting feature
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state to trigger fallback UI on error
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to an external service
        this.setState({ error, errorInfo });
        logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        // Optionally reload the page or reset the app state
        window.location.reload();
    };

    handleReportError = () => {
        // Provide custom logic to allow users to report errors
        const { error, errorInfo } = this.state;
        console.log('Reporting error:', error, errorInfo);
        // e.g., send this to an error reporting service, or show a form
    };

    render() {
        const { hasError, error, errorInfo } = this.state;
        const { fallbackUI, reportError = false, children } = this.props;

        if (hasError) {
            // Show a detailed fallback UI in development mode
            const isDevMode = process.env.NODE_ENV === 'development';

            return (
                <div className="error-boundary">
                    {fallbackUI || (
                        <div className="error-fallback">
                            <h1>Something went wrong.</h1>
                            <p>We apologize for the inconvenience. Please try again later.</p>

                            {isDevMode && error && (
                                <div className="error-details">
                                    <h3>Error Details (Development Mode):</h3>
                                    <p>{error.message}</p>
                                    {errorInfo && <pre>{errorInfo.componentStack}</pre>}
                                </div>
                            )}

                            {/* Reset or reload option */}
                            <button onClick={this.handleReset} className="reset-button">
                                Reload Page
                            </button>

                            {/* Error reporting option */}
                            {reportError && (
                                <button onClick={this.handleReportError} className="report-button">
                                    Report This Issue
                                </button>
                            )}
                        </div>
                    )}

                    <style jsx>{`
            .error-fallback {
              text-align: center;
              padding: 20px;
              background-color: #f8d7da;
              color: #721c24;
              border-radius: 8px;
              border: 1px solid #f5c6cb;
              margin: 20px;
            }
            .error-details {
              margin-top: 20px;
              padding: 15px;
              background-color: #f3f4f6;
              border: 1px solid #ccc;
              border-radius: 8px;
              color: #333;
              font-family: monospace;
              text-align: left;
            }
            .reset-button,
            .report-button {
              padding: 10px 20px;
              margin: 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              background-color: #0070f3;
              color: white;
            }
            .reset-button:hover,
            .report-button:hover {
              background-color: #005bb5;
            }
          `}</style>
                </div>
            );
        }

        return children;
    }
}

export default ErrorBoundary;
