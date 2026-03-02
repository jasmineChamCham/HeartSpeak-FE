import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// Import landing sections
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ServiceSection } from "@/components/landing/ServiceSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default function Index() {
  const { user, isLoading: authLoading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal Header */}
      <header className="absolute top-0 z-50 flex w-full items-center justify-between px-6 py-6 md:px-12 font-light">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo-primary-color-without-bg.png" alt="HeartSpeak Logo" className="h-8 w-auto object-contain mt-1.5" />
            <span className="font-display text-xl font-semibold text-primary tracking-tight">HeartSpeak</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-sm text-white/90">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#service" className="hover:text-white transition-colors">Service</a>
          <a href="#how-it-works" className="hover:text-white transition-colors whitespace-nowrap">How it works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="shimmer-button inline-flex items-center justify-center gap-2 rounded-full bg-[#4A6F57]/40 backdrop-blur-md px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#4A6F57]/60 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(74,111,87,0.4)] border border-[#4A6F57]/40 hover:border-[#4A6F57]/80">
            Analyze your conversations<ArrowUpRight className="w-4 h-4 opacity-80" />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServiceSection />
        <HowItWorksSection />
        {/* <PricingSection />
        <FaqSection />
        <ContactSection /> */}
      </main>

      <SiteFooter />
    </div >
  );
}
