import { RouterProvider } from "react-router-dom";

import { AppProviders } from "./app/AppProviders";

import AuthProvider from "@/providers/AuthProvider";
import { router } from "@/routes/routes";
import { ErrorBoundary } from "@/components/common/error-boundary";

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;