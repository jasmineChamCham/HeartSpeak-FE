import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, AlertCircle, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signUp } from "@/api/auth/auth.sign-up";
import { ErrorMessages } from "@/common/error_messages";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface RegisterFormProps {
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

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [deviceId, setDeviceId] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [hasError, setHasError] = React.useState(false);
  const [showAvatarPopup, setShowAvatarPopup] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const key = "deviceId";
    try {
      let id = localStorage.getItem(key);
      if (!id) {
        id = (typeof crypto !== "undefined" && (crypto as any).randomUUID)
          ? (crypto as any).randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(key, id);
      }
      setDeviceId(id);
    } catch (e) {
      // localStorage may be unavailable (e.g., strict privacy mode); leave deviceId empty
    }
  }, []);

  // Cleanup avatar preview URL
  React.useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Clear error when user starts typing
  const clearError = () => {
    if (error) {
      setError(null);
      setHasError(false);
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        setHasError(true);
        setTimeout(() => setHasError(false), 600);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        setHasError(true);
        setTimeout(() => setHasError(false), 600);
        return;
      }

      setAvatarFile(file);
      // Create preview URL
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasError(false);

    try {
      await signUp({
        user: {
          displayName,
          email,
          password,
        },
        deviceId,
        ...(avatarFile && { avatar: avatarFile }),
      });
      toast.success("Account created successfully! Welcome to HeartSpeak!");
      onSuccess?.();
    } catch (err: any) {
      let errorMessage: string = ErrorMessages.SIGNUP;

      if (err?.response?.data?.message) {
        errorMessage = err?.response?.data?.message;
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
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          key={hasError ? 'error' : 'idle'}
          variants={shakeAnimation}
          animate={hasError ? "shake" : "idle"}
          className="space-y-4"
        >
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-border flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowAvatarPopup(true)}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAvatarFile(null);
                    setAvatarPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors z-10"
                  aria-label="Remove avatar"
                >
                  ×
                </button>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Image className="mr-2 h-4 w-4" />
                {avatarFile ? "Change Photo" : "Upload Photo"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Max 5MB, JPG, PNG, or GIF
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${iconErrorClass}`} />
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  clearError();
                }}
                placeholder="Your name"
                className={`pl-10 transition-colors ${inputErrorClass}`}
                required
              />
            </div>
          </div>

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
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>Create Account</>
          )}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button variant="outline" className="w-full" type="button">
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign up with Google
      </Button>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Already have an account? <span className="underline underline-offset-4">Log in</span>
        </Link>
      </div>

      {/* Avatar Popup Modal */}
      {showAvatarPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAvatarPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-lg shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Avatar Photo</h3>
                <button
                  onClick={() => setShowAvatarPopup(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Avatar Display */}
              <div className="flex items-center justify-center">
                <div className="w-64 h-64 rounded-lg overflow-hidden bg-muted border-2 border-border flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <User className="w-20 h-20 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No photo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowAvatarPopup(false);
                }}
                className="w-full"
              >
                <Image className="mr-2 h-4 w-4" />
                {avatarFile ? "Change Photo" : "Upload Photo"}
              </Button>

              {avatarPreview && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                    setShowAvatarPopup(false);
                  }}
                  className="w-full"
                >
                  Remove Photo
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
