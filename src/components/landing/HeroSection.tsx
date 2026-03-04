import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, User, Home } from "lucide-react";
import { useTranslation } from "react-i18next";


const VIDEOS = [
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,vc_h264/v1772367462/landing-page-videos/bebpsn7ufskijf7eavld.mp4",
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,vc_h264/v1772262683/landing-page-videos/xj1bgbpuxhoxsjnye5sj.mp4",
    "https://res.cloudinary.com/dyw50hhip/video/upload/q_auto:best,vc_h264/v1772262682/landing-page-videos/jr4goup38qqvvzrgjpqu.mp4",
];

export function HeroSection() {
    const { t, i18n } = useTranslation();
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentVideoIndex((prev) => (prev + 1) % VIDEOS.length);
        }, 4000);

        return () => clearTimeout(timer);
    }, [currentVideoIndex]);

    return (
        <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-12 pt-32 md:px-12 md:pb-16 text-left bg-black text-white">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                <AnimatePresence initial={false}>
                    <motion.video
                        key={currentVideoIndex}
                        src={VIDEOS[currentVideoIndex]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        autoPlay
                        muted
                        playsInline
                        onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % VIDEOS.length)}
                    />
                </AnimatePresence>
            </div>

            {/* Subtle Gradient Overlay for readability while keeping it light and moody */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
            <div className="absolute inset-0 z-0 bg-black/10" />

            {/* Content container */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between flex-1 mt-12 md:mt-20">
                {/* Top/Middle large text */}
                <div className="flex-1 flex flex-col justify-center max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className={`${i18n.language === 'en' ? 'text-4xl sm:text-5xl md:text-6xl lg:text-[5rem]' : 'text-3xl sm:text-4xl md:text-5xl lg:text-[4rem]'} font-medium leading-[1.1] tracking-tight text-white/95 mb-8 text-balance`}>
                            {t('hero.title_part1')} <br />
                            <span className={`opacity-90 text-[#e4ece4] ${i18n.language === 'vi' ? 'font-normal' : 'font-serif italic font-normal'}`}>{t('hero.title_part2')}</span>
                        </h1>
                    </motion.div>
                </div>

                {/* Bottom area */}
                <div className="flex flex-col lg:flex-row justify-between items-end gap-12 lg:gap-8 mt-auto pb-4">
                    {/* Left features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col gap-6 lg:gap-8 max-w-sm lg:max-w-md"
                    >
                        <div className="flex items-start gap-4">
                            <Heart className="w-5 h-5 mt-1 shrink-0 text-white stroke-[1.5]" />
                            <div>
                                <h3 className="text-base font-normal mb-1">{t('hero.feature1_title')}</h3>
                                <p className="text-sm text-white/70 leading-relaxed font-light">{t('hero.feature1_desc')}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <User className="w-5 h-5 mt-1 shrink-0 text-white stroke-[1.5]" />
                            <div>
                                <h3 className="text-base font-normal mb-1">{t('hero.feature2_title')}</h3>
                                <p className="text-sm text-white/70 leading-relaxed font-light">{t('hero.feature2_desc')}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Home className="w-5 h-5 mt-1 shrink-0 text-white stroke-[1.5]" />
                            <div>
                                <h3 className="text-base font-normal mb-1">{t('hero.feature3_title')}</h3>
                                <p className="text-sm text-white/70 leading-relaxed font-light">{t('hero.feature3_desc')}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        className="max-w-sm flex flex-col gap-6 lg:items-end lg:text-right"
                    >
                        <p className="text-base text-white/80 leading-relaxed font-light lg:ml-auto">
                            {t('hero.cta_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm md:text-base font-medium text-white whitespace-nowrap transition-all hover:bg-primary/90 shadow-lg"
                            >
                                {t('hero.cta_button_primary')} <ArrowUpRight className="w-4 h-4 opacity-90" />
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-transparent backdrop-blur-md px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 border border-white/30 shadow-lg"
                            >
                                {t('hero.cta_button_secondary')} <ArrowUpRight className="w-4 h-4 opacity-70" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
