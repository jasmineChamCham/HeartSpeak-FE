import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
    return (
        <section className="relative px-6 py-24 md:py-32 gradient-sage">
            <div className="mx-auto max-w-3xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-balance font-display text-4xl font-semibold leading-tight text-white md:text-6xl">
                        Some conversations change everything.
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mx-auto mt-8 max-w-2xl text-balance text-lg font-light leading-relaxed text-white/90 md:text-xl"
                >
                    Choose to respond with clarity, empathy, and maturity.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="mt-12 flex justify-center"
                >
                    <Button
                        asChild
                        size="lg"
                        className="h-14 rounded-full bg-white px-8 text-base font-medium text-sage hover:bg-white/90 shadow-elevated transition-all"
                    >
                        <Link to="/register">Start Free Today</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
