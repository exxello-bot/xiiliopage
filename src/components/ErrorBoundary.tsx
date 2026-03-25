import * as Sentry from "@sentry/react";
import { useRouteError } from "react-router-dom";

function ErrorFallback() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
      <div className="text-center max-w-md space-y-4">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          We've been notified and are working on a fix. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export const SentryErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  {
    fallback: <ErrorFallback />,
    showDialog: false,
  }
);

export { ErrorFallback };
