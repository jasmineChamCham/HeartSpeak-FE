import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function AboutSection() {
    return (
        <section id="about" className="relative w-full overflow-hidden bg-background h-screen flex items-center py-8 px-6 md:px-12 text-foreground">
            <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-center pl-0">

                {/* Left Content Column */}
                <div className="flex-1 w-full max-w-2xl lg:max-w-[45%] flex flex-col justify-center pt-4 lg:pt-0">

                    {/* Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex items-center gap-3 mb-10"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E8E6E1]/50 shadow-sm border border-black/5">
                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#58c4b5] to-[#7bdad1]" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-black/60 font-medium whitespace-nowrap">
                            About HeartSpeak
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-[2rem] md:text-[2.75rem] font-medium leading-[1.1] tracking-tight mb-8 text-[#18181A]"
                    >
                        Most relationships don't break from a lack of love. They fade from <span className="font-serif italic font-normal tracking-normal pr-1 text-[#2b2b2d]">lack of understanding.</span>
                    </motion.h2>

                    {/* Paragraph */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-[0.95rem] md:text-base text-black/70 font-light leading-[1.7] mb-10 max-w-[90%] space-y-4"
                    >
                        <p>
                            HeartSpeak gently analyzes your conversations to help you understand the emotions, intentions, and inner world of the people you love.
                            Because when you understand how someone thinks and feels, you stop reacting — and start connecting.
                        </p>
                        <p>
                            The quality of your life is shaped by the quality of your relationships.
                            And the quality of your relationships is shaped by how well you understand one another.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    >
                        <Link
                            to="/register"
                            className="shimmer-button inline-flex items-center justify-center gap-2 rounded-full bg-[#58c4b5] px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-[#4ea89b] shadow-[0_0_20px_rgba(88,196,181,0.2)] hover:shadow-[0_0_30px_rgba(88,196,181,0.4)] hover:scale-[1.02]"
                        >
                            Start free here <ArrowUpRight className="w-4 h-4 opacity-90" />
                        </Link>
                    </motion.div>
                </div>

                {/* Right Image Column */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex-1 w-full min-h-[300px] lg:min-h-[450px] relative mt-10 lg:mt-0"
                >
                    <div className="absolute inset-0 p-4 lg:p-6 bg-[#EDEBDF]/40 rounded-sm">
                        {/* Corner Ornaments (Custom SVG approximation) */}
                        <svg className="absolute top-8 left-8 w-12 h-12 text-white/60 mix-blend-overlay z-20 pointer-events-none" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 30V1H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                            <path d="M1 18L18 1" stroke="currentColor" strokeWidth="1" />
                            <circle cx="5" cy="5" r="1.5" fill="currentColor" />
                        </svg>

                        <svg className="absolute top-8 right-8 w-12 h-12 text-white/60 mix-blend-overlay z-20 pointer-events-none transform rotate-90" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 30V1H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                            <path d="M1 18L18 1" stroke="currentColor" strokeWidth="1" />
                            <circle cx="5" cy="5" r="1.5" fill="currentColor" />
                        </svg>

                        <svg className="absolute bottom-8 left-8 w-12 h-12 text-white/60 mix-blend-overlay z-20 pointer-events-none transform -rotate-90" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 30V1H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                            <path d="M1 18L18 1" stroke="currentColor" strokeWidth="1" />
                            <circle cx="5" cy="5" r="1.5" fill="currentColor" />
                        </svg>

                        <svg className="absolute bottom-8 right-8 w-12 h-12 text-white/60 mix-blend-overlay z-20 pointer-events-none transform rotate-180" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 30V1H30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                            <path d="M1 18L18 1" stroke="currentColor" strokeWidth="1" />
                            <circle cx="5" cy="5" r="1.5" fill="currentColor" />
                        </svg>

                        {/* Image */}
                        <div className="w-full h-full relative overflow-hidden group shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] bg-[#c9c8c4]">
                            <img
                                src="https://res.cloudinary.com/dyw50hhip/image/upload/v1772355787/landing-page-images/menuv41ra777batljc8a.jpg"
                                alt="Mental wellness calming landscape"
                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            />

                            {/* Subtle overlay */}
                            <div className="absolute inset-0 bg-black/10 mix-blend-overlay opacity-50" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
