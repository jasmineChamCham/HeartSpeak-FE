import React from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin } from "lucide-react";

export function ContactSection() {
    return (
        <section id="contact" className="relative w-full overflow-hidden bg-[#EDEBDF]/30 flex flex-col items-center py-24 px-6 md:px-12 text-foreground">
            <div className="max-w-5xl w-full mx-auto flex flex-col items-center">

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
                            Contact Us
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
                            We're here to help you <span className="font-serif italic font-normal text-[#2b2b2d]">connect better.</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {/* Email */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-gray-100"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-[#18181A]">Email Us</h3>
                        <p className="text-gray-500 font-light mb-4 text-sm">For general inquiries and support.</p>
                        <a href="mailto:hello@heartspeak.ai" className="text-primary font-medium hover:underline">hello@heartspeak.ai</a>
                    </motion.div>

                    {/* Live Chat */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-gray-100"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-[#18181A]">Live Chat</h3>
                        <p className="text-gray-500 font-light mb-4 text-sm">Speak directly to our support team.</p>
                        <button className="text-primary font-medium hover:underline">Start a conversation</button>
                    </motion.div>

                    {/* Office */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-gray-100"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-[#18181A]">Office</h3>
                        <p className="text-gray-500 font-light mb-4 text-sm">Come say hello at our headquarters.</p>
                        <span className="text-gray-800 font-medium">San Francisco, CA</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
