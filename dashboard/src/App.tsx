import { RouterProvider } from "react-router-dom";

import { AppProviders } from "./app/AppProviders";
import { router } from "@/routes/routes";
import { ErrorBoundary } from "@/components/common/error-boundary";

import { useAuthBootstrap } from
  "@/features/auth/hooks/useAuthBootstrap";

function AppContent() {
  useAuthBootstrap();

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppContent />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;