import { motion } from "framer-motion";

export function UseCasesSection() {
    const useCases = [
        "Apologize without ego",
        "Set boundaries respectfully",
        "Express love clearly",
        "De-escalate conflict",
        "End things with grace",
        "Repair misunderstandings",
    ];

    return (
        <section className="bg-secondary/20 px-6 py-24 md:py-32">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                        Built for Conversations That Matter
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {useCases.map((useCase, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                            className="flex items-center justify-center rounded-2xl bg-card p-6 text-center shadow-soft border border-border/50"
                        >
                            <p className="text-lg font-medium text-foreground">
                                {useCase}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    className="mt-16 text-center"
                >
                    <p className="mx-auto max-w-xl text-balance text-sm font-light leading-relaxed text-muted-foreground md:text-base">
                        One emotionally reactive moment can damage connection.<br />
                        <span className="font-medium text-foreground">One emotionally mature response can protect it.</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
