import * as React from "react";
import { getAuthData, onAuthStateChange, signIn } from "@/api/auth/auth.sign-in";
import { signOut as apiSignOut } from "@/api/auth/auth.sign-out";
import { LoginUserDto, Token } from "@/types/auth";

interface AuthContextType {
  user: LoginUserDto | null;
  token: Token | null;
  isLoading: boolean;
  login: (payload: { email: string; password: string; deviceId: string }) => Promise<{ user: LoginUserDto; token: Token }>;
  signOut: () => Promise<void>;
  refreshUser: () => void;
  setAuthData: (user: LoginUserDto, accessToken: string, refreshToken: string) => void;
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

    // Fetch and store geolocation for API requests
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          {
            localStorage.setItem("latitude", position.coords.latitude.toString());
            localStorage.setItem("longitude", position.coords.longitude.toString());
          }
        },
        (error) => {
          console.warn("Geolocation permission denied or unavailable:", error);
        }
      );
    }

    return () => subscription.unsubscribe();
  }, []);

  const login = async (payload: { email: string; password: string; deviceId: string }) => {
    const { user: newUser, token: newToken } = await signIn(payload);
    setToken(newToken);
    setUser(newUser);
    setIsLoading(false);
    return { user: newUser, token: newToken };
  };

  const signOut = async () => {
    await apiSignOut();
    setToken(null);
    setUser(null);
  };

  const refreshUser = () => {
    const data = getAuthData();
    setToken(data.token);
    setUser(data.user);
  };

  const setAuthData = (newUser: LoginUserDto, accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    // Attempt to store full data mimicking getAuthData format if needed
    const tokenObj: Token = {
      access_token: accessToken,
      refresh_token: refreshToken
    };

    // We update local state
    setToken(tokenObj);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signOut, refreshUser, setAuthData }}>
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
