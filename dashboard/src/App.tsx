import { RouterProvider } from "react-router-dom";

import { AppProviders } from "./app/AppProviders";

import { router } from "@/routes/routes";

import { ErrorBoundary } from
  "@/components/common/error-boundary";

import { useAuthBootstrap } from
  "@/features/auth/hooks/useAuthBootstrap";

import { SocketProvider } from
  "@/socket/SocketProvider";

function AppContent() {
  useAuthBootstrap();

  return (
    <SocketProvider>
      <RouterProvider
        router={router}
      />
    </SocketProvider>
  );
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