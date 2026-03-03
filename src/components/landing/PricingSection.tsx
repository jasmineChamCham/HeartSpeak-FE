import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function PricingSection() {
    const { i18n } = useTranslation();
    return (
        <section id="pricing" className="relative w-full overflow-hidden bg-background flex flex-col items-center py-20 px-6 md:px-12 text-foreground">
            <div className="max-w-7xl w-full mx-auto flex flex-col items-center">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-12 w-full mb-16">
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
                            Pricing
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
                            Simple, transparent <span className={`text-[#2b2b2d] ${i18n.language === 'vi' ? 'font-normal' : 'font-serif italic font-normal'}`}>pricing</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col"
                    >
                        <h3 className="text-xl font-medium mb-2">Basic</h3>
                        <div className="text-3xl font-semibold mb-6">$0<span className="text-base text-gray-500 font-normal">/month</span></div>
                        <p className="text-gray-600 mb-8 border-b border-gray-100 pb-8">Perfect for getting started and exploring the magic.</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4EA89B]" /> 5 analysis sessions per month
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4EA89B]" /> Basic emotion detection
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4EA89B]" /> Standard tone analysis
                            </li>
                        </ul>
                        <button className="w-full py-3 rounded-xl border border-[#4EA89B] text-[#4EA89B] font-medium hover:bg-[#4EA89B]/5 transition-colors">
                            Get Started
                        </button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="bg-primary/5 border border-primary/20 rounded-3xl p-8 shadow-sm flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-xl">Popular</div>
                        <h3 className="text-xl font-medium mb-2 text-primary">Encantta Pro</h3>
                        <div className="text-3xl font-semibold mb-6 text-primary">$12<span className="text-base opacity-70 font-normal">/month</span></div>
                        <p className="text-primary/80 mb-8 border-b border-primary/10 pb-8">Deep insights for those who want to truly understand.</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-sm text-primary">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Unlimited analysis sessions
                            </li>
                            <li className="flex items-center gap-3 text-sm text-primary">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Advanced psychological profiling
                            </li>
                            <li className="flex items-center gap-3 text-sm text-primary">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Hidden meaning extraction
                            </li>
                            <li className="flex items-center gap-3 text-sm text-primary">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Custom response suggestions
                            </li>
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                            Upgrade to Pro
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
