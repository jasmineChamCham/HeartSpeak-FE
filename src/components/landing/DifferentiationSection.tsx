import { motion } from "framer-motion";

export function DifferentiationSection() {
    return (
        <section className="bg-background px-6 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                        Not Just Another AI Tool
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-12 space-y-8"
                >
                    <div className="rounded-3xl border border-sage/20 bg-sage/5 p-8 md:p-12">
                        <p className="text-xl font-light text-muted-foreground md:text-2xl">
                            Most AI helps you sound smarter.
                            <br />
                            <span className="mt-2 block font-medium text-foreground">
                                HeartSpeak helps you become emotionally wiser.
                            </span>
                        </p>
                    </div>

                    <div className="space-y-4 pt-4 text-lg font-light leading-relaxed text-muted-foreground">
                        <p>
                            It doesn't just rewrite sentences.
                            <br className="hidden sm:block" />
                            It refines intention.
                        </p>

                        <p className="font-display italic">
                            Because what matters isn't what you meant —<br className="hidden sm:block" />
                            it's what they felt.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
