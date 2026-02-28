import { motion } from "framer-motion";

export function TestimonialSection() {
    const testimonials = [
        {
            quote: "I finally sent a message I've been rewriting for years.",
        },
        {
            quote:
                "The tone felt calm, not defensive. It changed the entire conversation.",
        },
    ];

    return (
        <section className="bg-background px-6 py-24 md:py-32">
            <div className="mx-auto max-w-4xl text-center">
                <div className="grid gap-12 md:grid-cols-2">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                            className="flex flex-col items-center gap-6"
                        >
                            <p className="text-balance font-display text-2xl font-light italic leading-relaxed text-muted-foreground md:text-3xl">
                                "{testimonial.quote}"
                            </p>
                            <div className="h-px w-12 bg-border" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
