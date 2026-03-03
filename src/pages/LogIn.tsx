import * as React from "react";
import { motion } from "framer-motion";
import { LogInForm } from "@/components/LogInForm";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { MAIN_PAGE } from "@/common/constant";
import { toast } from "sonner";

export default function LogIn() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show email verification notice if redirected from Register
  React.useEffect(() => {
    const state = location.state as { emailVerificationSent?: boolean; email?: string } | null;
    if (state?.emailVerificationSent) {
      const emailHint = state.email ? ` to ${state.email}` : "";
      toast.info(`Verification email sent${emailHint}. Please check your inbox to finish signing up.`, {
        duration: 8000,
      });
      // Clear the state so the toast doesn't re-show on refresh
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  // Redirect to analysis session if already authenticated
  React.useEffect(() => {
    if (!isLoading && user) {
      navigate(MAIN_PAGE);
    }
  }, [user, isLoading, navigate]);

  const handleLogInSuccess = () => {
    navigate(MAIN_PAGE);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-calm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <AuthLayout
      title={t('auth.login_title')}
      subtitle={t('auth.login_subtitle')}
    >
      <LogInForm onSuccess={handleLogInSuccess} />
    </AuthLayout>
  );
}
