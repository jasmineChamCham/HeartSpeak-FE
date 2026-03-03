import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// Import landing sections
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ServiceSection } from "@/components/landing/ServiceSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal Header */}
      <header className="absolute top-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-12 font-light">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo-primary-color-without-bg.png" alt="Encantta Logo" className="h-8 w-auto object-contain mt-1.5" />
            <span className="font-display text-xl font-semibold text-primary tracking-tight">Encantta</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-sm text-white/90">
          <a href="#about" className="hover:text-white transition-colors">{t('header.about')}</a>
          <a href="#service" className="hover:text-white transition-colors">{t('header.service')}</a>
          <a href="#how-it-works" className="hover:text-white transition-colors whitespace-nowrap">{t('header.how_it_works')}</a>
          {/* <a href="#pricing" className="hover:text-white transition-colors">Pricing</a> */}
          <a href="#faq" className="hover:text-white transition-colors">{t('header.faq')}</a>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher />
          <Link to="/login" className="shimmer-button inline-flex items-center justify-center gap-1.5 md:gap-2 rounded-full bg-[#4A6F57]/40 backdrop-blur-md px-3 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white transition-all duration-300 hover:bg-[#4A6F57]/60 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(74,111,87,0.4)] border border-[#4A6F57]/40 hover:border-[#4A6F57]/80">
            <span className="hidden sm:inline">{t('header.analyze_long')}</span>
            <span className="inline sm:hidden">{t('header.analyze_short')}</span>
            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 opacity-80" />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServiceSection />
        <HowItWorksSection />
        {/* <PricingSection /> */}
        <FaqSection />
      </main>

      <SiteFooter />
    </div >
  );
}
