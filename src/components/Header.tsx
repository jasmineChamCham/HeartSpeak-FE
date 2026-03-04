import { Link } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LoginUserDto } from "@/types/auth";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

interface SessionHeaderProps {
    user: LoginUserDto;
    onSignOut: () => void;
}

export function Header({ user, onSignOut }: SessionHeaderProps) {
    const { t } = useTranslation();

    return (
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
            <div className="container flex items-center justify-between py-4">
                <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-background/50 dark:hover:bg-background/20 transition-colors group"
                >
                    <div className="relative">
                        {user.avatarUrl ? (
                            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-colors ring-2 ring-transparent group-hover:ring-primary/10">
                                <img
                                    src={user.avatarUrl}
                                    alt={user.displayName || "User avatar"}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        // Fallback to icon if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = "none";
                                        const parent = target.parentElement;
                                        if (parent) {
                                            parent.className = "h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 transition-colors";
                                            const icon = document.createElement("div");
                                            icon.innerHTML = '<svg class="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>';
                                            parent.appendChild(icon);
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 transition-colors shadow-sm group-hover:shadow-md">
                                <UserCircle className="h-6 w-6 text-primary" />
                            </div>
                        )}
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-sm font-medium text-foreground">
                            {user.displayName || t('header.profile')}
                        </div>
                        <div className="text-xs text-muted-foreground">{t('header.view_settings')}</div>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher variant="app" />
                    <Button variant="ghost" size="sm" onClick={onSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('header.sign_out')}
                    </Button>
                </div>
            </div>
        </header>
    );
}
