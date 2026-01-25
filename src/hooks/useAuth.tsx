import * as React from "react";
import { getAuthData, onAuthStateChange } from "@/api/auth/auth.sign-in";
import { signOut as apiSignOut } from "@/api/auth/auth.sign-out";
import { LoginUserDto, Token } from "@/types/auth";

interface AuthContextType {
  user: LoginUserDto | null;
  token: Token | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<LoginUserDto | null>(null);
  const [token, setToken] = React.useState<Token | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Initial load from storage
    const data = getAuthData();
    setToken(data.token);
    setUser(data.user);
    setIsLoading(false);

    // Subscribe to changes (e.g. from other tabs or login events)
    const subscription = onAuthStateChange((_event, newToken, newUser) => {
      setToken(newToken);
      setUser(newUser);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await apiSignOut();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
