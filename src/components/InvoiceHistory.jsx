import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FileText, ChevronRight, Clock, CheckCircle2, XCircle, Search, Filter as FilterIcon, ArrowLeft, ChevronLeft, ChevronRight as ChevronRightIcon, Download, Loader2, ShoppingBag, Trash2, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getOrdersByUser, getOrderById, deleteOrder } from '../store/slices/orderSlice';
import { downloadQuote } from '../store/slices/orderSlice';
import './InvoiceHistory.css';

const InvoiceHistory = ({ onBack }) => {
    const dispatch = useAppDispatch();
    const { orders = [], loading, error } = useAppSelector(state => state.order);

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter state
    const [statusFilter, setStatusFilter] = useState('ALL');

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

    // Fetch orders on mount
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            console.log('🔄 InvoiceHistory - Fetching orders...');
            dispatch(getOrdersByUser(token)).then((result) => {
                console.log('📦 InvoiceHistory - Orders fetched:', result.payload);
            });
        }
    }, [dispatch]);

    console.log('🏠 InvoiceHistory - orders:', orders);
    console.log('🏠 InvoiceHistory - loading:', loading);
    
    const allInvoices = orders.map(order => ({
        id: order.order_number || order.id,
        date: order.created_at,
        amount: order.total,
        status: order.status?.toUpperCase() || 'PENDING',
        items: order.total_products || order.lines?.length || 0,
        customer: order.customer_name,
        paymentMethod: 'Non spécifié',
        products: order.lines?.map(line => ({
            name: line.product?.name || 'Produit inconnu',
            quantity: line.quantity,
            price: line.unit_price
        })) || []
    }));
    
    console.log('📋 InvoiceHistory - allInvoices:', allInvoices);

    // Filter invoices by status
    const filteredInvoices = statusFilter === 'ALL' 
        ? allInvoices 
        : allInvoices.filter(invoice => invoice.status === statusFilter);

    // Pagination logic
    const totalInvoices = filteredInvoices.length;
    const totalPages = Math.ceil(totalInvoices / itemsPerPage);
    const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Reset to first page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    // Status filter options with counts
    const statusOptions = [
        { value: 'ALL', label: 'Tous', count: allInvoices.length },
        { value: 'PENDING', label: 'En attente', count: allInvoices.filter(inv => inv.status === 'PENDING').length },
        { value: 'CONFIRMED', label: 'Confirmé', count: allInvoices.filter(inv => inv.status === 'CONFIRMED').length },
        { value: 'PAID', label: 'Payé', count: allInvoices.filter(inv => inv.status === 'PAID').length },
        { value: 'PROCESSING', label: 'En traitement', count: allInvoices.filter(inv => inv.status === 'PROCESSING').length },
        { value: 'SHIPPED', label: 'Expédié', count: allInvoices.filter(inv => inv.status === 'SHIPPED').length },
        { value: 'DELIVERED', label: 'Livré', count: allInvoices.filter(inv => inv.status === 'DELIVERED').length },
        { value: 'CANCELLED', label: 'Annulé', count: allInvoices.filter(inv => inv.status === 'CANCELLED').length }
    ].filter(option => option.value === 'ALL' || option.count > 0);

    // Handler pour charger les détails complets d'une commande
    const handleInvoiceClick = async (invoice) => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        setIsLoadingDetails(true);
        console.log('🔍 Loading order details for:', invoice.id);

        try {
            const result = await dispatch(getOrderById({ id: invoice.id, token }));
            console.log('✅ Order details loaded:', result.payload);

            if (result.payload) {
                const order = result.payload;
                setSelectedInvoice({
                    id: order.order_number || order.id,
                    date: order.created_at,
                    amount: order.total,
                    status: order.status?.toUpperCase() || 'PENDING',
                    items: order.total_products || order.lines?.length || 0,
                    customer: order.customer_name,
                    paymentMethod: 'Non spécifié',
                    products: order.lines?.map(line => ({
                        name: line.name || 'Produit inconnu',
                        quantity: line.quantity,
                        price: line.unit_price
                    })) || []
                });
            }
        } catch (error) {
            console.error('❌ Error loading order details:', error);
        } finally {
            setIsLoadingDetails(false);
        }
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
        const token = sessionStorage.getItem('token');

        try {
            const result = await dispatch(downloadQuote({ orderId: selectedInvoice.id, token })).unwrap();
            
            // Créer un lien de téléchargement
            const url = window.URL.createObjectURL(result.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `devis-INV-${selectedInvoice.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            console.log(`✅ PDF downloaded for invoice ${selectedInvoice.id}`);
        } catch (error) {
            console.error('❌ Error downloading PDF:', error);
            alert('Erreur lors du téléchargement du PDF');
        } finally {
            setIsDownloadingPDF(false);
        }
    };

    // Handle delete order
    const handleDeleteOrder = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        const token = sessionStorage.getItem('token');

        try {
            await dispatch(deleteOrder({ orderId: selectedInvoice.id, token })).unwrap();
            
            console.log(`✅ Order ${selectedInvoice.id} deleted`);
            
            // Fermer les modals et recharger les commandes
            setSelectedInvoice(null);
            setShowDeleteConfirm(false);
            
            // Recharger la liste des commandes
            await dispatch(getOrdersByUser(token));
        } catch (error) {
            console.error('❌ Error deleting order:', error);
            alert(error || 'Erreur lors de la suppression du devis');
        } finally {
            setIsDeleting(false);
        }
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
                    <h2><FileText size={28} style={{ color: 'var(--primary-accent)' }} /> Historique des devis</h2>
                </div>
            </div>

            {/* Status Filter Section */}
            <motion.div
                className="status-filter-section"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                style={{
                    padding: '1rem 2rem',
                    marginBottom: '1.5rem'
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-main)',
                        fontWeight: 600
                    }}>
                        <FilterIcon size={18} style={{ color: 'var(--primary-accent)' }} />
                        <span>Filtrer par statut:</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                    }}>
                        {statusOptions.map((option) => (
                            <motion.button
                                key={option.value}
                                onClick={() => setStatusFilter(option.value)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: statusFilter === option.value 
                                        ? '2px solid var(--primary-accent)' 
                                        : '1px solid var(--border-color)',
                                    background: statusFilter === option.value 
                                        ? 'var(--primary-accent)' 
                                        : 'var(--bg-secondary)',
                                    color: statusFilter === option.value ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    fontWeight: statusFilter === option.value ? 600 : 500,
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span>{option.label}</span>
                                <span style={{
                                    background: statusFilter === option.value 
                                        ? 'rgba(255,255,255,0.2)' 
                                        : 'var(--bg-tertiary)',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}>
                                    {option.count}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>


            <motion.div
                className="invoices-list"
                variants={containerVariants}
                animate="visible"
                style={{ width: '100%', maxWidth: '100%', padding: '0 2rem' }}
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
                                    onClick={() => handleInvoiceClick(invoice)}
                                >
                                    <div className="inv-icon">
                                        <FileText size={20} />
                                    </div>
                                    <div className="inv-info">
                                        <h4>INV-{invoice.id}</h4>
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
                                        {invoice.status === 'PENDING' && <><Clock size={14} /> <span>En attente</span></>}
                                        {invoice.status === 'CONFIRMED' && <><CheckCircle2 size={14} /> <span>Confirmé</span></>}
                                        {invoice.status === 'PAID' && <><CheckCircle2 size={14} /> <span>Payé</span></>}
                                        {invoice.status === 'PROCESSING' && <><Clock size={14} /> <span>En traitement</span></>}
                                        {invoice.status === 'SHIPPED' && <><CheckCircle2 size={14} /> <span>Expédié</span></>}
                                        {invoice.status === 'DELIVERED' && <><CheckCircle2 size={14} /> <span>Livré</span></>}
                                        {invoice.status === 'CANCELLED' && <><XCircle size={14} /> <span>Annulé</span></>}
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
                                <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Aucun devis réel disponible pour le moment.</p>
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
                                        <span>INV-{selectedInvoice.id}</span>
                                    </div>
                                    <div className={`status-badge status-${selectedInvoice.status}`}>
                                        {selectedInvoice.status === 'PENDING' && <><Clock size={16} /> <span>En attente</span></>}
                                        {selectedInvoice.status === 'CONFIRMED' && <><CheckCircle2 size={16} /> <span>Confirmé</span></>}
                                        {selectedInvoice.status === 'PAID' && <><CheckCircle2 size={16} /> <span>Payé</span></>}
                                        {selectedInvoice.status === 'PROCESSING' && <><Clock size={16} /> <span>En traitement</span></>}
                                        {selectedInvoice.status === 'SHIPPED' && <><CheckCircle2 size={16} /> <span>Expédié</span></>}
                                        {selectedInvoice.status === 'DELIVERED' && <><CheckCircle2 size={16} /> <span>Livré</span></>}
                                        {selectedInvoice.status === 'CANCELLED' && <><XCircle size={16} /> <span>Annulé</span></>}
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
                                        <span className="amount">{selectedInvoice.amount.toFixed(2)} DH</span>
                                    </div>
                                    <div className="totals-row">
                                        <span className="label">TVA (20%)</span>
                                        <span className="amount">{(selectedInvoice.amount * 0.2).toFixed(2)} DH</span>
                                    </div>
                                    <div className="totals-row total-row">
                                        <span className="label">Total TTC</span>
                                        <span className="amount">{(selectedInvoice.amount * 1.2).toFixed(2)} DH</span>
                                    </div>
                                </div>

                                <div className="action-buttons" style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center'
                                }}>
                                    {selectedInvoice.status === 'PENDING' && (
                                        <motion.button
                                            className="delete-order-btn"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            disabled={isDeleting}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                background: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '14px 24px',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                                transition: 'all 0.3s ease',
                                                minWidth: '180px',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Trash2 size={20} />
                                            <span>Supprimer</span>
                                        </motion.button>
                                    )}

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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        className="delete-confirm-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10000,
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        <motion.div
                            className="delete-confirm-modal"
                            initial={{ scale: 0.8, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 30 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                borderRadius: '24px',
                                padding: '2.5rem',
                                maxWidth: '480px',
                                width: '90%',
                                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                                border: '2px solid rgba(239, 68, 68, 0.2)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Decorative elements */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                style={{
                                    position: 'absolute',
                                    top: '-50px',
                                    right: '-50px',
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
                                    pointerEvents: 'none'
                                }}
                            />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring' }}
                                style={{
                                    position: 'absolute',
                                    bottom: '-30px',
                                    left: '-30px',
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
                                    pointerEvents: 'none'
                                }}
                            />

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1.5rem',
                                textAlign: 'center',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {/* Icon with animation */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                                    style={{
                                        width: '90px',
                                        height: '90px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3), inset 0 0 0 2px rgba(239, 68, 68, 0.2)',
                                        position: 'relative'
                                    }}
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                    >
                                        <AlertTriangle size={45} style={{ color: '#ef4444', filter: 'drop-shadow(0 2px 8px rgba(239, 68, 68, 0.4))' }} />
                                    </motion.div>
                                </motion.div>

                                {/* Text content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 style={{
                                        margin: 0,
                                        marginBottom: '0.75rem',
                                        fontSize: '1.75rem',
                                        color: 'var(--text-main)',
                                        fontWeight: 700,
                                        letterSpacing: '-0.5px'
                                    }}>
                                        ⚠️ Attention !
                                    </h3>
                                    <p style={{
                                        margin: 0,
                                        marginBottom: '0.5rem',
                                        color: 'var(--text-muted)',
                                        fontSize: '1.05rem',
                                        lineHeight: '1.6'
                                    }}>
                                        Vous êtes sur le point de supprimer définitivement
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        padding: '0.75rem 1rem',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(239, 68, 68, 0.2)'
                                    }}>
                                        <strong style={{ 
                                            color: '#ef4444', 
                                            fontSize: '1.1rem',
                                            fontWeight: 700
                                        }}>
                                            Devis INV-{selectedInvoice?.id}
                                        </strong>
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        marginTop: '0.75rem',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.95rem',
                                        fontStyle: 'italic'
                                    }}>
                                        ⚡ Cette action est <strong>irréversible</strong>
                                    </p>
                                </motion.div>

                                {/* Action buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        width: '100%',
                                        marginTop: '0.5rem'
                                    }}
                                >
                                    <motion.button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        disabled={isDeleting}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            flex: 1,
                                            padding: '14px 20px',
                                            borderRadius: '14px',
                                            border: '2px solid var(--border-color)',
                                            background: 'var(--bg-secondary)',
                                            color: 'var(--text-main)',
                                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            opacity: isDeleting ? 0.5 : 1,
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        ← Annuler
                                    </motion.button>

                                    <motion.button
                                        onClick={handleDeleteOrder}
                                        disabled={isDeleting}
                                        whileHover={{ scale: isDeleting ? 1 : 1.03, y: isDeleting ? 0 : -2 }}
                                        whileTap={{ scale: isDeleting ? 1 : 0.97 }}
                                        style={{
                                            flex: 1,
                                            padding: '14px 20px',
                                            borderRadius: '14px',
                                            border: 'none',
                                            background: isDeleting 
                                                ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
                                                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                            color: 'white',
                                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                                            fontWeight: 700,
                                            fontSize: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            boxShadow: isDeleting 
                                                ? '0 6px 20px rgba(245, 158, 11, 0.4)'
                                                : '0 6px 20px rgba(239, 68, 68, 0.4)',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                >
                                                    <Loader2 size={20} />
                                                </motion.div>
                                                <span>Suppression...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={20} />
                                                <span>Supprimer définitivement</span>
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default InvoiceHistory;
