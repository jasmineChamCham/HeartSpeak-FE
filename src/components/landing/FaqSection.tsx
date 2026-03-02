import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How accurate is the analysis?",
        answer: "Our AI is trained on vast psychological and linguistic datasets to understand nuance, subtext, and emotional tone. While it provides profound insights, we recommend using it as a tool for empathy rather than absolute truth."
    },
    {
        question: "Are my conversations private?",
        answer: "Absolutely. We employ end-to-end encryption for all sessions. Your conversation data is never sold, and is only used to provide your analysis. You can delete your history at any time."
    },
    {
        question: "Can it really tell what someone is thinking?",
        answer: "It analyzes the underlying patterns in text—word choice, phrasing, hesitations, and context—to infer likely emotional states and unsaid intentions. It helps you see the emotional reality beneath the surface."
    },
    {
        question: "Does it work in languages other than English?",
        answer: "Currently, our most accurate models are optimized for English, but we are actively working on supporting Spanish, French, and Mandarin in the near future."
    }
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="relative w-full overflow-hidden bg-background flex flex-col items-center py-20 px-6 md:px-12 text-foreground">
            <div className="max-w-3xl w-full mx-auto flex flex-col items-center">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-12 w-full mb-12">
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
                            FAQ
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
                            Frequently asked <span className="font-serif italic font-normal text-[#2b2b2d]">questions</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="border border-gray-200 rounded-2xl overflow-hidden bg-white/40"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-medium text-[#18181A] text-lg">{faq.question}</span>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-gray-600 font-light leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
