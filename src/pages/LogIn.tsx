import * as React from "react";
import { motion } from "framer-motion";
import { LogInForm } from "@/components/LogInForm";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { MAIN_PAGE } from "@/common/constant";

export default function LogIn() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

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
      title="Login to your account"
      subtitle="Enter your email below to login to your account"
    >
      <LogInForm onSuccess={handleLogInSuccess} />
    </AuthLayout>
  );
}
