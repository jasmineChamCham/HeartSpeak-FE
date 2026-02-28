import { Link } from "react-router-dom";

export function SiteFooter() {
    return (
        <footer className="bg-background px-6 py-12 md:py-16">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
                <div className="flex items-center gap-2">
                    {/* Optionally insert a minimal logo here */}
                    <span className="font-display text-xl font-semibold tracking-tight text-foreground">
                        HeartSpeak
                    </span>
                </div>

                <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
                    <Link to="/login" className="hover:text-foreground transition-colors">
                        Log In
                    </Link>
                    <Link to="/register" className="hover:text-foreground transition-colors">
                        Sign Up
                    </Link>
                </nav>

                <p className="text-sm font-light text-muted-foreground/60">
                    © {new Date().getFullYear()} HeartSpeak. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
