"use client"
import { motion } from "framer-motion";

function ease(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export default function FadeWrapper(props) {
    const { children, animate = "animate", initial = "initial", exit = "initial", variants, transition, keyValue, ...other } = props

    return (
        <motion.div
            key={keyValue}
            className="fadeWrapper"
            initial={initial}
            animate={animate}
            exit={exit}
            variants={{
                initial: {
                    opacity: 0,
                    ...variants?.initial
                },
                animate: {
                    opacity: 1,
                    ...variants?.animate
                },
                ...variants
            }}
            transition={{
                ease: ease,
                duration: .35,
                ...transition
            }}
            {...other}
        >
            {children}
        </motion.div>
    )
}