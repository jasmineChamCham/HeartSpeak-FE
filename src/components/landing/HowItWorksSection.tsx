import { motion } from "framer-motion";
import { PenLine, Target, Send } from "lucide-react";

export function HowItWorksSection() {
    const steps = [
        {
            num: "01",
            title: "Write What You Feel",
            desc: "Raw. Honest. Unfiltered.",
            icon: <PenLine className="h-6 w-6 text-sage" />,
        },
        {
            num: "02",
            title: "Choose Your Intention",
            desc: "Clarify, apologize, express love, set a boundary.",
            icon: <Target className="h-6 w-6 text-sage" />,
        },
        {
            num: "03",
            title: "Send With Confidence",
            desc: "Receive a refined message grounded in empathy and maturity.",
            icon: <Send className="h-6 w-6 text-sage" />,
        },
    ];

    return (
        <section id="how-it-works" className="bg-background px-6 py-24 md:py-32">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-balance font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                        How It Works
                    </h2>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-3">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: i * 0.2, ease: "easeOut" }}
                            className="group relative flex flex-col gap-4 rounded-3xl bg-card p-8 shadow-card transition-all hover:shadow-elevated border border-border/50"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/10 transition-colors group-hover:bg-sage/20">
                                    {step.icon}
                                </div>
                                <span className="font-display text-2xl font-light text-muted-foreground/30">
                                    {step.num}
                                </span>
                            </div>

                            <h3 className="font-display text-2xl font-medium text-foreground">
                                {step.title}
                            </h3>

                            <p className="text-base font-light leading-relaxed text-muted-foreground">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
