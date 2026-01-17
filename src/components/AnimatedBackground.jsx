import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, GlassWater, Coffee, CupSoda, Package } from 'lucide-react';

const AnimatedBackground = () => {
    // Generate random particles for the global trade effect
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 5,
    }));

    // Food icons to animate (Floating/Rotating)
    const foodIcons = Array.from({ length: 12 }).map((_, i) => ({
        id: `food-${i}`,
        Icon: i % 2 === 0 ? Cookie : (i % 3 === 0 ? Coffee : GlassWater),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 24, // Varying sizes
        duration: 15 + Math.random() * 15,
        delay: Math.random() * 5,
        rotation: Math.random() * 360,
    }));

    // Shipping/Importation Boxes (Moving horizontally across screen)
    const shippingBoxes = Array.from({ length: 6 }).map((_, i) => ({
        id: `box-${i}`,
        y: 10 + Math.random() * 80, // Spread vertically
        size: 20 + Math.random() * 10,
        duration: 20 + Math.random() * 15,
        delay: Math.random() * 10,
    }));

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            overflow: 'hidden',
            // Dynamic background using CSS variables
            background: 'radial-gradient(circle at 50% 50%, var(--color-secondary-light) 0%, var(--color-secondary) 100%)',
        }}>
            {/* Abstract World Map grid lines (subtle) */}
            <svg
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0.1,
                }}
            >
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Floating Food Icons */}
            {foodIcons.map((item) => (
                <motion.div
                    key={item.id}
                    style={{
                        position: 'absolute',
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        opacity: 0.15, // Subtle appearance
                        color: 'white',
                    }}
                    initial={{
                        rotate: item.rotation,
                        scale: 0.8
                    }}
                    animate={{
                        y: [0, -30, 0], // Floating motion
                        rotate: [item.rotation, item.rotation + 360], // Slow rotation
                        opacity: [0.1, 0.2, 0.1], // Pulsing opacity
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <item.Icon size={item.size} />
                </motion.div>
            ))}

            {/* Importation/Shipping Boxes - NEW ANIMATION */}
            {shippingBoxes.map((box) => (
                <motion.div
                    key={box.id}
                    style={{
                        position: 'absolute',
                        top: `${box.y}%`,
                        left: '-50px', // Start off-screen left
                        opacity: 0.3,
                        color: '#FF0000', // Red boxes for branding
                    }}
                    animate={{
                        x: ['0vw', '110vw'], // Move across screen
                        opacity: [0, 0.3, 0.3, 0], // Fade in/out at edges
                    }}
                    transition={{
                        duration: box.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: box.delay,
                    }}
                >
                    <Package size={box.size} />
                </motion.div>
            ))}

            {/* Moving Particles/Trade Routes */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: '#FF0000', // Subtle red dots
                        opacity: 0.4,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        x: [0, Math.random() * 200 - 100], // Move horizontally
                        y: [0, Math.random() * 200 - 100], // Move vertically
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: particle.delay,
                    }}
                />
            ))}

            {/* Connecting lines - visual metaphor for logistics */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.2 }}>
                <motion.path
                    d="M 0 50 Q 50 20 100 50"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
                <motion.path
                    d="M 10 90 Q 50 60 90 90"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 7, delay: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
            </svg>

        </div>
    );
};

export default AnimatedBackground;
