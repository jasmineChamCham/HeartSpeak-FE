import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ErrorMessages } from "@/common/error_messages";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface LogInFormProps {
  onSuccess?: () => void;
}

// Shake animation variants
const shakeAnimation = {
  shake: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    transition: { duration: 0.5 },
  },
  idle: { x: 0 },
};

export function LogInForm({ onSuccess }: LogInFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [deviceId, setDeviceId] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [hasError, setHasError] = React.useState(false);

  const { login } = useAuth();

  React.useEffect(() => {
    const key = "deviceId";
    try {
      let id = localStorage.getItem(key);
      if (!id) {
        id = (crypto && (crypto as any).randomUUID)
          ? (crypto as any).randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(key, id);
      }
      setDeviceId(id);
    } catch (e) {
      // localStorage may be unavailable (e.g., strict privacy mode); leave deviceId empty
    }
  }, []);

  // Clear error when user starts typing
  const clearError = () => {
    if (error) {
      setError(null);
      setHasError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasError(false);

    try {
      await login({ email, password, deviceId });
      toast.success("Welcome back!");
      onSuccess?.();
    } catch (err: any) {
      let errorMessage: string = ErrorMessages.LOGIN;

      if (err?.response?.data?.message) {
        errorMessage = err?.response?.data?.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setHasError(true);

      // Reset shake animation after a short delay
      setTimeout(() => setHasError(false), 600);
    } finally {
      setIsLoading(false);
    }
  };

  const inputErrorClass = error
    ? "border-red-500 bg-red-50/50 focus-visible:ring-red-500 dark:bg-red-950/20"
    : "";

  const iconErrorClass = error ? "text-red-500" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="glass-card border-0 shadow-elevated">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Log in to continue your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              key={hasError ? 'error' : 'idle'}
              variants={shakeAnimation}
              animate={hasError ? "shake" : "idle"}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className={error ? "text-red-600" : ""}>
                  Email
                </Label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${iconErrorClass}`} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                    placeholder="you@example.com"
                    className={`pl-10 transition-colors ${inputErrorClass}`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={error ? "text-red-600" : ""}>
                  Password
                </Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${iconErrorClass}`} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                    placeholder="••••••••"
                    className={`pl-10 transition-colors ${inputErrorClass}`}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </motion.div>

            {/* Error message display - outside the shake container */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800"
              >
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Log In</>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Don't have an account? Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
