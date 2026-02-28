import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, User, Home } from "lucide-react";

export function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    }, []);

    return (
        <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-12 pt-32 md:px-12 md:pb-16 text-left bg-black text-white">
            {/* Background Video */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-0 overflow-hidden bg-black object-cover"
            >
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    loop
                    preload="auto"
                    src="https://res.cloudinary.com/dyw50hhip/video/upload/v1772183028/landing-page-videos/ujimytcbekumegsaihmt.mp4"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
            </motion.div>

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
                        <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-medium leading-[1.1] tracking-tight text-white/95 mb-8 text-balance">
                            Stop guessing <br />
                            <span className="font-serif italic font-normal opacity-90 text-[#e4ece4]">what they're really saying.</span>
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
                                <h3 className="text-base font-normal mb-1">Emotional Clarity</h3>
                                <p className="text-sm text-white/70 leading-relaxed font-light">See the feeling and intent behind the message.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <User className="w-5 h-5 mt-1 shrink-0 text-white stroke-[1.5]" />
                            <div>
                                <h3 className="text-base font-normal mb-1">Never Be Left Wondering</h3>
                                <p className="text-sm text-white/70 leading-relaxed font-light">Get clear insight so you can respond with confidence.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Home className="w-5 h-5 mt-1 shrink-0 text-white stroke-[1.5]" />
                            <div>
                                <h3 className="text-base font-normal mb-1">A Safe Space for Your Heart</h3>
                                <p className="text-sm text-white/70 leading-relaxed font-light">Your most sensitive conversations stay private and secure.</p>
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
                            Advanced AI analysis to help you respond with empathy and confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#58c4b5] px-8 py-4 text-sm md:text-base font-medium text-white whitespace-nowrap transition-all hover:bg-[#4ea89b] shadow-lg"
                            >
                                See what they really mean <ArrowUpRight className="w-4 h-4 opacity-90" />
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-transparent backdrop-blur-md px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 border border-white/30 shadow-lg"
                            >
                                Contact <ArrowUpRight className="w-4 h-4 opacity-70" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
