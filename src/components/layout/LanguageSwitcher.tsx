import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ variant = "landing" }: { variant?: "landing" | "app" }) {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const languages = [
        { code: "en", name: "English" },
        { code: "vi", name: "Tiếng Việt" },
        { code: "fr", name: "Français" },
        { code: "it", name: "Italiano" },
        { code: "es", name: "Español" },
    ];

    const isLanding = variant === "landing";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={isLanding ? "text-white/80 hover:text-white hover:bg-white/10 rounded-full h-9 w-9" : "text-foreground/80 hover:text-foreground hover:bg-accent rounded-full h-9 w-9"}>
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={isLanding ? "bg-black/80 backdrop-blur-md border border-white/20 text-white" : ""}>
                {languages.map((lng) => (
                    <DropdownMenuItem
                        key={lng.code}
                        onClick={() => changeLanguage(lng.code)}
                        className={`cursor-pointer ${isLanding ? 'focus:bg-white/10' : ''} ${i18n.resolvedLanguage === lng.code ? (isLanding ? 'bg-white/10 font-medium' : 'bg-accent font-medium') : ''}`}
                    >
                        {lng.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
