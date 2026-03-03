import { Link } from "react-router-dom";
import { ArrowRight, ArrowUp, Twitter, Facebook, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
    const { t } = useTranslation();
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#18181b] px-6 py-12 md:py-16 mt-auto w-full font-sans">
            <div className="mx-auto max-w-6xl flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Left Column: Brand & Info */}
                    <div className="md:col-span-4 flex flex-col items-center text-center md:items-start md:text-left md:pr-4">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/logo-primary-color-without-bg.png" alt="Encantta Logo" className="h-10 w-auto" />
                        </div>
                        <p className="text-sm font-light text-gray-400 mb-8 max-w-xs leading-relaxed">
                            {t('footer.desc')}
                        </p>
                        <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90">
                            {t('footer.cta')} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    {/* Right Columns: Links */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-2">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white mb-2">{t('footer.product')}</h4>
                            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.how_it_works')}</a>
                            <a href="#service" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.features')}</a>
                            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.pricing')}</a>
                            <Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.create_account')}</Link>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white mb-2">{t('footer.resources')}</h4>
                            {/* <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Communication guide</a> */}
                            {/* <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</a> */}
                            <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.faq')}</a>
                            <a href="mailto:support@Encantta.click" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.support')}</a>
                            <a href="mailto:contact@Encantta.click" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.contact')}</a>
                        </div>

                        {/* Column 3 */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white mb-2">{t('footer.privacy_trust')}</h4>
                            <Link to="/data-security" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.data_security')}</Link>
                            <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.privacy_policy')}</Link>
                            <Link to="/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.terms')}</Link>
                            <Link to="/cookie-policy" className="text-sm text-gray-400 hover:text-white transition-colors">{t('footer.cookie')}</Link>
                        </div>
                    </div>
                </div>

                <div className="mb-6 text-center md:text-left">
                    <p className="text-base font-medium text-gray-300">
                        {t('footer.designed_with')}
                    </p>
                </div>

                {/* Bottom Row */}
                <div className="border-t border-[#2a2a32] pt-8 flex flex-col md:flex-row items-center justify-between gap-6 w-full relative text-center md:text-left">
                    <p className="text-sm font-light text-gray-400 md:flex-1">
                        {t('footer.rights')}
                    </p>

                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 md:pr-16">
                        <div className="flex items-center gap-3">
                            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/80 transition-colors">
                                <Twitter className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                            </a>
                            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/80 transition-colors">
                                <Facebook className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                            </a>
                            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/80 transition-colors">
                                <Instagram className="h-4 w-4" strokeWidth={2} />
                            </a>
                        </div>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="absolute right-0 top-8 md:top-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/80 transition-colors shadow-lg"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
