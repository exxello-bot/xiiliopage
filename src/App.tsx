import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SentryErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "next-themes";

const AppShell = lazy(() => import("./components/AppShell"));
const HomePage = lazy(() => import("./pages/app/HomePage"));
const ChatPage = lazy(() => import("./pages/app/ChatPage"));
const ServicesPage = lazy(() => import("./pages/app/ServicesPage"));
const ProfilePage = lazy(() => import("./pages/app/ProfilePage"));

const Index = lazy(() => import("./pages/Index"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Install = lazy(() => import("./pages/Install"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Admin = lazy(() => import("./pages/Admin"));
const Portal = lazy(() => import("./pages/Portal"));
const InquiryDetail = lazy(() => import("./pages/InquiryDetail"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <SentryErrorBoundary>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Auth-first: root redirects to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public auth pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Guest/marketing landing */}
                <Route path="/explore" element={<Index />} />

                {/* App shell with bottom tabs (auth-protected) */}
                <Route element={<AppShell />}>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/inquiry/:id" element={<InquiryDetail />} />
                </Route>

                {/* Admin (has its own auth) */}
                <Route path="/admin" element={<Admin />} />

                {/* Legacy portal redirect */}
                <Route path="/portal" element={<Navigate to="/home" replace />} />
                <Route path="/portal/inquiry/:id" element={<Navigate to="/home" replace />} />

                {/* Static pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/install" element={<Install />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SentryErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
