"use client"
const { usePathname } = require("next/navigation");
import { motion } from "framer-motion";

export default function FadeWrapper(props) {
    const { children, ...other } = props
    const pathname = usePathname()
    return (

        <motion.div
            key={pathname}
            className="fadeWrapper"
            initial="initial"
            animate="animate"
            exit="initial"
            variants={{
                initial: {
                    opacity: 0,
                    scale: 0.98
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
            }}
            transition={{
                ease: "linear",
                stiffness: 260,
                damping: 20,
                duration: .25
            }}
            {...other}
        >
            {children}
        </motion.div>
    )
}