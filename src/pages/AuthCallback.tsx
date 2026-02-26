import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle } from "lucide-react";

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setAuthData } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        if (accessToken && refreshToken) {
            // Decode user data from access token if needed, or simply set the tokens
            // For now, we will set it so that useAuth hooks manage state 
            // (useAuth will need the tokens in storage)
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            try {
                // Decode basic JWT parts to populate user data so it feels instant
                const base64Url = accessToken.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);
                const userData = decodedToken.dataToken || decodedToken;

                // useAuth's getAuthData requires 'user' to be set in localStorage
                localStorage.setItem("user", JSON.stringify(userData));

                setAuthData(userData, accessToken, refreshToken);
                navigate("/analysis-session");
            } catch (e) {
                console.error("Failed to parse token", e);
                // Fallback redirect 
                window.location.href = "/analysis-session";
            }

        } else {
            setError("Authentication failed. Missing tokens.");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        }
    }, [searchParams, navigate, setAuthData]);

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center space-y-4 gradient-calm">
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle className="h-6 w-6" />
                    <p className="font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 gradient-calm">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-zinc-600 animate-pulse font-medium">Completing login...</p>
        </div>
    );
}
