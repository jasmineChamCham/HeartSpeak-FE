import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "@/api/auth/auth.verify-email";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

type Status = "loading" | "success" | "error";

export default function VerifyEmail() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [status, setStatus] = React.useState<Status>("loading");
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const hasFetched = React.useRef(false);

    React.useEffect(() => {
        if (hasFetched.current) return;

        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (!token || !email) {
            setErrorMessage(t('verify.invalid_link'));
            setStatus("error");
            return;
        }

        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            deviceId = (typeof crypto !== "undefined" && (crypto as any).randomUUID)
                ? (crypto as any).randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            localStorage.setItem("deviceId", deviceId);
        }

        hasFetched.current = true;
        verifyEmail({ token, email, deviceId })
            .then(() => {
                // verifyEmail saved tokens to localStorage — sync auth state
                refreshUser();
                setStatus("success");
                // Brief pause so the user sees the success state before navigating
                setTimeout(() => {
                    navigate("/onboarding");
                }, 1500);
            })
            .catch((err) => {
                const message =
                    err?.response?.data?.message ||
                    t('verify.verify_error');
                setErrorMessage(message);
                setStatus("error");
            });
    }, [navigate, refreshUser, searchParams, t]);

    return (
        <div className="flex min-h-screen items-center justify-center gradient-calm">
            <div className="flex flex-col items-center gap-5 text-center px-6">
                {status === "loading" && (
                    <>
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <h1 className="text-2xl font-semibold text-foreground">
                            {t('verify.verifying')}
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            {t('verify.hold_on')}
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                        <h1 className="text-2xl font-semibold text-foreground">
                            {t('verify.success')}
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            {t('verify.taking_onboarding')}
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <XCircle className="h-12 w-12 text-destructive" />
                        <h1 className="text-2xl font-semibold text-foreground">
                            {t('verify.failed')}
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            {errorMessage}
                        </p>
                        <a
                            href="/register"
                            className="mt-2 text-primary underline underline-offset-4 text-sm hover:opacity-80 transition-opacity"
                        >
                            {t('verify.back_signup')}
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}
