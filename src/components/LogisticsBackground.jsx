import React from 'react';
import { motion } from 'framer-motion';
import { Package, Candy, CupSoda } from 'lucide-react';

const LogisticsBackground = () => {
    // Items representing different product types being transported
    const logisticsItems = Array.from({ length: 8 }).map((_, i) => ({
        id: `logistic-${i}`,
        Icon: i % 3 === 0 ? Package : (i % 3 === 1 ? Candy : CupSoda),
        y: 10 + Math.random() * 85, // Random vertical position (10% to 95%)
        size: 24 + Math.random() * 16, // Random size
        duration: 25 + Math.random() * 20, // Slow movement (25s to 45s)
        delay: Math.random() * 15, // Staggered start
        opacity: 0.1 + Math.random() * 0.1, // Very subtle opacity (0.1 to 0.2)
    }));

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0, // Behind content but in front of white bg
            pointerEvents: 'none', // Allow clicks to pass through
            overflow: 'hidden',
        }}>
            {/* Grid Pattern (Subtle logistics map feel) */}
            <svg
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0.05,
                }}
            >
                <pattern id="logistics-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--grid-color)" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#logistics-grid)" />
            </svg>

            {/* Moving Logistics Items */}
            {logisticsItems.map((item) => (
                <motion.div
                    key={item.id}
                    style={{
                        position: 'absolute',
                        top: `${item.y}%`,
                        left: '-50px',
                        color: 'var(--text-secondary)', // Use gray for subtlety
                        opacity: item.opacity,
                    }}
                    animate={{
                        x: ['-5vw', '105vw'], // Move from left off-screen to right off-screen
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: item.delay,
                    }}
                >
                    <item.Icon size={item.size} />
                </motion.div>
            ))}
        </div>
    );
};

export default LogisticsBackground;
