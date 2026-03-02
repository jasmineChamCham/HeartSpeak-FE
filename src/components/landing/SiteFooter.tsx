import { Link } from "react-router-dom";
import { ArrowRight, ArrowUp, Twitter, Facebook, Instagram } from "lucide-react";

export function SiteFooter() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#18181b] px-6 py-12 md:py-16 mt-auto w-full font-sans">
            <div className="mx-auto max-w-6xl flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Left Column: Brand & Info */}
                    <div className="md:col-span-4 flex flex-col items-start pr-4">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/logo-primary-color-without-bg.png" alt="HeartSpeak Logo" className="h-10 w-auto" />
                            <span className="font-display text-xl tracking-wider text-white uppercase">
                                HeartSpeak
                            </span>
                        </div>
                        <p className="text-sm font-light text-gray-400 mb-8 max-w-xs leading-relaxed">
                            Empowering communication through empathy. We provide AI-driven analysis to understand the true meaning behind words.
                        </p>
                        <Link to="/register" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90">
                            Get a quote <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>

                    {/* Right Columns: Links */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 pt-2">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white mb-2">Account</h4>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Lorem ipsum dolor</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Lorem ipsum dolor</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Dedicated Team</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Project-Based Team</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Product Concepting /<br />Discovery Phase</Link>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white mb-2">Help</h4>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Lorem ipsum dolor</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Lorem ipsum dolor</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Dedicated Team</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Project-Based Team</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Product Concepting /<br />Discovery Phase</Link>
                        </div>

                        {/* Column 3 */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-white mb-2">Our Policies</h4>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Web Development</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Mobile Development</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Dedicated Team</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Project-Based Team</Link>
                            <Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Product Concepting /<br />Discovery Phase</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="border-t border-[#2a2a32] pt-8 flex flex-col md:flex-row items-center justify-between gap-6 w-full relative">
                    <p className="text-sm font-light text-gray-400 md:flex-1">
                        © {new Date().getFullYear()} HeartSpeak.co all right reserved
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
