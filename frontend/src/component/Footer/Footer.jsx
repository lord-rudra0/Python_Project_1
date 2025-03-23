import React from "react";
import { motion } from "framer-motion";
import './Footer.css';

function Footer() {
    return (
        <motion.footer
            className="footer"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                © {new Date().getFullYear()} PDF Summarizer. All rights reserved.
            </motion.p>
        </motion.footer>
    );
}

export default Footer; 