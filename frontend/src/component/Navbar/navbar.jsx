import React from "react";
import { motion } from "framer-motion";
import './Navbar.css';

function Navbar() {
    console.log("navbar");

    return (
        <motion.div
            className="navbar"
        >
            <motion.div animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <h1>ABC</h1>
            </motion.div>

            <motion.div animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <h1>Hello</h1>
            </motion.div>
        </motion.div>
    );
}

export default Navbar;
