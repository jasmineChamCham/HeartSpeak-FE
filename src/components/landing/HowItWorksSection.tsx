import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function HowItWorksSection() {
    const { t, i18n } = useTranslation();

    const steps = [
        {
            num: "01",
            title: t('how_it_works.step1_title'),
            desc: t('how_it_works.step1_desc'),
        },
        {
            num: "02",
            title: t('how_it_works.step2_title'),
            desc: t('how_it_works.step2_desc'),
        },
        {
            num: "03",
            title: t('how_it_works.step3_title'),
            desc: t('how_it_works.step3_desc'),
        },
    ];

    return (
        <section id="how-it-works" className="relative w-full overflow-hidden bg-background h-screen flex items-center px-6 md:px-12 mt-12 text-foreground">
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center gap-12 md:gap-16 py-12">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-12 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center gap-3 text-black/60"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E8E6E1]/50 shadow-sm border border-black/5">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-[#2b647f] font-medium whitespace-nowrap underline decoration-1 underline-offset-4">
                            {t('how_it_works.label')}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl md:max-w-2xl text-left md:text-right"
                    >
                        <h2 className="text-[2rem] md:text-[2.75rem] font-medium leading-[1.1] tracking-tight text-[#18181A]">
                            {t('how_it_works.headline_part1')}<span className={`text-[#2b2b2d] ${i18n.language === 'vi' ? 'font-normal' : 'font-serif italic font-normal'}`}>{t('how_it_works.headline_part2')}</span>{t('how_it_works.headline_part3')}
                        </h2>
                    </motion.div>
                </div>

                {/* Cards Area */}
                <div className="grid gap-6 md:gap-8 md:grid-cols-3">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.7, delay: i * 0.2, ease: "easeOut" }}
                            className="group relative flex flex-col gap-4 rounded-[1.5rem] bg-white p-6 md:p-8 border border-black/5 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 h-full min-h-[260px]"
                        >
                            <div>
                                <span className={`text-4xl md:text-5xl font-light text-black/80 ${i18n.language === 'vi' ? '' : 'font-serif italic'}`}>
                                    {step.num}
                                </span>
                            </div>

                            <h3 className="font-display text-2xl font-medium text-[#18181A] tracking-tight">
                                {step.title}
                            </h3>

                            <p className="text-sm md:text-base font-light leading-relaxed text-black/70 mt-auto pt-8">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex justify-center mt-4"
                >
                    <Link
                        to="/login"
                        className="shimmer-button inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-primary/90 shadow-lg hover:scale-[1.02]"
                    >
                        {t('how_it_works.cta')} <ArrowUpRight className="w-4 h-4 opacity-90" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
