import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services';
import { User, Lock, ArrowRight, Loader2, Mail, Key, ArrowLeft } from 'lucide-react';
import Toast from './Toast';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
    // Views: 'login' | 'forgot-password' | 'token-entry'
    const [view, setView] = useState('login');
    const [loading, setLoading] = useState(false);

    // Form States
    const [username, setUsername] = useState('ilham');
    const [password, setPassword] = useState('ilham123');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    // Toast State
    const [toast, setToast] = useState(null); // { message, type }

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        // Auto-clear logic is handled inside Toast component but we clear state here for cleanup if needed
        setTimeout(() => setToast(null), 3500);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            //const data = await authService.login({ email: username, password });
            //console.log('Login successful:', data);
           // if (data.data.token) {
           /*     sessionStorage.setItem('token', data.data.token);
                sessionStorage.setItem('user', JSON.stringify(data.data.user));
                showToast('Connexion réussie ! Bienvenue.', 'success');
                setTimeout(() => {
                    if (onLoginSuccess) onLoginSuccess(data.user);
                }, 1000);
            } else {
                showToast('Erreur de connexion : Token non reçu.', 'error');
            }*/
           showToast('Connexion réussie ! Bienvenue.', 'success');
        } catch (error) {
            console.error('Login error:', error);
            showToast(error.message || 'Échec de la connexion.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate sending email
        setTimeout(() => {
            setLoading(false);
            console.log(`Token sent to ${email}`);
            showToast(`Code envoyé à ${email}`, 'info');
            setView('token-entry');
        }, 1500);
    };

    const handleVerifyToken = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate token verification
        setTimeout(() => {
            setLoading(false);
            showToast('Token valide ! Accès autorisé.', 'success');
            // alert('Token valide ! Accès autorisé.'); 
            // Optionally redirect or reset
            setView('login');
            setPassword('');
        }, 1500);
    };

    return (
        <>
            {/* Toast Container */}
            <div className="toast-container">
                <AnimatePresence>
                    {toast && (
                        <Toast
                            key="toast"
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                className="login-container"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="login-header">
                    <img src="/logoHorizontal.jpeg" alt="AMS FOOD Logo" className="brand-logo" />
                    <p className="brand-subtitle">
                        {view === 'login' && 'Importation & Logistique'}
                        {view === 'forgot-password' && 'Récupération'}
                        {view === 'token-entry' && 'Vérification'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'login' && (
                        <motion.form
                            key="login-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleLogin}
                        >
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="login-input"
                                    placeholder="Nom d'utilisateur"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <User size={18} className="input-icon" />
                            </div>

                            <div className="input-group" style={{ marginBottom: '1rem' }}>
                                <input
                                    type="password"
                                    className="login-input"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock size={18} className="input-icon" />
                            </div>

                            <div className="forgot-password-link" onClick={() => setView('forgot-password')}>
                                Accès via un token
                            </div>

                            <SubmitButton loading={loading}>
                                Se connecter
                            </SubmitButton>
                        </motion.form>
                    )}

                    {view === 'forgot-password' && (
                        <motion.form
                            key="forgot-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleForgotPassword}
                        >
                            <div className="back-button" onClick={() => setView('login')}>
                                <ArrowLeft size={16} /> Retour
                            </div>

                            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                                Entrez votre email pour recevoir un code d'accès.
                            </p>

                            <div className="input-group">
                                <input
                                    type="email"
                                    className="login-input"
                                    placeholder="Votre Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail size={18} className="input-icon" />
                            </div>

                            <SubmitButton loading={loading}>
                                Envoyer le code
                            </SubmitButton>
                        </motion.form>
                    )}

                    {view === 'token-entry' && (
                        <motion.form
                            key="token-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleVerifyToken}
                        >
                            <div className="back-button" onClick={() => setView('forgot-password')}>
                                <ArrowLeft size={16} /> Retour
                            </div>

                            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                                Entrez le code reçu par email.
                            </p>

                            <div className="input-group">
                                <input
                                    type="text"
                                    className="login-input"
                                    placeholder="Code / Token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    required
                                />
                                <Key size={18} className="input-icon" />
                            </div>

                            <SubmitButton loading={loading}>
                                Vérifier le code
                            </SubmitButton>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};

// Reusable Button Component
const SubmitButton = ({ loading, children }) => (
    <motion.button
        type="submit"
        className="login-button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={loading ? {} : {
            boxShadow: [
                "0 0 0 0 rgba(255, 0, 0, 0)",
                "0 0 0 0 rgba(255, 0, 0, 0)",
            ]
        }}
    >
        {loading ? (
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
                <Loader2 size={20} />
            </motion.div>
        ) : (
            <>
                {children}
                <ArrowRight size={18} />
            </>
        )}
    </motion.button>
);

export default LoginForm;
