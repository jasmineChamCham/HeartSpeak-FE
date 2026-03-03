import React from "react";
import { motion } from "framer-motion";

const services = [
    {
        id: "decode",
        title: "Decode What’s Unspoken",
        description: "Understand emotions beneath the surface, even when they’re not clearly expressed.",
    },
    {
        id: "reveal",
        title: "Reveal True Intention",
        description: "See what they really mean, not just what they say.",
    },
    {
        id: "respond",
        title: "Respond With Emotional Intelligence",
        description: "Craft thoughtful replies that build trust instead of tension.",
    },
    {
        id: "recognize",
        title: "Recognize Relationship Patterns",
        description: "Identify recurring dynamics and grow beyond them.",
    }
];

export function ServiceSection() {
    return (
        <section id="service" className="relative w-full overflow-hidden bg-background min-h-screen py-20 lg:h-screen lg:py-8 flex items-center px-6 md:px-12 text-foreground">
            <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">

                {/* Left Column: Image Area */}
                <div className="w-full lg:w-[45%] flex flex-col justify-between pt-4 lg:pt-0 relative">
                    {/* Label */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex items-center gap-3 mb-10 md:mb-16"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E8E6E1]/50 shadow-sm border border-black/5">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-[#2b647f] font-medium whitespace-nowrap underline decoration-1 underline-offset-4">
                            How Encantta Helps You
                        </span>
                    </motion.div>

                    <div className="relative w-full">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="w-full"
                        >
                            {/* Title fades in first */}
                            <motion.h3
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-xl md:text-[1.35rem] font-medium mb-6 text-[#18181A]"
                            >
                                Overthinking a Message?
                            </motion.h3>

                            <div className="flex gap-6 items-end">
                                {/* Image with subtle zoom-out (breathing) */}
                                <div className="w-40 h-48 md:w-48 md:h-56 overflow-hidden shadow-sm bg-black/5 shrink-0">
                                    <motion.img
                                        src="landing-images/sad-teen-girl-using-phone-while-sitting-sofa.jpg"
                                        initial={{ scale: 1.05 }}
                                        whileInView={{ scale: 1.0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="w-full h-full object-cover origin-center"
                                    />
                                </div>

                                {/* Caption fades in after 200ms */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                    className="text-[0.95rem] text-black/60 max-w-[170px] leading-[1.6] pb-2 space-y-4"
                                >
                                    <div className="space-y-1">
                                        <p className="italic">“Did I say something wrong?”</p>
                                        <p className="italic">“Do they still care?”</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Column: Text Information */}
                <div className="w-full lg:w-[55%] flex flex-col mt-4 lg:mt-0 lg:pl-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-[2rem] md:text-[2.75rem] font-medium leading-[1.1] tracking-tight mb-12 text-[#18181A] max-w-none whitespace-nowrap"
                    >
                        Support for every connection
                    </motion.h2>

                    <div className="flex flex-col">
                        {services.map((service, index) => {
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                                    key={service.id}
                                    className="group flex flex-col md:flex-row md:items-start py-8 border-t border-black/10 transition-colors duration-300 hover:bg-black/[0.02] -mx-4 px-4 rounded-xl cursor-default"
                                >
                                    <h4 className="text-lg md:text-xl text-[#18181A] font-medium w-full md:w-[45%] mb-2 md:mb-0">
                                        {service.title}
                                    </h4>
                                    <p className="text-[0.95rem] md:text-base text-black/70 w-full md:w-[55%] leading-relaxed pl-0 md:pl-4">
                                        {service.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                        <div className="border-t border-black/10 w-full" />
                    </div>
                </div>

            </div>
        </section>
    );
}
