import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function TrustSection() {
    const points = [
        "We do not store conversations",
        "We do not sell data",
        "We do not train on your private messages",
    ];

    return (
        <section className="bg-secondary/20 px-6 py-24 md:py-32">
            <div className="mx-auto max-w-2xl text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-sage/10 text-sage"
                >
                    <ShieldCheck className="h-8 w-8" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="font-display text-3xl font-semibold text-foreground md:text-4xl"
                >
                    Your Words Stay Yours
                </motion.h2>

                <motion.ul
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="mt-12 space-y-4 text-left md:text-center"
                >
                    {points.map((point, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-3 text-lg font-light text-muted-foreground md:justify-center"
                        >
                            <div className="h-1.5 w-1.5 rounded-full bg-sage" />
                            {point}
                        </li>
                    ))}
                </motion.ul>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    className="mt-12"
                >
                    <p className="font-display font-medium text-foreground">
                        Your emotional world deserves safety.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
