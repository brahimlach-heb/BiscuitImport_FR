// Stock Management Functions - À ajouter dans AdminDashboard.jsx

// États à ajouter dans le composant:
/*
const [stockAdjustmentModal, setStockAdjustmentModal] = useState(null);
const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
const [adjustmentReason, setAdjustmentReason] = useState('adjustment');
const [stockSearchQuery, setStockSearchQuery] = useState('');
const [lowStockThreshold, setLowStockThreshold] = useState(20);
const [isAdjustingStock, setIsAdjustingStock] = useState(false);
*/

// Fonction renderStock à ajouter avant le return final:

const renderStock = () => {
    const stocks = stocksState || [];
    const filteredStocks = stocks.filter(stock => {
        if (!stockSearchQuery) return true;
        const searchLower = stockSearchQuery.toLowerCase();
        return (
            stock.product_name?.toLowerCase().includes(searchLower) ||
            stock.product_sku?.toLowerCase().includes(searchLower) ||
            stock.category?.toLowerCase().includes(searchLower)
        );
    });

    const totalStock = stocks.reduce((sum, stock) => sum + (parseInt(stock.quantity) || 0), 0);
    const lowStockCount = stockAlerts.length;
    const outOfStock = stocks.filter(s => parseInt(s.quantity) === 0).length;

    const handleAdjustStock = async () => {
        if (!stockAdjustmentModal || !adjustmentQuantity) {
            showToast('Veuillez entrer une quantité valide', 'error');
            return;
        }

        setIsAdjustingStock(true);
        const token = sessionStorage.getItem('token');
        try {
            await dispatch(adjustStock({
                productId: stockAdjustmentModal.productId,
                adjustmentQuantity: parseInt(adjustmentQuantity),
                reason: adjustmentReason,
                token
            }));
            
            // Recharger les stocks
            await dispatch(getAllStocks(token));
            
            showToast('Stock ajusté avec succès', 'success');
            setStockAdjustmentModal(null);
            setAdjustmentQuantity(0);
            setAdjustmentReason('adjustment');
        } catch (error) {
            showToast('Erreur lors de l\'ajustement du stock', 'error');
        } finally {
            setIsAdjustingStock(false);
        }
    };

    const openAdjustmentModal = (productId, productName, currentStock) => {
        setStockAdjustmentModal({ productId, productName, currentStock });
        setAdjustmentQuantity(0);
        setAdjustmentReason('adjustment');
    };

    const getStockStatus = (quantity) => {
        const qty = parseInt(quantity);
        if (qty === 0) return { status: 'out', color: '#ef4444', label: 'Rupture' };
        if (qty < lowStockThreshold) return { status: 'low', color: '#f97316', label: 'Faible' };
        return { status: 'ok', color: '#10b981', label: 'Bon' };
    };

    const getStockPercentage = (quantity, maxQty = 100) => {
        return Math.min((parseInt(quantity) / maxQty) * 100, 100);
    };

    return (
        <motion.div
            key="stock"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="stock-container"
        >
            {/* Header avec actions */}
            <div className="stock-header">
                <h2><Package size={28} style={{ color: 'var(--primary)' }} /> Gestion de Stock</h2>
                <div className="stock-actions">
                    <button
                        className="primary-btn"
                        onClick={() => dispatch(getStockReport(sessionStorage.getItem('token')))}
                        title="Générer un rapport de stock"
                    >
                        <BarChart size={18} /> Rapport
                    </button>
                    <button
                        className="secondary-btn"
                        onClick={() => dispatch(getLowStockAlerts({ 
                            threshold: lowStockThreshold, 
                            token: sessionStorage.getItem('token') 
                        }))}
                        title="Vérifier les alertes"
                    >
                        <AlertCircle size={18} /> Alertes
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="stock-summary">
                <div className="stock-card">
                    <div className="stock-card-label">Stock Total</div>
                    <div className="stock-card-value">{totalStock}</div>
                    <div className="stock-card-change positive">
                        <TrendingUp size={16} /> Unités en stock
                    </div>
                </div>

                <div className="stock-card">
                    <div className="stock-card-label">Produits en Alerte</div>
                    <div className="stock-card-value" style={{ color: '#f97316' }}>{lowStockCount}</div>
                    <div className="stock-card-change warning">
                        <AlertTriangle size={16} /> Stock faible
                    </div>
                </div>

                <div className="stock-card">
                    <div className="stock-card-label">Ruptures</div>
                    <div className="stock-card-value" style={{ color: '#ef4444' }}>{outOfStock}</div>
                    <div className="stock-card-change negative">
                        <XCircle size={16} /> Non disponible
                    </div>
                </div>

                <div className="stock-card">
                    <div className="stock-card-label">Produits Suivis</div>
                    <div className="stock-card-value">{stocks.length}</div>
                    <div className="stock-card-change" style={{ color: 'var(--primary)' }}>
                        <Package size={16} /> Référencés
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            {stockAlerts.length > 0 && (
                <div className="stock-alerts">
                    <div className="alerts-title">
                        <AlertTriangle size={20} style={{ color: '#f97316' }} />
                        Produits en Alerte ({stockAlerts.length})
                    </div>
                    {stockAlerts.map((alert, idx) => {
                        const status = getStockStatus(alert.quantity);
                        return (
                            <div 
                                key={idx} 
                                className={`alert-item ${status.status === 'low' ? 'warning' : ''}`}
                                style={{ borderLeftColor: status.color }}
                            >
                                <div className="alert-content">
                                    <div className="alert-product">{alert.product_name || 'Produit'}</div>
                                    <div className="alert-message">
                                        {status.label} - 
                                        {status.status === 'out' 
                                            ? ' Rupture de stock' 
                                            : ` ${alert.quantity} unités restantes`
                                        }
                                    </div>
                                </div>
                                <button
                                    className="stock-action-btn"
                                    onClick={() => openAdjustmentModal(
                                        alert.product_id,
                                        alert.product_name,
                                        alert.quantity
                                    )}
                                >
                                    <Plus size={16} /> Ravitailler
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Filters */}
            <div className="stock-filters">
                <input
                    type="text"
                    placeholder="Rechercher par produit, SKU..."
                    value={stockSearchQuery}
                    onChange={(e) => setStockSearchQuery(e.target.value)}
                    style={{ minWidth: '250px' }}
                />
                <input
                    type="number"
                    placeholder="Seuil d'alerte"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="1000"
                    style={{ maxWidth: '150px' }}
                />
            </div>

            {/* Stock Table */}
            <div className="stock-table-container">
                {filteredStocks.length > 0 ? (
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>SKU</th>
                                <th>Catégorie</th>
                                <th>Stock Actuel</th>
                                <th>État</th>
                                <th>Seuil d'Alerte</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStocks.map((stock, idx) => {
                                const status = getStockStatus(stock.quantity);
                                const percentage = getStockPercentage(stock.quantity);
                                return (
                                    <tr key={idx}>
                                        <td>
                                            <div className="stock-product-info">
                                                {stock.product_image && (
                                                    <img 
                                                        src={stock.product_image} 
                                                        alt={stock.product_name}
                                                        className="stock-product-image"
                                                    />
                                                )}
                                                <div>
                                                    <div className="stock-product-name">{stock.product_name}</div>
                                                    <div className="stock-product-category">{stock.brand || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{stock.product_sku || 'N/A'}</td>
                                        <td>{stock.category || 'N/A'}</td>
                                        <td>
                                            <div className="stock-quantity">
                                                <div className="stock-bar">
                                                    <div 
                                                        className={`stock-bar-fill ${status.status === 'low' ? 'low' : status.status === 'ok' ? '' : 'warning'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <div className="stock-quantity-value">{stock.quantity}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                background: `${status.color}20`,
                                                color: status.color,
                                                fontWeight: '600',
                                                fontSize: '0.85rem'
                                            }}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td>{stock.min_quantity || lowStockThreshold}</td>
                                        <td>
                                            <div className="stock-actions-cell">
                                                <button
                                                    className="stock-action-btn"
                                                    onClick={() => openAdjustmentModal(
                                                        stock.product_id,
                                                        stock.product_name,
                                                        stock.quantity
                                                    )}
                                                    title="Ajuster le stock"
                                                >
                                                    <Edit2 size={16} /> Ajuster
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="stock-empty">
                        <div className="stock-empty-icon">📦</div>
                        <p>Aucun produit trouvé avec ces critères</p>
                    </div>
                )}
            </div>

            {/* Stock Adjustment Modal */}
            {stockAdjustmentModal && (
                <div className="admin-overlay" onClick={() => {
                    setStockAdjustmentModal(null);
                    setAdjustmentQuantity(0);
                }}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><Package size={22} style={{ display: 'inline', marginRight: '10px' }} />Ajuster Stock</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setStockAdjustmentModal(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Produit</label>
                                <div style={{
                                    padding: '12px',
                                    background: 'var(--bg-main)',
                                    borderRadius: '8px',
                                    fontWeight: '600'
                                }}>
                                    {stockAdjustmentModal.productName}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Stock Actuel</label>
                                <div style={{
                                    padding: '12px',
                                    background: 'var(--bg-main)',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    color: parseInt(stockAdjustmentModal.currentStock) === 0 ? '#ef4444' : 'var(--text-primary)'
                                }}>
                                    {stockAdjustmentModal.currentStock} unités
                                </div>
                            </div>

                            <div className="stock-adjustment-form">
                                <div className="form-group">
                                    <label>Quantité à Ajouter/Retirer *</label>
                                    <input
                                        type="number"
                                        placeholder="Ex: +50 ou -10"
                                        value={adjustmentQuantity}
                                        onChange={(e) => setAdjustmentQuantity(e.target.value)}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            background: 'var(--bg-main)',
                                            width: '100%',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Raison de l'Ajustement</label>
                                    <div className="adjustment-reason">
                                        {[
                                            { value: 'adjustment', label: 'Ajustement' },
                                            { value: 'reception', label: 'Réception' },
                                            { value: 'loss', label: 'Perte/Casse' },
                                            { value: 'transfer', label: 'Transfert' },
                                            { value: 'inventory', label: 'Inventaire' }
                                        ].map((reason) => (
                                            <button
                                                key={reason.value}
                                                className={`reason-badge ${adjustmentReason === reason.value ? 'active' : ''}`}
                                                onClick={() => setAdjustmentReason(reason.value)}
                                                type="button"
                                            >
                                                {reason.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                padding: '12px',
                                background: 'rgba(212, 175, 55, 0.1)',
                                borderRadius: '8px',
                                borderLeft: '4px solid var(--primary)'
                            }}>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Nouveau Stock</div>
                                <div style={{ 
                                    fontSize: '1.2rem', 
                                    fontWeight: '700',
                                    color: 'var(--primary)'
                                }}>
                                    {(parseInt(stockAdjustmentModal.currentStock) || 0) + (parseInt(adjustmentQuantity) || 0)} unités
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="cancel-pill-btn"
                                onClick={() => setStockAdjustmentModal(null)}
                                disabled={isAdjustingStock}
                            >
                                Annuler
                            </button>
                            <button
                                className="save-pill-btn"
                                onClick={handleAdjustStock}
                                disabled={isAdjustingStock || !adjustmentQuantity}
                                style={{ opacity: (!adjustmentQuantity || isAdjustingStock) ? 0.6 : 1 }}
                            >
                                {isAdjustingStock ? (
                                    <>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} /> Enregistrer
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Stock Movements History */}
            {stockMovements.length > 0 && (
                <div className="stock-history">
                    <div className="history-title">Derniers Mouvements</div>
                    <div className="history-timeline">
                        {stockMovements.slice(0, 5).map((movement, idx) => (
                            <div key={idx} className="history-item">
                                <div className="history-marker">
                                    {movement.type === 'addition' ? (
                                        <Plus size={20} style={{ color: 'var(--primary)' }} />
                                    ) : (
                                        <Trash2 size={20} style={{ color: '#f97316' }} />
                                    )}
                                </div>
                                <div className="history-content">
                                    <div className="history-action">
                                        {movement.product_name}
                                    </div>
                                    <div className="history-details">
                                        {movement.type === 'addition' ? '+' : '-'}{movement.quantity} unités
                                        {movement.reason && ` - ${movement.reason}`}
                                    </div>
                                    <div className="history-time">
                                        {new Date(movement.created_at).toLocaleDateString('fr-FR')} à{' '}
                                        {new Date(movement.created_at).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};
