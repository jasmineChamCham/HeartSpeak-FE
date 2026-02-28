import { motion } from "framer-motion";

export function ShiftSection() {
    return (
        <section className="relative px-6 py-24 md:py-32 gradient-warm">
            <div className="mx-auto max-w-3xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                        Emotional Intelligence in Real Conversations
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-12 space-y-8 text-lg font-light leading-relaxed text-muted-foreground md:text-xl"
                >
                    <p>
                        HeartSpeak helps you <span className="font-medium text-foreground">slow down, reflect, and respond</span> with intention.
                    </p>

                    <p>
                        Instead of reacting from ego or fear,<br className="hidden sm:block" />
                        you communicate from understanding.
                    </p>

                    <div className="mx-auto my-8 h-px w-16 bg-sage/30" />

                    <p className="font-display italic">
                        This is not about sounding perfect.<br className="hidden sm:block" />
                        It's about aligning what you feel with what they receive.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
