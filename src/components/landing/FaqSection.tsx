import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "What is Encantta?",
        answer: "Encantta is an AI tool that helps you understand what’s really happening beneath your conversations. It looks at tone, wording, and emotional patterns to reveal what might be implied but not clearly said. Instead of overthinking, you get calm, structured clarity."
    },
    {
        question: "Are my conversations private?",
        answer: "Yes, your conversations are handled securely and used only to generate your analysis. We don’t sell, share, or publicly store your messages. Your privacy and trust are always respected."
    },
    {
        question: "How accurate is the analysis?",
        answer: "Encantta uses Gemini AI models to analyze your conversations, and you can choose which specific model is used for your analysis. Because communication is nuanced, you can comment on the analysis results if anything feels incomplete or slightly off. The system will then refine the results with your added context to provide deeper, more personalized insights."
    },
    {
        question: "Can I ask follow-up questions after the analysis?",
        answer: "Yes, you can continue the conversation after receiving your analysis. Our built-in chatbot lets you ask deeper questions, request clarification, or get help crafting a response. It’s designed to support you until you feel fully clear."
    },
    {
        question: "Will this help me improve my communication skills?",
        answer: "Yes, and that’s one of the biggest benefits. Over time, you’ll start recognizing emotional patterns and communication signals on your own. With practice, clarity turns into confidence and stronger real-life communication skills."
    }
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="relative w-full overflow-hidden bg-background min-h-screen flex items-center px-6 md:px-12 mt-12 text-foreground">
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
                            Frequently Asked Questions
                        </span>
                    </motion.div>

                </div>

                <div className="w-full max-w-3xl mx-auto space-y-4">
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
