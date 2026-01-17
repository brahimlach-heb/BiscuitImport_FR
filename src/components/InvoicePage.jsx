import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User as UserIcon, MapPin, Phone, CheckCircle, ArrowLeft, Send, Mail, AlertCircle } from 'lucide-react';
import './InvoicePage.css';

const InvoicePage = ({ items, onValidate, onCancel }) => {
    const [customer, setCustomer] = useState({
        name: '',
        address: '',
        phone: '',
        email: ''
    });

    const [error, setError] = useState('');

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.20; // 20% TVA
    const total = subtotal + tax;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
        if (error) setError(''); // Clear error on typing
    };

    const handleValidate = () => {
        if (!customer.name.trim() || !customer.address.trim() || !customer.phone.trim() || !customer.email.trim()) {
            setError('Veuillez renseigner toutes les informations requises pour valider la commande.');
            return;
        }

        // Optional: Simple email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customer.email)) {
            setError('Veuillez renseigner une adresse email valide.');
            return;
        }

        onValidate(customer);
    };

    return (
        <motion.div
            className="invoice-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <div className="invoice-paper">
                {/* Header */}
                <div className="invoice-header">
                    <div className="invoice-logo">
                        <FileText size={32} />
                        <span>FACTURE</span>
                    </div>
                    <div className="invoice-meta">
                        <p>Date : {new Date().toLocaleDateString('fr-FR')}</p>
                        <p>N° Facture : {Math.floor(Math.random() * 900000) + 100000}</p>
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
                            <button className="invoice-btn btn-cancel" onClick={onCancel}>
                                <ArrowLeft size={18} /> Annuler
                            </button>
                            <button
                                className="invoice-btn btn-validate"
                                onClick={handleValidate}
                            >
                                Valider la commande <Send size={18} />
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
                                    <span>TOTAL GÉNÉRAL</span>
                                    <span>{total.toFixed(2)} DH</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Actions (Visible only on mobile) */}
                <div className="invoice-actions mobile-only">
                    <button className="invoice-btn btn-cancel" onClick={onCancel}>
                        <ArrowLeft size={18} /> Annuler
                    </button>
                    <button
                        className="invoice-btn btn-validate"
                        onClick={handleValidate}
                    >
                        Valider la commande <Send size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default InvoicePage;
