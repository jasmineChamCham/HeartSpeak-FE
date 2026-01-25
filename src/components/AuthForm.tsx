import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, AlertCircle, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "@/api/auth/auth.sign-in";
import { ErrorMessages } from "@/common/error_messages";
import { signUp } from "@/api/auth/auth.sign-up";
import { toast } from "sonner";

interface AuthFormProps {
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

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = React.useState(true);
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
      // URL.createObjectURL(file) creates memory in the browser's memory (JavaScript heap),
      // so we need to revoke it when we're done with it.
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
      if (isLogin) {
        await signIn({ email, password, deviceId });
        toast.success("Welcome back!");
      } else {
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
      }
      onSuccess?.();
    } catch (err: any) {
      let errorMessage: string = isLogin ? ErrorMessages.LOGIN : ErrorMessages.SIGNUP;
      
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

  const inputErrorClass = error && isLogin
    ? "border-red-500 bg-red-50/50 focus-visible:ring-red-500 dark:bg-red-950/20"
    : "";

  const iconErrorClass = error && isLogin ? "text-red-500" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="glass-card border-0 shadow-elevated">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to continue your journey"
              : "Start improving your communication today"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              key={hasError && isLogin ? 'error' : 'idle'}
              variants={shakeAnimation}
              animate={hasError && isLogin ? "shake" : "idle"}
              className="space-y-4"
            >
              {!isLogin && (
                <>
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
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className={error && isLogin ? "text-red-600" : ""}>
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
                <Label htmlFor="password" className={error && isLogin ? "text-red-600" : ""}>
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
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>{isLogin ? "Sign In" : "Create Account"}</>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setAvatarFile(null);
                setAvatarPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Avatar Popup Modal */}
          {showAvatarPopup && !isLogin && (
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
