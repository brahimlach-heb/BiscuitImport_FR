import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FileText, ChevronRight, Clock, CheckCircle2, XCircle, Search, Filter as FilterIcon, ArrowLeft, ChevronLeft, ChevronRight as ChevronRightIcon, Download, Loader2, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getHistory } from '../store/slices/historySlice';
import './InvoiceHistory.css';

const MOCK_INVOICES = [
    {
        id: 'INV-2026-001',
        date: '2026-01-14',
        amount: 1250.50,
        status: 'pending',
        items: 5,
        customer: 'Boulangerie Moderne',
        paymentMethod: 'Virement bancaire',
        products: [
            { name: 'Petit Beurre (Lot de 10)', quantity: 2, price: 45.00 },
            { name: 'Palmito 200g', quantity: 5, price: 12.50 },
            { name: 'Prince Chocolat 300g', quantity: 10, price: 18.00 },
            { name: 'Mikado Lait', quantity: 8, price: 15.00 },
            { name: 'Lu Hello! Cookies', quantity: 4, price: 22.00 }
        ]
    },
    {
        id: 'INV-2026-002',
        date: '2026-01-12',
        amount: 850.00,
        status: 'paid',
        items: 3,
        customer: 'Épicerie Centrale',
        paymentMethod: 'Carte Bancaire',
        products: [
            { name: 'Cookies Granola', quantity: 15, price: 20.00 },
            { name: 'Thé Menthe Premium', quantity: 5, price: 55.00 },
            { name: 'Biscuits aux Amandes', quantity: 10, price: 27.50 }
        ]
    },
    {
        id: 'INV-2025-156',
        date: '2025-12-28',
        amount: 3200.75,
        status: 'paid',
        items: 12,
        customer: 'Supermarché Azur',
        paymentMethod: 'Chèque',
        products: [
            { name: 'Assortiment Fêtes', quantity: 20, price: 150.00 },
            { name: 'Chocolat Noir 70%', quantity: 50, price: 10.00 }
        ]
    },
    {
        id: 'INV-2025-150',
        date: '2025-12-20',
        amount: 450.20,
        status: 'cancelled',
        items: 2,
        customer: 'Café de la Gare',
        paymentMethod: 'Espèces',
        products: [
            { name: 'Spéculoos (Vrac)', quantity: 5, price: 80.00 },
            { name: 'Sucre Roux 1kg', quantity: 10, price: 5.00 }
        ]
    },
];

const InvoiceHistory = ({ onBack }) => {
    const dispatch = useAppDispatch();
    const { history = [], loading, error } = useAppSelector(state => state.history);

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Modern carousel state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const carouselRef = useRef(null);

    // Motion values for smooth animations
    const x = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const dragX = useMotionValue(0);

    // Fetch history on mount
    // Fetch history on mount
    /* useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            dispatch(getHistory(token));
        }
    }, [dispatch]); */

    const isDemoMode = history.length === 0 && !loading;
    const allInvoices = isDemoMode ? MOCK_INVOICES : history;

    // Pagination logic
    const totalInvoices = allInvoices.length;
    const totalPages = Math.ceil(totalInvoices / itemsPerPage);
    const paginatedInvoices = allInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate carousel dimensions
    const getItemWidth = useCallback(() => {
        if (typeof window === 'undefined') return 320;
        if (window.innerWidth < 768) return 280;
        if (window.innerWidth < 1024) return 320;
        return 360;
    }, []);

    const getVisibleItems = useCallback(() => {
        if (typeof window === 'undefined') return 1;
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 1;
        return 1; // Always show 1 item, but larger
    }, []);

    const [itemWidth, setItemWidth] = useState(getItemWidth());
    const [visibleItems] = useState(getVisibleItems());

    // Update dimensions on resize
    useEffect(() => {
        const handleResize = () => {
            setItemWidth(getItemWidth());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [getItemWidth]);

    // Modern drag handlers with momentum
    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = (event, info) => {
        setIsDragging(false);
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (selectedInvoice?.products?.length) {
            const swipeThreshold = 50;
            const swipeVelocityThreshold = 500;

            let newIndex = currentIndex;

            // Enhanced swipe detection with velocity
            if (Math.abs(offset) > swipeThreshold || Math.abs(velocity) > swipeVelocityThreshold) {
                if (offset > 0 || velocity > 0) {
                    newIndex = Math.max(0, currentIndex - 1);
                } else {
                    newIndex = Math.min(selectedInvoice.products.length - 1, currentIndex + 1);
                }
            }

            setCurrentIndex(newIndex);
            x.set(-newIndex * itemWidth);
        }
    };

    // Navigation functions
    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            x.set(-(currentIndex - 1) * itemWidth);
        }
    };

    const goToNext = () => {
        if (selectedInvoice?.products?.length && currentIndex < selectedInvoice.products.length - 1) {
            setCurrentIndex(currentIndex + 1);
            x.set(-(currentIndex + 1) * itemWidth);
        }
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        x.set(-index * itemWidth);
    };

    // Reset carousel when invoice changes
    useEffect(() => {
        setCurrentIndex(0);
        x.set(0);
    }, [selectedInvoice, x]);

    // Handle PDF download with loading state
    const handleDownloadPDF = async () => {
        if (isDownloadingPDF) return;

        setIsDownloadingPDF(true);

        // Simulate PDF generation/download
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Here you would typically trigger the actual PDF download
        // For now, we'll just simulate it
        console.log(`Downloading PDF for invoice ${selectedInvoice.id}`);

        setIsDownloadingPDF(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24
            }
        },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            className="invoice-history-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="history-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <motion.button
                        className="back-btn-circular"
                        onClick={onBack}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            background: 'var(--bg-secondary)',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                    <h2><FileText size={28} style={{ color: 'var(--primary-accent)' }} /> Historique des factures</h2>
                </div>
            </div>


            <motion.div
                className="invoices-list"
                variants={containerVariants}
                animate="visible"
            >
                {loading ? (
                    <div className="loading-spinner-container" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary-accent)' }} />
                    </div>
                ) : (
                    <AnimatePresence mode='popLayout'>
                        {paginatedInvoices.length > 0 ? (
                            paginatedInvoices.map((invoice, index) => (
                                <motion.div
                                    key={invoice.id}
                                    className="invoice-item-card"
                                    variants={itemVariants}
                                    layout
                                    onClick={() => setSelectedInvoice(invoice)}
                                >
                                    <div className="inv-icon">
                                        <FileText size={20} />
                                    </div>
                                    <div className="inv-info">
                                        <h4>{invoice.id}</h4>
                                        <p>{invoice.items} articles • {invoice.customer}</p>
                                    </div>
                                    <div className="inv-date">
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Date</p>
                                        <p style={{ margin: 0, fontWeight: 500 }}>{new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                    <div className="inv-amount">
                                        {invoice.amount} DH
                                    </div>
                                    <div className={`inv-status status-${invoice.status}`}>
                                        {invoice.status === 'pending' && <Clock size={14} />}
                                        {invoice.status === 'paid' && <CheckCircle2 size={14} />}
                                        {invoice.status === 'cancelled' && <XCircle size={14} />}
                                    </div>
                                    <div className="inv-action">
                                        <ChevronRight size={20} />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                key="empty"
                                className="empty-history"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ textAlign: 'center', padding: '3rem 1rem' }}
                            >
                                <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Aucune facture réelle disponible pour le moment.</p>
                                <motion.button
                                    onClick={onBack}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: 'var(--primary-accent)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <ShoppingBag size={18} />
                                    Passer une commande
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </motion.div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="pagination-wrapper" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '2rem',
                    paddingBottom: '2rem'
                }}>
                    <button
                        className="pagination-arrow"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            opacity: currentPage === 1 ? 0.5 : 1
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    background: currentPage === i + 1 ? 'var(--primary-accent)' : 'var(--bg-secondary)',
                                    color: currentPage === i + 1 ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        className="pagination-arrow"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                    >
                        <ChevronRightIcon size={20} />
                    </button>

                    <div className="items-per-page" style={{ marginLeft: '1rem' }}>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            style={{
                                padding: '8px',
                                borderRadius: '8px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-main)',
                                cursor: 'pointer'
                            }}
                        >
                            <option value={5}>5 / page</option>
                            <option value={10}>10 / page</option>
                            <option value={20}>20 / page</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Invoice Detail Modal */}
            <AnimatePresence>
                {selectedInvoice && (
                    <motion.div
                        className="invoice-detail-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedInvoice(null)}
                    >
                        <motion.div
                            className="invoice-detail-modal"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="detail-modal-header">
                                <div className="header-content">
                                    <div className="invoice-badge">
                                        <FileText size={24} />
                                        <span>{selectedInvoice.id}</span>
                                    </div>
                                    <div className={`status-badge status-${selectedInvoice.status}`}>
                                        {selectedInvoice.status === 'pending' && <Clock size={16} />}
                                        {selectedInvoice.status === 'paid' && <CheckCircle2 size={16} />}
                                        {selectedInvoice.status === 'cancelled' && <XCircle size={16} />}
                                    </div>
                                </div>
                                <button className="close-modal-btn" onClick={() => setSelectedInvoice(null)}>
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="detail-modal-content">
                                {/* Invoice Summary Cards */}
                                <div className="summary-cards">
                                    <motion.div
                                        className="summary-card"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="card-icon">
                                            <FileText size={20} />
                                        </div>
                                        <div className="card-content">
                                            <label>Client</label>
                                            <p>{selectedInvoice.customer}</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="summary-card"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="card-icon">
                                            <Clock size={20} />
                                        </div>
                                        <div className="card-content">
                                            <label>Date</label>
                                            <p>{new Date(selectedInvoice.date).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="summary-card"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className="card-icon">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div className="card-content">
                                            <label>Articles</label>
                                            <p>{selectedInvoice.items} produits</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="summary-card payment-card"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="card-icon">
                                            💳
                                        </div>
                                        <div className="card-content">
                                            <label>Mode de paiement</label>
                                            <p>{selectedInvoice.paymentMethod}</p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Products Section - Modern Carousel */}
                                <motion.div
                                    className="products-section"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="products-header">
                                        <h4>Articles commandés</h4>
                                        <div className="carousel-controls">
                                            <motion.button
                                                className="carousel-nav-btn"
                                                onClick={goToPrevious}
                                                disabled={currentIndex === 0}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{
                                                    opacity: currentIndex === 0 ? 0.3 : 1,
                                                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                <ChevronLeft size={20} />
                                            </motion.button>

                                            <div className="carousel-indicators">
                                                {selectedInvoice.products?.map((_, idx) => (
                                                    <motion.button
                                                        key={idx}
                                                        className={`indicator ${currentIndex === idx ? 'active' : ''}`}
                                                        onClick={() => goToSlide(idx)}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.8 }}
                                                        animate={{
                                                            scale: currentIndex === idx ? 1.2 : 1,
                                                            backgroundColor: currentIndex === idx ? 'var(--primary-accent)' : 'var(--bg-tertiary)'
                                                        }}
                                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                    />
                                                ))}
                                            </div>

                                            <motion.div
                                                className="carousel-progress"
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: selectedInvoice.products?.length ? `${((currentIndex + 1) / selectedInvoice.products.length) * 100}%` : '0%'
                                                }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                            />

                                            <motion.button
                                                className="carousel-nav-btn"
                                                onClick={goToNext}
                                                disabled={!selectedInvoice?.products?.length || currentIndex >= selectedInvoice.products.length - 1}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{
                                                    opacity: (!selectedInvoice?.products?.length || currentIndex >= selectedInvoice.products.length - 1) ? 0.3 : 1,
                                                    cursor: (!selectedInvoice?.products?.length || currentIndex >= selectedInvoice.products.length - 1) ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                <ChevronRightIcon size={20} />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div className="products-carousel-container">
                                        <motion.div
                                            className="products-carousel"
                                            ref={carouselRef}
                                            style={{ x: xSpring }}
                                            drag="x"
                                            dragConstraints={{
                                                left: -(selectedInvoice?.products?.length - 1) * itemWidth || 0,
                                                right: 0
                                            }}
                                            dragElastic={0.1}
                                            onDragStart={handleDragStart}
                                            onDragEnd={handleDragEnd}
                                            whileTap={{ cursor: 'grabbing' }}
                                        >
                                            {selectedInvoice.products?.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    className="product-item-carousel"
                                                    style={{ width: itemWidth }}
                                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                        y: 0,
                                                        transition: {
                                                            delay: 0.6 + idx * 0.1,
                                                            type: 'spring',
                                                            stiffness: 300,
                                                            damping: 20
                                                        }
                                                    }}
                                                    whileHover={{
                                                        scale: 1.02,
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                                        transition: { type: 'spring', stiffness: 400 }
                                                    }}
                                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                                >
                                                    <div className="product-info">
                                                        <h5>{item.name}</h5>
                                                        <div className="product-details">
                                                            <span className="quantity">Quantité: {item.quantity}</span>
                                                            <span className="price">Prix: {item.price.toFixed(2)} DH</span>
                                                        </div>
                                                    </div>
                                                    <div className="product-total">
                                                        <span className="total-amount">
                                                            {(item.quantity * item.price).toFixed(2)} DH
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Enhanced Footer with Totals */}
                            <motion.div
                                className="detail-footer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="totals-breakdown">
                                    <div className="totals-row">
                                        <span className="label">Sous-total HT</span>
                                        <span className="amount">{(selectedInvoice.amount / 1.2).toFixed(2)} DH</span>
                                    </div>
                                    <div className="totals-row">
                                        <span className="label">TVA (20%)</span>
                                        <span className="amount">{(selectedInvoice.amount - (selectedInvoice.amount / 1.2)).toFixed(2)} DH</span>
                                    </div>
                                    <div className="totals-row total-row">
                                        <span className="label">Total TTC</span>
                                        <span className="amount">{selectedInvoice.amount.toFixed(2)} DH</span>
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <motion.button
                                        className={`pdf-download-btn ${isDownloadingPDF ? 'downloading' : ''}`}
                                        onClick={handleDownloadPDF}
                                        disabled={isDownloadingPDF}
                                        whileHover={{ scale: isDownloadingPDF ? 1 : 1.05 }}
                                        whileTap={{ scale: isDownloadingPDF ? 1 : 0.95 }}
                                        style={{
                                            pointerEvents: isDownloadingPDF ? 'none' : 'auto'
                                        }}
                                    >
                                        <motion.div
                                            className="btn-content"
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {isDownloadingPDF ? (
                                                <>
                                                    <Loader2 size={20} className="btn-icon spinning" />
                                                    <span className="btn-text">Création du PDF...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={20} className="btn-icon" />
                                                    <span className="btn-text">Télécharger PDF</span>
                                                </>
                                            )}
                                        </motion.div>

                                        {isDownloadingPDF && (
                                            <motion.div
                                                className="progress-bar"
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 2, ease: 'easeInOut' }}
                                            />
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default InvoiceHistory;
