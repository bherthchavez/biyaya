import React from "react";
import { motion } from "framer-motion";
import { RiCupFill } from "react-icons/ri";

const CoffeeLoadingAnimation = () => {
    // Steam animation variants
    const steamVariants = {
        initial: { y: 0, opacity: 0.5, scale: 1 },
        animate: { y: -20, opacity: 0, scale: 1.2 },
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen ">
            <motion.div
                className="relative flex flex-col items-center"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Steam Animation */}
                <div className="absolute top-[-40px] flex space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-10 bg-gray-900 rounded-full"
                            animate={{ y: [-10, -30, -10], opacity: [0.2, 1, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Coffee Cup SVG with Circular Handle */}
                <RiCupFill size={90} className="text-gray-800" />
            </motion.div>
            <div className="flex flex-col sm:flex-row justify-center text-center items-center gap-2 mt-16">
                <p className="text-xs font-thin text-gray-400">Designed and developed by: </p>

                <a href='https://julbertpruel.netlify.app/'
                    target='_blank' rel='noreferrer noopener'
                    className=" font-normal text-xs text-gray-400"
                >
                    Julbert Pruel
                </a>
            </div>
        </div>
    );
};

export default CoffeeLoadingAnimation;