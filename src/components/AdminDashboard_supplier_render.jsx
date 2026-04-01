// Supplier Management Interface Functions - À ajouter dans AdminDashboard.jsx

// États à ajouter dans le composant:
/*
const [supplierSearchQuery, setSupplierSearchQuery] = useState('');
const [newSupplier, setNewSupplier] = useState({ name: '', cin: '', contact_name: '', email: '', phone: '', address: '', city: '', is_active: true });
const [editingSupplier, setEditingSupplier] = useState(null);
const [isCreatingSupplier, setIsCreatingSupplier] = useState(false);
const [supplierPage, setSupplierPage] = useState(1);
*/

// Fonction render à ajouter:

const renderSuppliers = () => {
    const suppliers = suppliersState || [];
    const filteredSuppliers = suppliers.filter(s => {
        if (!supplierSearchQuery) return true;
        const searchLower = supplierSearchQuery.toLowerCase();
        return (
            s.name?.toLowerCase().includes(searchLower) ||
            s.email?.toLowerCase().includes(searchLower) ||
            s.contact_name?.toLowerCase().includes(searchLower)
        );
    });

    const activeSuppliers = suppliers.filter(s => s.is_active).length;

    return (
        <motion.div
            key="suppliers"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="supplier-container"
        >
            <div className="supplier-header">
                <h2><UserCheck size={28} style={{ color: 'var(--primary)' }} /> Gestion des Fournisseurs</h2>
                <div className="supplier-actions">
                    <button
                        className="primary-btn"
                        onClick={() => setIsCreatingSupplier(true)}
                    >
                        <Plus size={18} /> Nouveau Fournisseur
                    </button>
                </div>
            </div>

            <div className="supplier-summary">
                <div className="supplier-card">
                    <div className="supplier-card-label">Total Fournisseurs</div>
                    <div className="supplier-card-value">{suppliers.length}</div>
                    <div className="supplier-card-change positive">
                        <UserCheck size={16} /> Enregistrés
                    </div>
                </div>

                <div className="supplier-card">
                    <div className="supplier-card-label">Fournisseurs Actifs</div>
                    <div className="supplier-card-value" style={{ color: 'var(--primary)' }}>{activeSuppliers}</div>
                    <div className="supplier-card-change">
                        <CheckCircle2 size={16} /> En activité
                    </div>
                </div>

                <div className="supplier-card">
                    <div className="supplier-card-label">Taux d'Activité</div>
                    <div className="supplier-card-value" style={{ color: '#10b981' }}>
                        {suppliers.length > 0 ? ((activeSuppliers / suppliers.length) * 100).toFixed(0) : 0}%
                    </div>
                    <div className="supplier-card-change positive">
                        <TrendingUp size={16} /> Partenaires actifs
                    </div>
                </div>
            </div>

            <div className="supplier-filters">
                <input
                    type="text"
                    placeholder="Rechercher par nom, email, contact..."
                    value={supplierSearchQuery}
                    onChange={(e) => setSupplierSearchQuery(e.target.value)}
                    style={{ minWidth: '250px' }}
                />
            </div>

            <div className="supplier-table-container">
                {filteredSuppliers.length > 0 ? (
                    <table className="supplier-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Téléphone</th>
                                <th>Ville</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSuppliers.map((supplier, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div className="supplier-info">
                                            <div className="supplier-icon">
                                                <Factory size={18} />
                                            </div>
                                            <div className="supplier-name">{supplier.name}</div>
                                        </div>
                                    </td>
                                    <td>{supplier.contact_name || 'N/A'}</td>
                                    <td>{supplier.email || 'N/A'}</td>
                                    <td>{supplier.phone || 'N/A'}</td>
                                    <td>{supplier.city || 'N/A'}</td>
                                    <td>
                                        <span className={`status-badge ${supplier.is_active ? 'active' : 'inactive'}`}>
                                            {supplier.is_active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="supplier-actions-cell">
                                            <button
                                                className="supplier-action-btn"
                                                onClick={() => setEditingSupplier(supplier)}
                                                title="Modifier"
                                            >
                                                <Edit2 size={16} /> Modifier
                                            </button>
                                            <button
                                                className="supplier-action-btn"
                                                style={{ color: '#ef4444' }}
                                                onClick={() => {
                                                    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
                                                        dispatch(deleteSupplier({ id: supplier.id, token: sessionStorage.getItem('token') }));
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
                    <div className="supplier-empty">
                        <div className="supplier-empty-icon">🏭</div>
                        <p>Aucun fournisseur trouvé</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
