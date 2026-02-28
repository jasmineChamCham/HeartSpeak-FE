import { motion } from "framer-motion";

export function ProblemSection() {
    return (
        <section className="relative bg-background px-6 py-24 md:py-32">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center md:text-left"
                >
                    <h2 className="text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                        Why Good Intentions Still Lead to Misunderstanding
                    </h2>
                </motion.div>

                <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="flex flex-col gap-6"
                    >
                        <p className="text-xl font-light leading-relaxed text-muted-foreground md:text-2xl">
                            You didn't mean to hurt them.
                            <br />
                            You didn't mean to sound cold.
                            <br />
                            You didn't mean to escalate the situation.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col gap-6"
                    >
                        <div className="space-y-6 rounded-3xl bg-secondary/30 p-8 shadow-sm">
                            <p className="text-lg font-medium leading-relaxed text-foreground md:text-xl">
                                But communication is not just about intention.
                                <br />
                                <span className="text-sage">It's about impact.</span>
                            </p>

                            <div className="h-px w-full bg-border" />

                            <p className="text-base font-light leading-relaxed text-muted-foreground">
                                Many relationships don't break from lack of love —<br />
                                they break from lack of emotional clarity.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
