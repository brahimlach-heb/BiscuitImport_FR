// Warehouse Management Interface Functions - À ajouter dans AdminDashboard.jsx

// États à ajouter dans le composant:
/*
const [warehouseSearchQuery, setWarehouseSearchQuery] = useState('');
const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '', city: '', capacity: 0, is_active: true });
const [editingWarehouse, setEditingWarehouse] = useState(null);
const [isCreatingWarehouse, setIsCreatingWarehouse] = useState(false);
const [warehousePage, setWarehousePage] = useState(1);
*/

// Fonction render à ajouter:

const renderWarehouses = () => {
    const warehouses = warehousesState || [];
    const filteredWarehouses = warehouses.filter(w => {
        if (!warehouseSearchQuery) return true;
        const searchLower = warehouseSearchQuery.toLowerCase();
        return (
            w.name?.toLowerCase().includes(searchLower) ||
            w.location?.toLowerCase().includes(searchLower) ||
            w.city?.toLowerCase().includes(searchLower)
        );
    });

    const totalCapacity = warehouses.reduce((sum, w) => sum + (parseInt(w.capacity) || 0), 0);
    const activeWarehouses = warehouses.filter(w => w.is_active).length;

    return (
        <motion.div
            key="warehouses"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="warehouse-container"
        >
            <div className="warehouse-header">
                <h2><Building2 size={28} style={{ color: 'var(--primary)' }} /> Gestion des Entrepôts</h2>
                <div className="warehouse-actions">
                    <button
                        className="primary-btn"
                        onClick={() => setIsCreatingWarehouse(true)}
                    >
                        <Plus size={18} /> Nouvel Entrepôt
                    </button>
                </div>
            </div>

            <div className="warehouse-summary">
                <div className="warehouse-card">
                    <div className="warehouse-card-label">Total Entrepôts</div>
                    <div className="warehouse-card-value">{warehouses.length}</div>
                    <div className="warehouse-card-change positive">
                        <Building2 size={16} /> Actifs
                    </div>
                </div>

                <div className="warehouse-card">
                    <div className="warehouse-card-label">Entrepôts Actifs</div>
                    <div className="warehouse-card-value" style={{ color: 'var(--primary)' }}>{activeWarehouses}</div>
                    <div className="warehouse-card-change">
                        <CheckCircle2 size={16} /> En service
                    </div>
                </div>

                <div className="warehouse-card">
                    <div className="warehouse-card-label">Capacité Totale</div>
                    <div className="warehouse-card-value">{totalCapacity}</div>
                    <div className="warehouse-card-change">
                        <TrendingUp size={16} /> Unités
                    </div>
                </div>
            </div>

            <div className="warehouse-filters">
                <input
                    type="text"
                    placeholder="Rechercher par nom, localisation..."
                    value={warehouseSearchQuery}
                    onChange={(e) => setWarehouseSearchQuery(e.target.value)}
                    style={{ minWidth: '250px' }}
                />
            </div>

            <div className="warehouse-table-container">
                {filteredWarehouses.length > 0 ? (
                    <table className="warehouse-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Localisation</th>
                                <th>Ville</th>
                                <th>Capacité</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWarehouses.map((warehouse, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div className="warehouse-info">
                                            <div className="warehouse-icon">
                                                <Building2 size={18} />
                                            </div>
                                            <div className="warehouse-name">{warehouse.name}</div>
                                        </div>
                                    </td>
                                    <td>{warehouse.location || 'N/A'}</td>
                                    <td>{warehouse.city || 'N/A'}</td>
                                    <td>{warehouse.capacity || 0} unités</td>
                                    <td>
                                        <span className={`status-badge ${warehouse.is_active ? 'active' : 'inactive'}`}>
                                            {warehouse.is_active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="warehouse-actions-cell">
                                            <button
                                                className="warehouse-action-btn"
                                                onClick={() => setEditingWarehouse(warehouse)}
                                                title="Modifier"
                                            >
                                                <Edit2 size={16} /> Modifier
                                            </button>
                                            <button
                                                className="warehouse-action-btn"
                                                style={{ color: '#ef4444' }}
                                                onClick={() => {
                                                    if (confirm('Êtes-vous sûr de vouloir supprimer cet entrepôt ?')) {
                                                        dispatch(deleteWarehouse({ id: warehouse.id, token: sessionStorage.getItem('token') }));
                                                    }
                                                }}
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="warehouse-empty">
                        <div className="warehouse-empty-icon">📦</div>
                        <p>Aucun entrepôt trouvé</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
