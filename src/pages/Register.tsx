import * as React from "react";
import { motion } from "framer-motion";
import { RegisterForm } from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { MAIN_PAGE } from "@/common/constant";

export default function Register() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to analysis session if already authenticated
  React.useEffect(() => {
    if (!isLoading && user) {
      navigate(MAIN_PAGE);
    }
  }, [user, isLoading, navigate]);

  const handleRegisterSuccess = () => {
    navigate("/onboarding");
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
      title="Create Account"
      subtitle="Start improving your communication today"
    >
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </AuthLayout>
  );
}
