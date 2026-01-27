import * as React from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MAIN_PAGE } from "@/common/constant";

export default function Index() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect users based on authentication status
  React.useEffect(() => {
    if (!authLoading) {
      if (user) {
        // Authenticated users go to main page
        navigate(MAIN_PAGE);
      } else {
        // Unauthenticated users go to login
        navigate("/login");
      }
    }
  }, [user, authLoading, navigate]);

  // Show loading while checking auth or redirecting
  return (
    <div className="flex min-h-screen items-center justify-center gradient-calm">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
