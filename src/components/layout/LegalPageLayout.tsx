import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

interface LegalPageLayoutProps {
    children: React.ReactNode;
    title: string;
    lastUpdated?: string;
}

export function LegalPageLayout({ children, title, lastUpdated }: LegalPageLayoutProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 flex w-full items-center px-6 py-4 md:px-12 bg-background/80 backdrop-blur-md border-b border-border">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <ArrowLeft className="w-5 h-5 text-muted-foreground mr-2" />
                    <img src="/logo-primary-color-without-bg.png" alt="HeartSpeak Logo" className="h-8 w-auto object-contain mt-1.5" />
                    <span className="font-display text-xl font-semibold text-primary tracking-tight">HeartSpeak</span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center py-16 px-6 md:px-12">
                <article className="w-full max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight">{title}</h1>
                    {lastUpdated && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-12">Effective Date: {lastUpdated}</p>
                    )}

                    <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed [&_p]:mb-6 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_a]:text-primary hover:[&_a]:text-primary/80 transition-colors">
                        {children}
                    </div>
                </article>
            </main>

            <SiteFooter />
        </div>
    );
}
