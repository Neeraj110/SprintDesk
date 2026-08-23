import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./routes/ProtectedRoute";
import { FullScreenLoader } from "./components/ui/FullScreenLoader";
import { ToastProvider } from "./components/ui/Toast";
import { AuthenticatedLayout } from "./components/layout/AuthenticatedLayout";
import { useSessionBootstrap } from "./hooks/useSessionBootstrap";

// Route-level code splitting (Task 06 requirement).
const LoginPage = lazy(() =>
  import("./features/auth/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage }))
);
const BoardPage = lazy(() =>
  import("./pages/BoardPage").then((m) => ({ default: m.BoardPage }))
);
const AnalyticsPage = lazy(() =>
  import("./pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage }))
);

function App() {
  useSessionBootstrap();

  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AuthenticatedLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/board" element={<BoardPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
