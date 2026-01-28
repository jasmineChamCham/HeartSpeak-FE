import * as React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Branding */}
            <div className="hidden w-1/2 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
                <div className="flex items-center gap-2">
                    <img
                        src="/logo-without-background.png"
                        alt="Logo"
                        className="h-8 w-8 brightness-0 invert filter"
                    />
                    <span className="font-display text-xl font-medium">HeartSpeak</span>
                </div>

                <div className="space-y-4">
                    <h1 className="font-display text-4xl font-bold leading-tight">
                        Understand Your Conversations Better
                    </h1>
                    <p className="text-lg text-primary-foreground/90">
                        AI-powered analysis to help you understand people and communicate with clarity and compassion
                    </p>
                </div>

                <div className="text-sm text-primary-foreground/70">
                    &copy; {new Date().getFullYear()} HeartSpeak. All rights reserved.
                </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex w-full flex-col items-center justify-center bg-background px-4 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {subtitle}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
