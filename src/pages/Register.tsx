import * as React from "react";
import { motion } from "framer-motion";
import { RegisterForm } from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
    <div className="flex min-h-screen flex-col items-center justify-center gradient-calm p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage-light px-4 py-2">
          <img src="/logo-without-background.png" alt="Logo" className="h-5 w-5" />
          <span className="font-display text-lg font-medium text-primary">HeartSpeak</span>
        </div>
        <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
          Understand Your
          <span className="block text-primary">Conversations Better</span>
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          AI-powered analysis to help you understand people and communicate with clarity and compassion
        </p>
      </motion.div>
      <RegisterForm onSuccess={handleRegisterSuccess} />
    </div>
  );
}
