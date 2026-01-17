import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="toast-icon" size={20} />,
        error: <XCircle className="toast-icon" size={20} style={{ color: '#ef4444' }} />,
        info: <Info className="toast-icon" size={20} style={{ color: '#3b82f6' }} />
    };

    return (
        <motion.div
            className={`toast ${type}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
        >
            {icons[type]}
            <div className="toast-content">
                <div className="toast-title">
                    {type === 'success' ? 'Succès' : type === 'error' ? 'Erreur' : 'Info'}
                </div>
                <div className="toast-message">{message}</div>
            </div>
        </motion.div>
    );
};

export default Toast;
