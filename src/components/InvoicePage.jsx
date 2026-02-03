import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User as UserIcon, MapPin, Phone, CheckCircle, ArrowLeft, Send, Mail, AlertCircle, Truck } from 'lucide-react';
import Toast from './Toast';
import { orderService } from '../services/orderService';
import './InvoicePage.css';

const InvoicePage = ({ items, onValidate, onCancel, user }) => {
    const [customer, setCustomer] = useState({
        name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
        address: user?.address || '',
        phone: user?.phone || '',
        email: user?.email || ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [recap, setRecap] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.20; // 20% TVA
    const total = subtotal + tax;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
        if (error) setError(''); // Clear error on typing
    };

    const handleValidate = async () => {
        if (!customer.name.trim() || !customer.address.trim() || !customer.phone.trim() || !customer.email.trim()) {
            setNotification({
                type: 'error',
                message: 'Veuillez renseigner toutes les informations requises pour valider la commande.'
            });
            return;
        }

        // Optional: Simple email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customer.email)) {
            setNotification({
                type: 'error',
                message: 'Veuillez renseigner une adresse email valide.'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await onValidate(customer);
            const payload = response?.data?.order || response?.data || response?.order || response;
            const orderId = payload?.order_number || payload?.orderNumber || payload?.id || response?.order_number || response?.orderNumber || response?.id;

            setRecap({
                orderId,
                date: new Date(),
                customer: { ...customer },
                items: [...items],
                subtotal,
                tax,
                total
            });
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Erreur lors de la validation de la commande. Veuillez réessayer.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadQuote = async () => {
        if (isDownloading) return;
        const token = sessionStorage.getItem('token');
        if (!token || !recap?.orderId) {
            setNotification({
                type: 'error',
                message: 'Impossible de télécharger le devis pour le moment.'
            });
            return;
        }

        setIsDownloading(true);
        try {
            const blob = await orderService.downloadQuote(recap.orderId, token);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `devis-INV-${recap.orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Erreur lors du téléchargement du devis.'
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            className="invoice-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            {/* Toast Notifications */}
            <AnimatePresence>
                {notification && (
                    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
                        <Toast
                            message={notification.message}
                            type={notification.type}
                            onClose={() => setNotification(null)}
                            duration={3000}
                        />
                    </div>
                )}
            </AnimatePresence>

            {recap ? (
                <div className="invoice-paper">
                    <div className="invoice-header">
                        <div className="invoice-logo">
                            <FileText size={32} />
                            <span>RÉCAPITULATIF DEVIS</span>
                        </div>
                        <div className="invoice-meta">
                            <p>Date : {recap.date.toLocaleDateString('fr-FR')}</p>
                            {recap.orderId && <p>N° Devis : {recap.orderId}</p>}
                        </div>
                    </div>

                    <div className="invoice-recap-body">
                        <div className="recap-section">
                            <h4>Informations Client</h4>
                            <div className="recap-info-grid">
                                <div className="recap-info-row">
                                    <span className="recap-info-label">Nom</span>
                                    <span className="recap-info-value">{recap.customer.name}</span>
                                </div>
                                <div className="recap-info-row">
                                    <span className="recap-info-label">Email</span>
                                    <span className="recap-info-value">{recap.customer.email}</span>
                                </div>
                                <div className="recap-info-row">
                                    <span className="recap-info-label">Téléphone</span>
                                    <span className="recap-info-value">{recap.customer.phone}</span>
                                </div>
                                <div className="recap-info-row full">
                                    <span className="recap-info-label">Adresse</span>
                                    <span className="recap-info-value">{recap.customer.address}</span>
                                </div>
                            </div>
                        </div>

                        <div className="recap-section">
                            <h4>Détail de la commande</h4>
                            <div className="recap-items">
                                {recap.items.map((item, index) => (
                                    <div key={item.id || index} className="recap-item-row">
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>{(item.price * item.quantity).toFixed(2)} DH</span>
                                    </div>
                                ))}
                            </div>
                            <div className="recap-totals">
                                <div className="recap-total-row">
                                    <span>Sous-total</span>
                                    <span>{recap.subtotal.toFixed(2)} DH</span>
                                </div>
                                <div className="recap-total-row">
                                    <span>TVA (20%)</span>
                                    <span>{recap.tax.toFixed(2)} DH</span>
                                </div>
                                <div className="recap-total-row total">
                                    <span>Total</span>
                                    <span>{recap.total.toFixed(2)} DH</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="invoice-recap-actions">
                        <button
                            className="invoice-btn btn-cancel"
                            onClick={() => {
                                setRecap(null);
                                onCancel();
                            }}
                        >
                            <ArrowLeft size={18} /> Retour à l'accueil
                        </button>
                        <button
                            className="invoice-btn btn-validate"
                            onClick={handleDownloadQuote}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <>
                                    <motion.div
                                        animate={{ x: [-10, 10, -10] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <Truck size={18} />
                                    </motion.div>
                                    <span>Téléchargement...</span>
                                </>
                            ) : (
                                <>
                                    Télécharger le devis <FileText size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="invoice-paper">
                {/* Header */}
                <div className="invoice-header">
                    <div className="invoice-logo">
                        <FileText size={32} />
                        <span>DEVIS</span>
                    </div>
                    <div className="invoice-meta">
                        <p>Date : {new Date().toLocaleDateString('fr-FR')}</p>
                        <p>N° Devis : xxxxxxx</p>
                    </div>
                </div>

                <div className="invoice-split-view">
                    {/* Left Column: Customer Info */}
                    <div className="invoice-left">
                        <div className="customer-info-section">
                            <h3><UserIcon size={18} /> Informations Client</h3>
                            <div className="info-form">
                                <div className="input-field">
                                    <label>Nom Complet</label>
                                    <div className="input-with-icon">
                                        <UserIcon size={16} />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Jean Dupont"
                                            value={customer.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="input-field">
                                    <label>Email</label>
                                    <div className="input-with-icon">
                                        <Mail size={16} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="jean.dupont@example.com"
                                            value={customer.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="input-field">
                                    <label>Téléphone</label>
                                    <div className="input-with-icon">
                                        <Phone size={16} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="+212 600 000 000"
                                            value={customer.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="input-field full-width">
                                    <label>Adresse de Livraison</label>
                                    <div className="input-with-icon">
                                        <MapPin size={16} />
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="123 Rue de l'Océan, Casablanca"
                                            value={customer.address}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="validation-error"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="invoice-actions desktop-only">
                            <button className="invoice-btn btn-cancel" onClick={onCancel} disabled={isLoading}>
                                <ArrowLeft size={18} /> Annuler
                            </button>
                            <button
                                className="invoice-btn btn-validate"
                                onClick={handleValidate}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ x: [-10, 10, -10] }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                            style={{ display: 'flex', alignItems: 'center' }}
                                        >
                                            <Truck size={18} />
                                        </motion.div>
                                        <span>Envoi en cours...</span>
                                    </>
                                ) : (
                                    <>
                                        Valider la commande <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="invoice-right">
                        <div className="order-summary-section">
                            <h3>Détail de la commande</h3>
                            <div className="items-simple-list">
                                {items.map((item, index) => (
                                    <div key={item.id || index} className="item-simple-row">
                                        <div className="item-main-info">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty">x{item.quantity}</span>
                                        </div>
                                        <span className="item-line-total">{(item.price * item.quantity).toFixed(2)} DH</span>
                                    </div>
                                ))}
                            </div>

                            <div className="invoice-totals">
                                <div className="total-row">
                                    <span>Sous-total</span>
                                    <span>{subtotal.toFixed(2)} DH</span>
                                </div>
                                <div className="total-row">
                                    <span>TVA (20%)</span>
                                    <span>{tax.toFixed(2)} DH</span>
                                </div>
                                <div className="total-row grand-total">
                                    <span>TOTAL</span>
                                    <span>{total.toFixed(2)} DH</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Actions (Visible only on mobile) */}
                <div className="invoice-actions mobile-only">
                    <button className="invoice-btn btn-cancel" onClick={onCancel} disabled={isLoading}>
                        <ArrowLeft size={18} /> Annuler
                    </button>
                    <button
                        className="invoice-btn btn-validate"
                        onClick={handleValidate}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <motion.div
                                    animate={{ x: [-10, 10, -10] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <Truck size={18} />
                                </motion.div>
                                <span>Envoi...</span>
                            </>
                        ) : (
                            <>
                                Valider la commande <Send size={18} />
                            </>
                        )}
                    </button>
                </div>
                </div>
            )}
        </motion.div>
    );
};

export default InvoicePage;
