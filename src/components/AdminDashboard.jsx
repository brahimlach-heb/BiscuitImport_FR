import React, { useState, useEffect } from 'react';
import { productService, categoryService, userService, orderService, authService, roleService, bankService, stockService, warehouseService, supplierService, purchaseOrderService, returnService } from '../services';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    getAllProducts,
    createProduct,
    updateProduct
} from '../store/slices/productSlice';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../store/slices/categorySlice';
import { getAllUsers } from '../store/slices/userSlice';
import { getOrdersByUser, updateOrderDiscount, downloadQuote } from '../store/slices/orderSlice';
import {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    getRoleById
} from '../store/slices/roleSlice';
import {
    getAllBanks,
    createBank as createBankThunk,
    updateBank as updateBankThunk,
    deleteBank as deleteBankThunk
} from '../store/slices/bankSlice';
import {
    getAllStocks,
    adjustStock,
    getStockMovements,
    getLowStockAlerts,
    getStockReport
} from '../store/slices/stockSlice';
import {
    getAllWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWarehouseStock,
    transferBetweenWarehouses
} from '../store/slices/warehouseSlice';
import {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierProducts
} from '../store/slices/supplierSlice';
import {
    getAllPurchaseOrders,
    getPurchaseOrderById,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    addPurchaseOrderLine,
    removePurchaseOrderLine,
    updatePurchaseOrderStatus,
    receivePurchaseOrder,
    getPurchaseOrderHistory,
    resetCurrentPurchaseOrder
} from '../store/slices/purchaseOrderSlice';
import {
    getAllCustomerReturns,
    createCustomerReturn,
    updateCustomerReturn,
    deleteCustomerReturn,
    updateReturnStatus,
    processReturnRefund,
    getAllSupplierReturns,
    createSupplierReturn,
    updateSupplierReturn,
    deleteSupplierReturn,
    updateSupplierReturnStatus,
    processSupplierCredit,
    resetCurrentCustomerReturn,
    resetCurrentSupplierReturn
} from '../store/slices/returnSlice';
import {
    LayoutDashboard,
    Users as UsersIcon,
    Tag,
    Package,
    ShoppingCart,
    Plus,
    Search,
    Edit2,
    Trash2,
    MoreVertical,
    ChevronLeft,
    CheckCircle2,
    Clock,
    XCircle,
    Truck,
    ArrowLeft,
    Image as ImageIcon,
    Save,
    X,
    BarChart3,
    PieChart as PieChartIcon,
    Menu,
    ChevronDown,
    TrendingUp,
    Zap,
    DollarSign,
    CreditCard,
    Banknote,
    BarChart,
    Loader2,
    Shield,
    Eye,
    FileText,
    Download,
    Grid,
    List,
    AlertTriangle,
    AlertCircle,
    Building2,
    MapPin,
    UserCheck,
    Factory,
    ShoppingBag,
    Mail,
    RotateCcw,
    Loader
} from 'lucide-react';
import './AdminDashboard.css';
import './AdminDashboard_additions.css';
import './AdminDashboard_stock.css';
import './AdminDashboard_warehouse_supplier.css';
import './AdminDashboard_period_filter.css';
import './AdminDashboard_po.css';

const SALES_DATA = [
    { day: 'Lun', sales: 1200 },
    { day: 'Mar', sales: 1900 },
    { day: 'Mer', sales: 1500 },
    { day: 'Jeu', sales: 2400 },
    { day: 'Ven', sales: 2100 },
    { day: 'Sam', sales: 3000 },
    { day: 'Dim', sales: 2700 }
];

const ORDER_STATUSES = [
    { label: 'En attente', value: 'PENDING', icon: <Clock size={14} />, color: '#f59e0b' }, // Orange
    { label: 'Confirmée', value: 'CONFIRMED', icon: <CheckCircle2 size={14} />, color: '#10b981' }, // Vert
    { label: 'En cours de traitement', value: 'PROCESSING', icon: <Package size={14} />, color: '#8b5cf6' }, // Violet
    { label: 'Expédiée', value: 'SHIPPED', icon: <Truck size={14} />, color: '#3b82f6' }, // Bleu
    { label: 'Livrée', value: 'DELIVERED', icon: <CheckCircle2 size={14} />, color: '#059669' }, // Vert foncé
    { label: 'Annulée', value: 'CANCELLED', icon: <XCircle size={14} />, color: '#ef4444' } // Rouge
];

// Enhanced Interactive SVG Chart Component with Hover Effects
const SalesChart = ({ data }) => {
    const [hoveredBar, setHoveredBar] = useState(null);
    const maxSales = Math.max(...data.map(d => d.sales));
    const containerHeight = 220;
    const barWidth = 45;
    const gap = 25;
    const chartWidth = data.length * (barWidth + gap);

    return (
        <div className="chart-container-enhanced">
            <svg
                width="100%"
                height={containerHeight + 60}
                viewBox={`0 0 ${chartWidth} ${containerHeight + 60}`}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <line
                        key={i}
                        x1="0"
                        y1={containerHeight * (1 - ratio)}
                        x2={chartWidth}
                        y2={containerHeight * (1 - ratio)}
                        stroke="var(--border-color)"
                        strokeWidth="1"
                        opacity="0.3"
                        strokeDasharray="4 4"
                    />
                ))}

                {data.map((d, i) => {
                    const barHeight = (d.sales / maxSales) * containerHeight;
                    const isHovered = hoveredBar === i;

                    return (
                        <g key={d.day}>
                            {/* Bar */}
                            <motion.rect
                                x={i * (barWidth + gap)}
                                y={containerHeight - barHeight}
                                width={barWidth}
                                initial={{ height: 0, y: containerHeight }}
                                animate={{
                                    height: barHeight,
                                    y: containerHeight - barHeight,
                                    opacity: isHovered ? 1 : 0.85
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay: i * 0.08,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                fill="url(#barGradient)"
                                rx="8"
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHoveredBar(i)}
                                onMouseLeave={() => setHoveredBar(null)}
                            />

                            {/* Hover Glow Effect */}
                            {isHovered && (
                                <motion.rect
                                    x={i * (barWidth + gap) - 3}
                                    y={containerHeight - barHeight - 3}
                                    width={barWidth + 6}
                                    height={barHeight + 6}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    fill="none"
                                    stroke="var(--primary)"
                                    strokeWidth="3"
                                    rx="10"
                                />
                            )}

                            {/* Day Label */}
                            <text
                                x={i * (barWidth + gap) + barWidth / 2}
                                y={containerHeight + 25}
                                textAnchor="middle"
                                fontSize="13"
                                fontWeight="600"
                                fill={isHovered ? "var(--primary)" : "var(--text-muted)"}
                            >
                                {d.day}
                            </text>

                            {/* Value Label */}
                            <motion.text
                                x={i * (barWidth + gap) + barWidth / 2}
                                y={containerHeight - barHeight - 12}
                                textAnchor="middle"
                                fontSize={isHovered ? "13" : "11"}
                                fontWeight="800"
                                fill="var(--primary)"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: isHovered ? 1.15 : 1
                                }}
                                transition={{ delay: i * 0.08 + 0.3 }}
                            >
                                {d.sales} DH
                            </motion.text>
                        </g>
                    );
                })}

                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.6" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

// Brand New Modern Trend Chart (Line Chart) with Animations
const SalesTrendChart = ({ data }) => {
    const maxSales = Math.max(...data.map(d => d.sales));
    const containerHeight = 220;
    const padding = 40;
    const width = 500;
    const height = containerHeight;

    // Calculate points for the line
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - (d.sales / maxSales) * (height - padding * 2) - padding;
        return { x, y };
    });

    // Create path string
    const d = points.reduce((acc, point, i) => {
        return i === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
    }, "");

    // Create area path string (the gradient fill)
    const areaD = `${d} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

    return (
        <div className="trend-chart-container">
            <svg
                width="100%"
                height={height + 40}
                viewBox={`0 0 ${width} ${height + 40}`}
                preserveAspectRatio="xMidYMid meet"
                className="overflow-visible"
            >
                <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.5, 1].map((ratio, i) => (
                    <line
                        key={i}
                        x1={padding}
                        y1={padding + (height - padding * 2) * (1 - ratio)}
                        x2={width - padding}
                        y2={padding + (height - padding * 2) * (1 - ratio)}
                        stroke="var(--border-color)"
                        strokeWidth="1"
                        opacity="0.2"
                    />
                ))}

                {/* Area under the line */}
                <motion.path
                    d={areaD}
                    fill="url(#trendGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                />

                {/* The Trend Line */}
                <motion.path
                    d={d}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Data Points */}
                {points.map((point, i) => (
                    <g key={i}>
                        <motion.circle
                            cx={point.x}
                            cy={point.y}
                            r="6"
                            fill="var(--bg-card)"
                            stroke="var(--primary)"
                            strokeWidth="3"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1 + i * 0.1 }}
                            whileHover={{ scale: 1.5 }}
                            style={{ cursor: 'pointer' }}
                        />
                        <text
                            x={point.x}
                            y={height + 20}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight="600"
                            fill="var(--text-muted)"
                        >
                            {data[i].day}
                        </text>

                        {/* Value Tooltip Style Label */}
                        <motion.g
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 + i * 0.1 }}
                        >
                            <rect
                                x={point.x - 25}
                                y={point.y - 35}
                                width="50"
                                height="22"
                                rx="6"
                                fill="var(--bg-main)"
                                stroke="var(--border-color)"
                                strokeWidth="1"
                            />
                            <text
                                x={point.x}
                                y={point.y - 20}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="800"
                                fill="var(--primary)"
                            >
                                {data[i].sales}
                            </text>
                        </motion.g>
                    </g>
                ))}
            </svg>
        </div>
    );
};

// Interactive Donut Chart Component
const DonutChart = ({ data, total }) => {
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const radius = 80;
    const strokeWidth = 35;
    const center = 100;
    const circumference = 2 * Math.PI * radius;

    let currentAngle = -90;

    return (
        <div className="donut-chart-container">
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Background Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="var(--bg-main)"
                    strokeWidth={strokeWidth}
                />

                {/* Segments */}
                {data.map((segment, i) => {
                    const percentage = (segment.count / total) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = currentAngle;
                    currentAngle += angle;

                    const isHovered = hoveredSegment === i;
                    const adjustedRadius = isHovered ? radius + 5 : radius;

                    return (
                        <motion.circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={adjustedRadius}
                            fill="none"
                            stroke={segment.color}
                            strokeWidth={isHovered ? strokeWidth + 8 : strokeWidth}
                            strokeDasharray={`${(percentage / 100) * circumference} ${circumference}`}
                            strokeDashoffset={-((startAngle + 90) / 360) * circumference}
                            style={{
                                cursor: 'pointer',
                                transformOrigin: 'center',
                                transition: 'all 0.3s ease'
                            }}
                            initial={{ strokeDasharray: `0 ${circumference}` }}
                            animate={{
                                strokeDasharray: `${(percentage / 100) * circumference} ${circumference}`,
                                r: adjustedRadius,
                                strokeWidth: isHovered ? strokeWidth + 8 : strokeWidth
                            }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            onMouseEnter={() => setHoveredSegment(i)}
                            onMouseLeave={() => setHoveredSegment(null)}
                        />
                    );
                })}

                {/* Center Text */}
                <text
                    x={center}
                    y={center - 5}
                    textAnchor="middle"
                    fontSize="28"
                    fontWeight="800"
                    fill="var(--text-main)"
                >
                    {total}
                </text>
                <text
                    x={center}
                    y={center + 15}
                    textAnchor="middle"
                    fontSize="12"
                    fill="var(--text-muted)"
                    fontWeight="600"
                >
                    Commandes
                </text>
            </svg>
        </div>
    );
};

const AdminDashboard = ({ onBack, initialProducts, initialCategories }) => {
        // --- Import/Export Excel hooks (déplacés ici pour éviter l'erreur de hooks) ---
        const [isExporting, setIsExporting] = useState(false);
        const [isImporting, setIsImporting] = useState(false);
        const [importError, setImportError] = useState(null);
        const [importSuccess, setImportSuccess] = useState(null);
        const fileInputRef = React.useRef();

        // Export handler
        const handleExportExcel = async () => {
            setIsExporting(true);
            try {
                const token = sessionStorage.getItem('token');
                const blob = await productService.exportProductsToExcel(token);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'produits.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                if (showToast) showToast('Exportation Excel réussie !', 'success');
            } catch (e) {
                if (showToast) showToast("Erreur lors de l'exportation Excel.", 'error');
            } finally {
                setIsExporting(false);
            }
        };

        // Import handler
        const handleImportExcel = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            setIsImporting(true);
            try {
                const token = sessionStorage.getItem('token');
                await productService.importProductsFromExcel(file, token);
                if (showToast) showToast('Importation Excel réussie !', 'success');
                // Optionally refresh products
                if (typeof dispatch === 'function') {
                    dispatch(getAllProducts({ category: null, token }));
                }
            } catch (e) {
                if (showToast) showToast("Erreur lors de l'importation Excel.", 'error');
            } finally {
                setIsImporting(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
    const dispatch = useAppDispatch();

    // Redux state
    const { products: productsState = [], loading: productsLoading, error: productsError } = useAppSelector(state => state.product);
    const { categories: categoriesState = [], loading: categoriesLoading, error: categoriesError } = useAppSelector(state => state.category);
    const { users: usersState = [], loading: usersLoading, error: usersError } = useAppSelector(state => state.user);
    const { orders: ordersState = [], loading: ordersLoading, error: ordersError } = useAppSelector(state => state.order);
    const { roles: rolesState = [], loading: rolesLoading, error: rolesError } = useAppSelector(state => state.role);
    const { stocks: stocksState = [], loading: stocksLoading, error: stocksError, alerts: stockAlerts = [], movements: stockMovements = [], report: stockReport = null } = useAppSelector(state => state.stock);
    const { warehouses: warehousesState = [], loading: warehousesLoading, error: warehousesError, warehouseStock: warehouseStockState = [] } = useAppSelector(state => state.warehouse);
    const { suppliers: suppliersState = [], loading: suppliersLoading, error: suppliersError, supplierProducts: supplierProductsState = [] } = useAppSelector(state => state.supplier);
    const { purchaseOrders: purchaseOrdersState = [], loading: purchaseOrdersLoading, error: purchaseOrdersError, currentPurchaseOrder: currentPOState = null, purchaseOrderHistory: poHistoryState = [] } = useAppSelector(state => state.purchaseOrder);
    const { customerReturns: customerReturnsState = [], supplierReturns: supplierReturnsState = [], currentCustomerReturn: currentCustomerReturnState = null, currentSupplierReturn: currentSupplierReturnState = null, customerReturnsLoading, customerReturnsError, supplierReturnsLoading, supplierReturnsError } = useAppSelector(state => state.return);

    // Combined loading state
    const loading = productsLoading || categoriesLoading || usersLoading || ordersLoading || rolesLoading;

    // Use Redux state directly
    const products = productsState;
    const categories = categoriesState;
    const users = usersState;
    const orders = ordersState;
    const roles = rolesState;
    const purchaseOrders = purchaseOrdersState;
    const warehouses = warehousesState;
    const suppliers = suppliersState;
    const stocks = stocksState;
    const customerReturns = customerReturnsState;
    const supplierReturns = supplierReturnsState;

    // Combined error state
    const hasError = productsError || categoriesError || usersError || ordersError || rolesError;

    // Data received tracking removed

    // Error display removed

    const [activeTab, setActiveTab] = useState('orders'); // Changed from 'overview' to 'orders'
    const [searchQuery, setSearchQuery] = useState('');
    const [chartType, setChartType] = useState('bar'); // 'bar' or 'trend'
    const [ordersViewMode, setOrdersViewMode] = useState('cards'); // 'cards' or 'table'
    const [dailyPeriod, setDailyPeriod] = useState('hebdomadaire'); // 'hebdomadaire', 'mensuel', 'trimestriel'
    const [trendPeriod, setTrendPeriod] = useState('hebdomadaire'); // 'hebdomadaire', 'mensuel', 'trimestriel'
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    // Orders filters
    const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
    const [orderSearchQuery, setOrderSearchQuery] = useState('');

    // Pagination state
    const [currentUserPage, setCurrentUserPage] = useState(1);
    const [currentProductPage, setCurrentProductPage] = useState(1);
    const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
    const [currentOrderPage, setCurrentOrderPage] = useState(1);
    const [currentRolePage, setCurrentRolePage] = useState(1);
    const itemsPerPage = 10;

    // UI state for modals/forms
    const [isEditingProduct, setIsEditingProduct] = useState(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deletingRole, setDeletingRole] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [viewingPO, setViewingPO] = useState(null);
    const [paymentModal, setPaymentModal] = useState({ show: false, order: null });
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [newPayment, setNewPayment] = useState({ type: 'cash', bank_code: '', amount: '', payment_date: '', comment: '' });
    const [statusChangeModal, setStatusChangeModal] = useState({ show: false, orderId: null, newStatus: null });
    const [statusComment, setStatusComment] = useState('');
    const [discountModal, setDiscountModal] = useState({ show: false, order: null });
    const [discountData, setDiscountData] = useState({ discount_amount: '', discount_type: 'percentage' });

    const [editingCategory, setEditingCategory] = useState(null);

    // Banks Redux state
    const banks = useAppSelector((state) => state.bank.banks) || [];
    const [isAddingBank, setIsAddingBank] = useState(false);
    const [editingBank, setEditingBank] = useState(null);
    const [deletingBank, setDeletingBank] = useState(null);
    const [newBank, setNewBank] = useState({ code: '', label: '' });
    const [bankErrors, setBankErrors] = useState({});
    const [currentBankPage, setCurrentBankPage] = useState(1);

    // Loading states for modals
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [isRoleLoading, setIsRoleLoading] = useState(false);
    const [isBankLoading, setIsBankLoading] = useState(false);
    const [isSavingPayment, setIsSavingPayment] = useState(false);
    const [downloadingOrderId, setDownloadingOrderId] = useState(null);

    // User role state for access control
    const [userRole, setUserRole] = useState({ id: 1, code: 'ADMIN', label: 'Administrateur', is_active: true });
    const [isLoadingRole, setIsLoadingRole] = useState(true);

    // Fetch user role on mount
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userStr = sessionStorage.getItem('user');
        
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                const roleId = user.role_id || user.role?.id;
                
                if (roleId) {
                    dispatch(getRoleById({ id: roleId, token }))
                        .unwrap()
                        .then((role) => {
                            setUserRole(role?.data || role);
                            setIsLoadingRole(false);
                        })
                        .catch((error) => {
                            setIsLoadingRole(false);
                        });
                } else {
                    setIsLoadingRole(false);
                }
            } catch (error) {
                setIsLoadingRole(false);
            }
        } else {
            // Demo mode: set ADMIN role by default to allow viewing all content
            setUserRole({ id: 1, code: 'ADMIN', label: 'Administrateur', is_active: true });
            setIsLoadingRole(false);
        }
    }, [dispatch]);

    // Fetch data using Redux thunks
    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (token) {
            dispatch(getAllCategories(token));
            
            // Load roles only if user is ADMIN
            if (userRole?.code === 'ADMIN') {
                dispatch(getAllRoles(token));
                dispatch(getAllBanks(token));
            }
        }
    }, [dispatch, userRole]);

    // Load data when activeTab changes
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        // Allow loading even without token (for demo mode with mocks)

        switch(activeTab) {
            case 'products':
                if (token) dispatch(getAllProducts({ category: null, token }));
                break;
            case 'users':
                // Only load users if user is ADMIN
                if (userRole?.code === 'ADMIN' && token) {
                    dispatch(getAllUsers(token));
                }
                break;
            case 'orders':
                if (token) dispatch(getOrdersByUser(token));
                break;
            case 'banks':
                // Only load banks if user is ADMIN
                if (userRole?.code === 'ADMIN' && token) {
                    dispatch(getAllBanks(token));
                }
                break;
            case 'stock':
                // Load stock data
                if (token) {
                    dispatch(getAllStocks(token));
                    dispatch(getLowStockAlerts({ threshold: lowStockThreshold, token }));
                }
                break;
            case 'warehouses':
                // Load warehouse data
                if (token) {
                    dispatch(getAllWarehouses(token));
                }
                break;
            case 'suppliers':
                // Load supplier data
                if (token) {
                    dispatch(getAllSuppliers(token));
                }
                break;
            case 'purchaseOrders':
                // Load purchase order data
                if (token) {
                    dispatch(getAllPurchaseOrders(token));
                }
                break;
            case 'overview':
                // Load all data for overview
                if (token) {
                    dispatch(getAllProducts({ category: null, token }));
                    if (userRole?.code === 'ADMIN') {
                        dispatch(getAllUsers(token));
                    }
                    dispatch(getOrdersByUser(token));
                    dispatch(getAllWarehouses(token));
                    dispatch(getAllSuppliers(token));
                }
                break;
            default:
                break;
        }
    }, [activeTab, dispatch, userRole]);

    // Form data state
    const [newUser, setNewUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role_id: '',
        phone: '',
        address: '',
        discount_percent: 20,
        is_active: true,
        deactivated_at: new Date().toISOString().split('T')[0]
    });
    const [newCategory, setNewCategory] = useState({ name: '', emoji: '📦', description: '', is_active: true });
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        brand: '',
        price: '',
        stock: '',
        packageUnit: '',
        description: '',
        ingredients: '',
        is_active: true,
        flavors: [],
        role_prices: []
    });
    const [newRole, setNewRole] = useState({ code: '', label: '', is_active: true });
    const [editProduct, setEditProduct] = useState({
        name: '',
        category: '',
        brand: '',
        price: '',
        stock: '',
        packageUnit: '',
        description: '',
        ingredients: '',
        is_active: true,
        flavors: [],
        role_prices: []
    });

    // Flavor management states
    const [isAddingFlavor, setIsAddingFlavor] = useState(false);
    const [editingFlavorIndex, setEditingFlavorIndex] = useState(null);
    const [currentFlavor, setCurrentFlavor] = useState({ name: '', description: '', color: '#d4af37', image: '' });
    const [flavorImageFile, setFlavorImageFile] = useState(null);
    const [imageInputMethod, setImageInputMethod] = useState('url'); // 'url' or 'file'

    // Role price management states
    const [isAddingRolePrice, setIsAddingRolePrice] = useState(false);
    const [editingRolePriceIndex, setEditingRolePriceIndex] = useState(null);
    const [currentRolePrice, setCurrentRolePrice] = useState({ role_id: '', price: '' });

    // Validation errors
    const [userErrors, setUserErrors] = useState({});
    const [categoryErrors, setCategoryErrors] = useState({});
    const [productErrors, setProductErrors] = useState({});
    const [roleErrors, setRoleErrors] = useState({});

    // Stock Management States
    const [stockAdjustmentModal, setStockAdjustmentModal] = useState(null);
    const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
    const [adjustmentReason, setAdjustmentReason] = useState('adjustment');
    const [stockSearchQuery, setStockSearchQuery] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState(20);
    const [isAdjustingStock, setIsAdjustingStock] = useState(false);

    // Warehouse Management States
    const [warehouseSearchQuery, setWarehouseSearchQuery] = useState('');
    const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '', city: '', capacity: 0, is_active: true });
    const [editingWarehouse, setEditingWarehouse] = useState(null);
    const [isCreatingWarehouse, setIsCreatingWarehouse] = useState(false);
    const [deletingWarehouse, setDeletingWarehouse] = useState(null);
    const [isSavingWarehouse, setIsSavingWarehouse] = useState(false);

    // Supplier Management States
    const [supplierSearchQuery, setSupplierSearchQuery] = useState('');
    const [newSupplier, setNewSupplier] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        address: '', 
        city: '', 
        postal_code: '',
        country: '',
        payment_terms: '',
        is_active: true 
    });
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [isCreatingSupplier, setIsCreatingSupplier] = useState(false);
    const [deletingSupplier, setDeletingSupplier] = useState(null);
    const [isSavingSupplier, setIsSavingSupplier] = useState(false);

    // Purchase Order Management States
    const [poSearchQuery, setPoSearchQuery] = useState('');
    const [poStatusFilter, setPoStatusFilter] = useState('all');
    const [newPurchaseOrder, setNewPurchaseOrder] = useState({ supplier_id: '', warehouse_id: '', total_amount: 0, status: 'draft', notes: '', lines: [] });
    const [editingPurchaseOrder, setEditingPurchaseOrder] = useState(null);
    const [isCreatingPurchaseOrder, setIsCreatingPurchaseOrder] = useState(false);
    const [poItems, setPoItems] = useState([]);
    const [newPoItem, setNewPoItem] = useState({ product_id: '', quantity: 1, unit_price: 0, received_quantity: 0 });
    const [showPoItemModal, setShowPoItemModal] = useState(false);
    const [isReceivingPO, setIsReceivingPO] = useState(false);
    const [poReceiveItems, setPoReceiveItems] = useState({});
    const [deletingPO, setDeletingPO] = useState(null);
    const [isSavingPO, setIsSavingPO] = useState(false);
    const [isLoadingForEdit, setIsLoadingForEdit] = useState(false);
    const [isLoadingForDetails, setIsLoadingForDetails] = useState(false);

    // Returns Management States
    const [customerReturnSearchQuery, setCustomerReturnSearchQuery] = useState('');
    const [customerReturnStatusFilter, setCustomerReturnStatusFilter] = useState('all');
    const [customerReturnProductSearch, setCustomerReturnProductSearch] = useState('');
    const [isCustomerReturnProductSearching, setIsCustomerReturnProductSearching] = useState(false);
    const [newCustomerReturn, setNewCustomerReturn] = useState({ order_id: '', product_id: '', quantity_returned: 0, reason: '', notes: '' });
    const [isCreatingCustomerReturn, setIsCreatingCustomerReturn] = useState(false);
    const [editingCustomerReturn, setEditingCustomerReturn] = useState(null);
    const [viewingCustomerReturn, setViewingCustomerReturn] = useState(null);

    const [supplierReturnSearchQuery, setSupplierReturnSearchQuery] = useState('');
    const [supplierReturnStatusFilter, setSupplierReturnStatusFilter] = useState('all');
    const [supplierReturnProductSearch, setSupplierReturnProductSearch] = useState('');
    const [isSupplierReturnProductSearching, setIsSupplierReturnProductSearching] = useState(false);
    const [newSupplierReturn, setNewSupplierReturn] = useState({ po_id: '', product_id: '', quantity_returned: 0, reason: '', notes: '' });
    const [isCreatingSupplierReturn, setIsCreatingSupplierReturn] = useState(false);
    const [editingSupplierReturn, setEditingSupplierReturn] = useState(null);
    const [viewingSupplierReturn, setViewingSupplierReturn] = useState(null);

    // Load suppliers and warehouses when PO modal opens
    useEffect(() => {
        if (isCreatingPurchaseOrder) {
            const token = sessionStorage.getItem('token');
            if (token) {
                console.log('Loading suppliers and warehouses for PO modal...');
                dispatch(getAllSuppliers(token));
                dispatch(getAllWarehouses(token));
                dispatch(getAllProducts({ category: null, token }));
            }
        }
    }, [isCreatingPurchaseOrder, dispatch]);

    const stats = [
        { label: 'Total Produits', value: products.length, icon: <Package size={20} />, color: '#d4af37' },
        { label: 'Utilisateurs', value: users.length, icon: <UsersIcon size={20} />, color: '#10b981' },
        { label: 'Catégories', value: categories.length, icon: <Tag size={20} />, color: '#8b5cf6' }
    ];

    const handleStatusChange = (orderId, newStatus) => {
        // Ouvrir le modal pour demander un commentaire
        setStatusChangeModal({ show: true, orderId, newStatus });
        setStatusComment('');
    };

    const confirmStatusChange = async () => {
        const { orderId, newStatus } = statusChangeModal;
        const token = sessionStorage.getItem('token');
        try {
            // Mettre à jour dans le backend avec le commentaire
            await orderService.updateOrderStatus(orderId, newStatus, statusComment, token);
            // Recharger les commandes depuis Redux
            await dispatch(getOrdersByUser(token));
            showToast('Statut de la commande mis à jour avec succès', 'success');
            // Fermer le modal
            setStatusChangeModal({ show: false, orderId: null, newStatus: null });
            setStatusComment('');
        } catch (error) {
            showToast('Erreur lors de la mise à jour du statut', 'error');
        }
    };

    const handleViewOrder = async (order) => {
        const token = sessionStorage.getItem('token');
        try {
            // Charger les détails complets de la commande
            const fullOrder = await orderService.getOrderById(order.id, token);
            setViewingOrder(fullOrder);
        } catch (error) {
            showToast('Erreur lors du chargement des détails de la commande', 'error');
        }
    };

    const handleDownloadQuote = async (order) => {
        if (downloadingOrderId) return;

        const token = sessionStorage.getItem('token');
        const orderId = order.order_number || order.id;

        setDownloadingOrderId(orderId);

        try {
            const result = await dispatch(downloadQuote({ orderId, token })).unwrap();
            const url = window.URL.createObjectURL(result.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `devis-INV-${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('❌ Error downloading quote:', error);
            alert('Erreur lors du téléchargement du devis');
        } finally {
            setDownloadingOrderId(null);
        }
    };

    const handleViewProduct = async (product) => {
        const token = sessionStorage.getItem('token');
        setIsProductLoading(true);
        try {
            // Charger les détails complets du produit
            const fullProduct = await productService.getProductById(product.id, token);
            
            // L'API peut retourner role_prices ou price_roles
            const rolePrices = fullProduct.role_prices || fullProduct.price_roles || [];
            
            setViewingProduct({
                ...fullProduct,
                role_prices: rolePrices,
                price_roles: rolePrices,
                flavors: fullProduct.flavors || []
            });
        } catch (error) {
            showToast('Erreur lors du chargement du produit', 'error');
        } finally {
            setIsProductLoading(false);
        }
    };

    const handleEditProduct = async (product) => {
        const token = sessionStorage.getItem('token');
        setIsProductLoading(true);
        try {
            // Charger les détails complets du produit
            const fullProduct = await productService.getProductById(product.id, token);
            
            // L'API peut retourner role_prices ou price_roles
            const rolePrices = fullProduct.role_prices || fullProduct.price_roles || [];
            
            setEditProduct({
                id: fullProduct.id,
                name: fullProduct.name || '',
                category: fullProduct.category_id || fullProduct.category || '',
                brand: fullProduct.brand || fullProduct.marque || '',
                price: fullProduct.price || '',
                stock: fullProduct.stock || 0,
                packageUnit: fullProduct.packageUnit || '',
                description: fullProduct.description || '',
                ingredients: fullProduct.ingredients || '',
                is_active: fullProduct.is_active ?? true,
                flavors: fullProduct.flavors || [],
                role_prices: rolePrices
            });
            setIsEditingProduct(fullProduct);
        } catch (error) {
            showToast('Erreur lors du chargement du produit');
        } finally {
            setIsProductLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        setDeletingUser(id);
    };

    const confirmDeleteUser = async () => {
        const id = deletingUser;
        setDeletingUser(null);

        const token = sessionStorage.getItem('token');
        try {
            await userService.deleteUser(id, token);
            // Recharger la liste des utilisateurs après suppression
            await dispatch(getAllUsers(token));
            showToast('Utilisateur supprimé avec succès');
        } catch (error) {
            showToast('Erreur lors de la suppression de l\'utilisateur', 'error');
        }
    };

    const handleDeleteProduct = async (id) => {
        setDeletingProduct(id);
    };

    const confirmDeleteProduct = async () => {
        const id = deletingProduct;
        setDeletingProduct(null);

        const token = sessionStorage.getItem('token');
        try {
            await productService.deleteProduct(id, token);
            // Recharger la liste des produits après suppression
            await dispatch(getAllProducts({ category: null, token }));
            showToast('Produit supprimé avec succès');
        } catch (error) {
            showToast('Erreur lors de la suppression du produit', 'error');
        }
    };

    const handleDeleteCategory = async (id) => {
        setDeletingCategory(id);
    };

    const handleDeletePurchaseOrder = async (id) => {
        setDeletingPO(id);
    };

    const confirmDeletePurchaseOrder = async () => {
        if (!deletingPO) return;
        
        const id = deletingPO;
        setDeletingPO(null);
        const token = sessionStorage.getItem('token');
        
        try {
            const result = await dispatch(deletePurchaseOrder({ id, token }));
            
            if (deletePurchaseOrder.fulfilled.match(result)) {
                showToast('Commande d\'achat supprimée avec succès', 'success');
                dispatch(getAllPurchaseOrders(token));
            } else if (deletePurchaseOrder.rejected.match(result)) {
                showToast('Erreur lors de la suppression de la commande', 'error');
            }
        } catch (error) {
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    const handleDeleteSupplier = async (id) => {
        setDeletingSupplier(id);
    };

    const handleDeleteWarehouse = async (id) => {
        setDeletingWarehouse(id);
    };

    const confirmDeleteWarehouse = async () => {
        if (!deletingWarehouse) return;
        
        const id = deletingWarehouse;
        setDeletingWarehouse(null);
        const token = sessionStorage.getItem('token');
        
        try {
            const result = await dispatch(deleteWarehouse({ id, token }));
            
            if (deleteWarehouse.fulfilled.match(result)) {
                showToast('Entrepôt supprimé avec succès', 'success');
                dispatch(getAllWarehouses(token));
            } else if (deleteWarehouse.rejected.match(result)) {
                showToast('Erreur lors de la suppression de l\'entrepôt', 'error');
            }
        } catch (error) {
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    const confirmDeleteSupplier = async () => {
        if (!deletingSupplier) return;
        
        const id = deletingSupplier;
        setDeletingSupplier(null);
        const token = sessionStorage.getItem('token');
        
        try {
            const result = await dispatch(deleteSupplier({ id, token }));
            
            if (deleteSupplier.fulfilled.match(result)) {
                showToast('Fournisseur supprimé avec succès', 'success');
                dispatch(getAllSuppliers(token));
            } else if (deleteSupplier.rejected.match(result)) {
                showToast('Erreur lors de la suppression du fournisseur', 'error');
            }
        } catch (error) {
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    const confirmDeleteCategory = async () => {
        const id = deletingCategory;
        setDeletingCategory(null);

        const token = sessionStorage.getItem('token');
        try {
            const result = await dispatch(deleteCategory({ id, token }));

            if (deleteCategory.fulfilled.match(result)) {
                showToast('Catégorie supprimée avec succès');
            } else if (deleteCategory.rejected.match(result)) {
                showToast('Erreur lors de la suppression de la catégorie', 'error');
            }
        } catch (error) {
            showToast('Erreur lors de la suppression de la catégorie', 'error');
        }
    };



    // Validation functions
    const validateUser = () => {
        const errors = {};
        if (!newUser.first_name.trim()) errors.first_name = 'Le prénom est requis';
        if (!newUser.last_name.trim()) errors.last_name = 'Le nom est requis';
        if (!newUser.email.trim()) errors.email = 'L\'email est requis';
        else if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = 'Email invalide';
        // Mot de passe requis seulement pour l'ajout (pas en édition)
        if (!editingUser && (!newUser.password || newUser.password.length < 6)) {
            errors.password = 'Mot de passe min. 6 caractères';
        } else if (editingUser && newUser.password && newUser.password.length < 6) {
            errors.password = 'Mot de passe min. 6 caractères';
        }
        if (!newUser.role_id) errors.role_id = 'Le rôle est requis';
        if (newUser.phone && !/^\d{8,15}$/.test(newUser.phone.replace(/\s/g, ''))) {
            errors.phone = 'Téléphone invalide (8-15 chiffres)';
        }
        setUserErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateCategory = () => {
        const errors = {};
        if (!newCategory.name.trim()) errors.name = 'Le nom est requis';
        if (!newCategory.emoji.trim()) errors.emoji = 'L\'emoji est requis';
        setCategoryErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateProduct = (product = newProduct) => {
        const errors = {};
        if (!product.name.trim()) errors.name = 'Le nom est requis';
        if (!product.category) errors.category = 'La catégorie est requise';
        if (!product.brand.trim()) errors.brand = 'La marque est requise';
        if (!product.price || parseFloat(product.price) <= 0) errors.price = 'Prix invalide';
        if (!product.stock || parseInt(product.stock) < 0) errors.stock = 'Stock invalide';
        setProductErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Add handlers
    const handleAddUser = async () => {
        if (validateUser()) {
            setIsUserLoading(true);
            try {
                const userData = {
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    email: newUser.email,
                    password: newUser.password,
                    role_id: parseInt(newUser.role_id),
                    phone: newUser.phone || undefined,
                    address: newUser.address || undefined,
                    discount_percent: parseFloat(newUser.discount_percent),
                    is_active: newUser.is_active,
                    deactivated_at: newUser.deactivated_at
                };
                const user = await authService.register(userData);
                // Recharger la liste des utilisateurs après création
                const token = sessionStorage.getItem('token');
                if (token) {
                    await dispatch(getAllUsers(token));
                }
                showToast('Utilisateur créé avec succès');
                setIsAddingUser(false);
                setNewUser({
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    role_id: '',
                    phone: '',
                    address: '',
                    discount_percent: 20,
                    is_active: true,
                    deactivated_at: '2026-01-20'
                });
                setUserErrors({});
            } catch (error) {
                showToast('Erreur lors de l\'ajout de l\'utilisateur', 'error');
            } finally {
                setIsUserLoading(false);
            }
        }
    };

    const handleUpdateUser = async () => {
        if (validateUser()) {
            setIsUserLoading(true);
            try {
                const userData = {
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    email: newUser.email,
                    role_id: parseInt(newUser.role_id),
                    phone: newUser.phone || undefined,
                    address: newUser.address || undefined,
                    discount_percent: parseFloat(newUser.discount_percent),
                    is_active: newUser.is_active,
                    deactivated_at: newUser.deactivated_at
                };
                // Ajouter le mot de passe seulement s'il a été modifié
                if (newUser.password && newUser.password.length >= 6) {
                    userData.password = newUser.password;
                }
                const token = sessionStorage.getItem('token');
                await userService.updateUser(editingUser, userData, token);
                // Recharger la liste des utilisateurs après mise à jour
                if (token) {
                    await dispatch(getAllUsers(token));
                }
                showToast('Utilisateur modifié avec succès');
                setEditingUser(null);
                setNewUser({
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    role_id: '',
                    phone: '',
                    address: '',
                    discount_percent: 20,
                    is_active: true,
                    deactivated_at: '2026-01-20'
                });
                setUserErrors({});
            } catch (error) {
                showToast('Erreur lors de la modification de l\'utilisateur', 'error');
            } finally {
                setIsUserLoading(false);
            }
        }
    };

    const handleAddCategory = async () => {
        if (validateCategory()) {
            const token = sessionStorage.getItem('token');
            const categoryData = {
                name: newCategory.name,
                description: newCategory.description,
                emoji: newCategory.emoji,
                is_active: newCategory.is_active
            };
            setIsCategoryLoading(true);
            try {
                const result = await dispatch(createCategory({ categoryData, token }));

                if (createCategory.fulfilled.match(result)) {
                    showToast('Catégorie créée avec succès');
                    setIsAddingCategory(false);
                    setNewCategory({ name: '', emoji: '📦', description: '', is_active: true });
                    setCategoryErrors({});
                } else {
                    showToast('Erreur lors de l\'ajout de la catégorie', 'error');
                }
            } catch (error) {
                showToast('Erreur lors de l\'ajout de la catégorie', 'error');
            } finally {
                setIsCategoryLoading(false);
            }
        }
    };

    const handleUpdateCategory = async () => {
        if (validateCategory()) {
            const token = sessionStorage.getItem('token');
            const categoryData = {
                name: newCategory.name,
                description: newCategory.description,
                emoji: newCategory.emoji,
                is_active: newCategory.is_active
            };
            setIsCategoryLoading(true);
            try {
                const result = await dispatch(updateCategory({ id: editingCategory, categoryData, token }));

                if (updateCategory.fulfilled.match(result)) {
                    showToast('Catégorie modifiée avec succès');
                    setEditingCategory(null);
                    setNewCategory({ name: '', emoji: '📦', description: '', is_active: true });
                    setCategoryErrors({});
                    // Recharger les catégories
                    await dispatch(getAllCategories(token));
                } else {
                    showToast('Erreur lors de la modification de la catégorie', 'error');
                }
            } catch (error) {
                showToast('Erreur lors de la modification de la catégorie', 'error');
            } finally {
                setIsCategoryLoading(false);
            }
        }
    };





    const handleAddProduct = async () => {
        if (validateProduct()) {
            const token = sessionStorage.getItem('token');
            const productData = {
                name: newProduct.name,
                category_id: parseInt(newProduct.category),
                marque: newProduct.brand,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
                packageUnit: newProduct.packageUnit ? parseInt(newProduct.packageUnit) : null,
                description: newProduct.description,
                ingredients: newProduct.ingredients,
                is_active: newProduct.is_active,
                flavors: newProduct.flavors,
                price_roles: newProduct.role_prices
            };
            setIsProductLoading(true);
            try {
                const result = await dispatch(createProduct({ productData, token }));

                if (createProduct.fulfilled.match(result)) {
                    showToast('Produit créé avec succès');
                    setIsAddingProduct(false);
                    setNewProduct({ name: '', category: '', brand: '', price: '', stock: '', packageUnit: '', description: '', ingredients: '', is_active: true, flavors: [], role_prices: [] });
                    setProductErrors({});
                } else {
                    showToast('Erreur lors de l\'ajout du produit', 'error');
                }
            } catch (error) {
                showToast('Erreur lors de l\'ajout du produit', 'error');
            } finally {
                setIsProductLoading(false);
            }
        }
    };

    const handleUpdateProduct = async () => {
        if (validateProduct(editProduct)) {
            const token = sessionStorage.getItem('token');
            const productData = {
                name: editProduct.name,
                category_id: parseInt(editProduct.category),
                marque: editProduct.brand,
                price: parseFloat(editProduct.price),
                stock: parseInt(editProduct.stock),
                packageUnit: editProduct.packageUnit ? parseInt(editProduct.packageUnit) : 1,
                description: editProduct.description,
                ingredients: editProduct.ingredients,
                is_active: editProduct.is_active,
                flavors: editProduct.flavors,
                price_roles: editProduct.role_prices
            };
            setIsProductLoading(true);
            try {
                const result = await dispatch(updateProduct({ id: editProduct.id, productData, token }));

                if (updateProduct.fulfilled.match(result)) {
                    showToast('Produit mis à jour avec succès');
                    setIsEditingProduct(null);
                    setEditProduct({ name: '', category: '', brand: '', price: '', stock: '', packageUnit: '', description: '', ingredients: '', is_active: true, flavors: [], role_prices: [] });
                    setProductErrors({});
                    // Recharger la liste des produits
                    await dispatch(getAllProducts({ category: null, token }));
                } else {
                    showToast('Erreur lors de la mise à jour du produit', 'error');
                }
            } catch (error) {
                showToast('Erreur lors de la mise à jour du produit', 'error');
            } finally {
                setIsProductLoading(false);
            }
        }
    };

    // Pagination helpers
    const paginate = (items, currentPage) => {
        if (!items || !Array.isArray(items)) {
            return [];
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.filter(item => item != null).slice(startIndex, startIndex + itemsPerPage);
    };

    const getTotalPages = (items) => {
        if (!items || !Array.isArray(items)) {
            return 1;
        }
        return Math.ceil(items.length / itemsPerPage);
    };

    const renderOverview = () => (
        <div className="admin-overview">
            {/* Stats Cards */}
            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <span className="stat-value">{stat.value}</span>
                            <p className="stat-label">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts and Recent Activity */}
            <div className="overview-recent-grid">
                <div className="recent-card">
                    <div className="card-header-flex">
                        <h3><Clock size={20} style={{ display: 'inline', marginRight: '10px' }} />Activité Récente</h3>
                    </div>
                    <div className="simple-table-modern">
                        {orders.slice(0, 3).map(order => {
                            const statusInfo = ORDER_STATUSES.find(s => s.value === order.status) || { color: '#999', label: order.status };
                            const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'N/A';
                            
                            return (
                                <div key={order.id} className="simple-row-modern" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div className="order-id-customer" style={{ flex: 1 }}>
                                        <span className="id" style={{ fontWeight: '700', color: 'var(--primary)' }}>#{order.id}</span>
                                        <span className="customer" style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                                            {order.customer || order.customer_name || order.user?.name || 'Client'}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                                            {orderDate}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '120px' }}>
                                        <span style={{ fontWeight: '700', color: '#10b981', fontSize: '0.95rem' }}>
                                            {parseFloat(order.total || 0).toFixed(2)} DH
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className="status-badge-modern" style={{
                                            background: `${statusInfo.color}15`,
                                            color: statusInfo.color,
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {orders.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                Aucune commande récente
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="overview-bottom-row" style={{ marginTop: '30px' }}>
                <div className="recent-card full-width">
                    <h3>Nouveaux Utilisateurs</h3>
                    <div className="users-mini-list">
                        {users.filter(user => user && (user.id || user._id)).slice(0, 3).map(user => (
                            <div key={user.id} className="user-pill-item">
                                <div className="avatar-small">
                                    {user?.name?.charAt(0) || user?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="info">
                                    <span className="name">{user?.name || user?.firstName || user?.email || 'Utilisateur'}</span>
                                    <span className="email">{user?.email || 'N/A'}</span>
                                </div>
                                <span className="role">{user?.role_label || 'Client'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="statistics-section" style={{ marginTop: '40px' }}>
                <div className="section-header">
                    <h2><TrendingUp size={24} style={{ display: 'inline', marginRight: '10px' }} />Statistiques Globales</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {/* Revenu Total */}
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '10px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <DollarSign size={24} color="#10b981" />
                            </div>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', margin: 0 }}>
                                Revenu Total
                            </h4>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                            {orders.length} commandes
                        </div>
                    </div>

                    {/* Commandes Livrées */}
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '10px',
                                background: 'rgba(212, 175, 55, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Package size={24} color="#d4af37" />
                            </div>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', margin: 0 }}>
                                Taux de Livraison
                            </h4>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {((orders.filter(o => o.status === 'DELIVERED').length / (orders.length || 1)) * 100).toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                            {orders.filter(o => o.status === 'DELIVERED').length} commandes livrées
                        </div>
                    </div>

                    {/* Utilisateurs */}
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '10px',
                                background: 'rgba(139, 92, 246, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <UsersIcon size={24} color="#8b5cf6" />
                            </div>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', margin: 0 }}>
                                Utilisateurs
                            </h4>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {users.length}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                            Comptes actifs
                        </div>
                    </div>

                    {/* Produits */}
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '10px',
                                background: 'rgba(59, 130, 246, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Package size={24} color="#3b82f6" />
                            </div>
                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', margin: 0 }}>
                                Produits
                            </h4>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {products.length}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                            {categories.length} catégories
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );

    const renderReporting = () => {
        const orderStatusData = ORDER_STATUSES.map(status => ({
            label: status.label,
            value: status.value,
            color: status.color,
            count: orders.filter(o => o.status === status.value).length
        }));

        return (
            <div className="admin-section reporting-view">
                <div className="section-header">
                    <h2>Rapports & Statistiques</h2>
                </div>

                <div className="reporting-grid">
                    <div className="report-card main-chart">
                        <div className="card-header-flex">
                            <h3><BarChart3 size={20} style={{ display: 'inline', marginRight: '10px' }} />Récapitulatif Quotidien</h3>
                            <div className="period-filter">
                                <button 
                                    className={dailyPeriod === 'hebdomadaire' ? 'active' : ''}
                                    onClick={() => setDailyPeriod('hebdomadaire')}
                                >
                                    Hebdo
                                </button>
                                <button 
                                    className={dailyPeriod === 'mensuel' ? 'active' : ''}
                                    onClick={() => setDailyPeriod('mensuel')}
                                >
                                    Mensuel
                                </button>
                                <button 
                                    className={dailyPeriod === 'trimestriel' ? 'active' : ''}
                                    onClick={() => setDailyPeriod('trimestriel')}
                                >
                                    Trimestriel
                                </button>
                                <button 
                                    className={dailyPeriod === 'annuel' ? 'active' : ''}
                                    onClick={() => setDailyPeriod('annuel')}
                                >
                                    Annuel
                                </button>
                            </div>
                        </div>
                        <SalesChart data={SALES_DATA} />
                    </div>

                    <div className="report-card main-chart">
                        <div className="card-header-flex">
                            <h3><TrendingUp size={20} style={{ display: 'inline', marginRight: '10px' }} />Tendance Hebdomadaire</h3>
                            <div className="period-filter">
                                <button 
                                    className={trendPeriod === 'hebdomadaire' ? 'active' : ''}
                                    onClick={() => setTrendPeriod('hebdomadaire')}
                                >
                                    Hebdo
                                </button>
                                <button 
                                    className={trendPeriod === 'mensuel' ? 'active' : ''}
                                    onClick={() => setTrendPeriod('mensuel')}
                                >
                                    Mensuel
                                </button>
                                <button 
                                    className={trendPeriod === 'trimestriel' ? 'active' : ''}
                                    onClick={() => setTrendPeriod('trimestriel')}
                                >
                                    Trimestriel
                                </button>
                                <button 
                                    className={trendPeriod === 'annuel' ? 'active' : ''}
                                    onClick={() => setTrendPeriod('annuel')}
                                >
                                    Annuel
                                </button>
                            </div>
                        </div>
                        <SalesTrendChart data={SALES_DATA} />
                    </div>

                    <div className="report-card distribution">
                        <h3><PieChartIcon size={20} style={{ display: 'inline', marginRight: '10px' }} />Répartition des Commandes</h3>
                        <div className="donut-chart-wrapper">
                            <DonutChart data={orderStatusData} total={orders.length} />
                            <div className="donut-legend">
                                {orderStatusData.map(status => (
                                    <div key={status.value} className="legend-item">
                                        <div className="legend-color" style={{ background: status.color }}></div>
                                        <span className="legend-label">{status.label}</span>
                                        <span className="legend-value">{status.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderUsers = () => {
        const paginatedUsers = paginate(users, currentUserPage);
        const totalPages = getTotalPages(users);

        return (
            <div className="admin-section">
                <div className="section-header">
                    <h2>Gestion des Utilisateurs</h2>
                    <button className="add-btn high-contrast" onClick={() => setIsAddingUser(true)}>
                        <Plus size={18} /> Ajouter un Utilisateur
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.filter(user => user && (user.id || user._id)).map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell-flex">
                                            <div className="avatar-small">
                                                {user?.name?.charAt(0) || user?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <span>{user?.last_name + ' ' + user?.first_name || user?.email || 'Utilisateur'}</span>
                                        </div>
                                    </td>
                                    <td>{user?.email || 'N/A'}</td>
                                    <td>
                                        <span className={`role-tag ${(user?.role_label || 'Client').toLowerCase()}`}>
                                            {user?.role_label || 'Client'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${user?.is_active ? 'active' : 'inactive'}`}>
                                            {user?.is_active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="icon-btn edit" onClick={() => {
                                            setEditingUser(user.id);
                                            setNewUser({
                                                first_name: user.first_name || '',
                                                last_name: user.last_name || '',
                                                email: user.email || '',
                                                password: '',
                                                role_id: user.role_id || '',
                                                phone: user.phone || '',
                                                address: user.address || '',
                                                discount_percent: user.discount_percent || 20,
                                                is_active: user.is_active !== undefined ? user.is_active : true,
                                                deactivated_at: user.deactivated_at || new Date().toISOString().split('T')[0]
                                            });
                                        }} title="Modifier"><Edit2 size={16} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDeleteUser(user.id)} title="Supprimer"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            className="page-btn"
                            disabled={currentUserPage === 1}
                            onClick={() => setCurrentUserPage(currentUserPage - 1)}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="page-info">
                            Page {currentUserPage} sur {totalPages}
                        </span>
                        <button
                            className="page-btn"
                            disabled={currentUserPage === totalPages}
                            onClick={() => setCurrentUserPage(currentUserPage + 1)}
                        >
                            <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderCategories = () => {
        const paginatedCategories = paginate(categories, currentCategoryPage);
        const totalPages = getTotalPages(categories);

        return (
            <div className="admin-section categories-view">
                <div className="section-header">
                    <h2><Tag size={24} /> Catégories</h2>
                    <button className="add-btn" onClick={() => setIsAddingCategory(true)}>
                        <Plus size={20} /> Nouvelle Catégorie
                    </button>
                </div>

                <div className="categories-grid">
                    {paginatedCategories.map(category => (
                        <div key={category.id} className="category-admin-card-modern">
                            <div className="category-icon-admin">{category.emoji}</div>
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                            <div className="category-stats-mini">
                                <span>{category.product_count>0 ? category.product_count : '0'} Produits</span>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="icon-btn edit"
                                    onClick={() => {
                                        setEditingCategory(category.id);
                                        setNewCategory({
                                            name: category.name || '',
                                            emoji: category.emoji || '📦',
                                            description: category.description || '',
                                            is_active: category.is_active !== undefined ? category.is_active : true
                                        });
                                    }}
                                    title="Modifier"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="icon-btn delete"
                                    onClick={() => handleDeleteCategory(category.id)}
                                    title="Supprimer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            className="page-btn"
                            disabled={currentCategoryPage === 1}
                            onClick={() => setCurrentCategoryPage(p => p - 1)}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="page-info">Page {currentCategoryPage} sur {totalPages}</span>
                        <button
                            className="page-btn"
                            disabled={currentCategoryPage === totalPages}
                            onClick={() => setCurrentCategoryPage(p => p + 1)}
                        >
                            <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderProducts = () => {
        const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const paginatedProducts = paginate(filteredProducts, currentProductPage);
        const totalPages = getTotalPages(filteredProducts);
        return (
            <div className="admin-section">
                <div className="section-header">
                    <h2>Gestion du Catalogue</h2>
                    <div className="header-actions-flex">
                        <div className="admin-search-bar-modern">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {/* Export Button */}
                            <button
                                className={`modern-action-btn export${isExporting ? ' loading' : ''}`}
                                onClick={handleExportExcel}
                                disabled={isExporting}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    background: '#e3edfa', // Soft blue
                                    color: '#2563eb', // Blue text
                                    border: '2px solid #2563eb', // Blue border
                                    borderRadius: '16px', // Match Nouveau Produit button
                                    padding: '0 18px',
                                    height: '48px',
                                    minWidth: '180px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 8px 0 rgba(59,130,246,0.04)',
                                    cursor: isExporting ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s, color 0.2s, border 0.2s',
                                    position: 'relative',
                                    opacity: isExporting ? 0.7 : 1
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.background = '#2563eb'; // Blue
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.background = '#e3edfa';
                                    e.currentTarget.style.color = '#2563eb';
                                }}
                            >
                                {isExporting ? <Loader2 className="spin" size={18} /> : <Download size={18} />}
                                <span style={{lineHeight: 1}}>Exporter Excel</span>
                            </button>
                            {/* Import Button */}
                            <label
                                className={`modern-action-btn import${isImporting ? ' loading' : ''}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    background: '#e6f7ef', // Soft green
                                    color: '#059669', // Green text
                                    border: '2px solid #059669', // Green border
                                    borderRadius: '16px', // Match Nouveau Produit button
                                    padding: '0 18px',
                                    height: '48px',
                                    minWidth: '180px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 8px 0 rgba(59,130,246,0.04)',
                                    cursor: isImporting ? 'not-allowed' : 'pointer',
                                    marginBottom: 0,
                                    transition: 'background 0.2s, color 0.2s, border 0.2s',
                                    position: 'relative',
                                    opacity: isImporting ? 0.7 : 1,
                                    overflow: 'hidden'
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.background = '#059669'; // Green
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.background = '#e6f7ef';
                                    e.currentTarget.style.color = '#059669';
                                }}
                            >
                                {isImporting ? <Loader2 className="spin" size={18} /> : <FileText size={18} />}
                                <span style={{lineHeight: 1}}>Importer Excel</span>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleImportExcel}
                                    disabled={isImporting}
                                    tabIndex={-1}
                                />
                            </label>
                            {importError && <span className="import-error animated-fade" style={{ color: '#ef4444', marginLeft: 8 }}>{importError}</span>}
                            {importSuccess && <span className="import-success animated-fade" style={{ color: '#10b981', marginLeft: 8 }}>{importSuccess}</span>}
                        </div>
                        <button className="add-btn high-contrast" onClick={() => setIsAddingProduct(true)}>
                            <Plus size={18} /> Nouveau Produit
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Catégorie</th>
                                <th>Marque</th>
                                <th>Prix</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.map(product => {
                                const category = categories.find(cat => cat.name === product.category || cat.id === product.category_id);
                                return (
                                <tr key={product.id}>
                                    <td className="bold">{product.name}</td>
                                    <td><span className="cat-pill">{category?.emoji || '📦'} {product.category}</span></td>
                                    <td>{product.marque}</td>
                                    <td className="price-cell">{product.price.toFixed(2)} DH</td>
                                    <td>
                                        <div className="stock-indicator">
                                            <div className="stock-bar">
                                                <div 
                                                    className="fill" 
                                                    style={{ 
                                                        width: `${Math.min(100, (product.stock / 100) * 100)}%`,
                                                        background: product.stock < 20 ? '#ef4444' : product.stock <= 80 ? '#f59e0b' : '#22c55e'
                                                    }}
                                                ></div>
                                            </div>
                                            <span 
                                                className="stock-count" 
                                                style={{
                                                    color: product.stock < 20 ? '#ef4444' : product.stock <= 80 ? '#f59e0b' : '#22c55e',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {product.stock} units
                                            </span>
                                        </div>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="icon-btn view" onClick={() => handleViewProduct(product)} title="Voir détails"><Eye size={16} /></button>
                                        <button className="icon-btn edit" onClick={() => handleEditProduct(product)}><Edit2 size={16} /></button>
                                        <button className="icon-btn delete" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            className="page-btn"
                            disabled={currentProductPage === 1}
                            onClick={() => setCurrentProductPage(currentProductPage - 1)}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="page-info">
                            Page {currentProductPage} sur {totalPages}
                        </span>
                        <button
                            className="page-btn"
                            disabled={currentProductPage === totalPages}
                            onClick={() => setCurrentProductPage(currentProductPage + 1)}
                        >
                            <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderStock = () => {
        // Ensure stocks is an array and filter out undefined/null values
        const stocksList = (Array.isArray(stocks) ? stocks : []).filter(s => s && typeof s === 'object');
        
        const filteredStocks = stocksList.filter(stock => {
            if (!stockSearchQuery) return true;
            const searchLower = stockSearchQuery.toLowerCase();
            return (
                stock.product_name?.toLowerCase().includes(searchLower) ||
                stock.product_sku?.toLowerCase().includes(searchLower) ||
                stock.category?.toLowerCase().includes(searchLower)
            );
        });

        const totalStock = stocksList.reduce((sum, stock) => sum + (parseInt(stock?.quantity) || 0), 0);
        const lowStockCount = stockAlerts.length;
        const outOfStock = stocksList.filter(s => s && parseInt(s?.quantity) === 0).length;

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
                                    <th>Seuil</th>
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
                                               {stock.name || 'Produit'}
                                            </td>
                                            <td>{'PRD-' + (stock.id || 'N/A')}</td>
                                            <td>{stock.category_name || 'N/A'}</td>
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
                                            <td>{stock.stock_securite}</td>
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

    const renderWarehouses = () => {
        // Ensure warehouses is an array and filter out undefined/null values
        const warehousesList = (Array.isArray(warehouses) ? warehouses : []).filter(w => w && typeof w === 'object');
        
        const filteredWarehouses = warehousesList.filter(w => {
            if (!warehouseSearchQuery) return true;
            const searchLower = warehouseSearchQuery.toLowerCase();
            return (
                w.name?.toLowerCase().includes(searchLower) ||
                w.location?.toLowerCase().includes(searchLower) ||
                w.city?.toLowerCase().includes(searchLower)
            );
        });

        const totalCapacity = warehousesList.reduce((sum, w) => sum + (parseInt(w?.capacity) || 0), 0);
        const activeWarehouses = warehousesList.filter(w => w?.is_active).length;

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
                        <div className="warehouse-card-value">{warehousesList.length}</div>
                        <div className="warehouse-card-change positive">
                            <Building2 size={16} /> Enregistrés
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
                                        <td style={{ textAlign: 'center' }}><strong>{warehouse.capacity || 0}</strong> unités</td>
                                        <td>
                                            <span className={`status-badge ${warehouse.is_active ? 'active' : 'inactive'}`}>
                                                {warehouse.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="warehouse-actions-cell">
                                                <button
                                                    className="warehouse-action-btn"
                                                    disabled={isSavingWarehouse}
                                                    onClick={() => setEditingWarehouse(warehouse)}
                                                    title="Modifier"
                                                    style={{ opacity: isSavingWarehouse ? 0.6 : 1, cursor: isSavingWarehouse ? 'not-allowed' : 'pointer' }}
                                                >
                                                    {isSavingWarehouse ? <Loader size={16} style={{animation: 'spin 1s linear infinite'}} /> : <Edit2 size={16} />} {isSavingWarehouse ? 'Chargement...' : 'Modifier'}
                                                </button>
                                                <button
                                                    className="warehouse-action-btn delete"
                                                    disabled={deletingWarehouse === warehouse.id}
                                                    onClick={() => handleDeleteWarehouse(warehouse.id)}
                                                    title="Supprimer"
                                                    style={{ opacity: deletingWarehouse === warehouse.id ? 0.6 : 1, cursor: deletingWarehouse === warehouse.id ? 'not-allowed' : 'pointer' }}
                                                >
                                                    {deletingWarehouse === warehouse.id ? <Loader size={16} style={{animation: 'spin 1s linear infinite'}} /> : <Trash2 size={16} />} {deletingWarehouse === warehouse.id ? 'Suppression...' : 'Supprimer'}
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

    const renderSuppliers = () => {
        // Ensure suppliers is an array and filter out undefined/null values
        const suppliersList = (Array.isArray(suppliers) ? suppliers : []).filter(s => s && typeof s === 'object');
        
        const filteredSuppliers = suppliersList.filter(s => {
            if (!supplierSearchQuery) return true;
            const searchLower = supplierSearchQuery.toLowerCase();
            return (
                s.name?.toLowerCase().includes(searchLower) ||
                s.email?.toLowerCase().includes(searchLower)
            );
        });

        const activeSuppliers = suppliersList.filter(s => s?.is_active).length;

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
                        <div className="supplier-card-value">{suppliersList.length}</div>
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
                            {suppliersList.length > 0 ? ((activeSuppliers / suppliersList.length) * 100).toFixed(0) : 0}%
                        </div>
                        <div className="supplier-card-change positive">
                            <TrendingUp size={16} /> Partenaires
                        </div>
                    </div>
                </div>

                <div className="supplier-filters">
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
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
                                    <th>Pays</th>
                                    <th>Ville</th>
                                    <th>Email</th>
                                    <th>Téléphone</th>
                                    <th>Code Postal</th>
                                    <th>Conditions Paiement</th>
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
                                        <td>{supplier.country || 'N/A'}</td>
                                        <td>{supplier.city || 'N/A'}</td>
                                        <td>{supplier.email || 'N/A'}</td>
                                        <td>{supplier.phone || 'N/A'}</td>
                                        <td>{supplier.postal_code || 'N/A'}</td>
                                        <td>{supplier.payment_terms || 'N/A'}</td>
                                        <td>
                                            <span className={`status-badge ${supplier.is_active ? 'active' : 'inactive'}`}>
                                                {supplier.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="supplier-actions-cell">
                                                <button
                                                    className="supplier-action-btn"
                                                    disabled={isSavingSupplier}
                                                    onClick={() => setEditingSupplier(supplier)}
                                                    title="Modifier"
                                                    style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'pointer' }}
                                                >
                                                    {isSavingSupplier ? <Loader size={16} style={{animation: 'spin 1s linear infinite'}} /> : <Edit2 size={16} />} {isSavingSupplier ? 'Chargement...' : 'Modifier'}
                                                </button>
                                                <button
                                                    className="supplier-action-btn delete"
                                                    disabled={deletingSupplier === supplier.id}
                                                    onClick={() => handleDeleteSupplier(supplier.id)}
                                                    title="Supprimer"
                                                    style={{ opacity: deletingSupplier === supplier.id ? 0.6 : 1, cursor: deletingSupplier === supplier.id ? 'not-allowed' : 'pointer' }}
                                                >
                                                    {deletingSupplier === supplier.id ? <Loader size={16} style={{animation: 'spin 1s linear infinite'}} /> : <Trash2 size={16} />} {deletingSupplier === supplier.id ? 'Suppression...' : 'Supprimer'}
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

    const renderPurchaseOrders = () => {
        // Ensure purchaseOrders is an array and filter out undefined/null values
        const poList = (Array.isArray(purchaseOrders) ? purchaseOrders : []).filter(po => po && typeof po === 'object');
        
        const filteredPOs = poList.filter(po => {
            const matchesSearch = !poSearchQuery || 
                po.id?.toString().includes(poSearchQuery) ||
                po.supplier?.name?.toLowerCase().includes(poSearchQuery.toLowerCase()) ||
                po.warehouse?.name?.toLowerCase().includes(poSearchQuery.toLowerCase());
            
            const matchesStatus = poStatusFilter === 'all' || po.status === poStatusFilter;
            return matchesSearch && matchesStatus;
        });

        const draftPOs = poList.filter(po => po?.status === 'draft').length;
        const sentPOs = poList.filter(po => po?.status === 'sent').length;
        const receivedPOs = poList.filter(po => po?.status === 'received').length;
        const totalPOAmount = poList.reduce((sum, po) => sum + (parseFloat(po?.total_amount) || 0), 0);

        return (
            <motion.div
                key="purchaseOrders"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="po-container"
            >
                <div className="po-header">
                    <h2><ShoppingBag size={28} style={{ color: 'var(--primary)' }} /> Gestion des Commandes d'Achat</h2>
                    <div className="po-actions">
                        <button
                            className="primary-btn"
                            onClick={() => setIsCreatingPurchaseOrder(true)}
                        >
                            <Plus size={18} /> Nouvelle Commande
                        </button>
                    </div>
                </div>

                <div className="po-summary">
                    <div className="po-card">
                        <div className="po-card-label">Total Commande</div>
                        <div className="po-card-value">{poList.length}</div>
                        <div className="po-card-change positive">
                            <ShoppingBag size={16} /> Articles
                        </div>
                    </div>

                    <div className="po-card">
                        <div className="po-card-label">En Brouillon</div>
                        <div className="po-card-value" style={{ color: '#f97316' }}>{draftPOs}</div>
                        <div className="po-card-change">
                            <Clock size={16} /> À Envoyer
                        </div>
                    </div>

                    <div className="po-card">
                        <div className="po-card-label">Montant Total</div>
                        <div className="po-card-value" style={{ color: 'var(--primary)' }}>
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalPOAmount)}
                        </div>
                        <div className="po-card-change positive">
                            <DollarSign size={16} /> Budget
                        </div>
                    </div>

                    <div className="po-card">
                        <div className="po-card-label">Reçues</div>
                        <div className="po-card-value" style={{ color: '#10b981' }}>{receivedPOs}</div>
                        <div className="po-card-change positive">
                            <CheckCircle2 size={16} /> Validées
                        </div>
                    </div>
                </div>

                <div className="po-filters">
                    <input
                        type="text"
                        placeholder="Rechercher par N° PO, fournisseur ou entrepôt..."
                        value={poSearchQuery}
                        onChange={(e) => setPoSearchQuery(e.target.value)}
                        style={{ minWidth: '300px' }}
                    />
                    <select
                        value={poStatusFilter}
                        onChange={(e) => setPoStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="draft">Brouillon</option>
                        <option value="sent">Envoyée</option>
                        <option value="received">Reçue</option>
                        <option value="cancelled">Annulée</option>
                    </select>
                </div>

                <div className="po-table-container">
                    {filteredPOs.length > 0 ? (
                        <table className="po-table">
                            <thead>
                                <tr>
                                    <th>N° Commande</th>
                                    <th>Fournisseur</th>
                                    <th>Entrepôt</th>
                                    <th>Montant</th>
                                    <th>Statut</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPOs.map((po, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div className="po-info">
                                                <ShoppingBag size={16} style={{ marginRight: '8px' }} />
                                                <strong>PO-{po.id}</strong>
                                            </div>
                                        </td>
                                        <td>{po.supplier_name || 'N/A'}</td>
                                        <td>{po.warehouse_id || 'N/A'}</td>
                                        <td className="po-amount">
                                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(po.total_amount || 0)}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${po.status}`}>
                                                {po.status === 'draft' ? 'Brouillon' : 
                                                 po.status === 'sent' ? 'Envoyée' : 
                                                 po.status === 'received' ? 'Reçue' : 
                                                 po.status === 'cancelled' ? 'Annulée' : po.status}
                                            </span>
                                        </td>
                                        <td>{po.created_at ? new Date(po.created_at).toLocaleDateString('fr-FR') : 'N/A'}</td>
                                        <td>
                                            <div className="po-actions-cell">
                                                <button
                                                    className="po-action-btn"
                                                    disabled={isLoadingForDetails}
                                                    onClick={async () => {
                                                        // Charger les données complètes pour afficher les détails
                                                        const token = sessionStorage.getItem('token');
                                                        setIsLoadingForDetails(true);
                                                        try {
                                                            console.log('Chargement détails PO ID:', po.id);
                                                            const result = await dispatch(getPurchaseOrderById({ id: po.id, token }));
                                                            
                                                            let purchaseOrder = null;
                                                            if (result?.type?.includes('fulfilled')) {
                                                                purchaseOrder = result.payload;
                                                            } else if (result?.type?.includes('rejected')) {
                                                                console.error('Erreur:', result.payload);
                                                                showToast('Erreur: ' + (result.payload || 'Impossible de charger les détails'), 'error');
                                                                return;
                                                            } else {
                                                                purchaseOrder = result?.payload;
                                                            }
                                                            
                                                            if (purchaseOrder && typeof purchaseOrder === 'object') {
                                                                console.log('Détails PO chargés:', purchaseOrder);
                                                                setViewingPO(purchaseOrder);
                                                            } else {
                                                                showToast('Erreur: données non trouvées', 'error');
                                                            }
                                                        } catch (error) {
                                                            console.error('Erreur chargement détails:', error);
                                                            showToast('Erreur lors du chargement des détails', 'error');
                                                        } finally {
                                                            setIsLoadingForDetails(false);
                                                        }
                                                    }}
                                                    title="Voir détails"
                                                >
                                                    {isLoadingForDetails ? <Loader size={16} style={{animation: 'spin 1s linear infinite'}} /> : <Eye size={16} />} {isLoadingForDetails ? 'Chargement...' : 'Détails'}
                                                </button>
                                                {po.status === 'draft' && (
                                                <button
                                                    className="po-action-btn"
                                                    disabled={isLoadingForEdit}
                                                    onClick={async () => {
                                                        // Charger les données complètes depuis l'API via Redux
                                                        const token = sessionStorage.getItem('token');
                                                        setIsLoadingForEdit(true);
                                                        try {
                                                            console.log('Chargement PO ID:', po.id);
                                                            const result = await dispatch(getPurchaseOrderById({ id: po.id, token }));
                                                            
                                                            console.log('=== FULL RESULT ===');
                                                            console.log(JSON.stringify(result, null, 2));
                                                            console.log('Result type:', result?.type);
                                                            console.log('Result payload:', result?.payload);
                                                            console.log('Result meta:', result?.meta);
                                                            
                                                            let purchaseOrder = null;
                                                            
                                                            // Vérifier si c'est fulfilled ou rejected
                                                            if (result?.type?.includes('fulfilled')) {
                                                                purchaseOrder = result.payload;
                                                            } else if (result?.type?.includes('rejected')) {
                                                                console.error('Action rejected. Error:', result.payload);
                                                                showToast('Erreur: ' + (result.payload || 'Impossible de charger la PO'), 'error');
                                                                return;
                                                            } else {
                                                                // Fallback si structure différente
                                                                purchaseOrder = result?.payload;
                                                            }
                                                            
                                                            console.log('Purchase Order final:', purchaseOrder);
                                                            
                                                            if (purchaseOrder && typeof purchaseOrder === 'object') {
                                                                console.log('PO data structure:');
                                                                console.log('- purchaseOrder.lines:', purchaseOrder.lines);
                                                                console.log('- purchaseOrder.items:', purchaseOrder.items);
                                                                
                                                                // Utiliser items si lines est vide
                                                                const articlesData = (purchaseOrder.lines && purchaseOrder.lines.length > 0) 
                                                                    ? purchaseOrder.lines 
                                                                    : purchaseOrder.items || [];
                                                                
                                                                console.log('Articles à charger:', articlesData);
                                                                
                                                                setEditingPurchaseOrder(purchaseOrder);
                                                                setNewPurchaseOrder({ 
                                                                    supplier_id: purchaseOrder.supplier_id || '', 
                                                                    warehouse_id: purchaseOrder.warehouse_id || '', 
                                                                    total_amount: purchaseOrder.total_amount || 0, 
                                                                    status: purchaseOrder.status || 'draft', 
                                                                    notes: purchaseOrder.notes || '',
                                                                    lines: articlesData
                                                                });
                                                                setPoItems(Array.isArray(purchaseOrder.items) ? purchaseOrder.items : []);
                                                                setIsCreatingPurchaseOrder(true);
                                                                showToast('PO chargée pour modification', 'success');
                                                            } else {
                                                                console.error('purchaseOrder est null/undefined');
                                                                showToast('Erreur: données non trouvées', 'error');
                                                            }
                                                        } catch (error) {
                                                            console.error('Erreur chargement PO:', error);
                                                            showToast('Erreur lors du chargement', 'error');
                                                        } finally {
                                                            setIsLoadingForEdit(false);
                                                        }
                                                    }}
                                                    title="Modifier"
                                                >
                                                    {isLoadingForEdit && po.status === 'draft' ? <Loader size={16} style={{animation: 'spin 1s linear infinite'}} /> : <Edit2 size={16} />} {isLoadingForEdit ? 'Chargement...' : 'Modifier'}
                                                </button>
                                                )}
                                                {po.status === 'sent' && (
                                                <button
                                                    className="po-action-btn receive"
                                                    onClick={() => setIsReceivingPO(po.id)}
                                                    title="Réceptionner"
                                                >
                                                    <CheckCircle2 size={16} /> Réceptionner
                                                </button>
                                                )}
                                                {po.status === 'draft' && (
                                                <>
                                                <button
                                                    className="po-action-btn"
                                                    onClick={() => {
                                                        dispatch(updatePurchaseOrderStatus({ id: po.id, status: 'sent', token: sessionStorage.getItem('token') }));
                                                        setTimeout(() => dispatch(getAllPurchaseOrders(sessionStorage.getItem('token'))), 500);
                                                    }}
                                                    title="Envoyer"
                                                >
                                                    <Mail size={16} /> Envoyer
                                                </button>
                                                <button
                                                    className="po-action-btn delete"
                                                    disabled={deletingPO === po.id}
                                                    onClick={() => handleDeletePurchaseOrder(po.id)}
                                                    title="Supprimer"
                                                >
                                                    {deletingPO === po.id ? <Loader size={16} style={{animation: 'spin 1s linear infinite'}} /> : <Trash2 size={16} />} {deletingPO === po.id ? 'Suppression...' : 'Supprimer'}
                                                </button>
                                                </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="po-empty">
                            <div className="po-empty-icon">📦</div>
                            <p>Aucune commande d'achat trouvée</p>
                        </div>
                    )}
                </div>

                {/* Create/Edit PO Modal */}
                {isCreatingPurchaseOrder && (
                    <div className="admin-overlay" onClick={() => setIsCreatingPurchaseOrder(false)}>
                        <motion.div
                            className="admin-modal large"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h3>{editingPurchaseOrder ? 'Modifier Commande d\'Achat' : 'Nouvelle Commande d\'Achat'}</h3>
                                <button disabled={isSavingPO} onClick={() => { setIsCreatingPurchaseOrder(false); setEditingPurchaseOrder(null); setPoItems([]); setNewPurchaseOrder({ supplier_id: '', warehouse_id: '', total_amount: 0, status: 'draft', notes: '', lines: [] }); }} className="close-btn" style={{ opacity: isSavingPO ? 0.6 : 1, cursor: isSavingPO ? 'not-allowed' : 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Fournisseur {console.log(newPurchaseOrder)}</label>
                                        <select
                                            disabled={isSavingPO}
                                            value={newPurchaseOrder.supplier_id}
                                            onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, supplier_id: e.target.value })}
                                            style={{ opacity: isSavingPO ? 0.6 : 1, cursor: isSavingPO ? 'not-allowed' : 'pointer' }}
                                        >
                                            <option value="">Sélectionner un fournisseur</option>
                                            {suppliers.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Entrepôt de Destination</label>
                                        <select
                                            disabled={isSavingPO}
                                            value={newPurchaseOrder.warehouse_id}
                                            onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, warehouse_id: e.target.value })}
                                            style={{ opacity: isSavingPO ? 0.6 : 1, cursor: isSavingPO ? 'not-allowed' : 'pointer' }}
                                        >
                                            <option value="">Sélectionner un entrepôt</option>
                                            {(Array.isArray(warehouses) ? warehouses : []).map((w) => (
                                                <option key={w.id} value={w.id}>{w.name} - {w.location}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Notes</label>
                                    <textarea
                                        disabled={isSavingPO}
                                        value={newPurchaseOrder.notes}
                                        onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, notes: e.target.value })}
                                        style={{ opacity: isSavingPO ? 0.6 : 1, cursor: isSavingPO ? 'not-allowed' : 'default' }}
                                        placeholder="Notes additionnelles..."
                                        rows="2"
                                    />
                                </div>

                                {/* Articles Section */}
                                <div className="po-articles-section">
                                    <div className="section-header">
                                        <h4>Articles de la Commande</h4>
                                        <button 
                                            disabled={isSavingPO}
                                            className="small-btn add-btn"
                                            onClick={() => setShowPoItemModal(true)}
                                            style={{ opacity: isSavingPO ? 0.6 : 1, cursor: isSavingPO ? 'not-allowed' : 'pointer' }}
                                        >
                                            <Plus size={14} /> Ajouter Article
                                        </button>
                                    </div>

                                    {newPurchaseOrder.lines.length > 0 ? (
                                        <div className="po-items-list">
                                            {newPurchaseOrder.lines.map((item, idx) => (
                                                <div key={idx} className="po-item-card">
                                                    <div className="po-item-info">
                                                        <div className="po-item-name">{item.product_name}</div>
                                                        <div className="po-item-details">
                                                            {item.quantity} x {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.unit_price)} = <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.quantity * item.unit_price)}</strong>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => setNewPurchaseOrder({ ...newPurchaseOrder, lines: newPurchaseOrder.lines.filter((_, delIdx) => delIdx !== idx) })}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="po-items-total">
                                                <strong>Montant Total: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(newPurchaseOrder.lines.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0))}</strong>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="po-empty-items">
                                            <p>Aucun article ajouté. Cliquez sur "Ajouter Article" pour commencer.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    disabled={isSavingPO}
                                    onClick={() => { setIsCreatingPurchaseOrder(false); setEditingPurchaseOrder(null); setPoItems([]); setNewPurchaseOrder({ supplier_id: '', warehouse_id: '', total_amount: 0, status: 'draft', notes: '', lines: []  }); }} 
                                    className="btn-cancel"
                                    style={{ opacity: isSavingPO ? 0.6 : 1, cursor: isSavingPO ? 'not-allowed' : 'pointer' }}
                                >
                                    Annuler
                                </button>
                                <button
                                    disabled={isSavingPO}
                                    onClick={() => {
                                        console.log('Tentative de ' + (editingPurchaseOrder ? 'modification' : 'création') + ' de commande d\'achat');
                                        console.log('Fournisseur ID:', newPurchaseOrder.supplier_id);
                                        console.log('Entrepôt ID:', newPurchaseOrder.warehouse_id);
                                        console.log('Articles:', poItems);
                                        
                                        if (newPurchaseOrder.supplier_id && newPurchaseOrder.warehouse_id && newPurchaseOrder.lines.length > 0) {
                                            setIsSavingPO(true);
                                            const totalAmount = newPurchaseOrder.lines.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
                                            console.log('Montant total calculé:', totalAmount);
                                            
                                            // Format the payload with lines array
                                            const payloadData = {
                                                supplier_id: newPurchaseOrder.supplier_id,
                                                warehouse_id: newPurchaseOrder.warehouse_id,
                                                total_amount: totalAmount,
                                                status: newPurchaseOrder.status || 'draft',
                                                notes: newPurchaseOrder.notes || '',
                                                lines: newPurchaseOrder.lines.map(item => ({
                                                    product_id: item.product_id,
                                                    product_name: item.product_name,
                                                    quantity: item.quantity,
                                                    unit_price: item.unit_price,
                                                    received_quantity: item.received_quantity || 0
                                                }))
                                            };
                                            console.log('Données de la commande d\'achat:', payloadData);
                                            
                                            const token = sessionStorage.getItem('token');
                                            if (editingPurchaseOrder) {
                                                // Modification
                                                dispatch(updatePurchaseOrder({ 
                                                    id: editingPurchaseOrder.id,
                                                    orderData: payloadData, 
                                                    token: token 
                                                }));
                                                showToast('Modification de la commande d\'achat en cours...', 'success');
                                                console.log('Commande d\'achat modifiée avec succès');
                                                setTimeout(() => {
                                                    dispatch(getAllPurchaseOrders(token));
                                                    setIsSavingPO(false);
                                                }, 500);
                                            } else {
                                                // Création
                                                dispatch(createPurchaseOrder({ 
                                                    orderData: payloadData, 
                                                    token: token 
                                                }));
                                                showToast('Création de la commande d\'achat en cours...', 'success');
                                                console.log('Commande d\'achat créée avec succès');
                                                setTimeout(() => {
                                                    dispatch(getAllPurchaseOrders(token));
                                                    setIsSavingPO(false);
                                                }, 500);
                                            }
                                            
                                            setNewPurchaseOrder({ supplier_id: '', warehouse_id: '', total_amount: 0, status: 'draft', notes: '', lines: [] });
                                            setPoItems([]);
                                            setNewPoItem({ product_id: '', quantity: 1, unit_price: 0, received_quantity: 0 });
                                            setIsCreatingPurchaseOrder(false);
                                            setEditingPurchaseOrder(null);
                                        } else {
                                            console.error('Validation échouée - Champs manquants');
                                            showToast('Veuillez remplir tous les champs et ajouter au moins un article', 'error');
                                            setIsSavingPO(false);
                                        }
                                    }}
                                    className="btn-save"
                                    style={{ opacity: isSavingPO ? 0.6 : 1, cursor: isSavingPO ? 'not-allowed' : 'pointer' }}
                                >
                                    {isSavingPO ? <Loader size={16} style={{animation: 'spin 1s linear infinite', marginRight: '8px'}} /> : <Save size={16} style={{marginRight: '8px'}} />} {isSavingPO ? 'En cours...' : (editingPurchaseOrder ? 'Modifier' : 'Créer')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Add Item Modal */}
                {showPoItemModal && (
                    <div className="admin-overlay" onClick={() => setShowPoItemModal(false)}>
                        <motion.div
                            className="admin-modal"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h3>Ajouter un Article</h3>
                                <button onClick={() => setShowPoItemModal(false)} className="close-btn">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Produit</label>
                                    <select
                                        value={newPoItem.product_id}
                                        onChange={(e) => {
                                            console.log('Sélection produit - value:', e.target.value);
                                            const selectedProduct = products.find(p => p.id === parseInt(e.target.value));
                                            console.log('Produit trouvé:', selectedProduct);
                                            setNewPoItem({
                                                ...newPoItem,
                                                product_id: e.target.value,
                                                product_name: selectedProduct?.name || '',
                                                unit_price: selectedProduct?.price || 0
                                            });
                                        }}
                                    >
                                        <option value="">Sélectionner un produit</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Quantité</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={newPoItem.quantity}
                                            onChange={(e) => setNewPoItem({ ...newPoItem, quantity: parseInt(e.target.value) || 0 })}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Prix Unitaire (auto-rempli)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={newPoItem.unit_price}
                                            onChange={(e) => setNewPoItem({ ...newPoItem, unit_price: parseFloat(e.target.value) || 0 })}
                                            placeholder="Rempli automatiquement"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Quantité Reçue</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newPoItem.received_quantity}
                                        onChange={(e) => setNewPoItem({ ...newPoItem, received_quantity: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="price-total">
                                        <span>Montant: </span>
                                        <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((newPoItem.quantity || 0) * (newPoItem.unit_price || 0))}</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => setShowPoItemModal(false)} className="btn-cancel">
                                    Annuler
                                </button>
                                <button
                                    onClick={() => {
                                        console.log('Tentative d\'ajout d\'article');
                                        console.log('newPoItem:', newPoItem);
                                        console.log('product_id:', newPoItem.product_id, 'quantity:', newPoItem.quantity, 'unit_price:', newPoItem.unit_price);
                                        
                                        if (newPoItem.product_id && newPoItem.quantity > 0 && newPoItem.unit_price > 0) {
                                            console.log('Validation réussie - Ajout de l\'article');
                                            setNewPurchaseOrder({ ...newPurchaseOrder, lines: [...newPurchaseOrder.lines, newPoItem] });
                                            setNewPoItem({ product_id: '', quantity: 1, unit_price: 0, received_quantity: 0 });
                                            setShowPoItemModal(false);
                                            showToast('Article ajouté avec succès', 'success');
                                        } else {
                                            console.error('Validation échouée');
                                            showToast('Veuillez remplir tous les champs correctement:\n- Sélectionner un produit\n- Quantité > 0\n- Prix unitaire > 0', 'error');
                                        }
                                    }}
                                    className="btn-save"
                                >
                                    <Plus size={16} /> Ajouter
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        );
    };

    const renderOrders = () => {
        // Apply filters
        let filteredOrders = orders;

        // Filter by status
        if (orderStatusFilter !== 'ALL') {
            filteredOrders = filteredOrders.filter(order => order.status === orderStatusFilter);
        }

        // Filter by search query (ID or customer name)
        if (orderSearchQuery.trim()) {
            const query = orderSearchQuery.toLowerCase();
            filteredOrders = filteredOrders.filter(order => {
                const orderId = order.id?.toString() || '';
                const customerName = order.customer_name?.toLowerCase() || '';
                return orderId.includes(query) || customerName.includes(query);
            });
        }

        const paginatedOrders = paginate(filteredOrders, currentOrderPage);
        const totalPages = getTotalPages(filteredOrders);

        return (
            <div className="admin-section">
                <div className="section-header">
                    <h2><ShoppingCart size={24} /> Gestion des Commandes</h2>
                    <div className="header-right-actions">
                        <div className="orders-stats-summary">
                            <div className="stat-mini">
                                <span className="stat-mini-value">{orders.length}</span>
                                <span className="stat-mini-label">Total</span>
                            </div>
                            <div className="stat-mini">
                                <span className="stat-mini-value">{orders.filter(o => o.status.toLowerCase() === 'pending').length}</span>
                                <span className="stat-mini-label">En attente</span>
                            </div>
                            <div className="stat-mini success">
                                <span className="stat-mini-value">{orders.filter(o => o.status.toLowerCase() === 'delivered').length}</span>
                                <span className="stat-mini-label">Livrées</span>
                            </div>
                        </div>
                        <div className="view-toggle-btn-group">
                            <button 
                                className={`view-toggle-btn ${ordersViewMode === 'cards' ? 'active' : ''}`}
                                onClick={() => setOrdersViewMode('cards')}
                                title="Vue en cartes"
                            >
                                <Grid size={18} />
                            </button>
                            <button 
                                className={`view-toggle-btn ${ordersViewMode === 'table' ? 'active' : ''}`}
                                onClick={() => setOrdersViewMode('table')}
                                title="Vue en tableau"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="filters-section" style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '20px',
                    padding: '15px',
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1', minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                            <Search size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                            Rechercher
                        </label>
                        <input
                            type="text"
                            placeholder="ID de commande ou nom du client..."
                            value={orderSearchQuery}
                            onChange={(e) => {
                                setOrderSearchQuery(e.target.value);
                                setCurrentOrderPage(1);
                            }}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-main)',
                                color: 'var(--text-main)',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <div style={{ flex: '0 0 200px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                            Statut
                        </label>
                        <select
                            value={orderStatusFilter}
                            onChange={(e) => {
                                setOrderStatusFilter(e.target.value);
                                setCurrentOrderPage(1);
                            }}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-main)',
                                color: 'var(--text-main)',
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="ALL">Tous les statuts</option>
                            {ORDER_STATUSES.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {(orderStatusFilter !== 'ALL' || orderSearchQuery.trim()) && (
                        <button
                            onClick={() => {
                                setOrderStatusFilter('ALL');
                                setOrderSearchQuery('');
                                setCurrentOrderPage(1);
                            }}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-main)',
                                color: 'var(--text-main)',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: '600',
                                alignSelf: 'flex-end'
                            }}
                        >
                            <X size={16} />
                            Réinitialiser
                        </button>
                    )}
                    <div style={{
                        marginLeft: 'auto',
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                        fontWeight: '600',
                        alignSelf: 'flex-end',
                        paddingBottom: '10px'
                    }}>
                        {filteredOrders.length} commande(s)
                    </div>
                </div>

                {ordersViewMode === 'cards' ? (
                    <div className="orders-grid-modern">
                        {paginatedOrders.map(order => {
                            const statusInfo = ORDER_STATUSES.find(s => s.value === order.status) || {color: '#999', label: order.status};
                            const orderId = order.order_number || order.id;
                            const isDownloading = downloadingOrderId === orderId;
                            return (
                            <motion.div 
                                key={order.id} 
                                className="order-card-modern"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="order-card-header">
                                    <div className="order-id-badge">
                                        <Package size={16} />
                                        <span>#{order.id}</span>
                                    </div>
                                    <div className="order-date-mini">
                                        <Clock size={14} />
                                        <span>{new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                </div>

                                <div className="order-card-body">
                                    <div className="order-customer-info">
                                        <div className="customer-avatar">
                                            {(order.customer || 'C').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="customer-details">
                                            <span className="customer-name">{order.customer_name || 'Client'}</span>
                                            <span className="customer-meta">{order.total_products || 'N/A'} articles</span>
                                        </div>
                                    </div>

                                    <div className="order-amount-section">
                                        <span className="amount-label">Montant total</span>
                                        <span className="amount-value">{parseFloat(order.total || 0).toFixed(2)} DH</span>
                                    </div>

                                    <div className="order-status-section">
                                        <label className="status-label">Statut</label>
                                        <select
                                            className="status-select-modern"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                borderColor: statusInfo.color,
                                                background: `${statusInfo.color}08`
                                            }}
                                        >
                                            {ORDER_STATUSES.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                        <div 
                                            className="status-indicator-dot" 
                                            style={{ background: statusInfo.color }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="order-card-footer">
                                    <button className="order-action-btn primary" onClick={() => handleViewOrder(order)}>
                                        <Eye size={16} />
                                        <span>Détails</span>
                                    </button>
                                    <button 
                                        className="order-action-btn download" 
                                        onClick={() => handleDownloadQuote(order)}
                                        title="Télécharger devis"
                                        disabled={isDownloading}
                                    >
                                        {isDownloading ? (
                                            <Loader2 size={16} className="spinning" style={{ animation: 'spin 1s linear infinite' }} />
                                        ) : (
                                            <Download size={16} />
                                        )}
                                        <span>{isDownloading ? 'Téléchargement...' : 'Devis'}</span>
                                    </button>
                                    <button 
                                        className="order-action-btn secondary" 
                                        onClick={() => handleOpenPaymentModal(order)}
                                        title="Méthodes de paiement"
                                        style={{ 
                                            borderColor: (order.amount_paid >= order.total) ? '#22c55e' : '#ef4444',
                                            color: (order.amount_paid >= order.total) ? '#22c55e' : '#ef4444'
                                        }}
                                    >
                                        <CreditCard size={16} />
                                        <span>Paiement</span>
                                    </button>
                                    <button 
                                        className="order-action-btn" 
                                        onClick={() => handleOpenDiscountModal(order)}
                                        title="Modifier la remise"
                                        style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                                    >
                                        <Edit2 size={16} />
                                        <span>Remise</span>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                ) : (
                    <div className="table-responsive">
                        {/* Pagination en haut du tableau */}
                        {totalPages > 1 && (
                            <div className="table-pagination-header">
                                <div className="pagination-info-text">
                                    Affichage de {((currentOrderPage - 1) * itemsPerPage) + 1} à {Math.min(currentOrderPage * itemsPerPage, orders.length)} sur {orders.length} commandes
                                </div>
                                <div className="pagination-controls compact">
                                    <button
                                        className="page-btn"
                                        disabled={currentOrderPage === 1}
                                        onClick={() => setCurrentOrderPage(1)}
                                        title="Première page"
                                    >
                                        <ChevronLeft size={16} />
                                        <ChevronLeft size={16} style={{ marginLeft: '-8px' }} />
                                    </button>
                                    <button
                                        className="page-btn"
                                        disabled={currentOrderPage === 1}
                                        onClick={() => setCurrentOrderPage(currentOrderPage - 1)}
                                        title="Page précédente"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="page-info">
                                        {currentOrderPage} / {totalPages}
                                    </span>
                                    <button
                                        className="page-btn"
                                        disabled={currentOrderPage === totalPages}
                                        onClick={() => setCurrentOrderPage(currentOrderPage + 1)}
                                        title="Page suivante"
                                    >
                                        <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                                    </button>
                                    <button
                                        className="page-btn"
                                        disabled={currentOrderPage === totalPages}
                                        onClick={() => setCurrentOrderPage(totalPages)}
                                        title="Dernière page"
                                    >
                                        <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                                        <ChevronLeft size={16} style={{ transform: 'rotate(180deg)', marginLeft: '-8px' }} />
                                    </button>
                                </div>
                            </div>
                        )}
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID Commande</th>
                                    <th>Client</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.map(order => {
                                    const statusInfo = ORDER_STATUSES.find(s => s.value === order.status) || {color: '#999', label: order.status};
                                    const orderId = order.order_number || order.id;
                                    const isDownloading = downloadingOrderId === orderId;
                                    return (
                                    <tr key={order.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Package size={16} style={{ color: 'var(--primary)' }} />
                                                <span className="bold">#{order.id}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '8px',
                                                    background: 'linear-gradient(135deg, var(--primary), #d4af37)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: '700',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {(order.customer_name || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: '600' }}>{order.customer_name || 'Client'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                                                <Clock size={14} />
                                                <span>{new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="price-cell">{parseFloat(order.total || 0).toFixed(2)} DH</td>
                                        <td>
                                            <div className="status-selector-modern" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div 
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        backgroundColor: statusInfo.color,
                                                        boxShadow: `0 0 8px ${statusInfo.color}40`
                                                    }}
                                                />
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    style={{
                                                        borderColor: statusInfo.color,
                                                        color: statusInfo.color,
                                                        background: `${statusInfo.color}15`,
                                                        fontWeight: '700'
                                                    }}
                                                >
                                                    {ORDER_STATUSES.map(s => (
                                                        <option key={s.value} value={s.value}>{s.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="actions-cell">
                                            <button className="icon-btn view" title="Voir détails" onClick={() => handleViewOrder(order)}><Eye size={16} /></button>
                                            <button
                                                className="icon-btn download"
                                                title="Télécharger devis"
                                                onClick={() => handleDownloadQuote(order)}
                                                disabled={isDownloading}
                                            >
                                                {isDownloading ? (
                                                    <Loader2 size={16} className="spinning" style={{ animation: 'spin 1s linear infinite' }} />
                                                ) : (
                                                    <Download size={16} />
                                                )}
                                            </button>
                                            <button 
                                                className="icon-btn" 
                                                title="Méthodes de paiement"
                                                onClick={() => handleOpenPaymentModal(order)}
                                                style={{ 
                                                    borderColor: (order.amount_paid >= order.total) ? '#22c55e' : '#ef4444',
                                                    color: (order.amount_paid >= order.total) ? '#22c55e' : '#ef4444'
                                                }}
                                            >
                                                <CreditCard size={16} />
                                            </button>
                                            <button 
                                                className="icon-btn" 
                                                title="Modifier la remise"
                                                onClick={() => handleOpenDiscountModal(order)}
                                                style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            className="page-btn"
                            disabled={currentOrderPage === 1}
                            onClick={() => setCurrentOrderPage(1)}
                            title="Première page"
                        >
                            <ChevronLeft size={16} />
                            <ChevronLeft size={16} style={{ marginLeft: '-8px' }} />
                        </button>
                        <button
                            className="page-btn"
                            disabled={currentOrderPage === 1}
                            onClick={() => setCurrentOrderPage(currentOrderPage - 1)}
                            title="Page précédente"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="pagination-numbers">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentOrderPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentOrderPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentOrderPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        className={`page-num-btn ${currentOrderPage === pageNum ? 'active' : ''}`}
                                        onClick={() => setCurrentOrderPage(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            className="page-btn"
                            disabled={currentOrderPage === totalPages}
                            onClick={() => setCurrentOrderPage(currentOrderPage + 1)}
                            title="Page suivante"
                        >
                            <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <button
                            className="page-btn"
                            disabled={currentOrderPage === totalPages}
                            onClick={() => setCurrentOrderPage(totalPages)}
                            title="Dernière page"
                        >
                            <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                            <ChevronLeft size={16} style={{ transform: 'rotate(180deg)', marginLeft: '-8px' }} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Validation functions for roles
    const validateRole = () => {
        const errors = {};
        if (!newRole.code.trim()) errors.code = 'Le code est requis';
        if (!newRole.label.trim()) errors.label = 'Le label est requis';
        if (newRole.code && !/^[A-Z_]+$/.test(newRole.code)) {
            errors.code = 'Le code doit contenir uniquement des majuscules et underscores';
        }
        setRoleErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Role management functions
    const handleAddRole = async () => {
        if (validateRole()) {
            const token = sessionStorage.getItem('token');
            const roleData = {
                code: newRole.code,
                label: newRole.label,
                is_active: newRole.is_active
            };
            setIsRoleLoading(true);
            try {
                const result = await dispatch(createRole({ roleData, token }));

                if (createRole.fulfilled.match(result)) {
                    setIsAddingRole(false);
                    setNewRole({ code: '', label: '', is_active: true });
                    setRoleErrors({});
                    showToast('Rôle ajouté avec succès');
                } else {
                    showToast('Erreur lors de l\'ajout du rôle', 'error');
                }
            } catch (error) {
                showToast('Erreur lors de l\'ajout du rôle', 'error');
            } finally {
                setIsRoleLoading(false);
            }
        }
    };

    const handleUpdateRole = async () => {
        if (validateRole()) {
            const token = sessionStorage.getItem('token');
            const roleData = {
                code: newRole.code,
                label: newRole.label,
                is_active: newRole.is_active
            };
            setIsRoleLoading(true);
            try {
                const result = await dispatch(updateRole({ id: editingRole.id, roleData, token }));

                if (updateRole.fulfilled.match(result)) {
                    setEditingRole(null);
                    setNewRole({ code: '', label: '', is_active: true });
                    setRoleErrors({});
                    showToast('Rôle modifié avec succès');
                } else {
                    showToast('Erreur lors de la modification du rôle');
                }
            } catch (error) {
                showToast('Erreur lors de la modification du rôle', 'error');
            } finally {
                setIsRoleLoading(false);
            }
        }
    };

    const handleDeleteRole = async (id) => {
        setDeletingRole(id);
    };

    const confirmDeleteRole = async () => {
        const id = deletingRole;
        setDeletingRole(null);

        const token = sessionStorage.getItem('token');
        try {
            const result = await dispatch(deleteRole({ id, token }));

            if (deleteRole.fulfilled.match(result)) {
                showToast('Rôle supprimé avec succès');
            } else if (deleteRole.rejected.match(result)) {
                showToast('Erreur lors de la suppression du rôle');
            }
        } catch (error) {
            showToast('Erreur lors de la suppression du rôle', 'error');
        }
    };

    const handleToggleRoleStatus = async (id) => {
        const token = sessionStorage.getItem('token');
        const role = roles.find(r => r.id === id);
        if (!role) return;

        const roleData = {
            code: role.code,
            label: role.label,
            is_active: !role.is_active
        };
        try {
            const result = await dispatch(updateRole({ id, roleData, token }));
            if (updateRole.fulfilled.match(result)) {
                showToast('Statut du rôle modifié');
            } else {
                showToast('Erreur lors du changement de statut', 'error');
            }
        } catch (error) {
            showToast('Erreur lors du changement de statut', 'error');
        }
    };

    const showToast = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    // Payment management functions
    const loadPayments = async (orderId) => {
        const token = sessionStorage.getItem('token');
        try {
            const payments = await orderService.getPaymentsByOrder(orderId, token);
            // Transformer les paiements du backend pour correspondre au format local
            const formattedPayments = payments.map(p => ({
                id: p.id,
                type: p.payment_method.toLowerCase(),
                bank_code: p.bank_code || '',
                amount: p.amount,
                payment_date: p.payment_date || '',
                comment: p.notes || '',
                isExisting: true // Marquer comme existant dans la BD
            }));
            setPaymentMethods(formattedPayments);
        } catch (error) {
        }
    };

    const handleDeletePayment = async (payment) => {
        if (!payment.isExisting) {
            // Si c'est un nouveau paiement pas encore enregistré, juste le retirer de la liste
            setPaymentMethods(paymentMethods.filter(p => p !== payment));
            return;
        }

        // Si c'est un paiement existant, le supprimer du backend
        const token = sessionStorage.getItem('token');
        const orderId = paymentModal.order.id;
        try {
            await orderService.deletePayment(orderId, payment.id, token);
            setPaymentMethods(paymentMethods.filter(p => p.id !== payment.id));
            showToast('Paiement supprimé avec succès', 'success');
            // Recharger les commandes
            dispatch(getOrdersByUser(token));
        } catch (error) {
            showToast('Erreur lors de la suppression du paiement', 'error');
        }
    };

    const handleOpenPaymentModal = async (order) => {
        setPaymentModal({ show: true, order });
        // Charger les banques si elles ne sont pas déjà chargées
        const token = sessionStorage.getItem('token');
        if (banks.length === 0) {
            dispatch(getAllBanks(token));
        }
        await loadPayments(order.id);
    };

    const handleOpenDiscountModal = (order) => {
        setDiscountModal({ show: true, order });
        setDiscountData({
            discount_amount: order.discount_amount || '',
            discount_type: 'percentage'
        });
    };

    const handleUpdateDiscount = async () => {
        const token = sessionStorage.getItem('token');
        const orderId = discountModal.order.id;
        
        try {
            const payload = {
                remise: parseFloat(discountData.discount_amount) || 0
            };

            await dispatch(updateOrderDiscount({ orderId, discountData: payload, token })).unwrap();
            
            // Rafraîchir les commandes
            await dispatch(getOrdersByUser(token));
            
            // Fermer la modal
            setDiscountModal({ show: false, order: null });
            setDiscountData({ discount_amount: '', discount_type: 'percentage' });
            
            showToast('Remise mise à jour avec succès', 'success');
        } catch (error) {
            showToast('Erreur lors de la mise à jour de la remise', 'error');
        }
    };

    // Bank validation
    const validateBank = () => {
        const errors = {};
        if (!newBank.code.trim()) errors.code = 'Le code est requis';
        if (!newBank.label.trim()) errors.label = 'Le label est requis';
        setBankErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Bank management functions
    const handleAddBank = async () => {
        if (validateBank()) {
            const token = sessionStorage.getItem('token');
            const bankData = {
                code: newBank.code,
                label: newBank.label
            };
            setIsBankLoading(true);
            try {
                const result = await dispatch(createBankThunk({ bankData, token }));
                if (createBankThunk.fulfilled.match(result)) {
                    showToast('Banque ajoutée avec succès', 'success');
                    setIsAddingBank(false);
                    setNewBank({ code: '', label: '' });
                    setBankErrors({});
                } else {
                    showToast('Erreur lors de l\'ajout de la banque', 'error');
                }
            } catch (error) {
                showToast('Erreur lors de l\'ajout de la banque', 'error');
            } finally {
                setIsBankLoading(false);
            }
        }
    };

    const handleUpdateBank = async () => {
        if (validateBank()) {
            const token = sessionStorage.getItem('token');
            const bankData = {
                code: newBank.code,
                label: newBank.label
            };
            setIsBankLoading(true);
            try {
                const result = await dispatch(updateBankThunk({ id: editingBank, bankData, token }));
                if (updateBankThunk.fulfilled.match(result)) {
                    showToast('Banque modifiée avec succès', 'success');
                    setEditingBank(null);
                    setNewBank({ code: '', label: '' });
                    setBankErrors({});
                } else {
                    showToast('Erreur lors de la modification de la banque', 'error');
                }
            } catch (error) {
                showToast('Erreur lors de la modification de la banque', 'error');
            } finally {
                setIsBankLoading(false);
            }
        }
    };

    const handleDeleteBank = async (id) => {
        const token = sessionStorage.getItem('token');
        try {
            const result = await dispatch(deleteBankThunk({ id, token }));
            if (deleteBankThunk.fulfilled.match(result)) {
                showToast('Banque supprimée avec succès', 'success');
                setDeletingBank(null);
            } else {
                showToast('Erreur lors de la suppression de la banque', 'error');
            }
        } catch (error) {
            showToast('Erreur lors de la suppression de la banque', 'error');
        }
    };

    const renderCustomerReturns = () => {
        // Ensure customerReturns is an array and filter out undefined/null values
        const crList = (Array.isArray(customerReturns) ? customerReturns : []).filter(r => r && typeof r === 'object');
        
        const filteredReturns = crList.filter(r => {
            const matchesSearch = !customerReturnSearchQuery || 
                r.return_number?.includes(customerReturnSearchQuery) ||
                r.customer_name?.toLowerCase().includes(customerReturnSearchQuery.toLowerCase()) ||
                r.product_name?.toLowerCase().includes(customerReturnSearchQuery.toLowerCase());
            const matchesStatus = customerReturnStatusFilter === 'all' || r.status === customerReturnStatusFilter;
            return matchesSearch && matchesStatus;
        });

        const approvedReturns = crList.filter(r => r?.status === 'approved').length;
        const totalRefunds = crList.reduce((sum, r) => sum + (parseFloat(r?.refund_amount) || 0), 0);

        return (
            <motion.div key="customerReturns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="returns-container">
                <h2><RotateCcw size={28} style={{ color: 'var(--primary)' }} /> Retours Clients</h2>
                <div className="returns-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Retours</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{crList.length}</div>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Approuvés</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)' }}>{approvedReturns}</div>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Montant Total</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{totalRefunds.toFixed(2)} DH</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input type="text" placeholder="Rechercher..." value={customerReturnSearchQuery} onChange={(e) => setCustomerReturnSearchQuery(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                    <select value={customerReturnStatusFilter} onChange={(e) => setCustomerReturnStatusFilter(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="approved">Approuvé</option>
                        <option value="received">Reçu</option>
                    </select>
                    <button className="primary-btn" onClick={() => setIsCreatingCustomerReturn(true)}><Plus size={18} /> Nouveau Retour</button>
                </div>

                {filteredReturns.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Numéro Retour</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Client</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Produit</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Quantité</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Raison</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Statut</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Montant</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReturns.map((ret, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '10px' }}><strong>{ret.return_number}</strong></td>
                                        <td style={{ padding: '10px' }}>{ret.customer_name}</td>
                                        <td style={{ padding: '10px' }}>{ret.product_name}</td>
                                        <td style={{ padding: '10px' }}>{ret.quantity_returned}</td>
                                        <td style={{ padding: '10px' }}>{ret.reason}</td>
                                        <td style={{ padding: '10px' }}><span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', background: ret.status === 'approved' ? '#d1fae5' : ret.status === 'received' ? '#dbeafe' : '#fef3c7', color: ret.status === 'approved' ? '#065f46' : ret.status === 'received' ? '#0c4a6e' : '#78350f' }}>{ret.status}</span></td>
                                        <td style={{ padding: '10px' }}>{ret.refund_amount.toFixed(2)} DH</td>
                                        <td style={{ padding: '10px' }}><button className="warehouse-action-btn" onClick={() => setViewingCustomerReturn(ret)}><Eye size={16} /> Voir</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Aucun retour client trouvé</div>
                )}
            </motion.div>
        );
    };

    const renderSupplierReturns = () => {
        // Ensure supplierReturns is an array and filter out undefined/null values
        const srList = (Array.isArray(supplierReturns) ? supplierReturns : []).filter(r => r && typeof r === 'object');
        
        const filteredReturns = srList.filter(r => {
            const matchesSearch = !supplierReturnSearchQuery || 
                r.return_number?.includes(supplierReturnSearchQuery) ||
                r.supplier_name?.toLowerCase().includes(supplierReturnSearchQuery.toLowerCase()) ||
                r.product_name?.toLowerCase().includes(supplierReturnSearchQuery.toLowerCase());
            const matchesStatus = supplierReturnStatusFilter === 'all' || r.status === supplierReturnStatusFilter;
            return matchesSearch && matchesStatus;
        });

        const sentReturns = srList.filter(r => r?.status === 'sent').length;
        const totalCredits = srList.reduce((sum, r) => sum + (parseFloat(r?.credit_amount) || 0), 0);

        return (
            <motion.div key="supplierReturns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="returns-container">
                <h2><RotateCcw size={28} style={{ color: 'var(--primary)' }} /> Retours Fournisseurs</h2>
                <div className="returns-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Retours</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{srList.length}</div>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Envoyés</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)' }}>{sentReturns}</div>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Montant Total</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{totalCredits.toFixed(2)} DH</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input type="text" placeholder="Rechercher..." value={supplierReturnSearchQuery} onChange={(e) => setSupplierReturnSearchQuery(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                    <select value={supplierReturnStatusFilter} onChange={(e) => setSupplierReturnStatusFilter(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="approved">Approuvé</option>
                        <option value="sent">Envoyé</option>
                        <option value="received">Reçu</option>
                    </select>
                    <button className="primary-btn" onClick={() => setIsCreatingSupplierReturn(true)}><Plus size={18} /> Nouveau Retour</button>
                </div>

                {filteredReturns.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Numéro Retour</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Fournisseur</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Produit</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Quantité</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Raison</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Statut</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Crédit</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReturns.map((ret, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '10px' }}><strong>{ret.return_number}</strong></td>
                                        <td style={{ padding: '10px' }}>{ret.supplier_name}</td>
                                        <td style={{ padding: '10px' }}>{ret.product_name}</td>
                                        <td style={{ padding: '10px' }}>{ret.quantity_returned}</td>
                                        <td style={{ padding: '10px' }}>{ret.reason}</td>
                                        <td style={{ padding: '10px' }}><span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', background: ret.status === 'sent' ? '#bfdbfe' : ret.status === 'received' ? '#d1fae5' : '#fef3c7', color: ret.status === 'sent' ? '#1e3a8a' : ret.status === 'received' ? '#065f46' : '#78350f' }}>{ret.status}</span></td>
                                        <td style={{ padding: '10px' }}>{ret.credit_amount.toFixed(2)} DH</td>
                                        <td style={{ padding: '10px' }}><button className="warehouse-action-btn" onClick={() => setViewingSupplierReturn(ret)}><Eye size={16} /> Voir</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Aucun retour fournisseur trouvé</div>
                )}
            </motion.div>
        );
    };

    const renderRoles = () => {
        const paginatedRoles = paginate(roles, currentRolePage);
        const totalPages = getTotalPages(roles);

        return (
            <div className="admin-section">
                <div className="section-header">
                    <h2>Gestion des Rôles</h2>
                    <button className="add-btn" onClick={() => setIsAddingRole(true)}>
                        <Plus size={20} /> Ajouter un Rôle
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Label</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRoles.map(role => (
                            <tr key={role.id}>
                                <td className="bold">{role.code}</td>
                                <td>{role.label}</td>
                                <td>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={role.is_active}
                                            onChange={() => handleToggleRoleStatus(role.id)}
                                        />
                                        <span className="toggle-slider"></span>
                                        <span className={`status-label ${role.is_active ? 'active' : 'inactive'}`}>
                                            {role.is_active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </label>
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className="icon-btn edit"
                                        onClick={() => {
                                            setEditingRole(role);
                                            setNewRole({ code: role.code, label: role.label, is_active: role.is_active });
                                        }}
                                        title="Modifier"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="icon-btn delete"
                                        onClick={() => handleDeleteRole(role.id)}
                                        title="Supprimer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        className="page-btn"
                        disabled={currentRolePage === 1}
                        onClick={() => setCurrentRolePage(currentRolePage - 1)}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="page-info">
                        Page {currentRolePage} sur {totalPages}
                    </span>
                    <button
                        className="page-btn"
                        disabled={currentRolePage === totalPages}
                        onClick={() => setCurrentRolePage(currentRolePage + 1)}
                    >
                        <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                </div>
            )}
        </div>
        );
    };

    // Render Banks
    const renderBanks = () => {
        const paginatedBanks = paginate(banks, currentBankPage, itemsPerPage);
        const totalPages = Math.ceil(banks.length / itemsPerPage);

        return (
            <div className="content-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title-main"><Banknote size={28} style={{ display: 'inline', marginRight: '12px' }} />Gestion des Banques</h2>
                        <p className="section-subtitle">Gérez les banques du système</p>
                    </div>
                    <button className="add-btn high-contrast" onClick={() => setIsAddingBank(true)}>
                        <Plus size={18} /> Ajouter une banque
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Code</th>
                                <th>Label</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBanks.map(bank => (
                                <tr key={bank.id}>
                                    <td className="bold">#{bank.id}</td>
                                    <td><span className="code-badge">{bank.code}</span></td>
                                    <td>{bank.label}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="icon-btn edit"
                                            onClick={() => {
                                                setEditingBank(bank.id);
                                                setNewBank({ code: bank.code, label: bank.label });
                                            }}
                                            title="Modifier"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="icon-btn delete"
                                            onClick={() => setDeletingBank(bank.id)}
                                            title="Supprimer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            className="page-btn"
                            disabled={currentBankPage === 1}
                            onClick={() => setCurrentBankPage(currentBankPage - 1)}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="page-info">
                            Page {currentBankPage} sur {totalPages}
                        </span>
                        <button
                            className="page-btn"
                            disabled={currentBankPage === totalPages}
                            onClick={() => setCurrentBankPage(currentBankPage + 1)}
                        >
                            <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="mobile-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'show' : ''}`}>
                <div className="admin-nav-header">
                    <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <LayoutDashboard size={24} />
                        <div className="logo-text">Administration</div>
                    </div>
                </div>
                <nav className="admin-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
                    >
                        <LayoutDashboard size={20} /> Vue d'ensemble
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'reporting' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('reporting'); setIsSidebarOpen(false); }}
                    >
                        <BarChart3 size={20} /> Reporting
                    </button>
                    {userRole?.code === 'ADMIN' && (
                        <button
                            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
                        >
                            <UsersIcon size={20} /> Utilisateurs
                        </button>
                    )}
                    <button
                        className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }}
                    >
                        <Tag size={20} /> Catégories
                    </button>
                    {userRole?.code === 'ADMIN' && (
                        <button
                            className={`nav-item ${activeTab === 'roles' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('roles'); setIsSidebarOpen(false); }}
                        >
                            <Shield size={20} /> Rôles
                        </button>
                    )}
                    {userRole?.code === 'ADMIN' && (
                        <button
                            className={`nav-item ${activeTab === 'banks' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('banks'); setIsSidebarOpen(false); }}
                        >
                            <Banknote size={20} /> Banques
                        </button>
                    )}
                    <button
                        className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
                    >
                        <Package size={20} /> Produits
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'stock' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('stock'); setIsSidebarOpen(false); }}
                    >
                        <Truck size={20} /> Stock
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'warehouses' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('warehouses'); setIsSidebarOpen(false); }}
                    >
                        <Building2 size={20} /> Entrepôts
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'suppliers' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('suppliers'); setIsSidebarOpen(false); }}
                    >
                        <UserCheck size={20} /> Fournisseurs
                    </button>
                    {userRole?.code === 'ADMIN' && (
                    <button
                        className={`nav-item ${activeTab === 'purchaseOrders' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('purchaseOrders'); setIsSidebarOpen(false); }}
                    >
                        <ShoppingBag size={20} /> Commandes Achat
                    </button>
                    )}
                    {userRole?.code === 'ADMIN' && (
                    <button
                        className={`nav-item ${activeTab === 'customerReturns' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('customerReturns'); setIsSidebarOpen(false); }}
                    >
                        <RotateCcw size={20} /> Retours Clients
                    </button>
                    )}
                    {userRole?.code === 'ADMIN' && (
                    <button
                        className={`nav-item ${activeTab === 'supplierReturns' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('supplierReturns'); setIsSidebarOpen(false); }}
                    >
                        <RotateCcw size={20} /> Retours Fournisseurs
                    </button>
                    )}
                    <button
                        className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
                    >
                        <ShoppingCart size={20} /> Commandes
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={onBack} className="back-to-shop-btn">
                        <ArrowLeft size={18} /> Retour Boutique
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <button className="mobile-menu-toggle" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <div className="titles">
                            <h1>{activeTab === 'overview' ? 'Administration' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                            <span className="breadcrumb">Gestion / {activeTab}</span>
                        </div>
                    </div>
                </header>

                <div className="admin-content-inner">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                        >
                            {activeTab === 'overview' && renderOverview()}
                            {activeTab === 'reporting' && renderReporting()}
                            {activeTab === 'users' && userRole?.code === 'ADMIN' && renderUsers()}
                            {activeTab === 'categories' && renderCategories()}
                            {activeTab === 'roles' && userRole?.code === 'ADMIN' && renderRoles()}
                            {activeTab === 'banks' && userRole?.code === 'ADMIN' && renderBanks()}
                            {activeTab === 'products' && renderProducts()}
                            {activeTab === 'stock' && renderStock()}
                            {activeTab === 'warehouses' && renderWarehouses()}
                            {activeTab === 'suppliers' && renderSuppliers()}
                            {activeTab === 'purchaseOrders' && userRole?.code === 'ADMIN' && renderPurchaseOrders()}
                            {activeTab === 'customerReturns' && userRole?.code === 'ADMIN' && renderCustomerReturns()}
                            {activeTab === 'supplierReturns' && userRole?.code === 'ADMIN' && renderSupplierReturns()}
                            {activeTab === 'orders' && renderOrders()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Product Details Modal */}
            {viewingProduct && (
                <div className="admin-overlay" onClick={() => setViewingProduct(null)}>
                    <motion.div
                        className="admin-modal large"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><Eye size={22} style={{ display: 'inline', marginRight: '10px' }} />Détails du Produit</h2>
                            <button className="close-btn" onClick={() => setViewingProduct(null)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nom du produit</label>
                                    <input type="text" value={viewingProduct.name} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Marque</label>
                                    <input type="text" value={viewingProduct.marque} disabled />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Catégorie</label>
                                    <input 
                                        type="text" 
                                        value={categories.find(cat => cat.name === viewingProduct.category || cat.id === viewingProduct.category_id)?.name || viewingProduct.category} 
                                        disabled 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Prix Unitaire (DH)</label>
                                    <input type="text" value={viewingProduct.price?.toFixed(2) || '0.00'} disabled />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="text" value={viewingProduct.stock || 0} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Unité d'emballage</label>
                                    <input type="text" value={viewingProduct.packageUnit || 'Non définie'} disabled />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Statut</label>
                                    <input type="text" value={viewingProduct.is_active ? 'Actif' : 'Inactif'} disabled />
                                </div>
                            </div>
                            {viewingProduct.description && (
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea value={viewingProduct.description} disabled rows="3"></textarea>
                                </div>
                            )}
                            {viewingProduct.ingredients && (
                                <div className="form-group">
                                    <label>Ingrédients</label>
                                    <textarea value={viewingProduct.ingredients} disabled rows="3"></textarea>
                                </div>
                            )}

                            {viewingProduct.flavors && viewingProduct.flavors.length > 0 && (
                                <div className="form-section">
                                    <div className="section-header-inline">
                                        <h3><Zap size={18} /> Flavors ({viewingProduct.flavors.length})</h3>
                                    </div>
                                    <div className="flavors-list">
                                        {viewingProduct.flavors.map((flavor, idx) => (
                                            <div key={idx} className="flavor-item">
                                                <div className="flavor-color-box" style={{ backgroundColor: flavor.color }}></div>
                                                <div className="flavor-details">
                                                    <strong>{flavor.name}</strong>
                                                    {flavor.description && <span className="flavor-desc-text">{flavor.description}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {((viewingProduct.role_prices && viewingProduct.role_prices.length > 0) || 
                              (viewingProduct.price_roles && viewingProduct.price_roles.length > 0)) && (
                                <div className="form-section">
                                    <div className="section-header-inline">
                                        <h3><DollarSign size={18} /> Prix par Rôle</h3>
                                    </div>
                                    <div className="role-prices-list">
                                        {(viewingProduct.role_prices || viewingProduct.price_roles || []).map((rp, idx) => {
                                            const role = roles.find(r => r.id === rp.role_id);
                                            return (
                                                <div key={idx} className="role-price-item-display">
                                                    <div className="role-price-label">
                                                        <Shield size={16} />
                                                        <span>{role?.label || role?.code || 'Rôle inconnu'}</span>
                                                    </div>
                                                    <div className="role-price-amount">{rp.price?.toFixed(2) || '0.00'} DH</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setViewingProduct(null)}>
                                Fermer
                            </button>
                            <button className="save-pill-btn" onClick={() => {
                                setViewingProduct(null);
                                handleEditProduct(viewingProduct);
                            }}>
                                <Edit2 size={16} /> Modifier
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Product Edit Modal */}
            {isEditingProduct && (
                <div className="admin-overlay" onClick={() => {
                    setIsEditingProduct(null);
                    setEditProduct({ name: '', category: '', brand: '', price: '', stock: '', description: '', ingredients: '', is_active: true, flavors: [], role_prices: [] });
                    setProductErrors({});
                }}>
                    <motion.div
                        className="admin-modal large"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><Package size={22} style={{ display: 'inline', marginRight: '10px' }} />Modifier le Produit</h2>
                            <button className="close-btn" onClick={() => {
                                setIsEditingProduct(null);
                                setEditProduct({ name: '', category: '', brand: '', price: '', stock: '', description: '', ingredients: '', is_active: true, flavors: [], role_prices: [] });
                                setProductErrors({});
                            }}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nom du produit *</label>
                                    <input
                                        type="text"
                                        placeholder="Biscuits au chocolat"
                                        value={editProduct.name}
                                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                        className={productErrors.name ? 'error' : ''}
                                    />
                                    {productErrors.name && <span className="error-text">{productErrors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Marque *</label>
                                    <input
                                        type="text"
                                        placeholder="LU"
                                        value={editProduct.brand}
                                        onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })}
                                        className={productErrors.brand ? 'error' : ''}
                                    />
                                    {productErrors.brand && <span className="error-text">{productErrors.brand}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Catégorie *</label>
                                    <select
                                        className={`admin-select ${productErrors.category ? 'error' : ''}`}
                                        value={editProduct.category}
                                        onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {productErrors.category && <span className="error-text">{productErrors.category}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Prix Unitaire (DH) *</label>
                                    <input
                                        type="number"
                                        placeholder="25.00"
                                        step="0.01"
                                        value={editProduct.price}
                                        onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                                        className={productErrors.price ? 'error' : ''}
                                    />
                                    {productErrors.price && <span className="error-text">{productErrors.price}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Stock *</label>
                                    <input
                                        type="number"
                                        placeholder="100"
                                        value={editProduct.stock}
                                        onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                                        className={productErrors.stock ? 'error' : ''}
                                    />
                                    {productErrors.stock && <span className="error-text">{productErrors.stock}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Unité d'emballage</label>
                                    <input
                                        type="number"
                                        placeholder="Nombre de produits par paquet"
                                        value={editProduct.packageUnit}
                                        onChange={(e) => setEditProduct({ ...editProduct, packageUnit: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Description du produit..."
                                    value={editProduct.description}
                                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                                    rows={3}
                                    className="admin-textarea"
                                />
                            </div>
                            <div className="form-group">
                                <label>Ingrédients</label>
                                <textarea
                                    placeholder="Farine, sucre, beurre, sel..."
                                    value={editProduct.ingredients}
                                    onChange={(e) => setEditProduct({ ...editProduct, ingredients: e.target.value })}
                                    rows={2}
                                    className="admin-textarea"
                                />
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={editProduct.is_active}
                                        onChange={(e) => setEditProduct({ ...editProduct, is_active: e.target.checked })}
                                    />
                                    <span>Produit actif</span>
                                </label>
                            </div>

                            {/* Flavors Section */}
                            <div className="form-section">
                                <div className="section-header-inline">
                                    <h3><Zap size={18} /> Flavors</h3>
                                    <button className="icon-btn add" onClick={() => setIsAddingFlavor(true)} title="Ajouter un flavor">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                {editProduct.flavors && editProduct.flavors.length > 0 && (
                                    <div className="flavors-list">
                                        {editProduct.flavors.map((flavor, index) => (
                                            <div key={index} className="flavor-item">
                                                <div className="flavor-color" style={{ backgroundColor: flavor.color }}></div>
                                                <div className="flavor-info">
                                                    <strong>{flavor.name}</strong>
                                                    <span>{flavor.description}</span>
                                                </div>
                                                <div className="flavor-actions">
                                                    <button className="icon-btn edit" onClick={() => {
                                                        setEditingFlavorIndex(index);
                                                        setCurrentFlavor(flavor);
                                                        setIsAddingFlavor(true);
                                                    }} title="Modifier">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button className="icon-btn delete" onClick={() => {
                                                        setEditProduct({
                                                            ...editProduct,
                                                            flavors: editProduct.flavors.filter((_, i) => i !== index)
                                                        });
                                                    }} title="Supprimer">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Role Prices Section */}
                            <div className="form-section">
                                <div className="section-header-inline">
                                    <h3><DollarSign size={18} /> Prix par Rôle</h3>
                                    <button className="icon-btn add" onClick={() => setIsAddingRolePrice(true)} title="Ajouter un prix">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                {editProduct.role_prices && editProduct.role_prices.length > 0 ? (
                                    <div className="role-prices-list">
                                        {editProduct.role_prices.map((rp, index) => {
                                            const role = roles.find(r => Number(r.id) === Number(rp.role_id));
                                            return (
                                                <div key={index} className="role-price-item">
                                                    <div className="role-price-info">
                                                        <strong>{role?.code || role?.label || 'Rôle inconnu'}</strong>
                                                        <span>{parseFloat(rp.price).toFixed(2)} DH</span>
                                                    </div>
                                                    <div className="role-price-actions">
                                                        <button className="icon-btn edit" onClick={() => {
                                                            setEditingRolePriceIndex(index);
                                                            setCurrentRolePrice(rp);
                                                            setIsAddingRolePrice(true);
                                                        }} title="Modifier">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button className="icon-btn delete" onClick={() => {
                                                            setEditProduct({
                                                                ...editProduct,
                                                                role_prices: editProduct.role_prices.filter((_, i) => i !== index)
                                                            });
                                                        }} title="Supprimer">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="empty-state">Aucun prix par rôle défini. Cliquez sur + pour en ajouter.</p>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsEditingProduct(null);
                                setEditProduct({ name: '', category: '', brand: '', price: '', stock: '', description: '', ingredients: '', is_active: true, flavors: [], role_prices: [] });
                                setProductErrors({});
                            }}>Annuler</button>
                            <button className="save-pill-btn" onClick={handleUpdateProduct} disabled={isProductLoading}>
                                {isProductLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Mise à jour...
                                    </>
                                ) : (
                                    <>
                                        <Edit2 size={18} /> Modifier
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* User Add/Edit Modal */}
            {(isAddingUser || editingUser) && (
                <div className="admin-overlay" onClick={() => {
                    setIsAddingUser(false);
                    setEditingUser(null);
                    setNewUser({
                        first_name: '',
                        last_name: '',
                        email: '',
                        password: '',
                        role_id: '',
                        phone: '',
                        address: '',
                        discount_percent: 20,
                        is_active: true,
                        deactivated_at: '2026-01-20'
                    });
                    setUserErrors({});
                }}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>
                                <UsersIcon size={22} style={{ display: 'inline', marginRight: '10px' }} />
                                {editingUser ? 'Modifier Utilisateur' : 'Ajouter un Utilisateur'}
                            </h2>
                            <button className="close-btn" onClick={() => {
                                setIsAddingUser(false);
                                setEditingUser(null);
                                setNewUser({
                                    first_name: '',
                                    last_name: '',
                                    email: '',
                                    password: '',
                                    role_id: '',
                                    phone: '',
                                    address: '',
                                    discount_percent: 20,
                                    is_active: true,
                                    deactivated_at: '2026-01-20'
                                });
                                setUserErrors({});
                            }}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Prénom *</label>
                                <input
                                    type="text"
                                    placeholder="Jean"
                                    value={newUser.first_name}
                                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                                    className={userErrors.first_name ? 'error' : ''}
                                />
                                {userErrors.first_name && <span className="error-text">{userErrors.first_name}</span>}
                            </div>
                            <div className="form-group">
                                <label>Nom *</label>
                                <input
                                    type="text"
                                    placeholder="Dupont"
                                    value={newUser.last_name}
                                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                                    className={userErrors.last_name ? 'error' : ''}
                                />
                                {userErrors.last_name && <span className="error-text">{userErrors.last_name}</span>}
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    placeholder="jean@example.com"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className={userErrors.email ? 'error' : ''}
                                />
                                {userErrors.email && <span className="error-text">{userErrors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label>Téléphone</label>
                                <input
                                    type="tel"
                                    placeholder="0123456789"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                    className={userErrors.phone ? 'error' : ''}
                                />
                                {userErrors.phone && <span className="error-text">{userErrors.phone}</span>}
                            </div>
                            <div className="form-group">
                                <label>Adresse</label>
                                <input
                                    type="text"
                                    placeholder="Adresse du client"
                                    value={newUser.address}
                                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mot de passe {editingUser ? '' : '*'}</label>
                                <input
                                    type="password"
                                    placeholder={editingUser ? "Laisser vide pour ne pas modifier" : "••••••••"}
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className={userErrors.password ? 'error' : ''}
                                />
                                {userErrors.password && <span className="error-text">{userErrors.password}</span>}
                                {editingUser && <span className="form-hint">Laisser vide pour conserver le mot de passe actuel</span>}
                            </div>
                            <div className="form-group">
                                <label>Rôle *</label>
                                <select
                                    className="admin-select"
                                    value={newUser.role_id}
                                    onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
                                >
                                    <option value="">Sélectionner un rôle</option>
                                    {Array.isArray(rolesState) && rolesState.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                                {userErrors.role_id && <span className="error-text">{userErrors.role_id}</span>}
                            </div>
                            <div className="form-group">
                                <label>Type d'utilisateur *</label>
                                <select
                                    className="admin-select"
                                    value={newUser.user_type || ''}
                                    onChange={e => setNewUser({ ...newUser, user_type: e.target.value })}
                                >
                                    <option value="">Sélectionner un type</option>
                                    <option value="candy">Candy</option>
                                    <option value="ams">AMS</option>
                                    <option value="both">Les deux</option>
                                </select>
                                {userErrors.user_type && <span className="error-text">{userErrors.user_type}</span>}
                            </div>
                            <div className="form-group">
                                <label>Remise (%)</label>
                                <input
                                    type="number"
                                    placeholder="20"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={newUser.discount_percent}
                                    onChange={(e) => setNewUser({ ...newUser, discount_percent: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={newUser.is_active}
                                        onChange={(e) => setNewUser({ ...newUser, is_active: e.target.checked })}
                                    />
                                    <span>Compte actif</span>
                                </label>
                            </div>
                            <div className="form-group">
                                <label>Date de désactivation</label>
                                <input
                                    type="date"
                                    value={newUser.deactivated_at}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setNewUser({ ...newUser, deactivated_at: e.target.value })}
                                />
                                <span className="form-hint">Date future de désactivation du compte</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsAddingUser(false);
                                setEditingUser(null);
                                setNewUser({
                                    first_name: '',
                                    last_name: '',
                                    email: '',
                                    password: '',
                                    role_id: '',
                                    phone: '',
                                    address: '',
                                    discount_percent: 20,
                                    is_active: true,
                                    deactivated_at: '2026-01-20'
                                });
                                setUserErrors({});
                            }}>Annuler</button>
                            <button
                                className="save-pill-btn"
                                onClick={editingUser ? handleUpdateUser : handleAddUser}
                                disabled={isUserLoading}
                            >
                                {isUserLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        {editingUser ? 'Modification...' : 'Création...'}
                                    </>
                                ) : (
                                    <>
                                        {editingUser ? <Save size={18} /> : <Plus size={18} />}
                                        {editingUser ? 'Modifier' : 'Créer'}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Category Add/Edit Modal */}
            {(isAddingCategory || editingCategory) && (
                <div className="admin-overlay" onClick={() => {
                    setIsAddingCategory(false);
                    setEditingCategory(null);
                }}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><Tag size={22} style={{ display: 'inline', marginRight: '10px' }} />{editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}</h2>
                            <button className="close-btn" onClick={() => {
                                setIsAddingCategory(false);
                                setEditingCategory(null);
                                setNewCategory({ name: '', emoji: '📦', description: '', is_active: true });
                                setCategoryErrors({});
                            }}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom de la catégorie *</label>
                                <input
                                    type="text"
                                    placeholder="Snacks"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className={categoryErrors.name ? 'error' : ''}
                                />
                                {categoryErrors.name && <span className="error-text">{categoryErrors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label>Emoji *</label>
                                <input
                                    type="text"
                                    placeholder="🍪"
                                    value={newCategory.emoji}
                                    onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                                    className={categoryErrors.emoji ? 'error' : ''}
                                    maxLength={2}
                                />
                                {categoryErrors.emoji && <span className="error-text">{categoryErrors.emoji}</span>}
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Description de la catégorie..."
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    rows={3}
                                    className="admin-textarea"
                                />
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={newCategory.is_active}
                                        onChange={(e) => setNewCategory({ ...newCategory, is_active: e.target.checked })}
                                    />
                                    <span>Catégorie active</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsAddingCategory(false);
                                setEditingCategory(null);
                                setNewCategory({ name: '', emoji: '📦', description: '', is_active: true });
                                setCategoryErrors({});
                            }}>Annuler</button>
                            <button className="save-pill-btn" onClick={editingCategory ? handleUpdateCategory : handleAddCategory} disabled={isCategoryLoading}>
                                {isCategoryLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> {editingCategory ? 'Modification...' : 'Création...'}
                                    </>
                                ) : (
                                    <>
                                        {editingCategory ? <Save size={18} /> : <Plus size={18} />} {editingCategory ? 'Modifier' : 'Créer'}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Product Add Modal */}
            {isAddingProduct && (
                <div className="admin-overlay" onClick={() => setIsAddingProduct(false)}>
                    <motion.div
                        className="admin-modal large"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><Package size={22} style={{ display: 'inline', marginRight: '10px' }} />Nouveau Produit</h2>
                            <button className="close-btn" onClick={() => {
                                setIsAddingProduct(false);
                                setNewProduct({ name: '', category: '', brand: '', stock: '', description: '', is_active: true, flavors: [], role_prices: [] });
                                setProductErrors({});
                            }}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nom du produit *</label>
                                    <input
                                        type="text"
                                        placeholder="Biscuits au chocolat"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className={productErrors.name ? 'error' : ''}
                                    />
                                    {productErrors.name && <span className="error-text">{productErrors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Marque *</label>
                                    <input
                                        type="text"
                                        placeholder="LU"
                                        value={newProduct.brand}
                                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                        className={productErrors.brand ? 'error' : ''}
                                    />
                                    {productErrors.brand && <span className="error-text">{productErrors.brand}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Catégorie *</label>
                                    <select
                                        className={`admin-select ${productErrors.category ? 'error' : ''}`}
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {productErrors.category && <span className="error-text">{productErrors.category}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Prix Unitaire (DH) *</label>
                                    <input
                                        type="number"
                                        placeholder="25.00"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className={productErrors.price ? 'error' : ''}
                                    />
                                    {productErrors.price && <span className="error-text">{productErrors.price}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Stock *</label>
                                    <input
                                        type="number"
                                        placeholder="100"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className={productErrors.stock ? 'error' : ''}
                                    />
                                    {productErrors.stock && <span className="error-text">{productErrors.stock}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Type de produit *</label>
                                    <select
                                        className="admin-select"
                                        value={newProduct.product_type || ''}
                                        onChange={e => setNewProduct({ ...newProduct, product_type: e.target.value })}
                                    >
                                        <option value="">Sélectionner un type</option>
                                        <option value="candy">Candy</option>
                                        <option value="ams">AMS</option>
                                        <option value="both">Les deux</option>
                                    </select>
                                    {productErrors.product_type && <span className="error-text">{productErrors.product_type}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Stock de sécurité</label>
                                    <input
                                        type="number"
                                        placeholder="Stock de sécurité"
                                        value={newProduct.stock_securite || ''}
                                        onChange={e => setNewProduct({ ...newProduct, stock_securite: e.target.value })}
                                        className={productErrors.stock_securite ? 'error' : ''}
                                    />
                                    {productErrors.stock_securite && <span className="error-text">{productErrors.stock_securite}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Unité d'emballage</label>
                                    <input
                                        type="number"
                                        placeholder="Nombre de produits par paquet"
                                        value={newProduct.packageUnit}
                                        onChange={(e) => setNewProduct({ ...newProduct, packageUnit: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Description du produit..."
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    rows={3}
                                    className="admin-textarea"
                                />
                            </div>
                            <div className="form-group">
                                <label>Ingrédients</label>
                                <textarea
                                    placeholder="Farine, sucre, beurre, sel..."
                                    value={newProduct.ingredients}
                                    onChange={(e) => setNewProduct({ ...newProduct, ingredients: e.target.value })}
                                    rows={2}
                                    className="admin-textarea"
                                />
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={newProduct.is_active}
                                        onChange={(e) => setNewProduct({ ...newProduct, is_active: e.target.checked })}
                                    />
                                    <span>Produit actif</span>
                                </label>
                            </div>

                            {/* Flavors Section */}
                            <div className="form-section">
                                <div className="section-header-inline">
                                    <h3><Zap size={18} /> Flavors</h3>
                                    <button className="icon-btn add" onClick={() => setIsAddingFlavor(true)} title="Ajouter un flavor">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                {newProduct.flavors.length > 0 && (
                                    <div className="flavors-list">
                                        {newProduct.flavors.map((flavor, index) => (
                                            <div key={index} className="flavor-item">
                                                <div className="flavor-color" style={{ backgroundColor: flavor.color }}></div>
                                                <div className="flavor-info">
                                                    <strong>{flavor.name}</strong>
                                                    <span>{flavor.description}</span>
                                                </div>
                                                <div className="flavor-actions">
                                                    <button className="icon-btn edit" onClick={() => {
                                                        setEditingFlavorIndex(index);
                                                        setCurrentFlavor(flavor);
                                                        setIsAddingFlavor(true);
                                                    }} title="Modifier">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button className="icon-btn delete" onClick={() => {
                                                        setNewProduct({
                                                            ...newProduct,
                                                            flavors: newProduct.flavors.filter((_, i) => i !== index)
                                                        });
                                                    }} title="Supprimer">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Role Prices Section */}
                            <div className="form-section">
                                <div className="section-header-inline">
                                    <h3><DollarSign size={18} /> Prix par Rôle</h3>
                                    <button className="icon-btn add" onClick={() => setIsAddingRolePrice(true)} title="Ajouter un prix">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                {newProduct.role_prices.length > 0 && (
                                    <div className="role-prices-list">
                                        {newProduct.role_prices.map((rp, index) => {
                                            const role = roles.find(r => Number(r.id) === Number(rp.role_id));
                                            return (
                                                <div key={index} className="role-price-item">
                                                    <div className="role-price-info">
                                                        <strong>{role.code || 'Rôle inconnu'}</strong>
                                                        <span>{parseFloat(rp.price).toFixed(2)} DH</span>
                                                    </div>
                                                    <div className="role-price-actions">
                                                        <button className="icon-btn edit" onClick={() => {
                                                            setEditingRolePriceIndex(index);
                                                            setCurrentRolePrice(rp);
                                                            setIsAddingRolePrice(true);
                                                        }} title="Modifier">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button className="icon-btn delete" onClick={() => {
                                                            setNewProduct({
                                                                ...newProduct,
                                                                role_prices: newProduct.role_prices.filter((_, i) => i !== index)
                                                            });
                                                        }} title="Supprimer">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsAddingProduct(false);
                                setNewProduct({ name: '', category: '', brand: '', stock: '', description: '', is_active: true, flavors: [], role_prices: [] });
                                setProductErrors({});
                            }}>Annuler</button>
                            <button className="save-pill-btn" onClick={handleAddProduct} disabled={isProductLoading}>
                                {isProductLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Création...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} /> Créer
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Flavor Add/Edit Modal */}
            {isAddingFlavor && (
                <div className="admin-overlay" onClick={() => {
                    setIsAddingFlavor(false);
                    setEditingFlavorIndex(null);
                    setCurrentFlavor({ name: '', description: '', color: '#d4af37', image: '' });
                    setFlavorImageFile(null);
                    setImageInputMethod('url');
                }}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><Zap size={22} style={{ display: 'inline', marginRight: '10px' }} />{editingFlavorIndex !== null ? 'Modifier le Flavor' : 'Ajouter un Flavor'}</h2>
                            <button className="close-btn" onClick={() => {
                                setIsAddingFlavor(false);
                                setEditingFlavorIndex(null);
                                setCurrentFlavor({ name: '', description: '', color: '#d4af37', image: '' });
                                setFlavorImageFile(null);
                                setImageInputMethod('url');
                            }}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom du flavor *</label>
                                <input
                                    type="text"
                                    placeholder="Chocolat"
                                    value={currentFlavor.name}
                                    onChange={(e) => setCurrentFlavor({ ...currentFlavor, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Description du flavor..."
                                    value={currentFlavor.description}
                                    onChange={(e) => setCurrentFlavor({ ...currentFlavor, description: e.target.value })}
                                    rows={2}
                                    className="admin-textarea"
                                />
                            </div>
                            <div className="form-group">
                                <label>Couleur *</label>
                                <input
                                    type="color"
                                    value={currentFlavor.color}
                                    onChange={(e) => setCurrentFlavor({ ...currentFlavor, color: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <div className="image-input-choice">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="imageMethod"
                                            value="url"
                                            checked={imageInputMethod === 'url'}
                                            onChange={(e) => {
                                                setImageInputMethod(e.target.value);
                                                setCurrentFlavor({ ...currentFlavor, image: '' });
                                                setFlavorImageFile(null);
                                            }}
                                        />
                                        <span>URL</span>
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="imageMethod"
                                            value="file"
                                            checked={imageInputMethod === 'file'}
                                            onChange={(e) => {
                                                setImageInputMethod(e.target.value);
                                                setCurrentFlavor({ ...currentFlavor, image: '' });
                                            }}
                                        />
                                        <span>Upload</span>
                                    </label>
                                </div>
                                <div className="image-upload-group">
                                    {imageInputMethod === 'url' ? (
                                        <input
                                            type="text"
                                            placeholder="URL de l'image..."
                                            value={currentFlavor.image}
                                            onChange={(e) => setCurrentFlavor({ ...currentFlavor, image: e.target.value })}
                                        />
                                    ) : (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setFlavorImageFile(file);
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setCurrentFlavor({ ...currentFlavor, image: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="file-input"
                                        />
                                    )}
                                </div>
                                {currentFlavor.image && (
                                    <div className="image-preview">
                                        <img src={currentFlavor.image} alt="Preview" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsAddingFlavor(false);
                                setEditingFlavorIndex(null);
                                setCurrentFlavor({ name: '', description: '', color: '#d4af37', image: '' });
                                setFlavorImageFile(null);
                                setImageInputMethod('url');
                            }}>Annuler</button>
                            <button className="save-pill-btn" onClick={() => {
                                if (currentFlavor.name.trim()) {
                                    // Vérifier si on est en mode édition de produit ou création
                                    if (isEditingProduct) {
                                        if (editingFlavorIndex !== null) {
                                            const updatedFlavors = [...editProduct.flavors];
                                            updatedFlavors[editingFlavorIndex] = currentFlavor;
                                            setEditProduct({ ...editProduct, flavors: updatedFlavors });
                                        } else {
                                            setEditProduct({ ...editProduct, flavors: [...editProduct.flavors, currentFlavor] });
                                        }
                                    } else {
                                        if (editingFlavorIndex !== null) {
                                            const updatedFlavors = [...newProduct.flavors];
                                            updatedFlavors[editingFlavorIndex] = currentFlavor;
                                            setNewProduct({ ...newProduct, flavors: updatedFlavors });
                                        } else {
                                            setNewProduct({ ...newProduct, flavors: [...newProduct.flavors, currentFlavor] });
                                        }
                                    }
                                    setIsAddingFlavor(false);
                                    setEditingFlavorIndex(null);
                                    setCurrentFlavor({ name: '', description: '', color: '#d4af37', image: '' });
                                    setFlavorImageFile(null);
                                }
                            }}>
                                <Save size={18} /> {editingFlavorIndex !== null ? 'Modifier' : 'Ajouter'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Role Price Add/Edit Modal */}
            {isAddingRolePrice && (
                <div className="admin-overlay" onClick={() => {
                    setIsAddingRolePrice(false);
                    setEditingRolePriceIndex(null);
                    setCurrentRolePrice({ role_id: '', price: '' });
                }}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><DollarSign size={22} style={{ display: 'inline', marginRight: '10px' }} />{editingRolePriceIndex !== null ? 'Modifier le Prix' : 'Ajouter un Prix'}</h2>
                            <button className="close-btn" onClick={() => {
                                setIsAddingRolePrice(false);
                                setEditingRolePriceIndex(null);
                                setCurrentRolePrice({ role_id: '', price: '' });
                            }}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Rôle *</label>
                                <select
                                    className="admin-select"
                                    value={currentRolePrice.role_id}
                                    onChange={(e) => setCurrentRolePrice({ ...currentRolePrice, role_id: e.target.value })}
                                >
                                    <option value="">Sélectionner un rôle...</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Prix (DH) *</label>
                                <input
                                    type="number"
                                    placeholder="25.00"
                                    step="0.01"
                                    value={currentRolePrice.price}
                                    onChange={(e) => setCurrentRolePrice({ ...currentRolePrice, price: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsAddingRolePrice(false);
                                setEditingRolePriceIndex(null);
                                setCurrentRolePrice({ role_id: '', price: '' });
                            }}>Annuler</button>
                            <button className="save-pill-btn" onClick={() => {
                                if (currentRolePrice.role_id && currentRolePrice.price) {
                                    // Vérifier si on est en mode édition de produit ou création
                                    if (isEditingProduct) {
                                        if (editingRolePriceIndex !== null) {
                                            const updatedRolePrices = [...editProduct.role_prices];
                                            updatedRolePrices[editingRolePriceIndex] = currentRolePrice;
                                            setEditProduct({ ...editProduct, role_prices: updatedRolePrices });
                                        } else {
                                            setEditProduct({ ...editProduct, role_prices: [...editProduct.role_prices, currentRolePrice] });
                                        }
                                    } else {
                                        if (editingRolePriceIndex !== null) {
                                            const updatedRolePrices = [...newProduct.role_prices];
                                            updatedRolePrices[editingRolePriceIndex] = currentRolePrice;
                                            setNewProduct({ ...newProduct, role_prices: updatedRolePrices });
                                        } else {
                                            setNewProduct({ ...newProduct, role_prices: [...newProduct.role_prices, currentRolePrice] });
                                        }
                                    }
                                    setIsAddingRolePrice(false);
                                    setEditingRolePriceIndex(null);
                                    setCurrentRolePrice({ role_id: '', price: '' });
                                }
                            }}>
                                <Save size={18} /> {editingRolePriceIndex !== null ? 'Modifier' : 'Ajouter'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Add Role Modal */}
            {isAddingRole && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="modal-header">
                            <h2>Ajouter un Rôle</h2>
                            <button className="close-btn" onClick={() => {
                                setIsAddingRole(false);
                                setNewRole({ code: '', label: '', is_active: true });
                                setRoleErrors({});
                            }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Code *</label>
                                <input
                                    type="text"
                                    placeholder="ADMIN, MANAGER, etc."
                                    value={newRole.code}
                                    onChange={(e) => setNewRole({ ...newRole, code: e.target.value.toUpperCase() })}
                                    className={roleErrors.code ? 'error' : ''}
                                />
                                {roleErrors.code && <span className="error-text">{roleErrors.code}</span>}
                                <small className="form-hint">Uniquement majuscules et underscores</small>
                            </div>
                            <div className="form-group">
                                <label>Label *</label>
                                <input
                                    type="text"
                                    placeholder="Administrateur"
                                    value={newRole.label}
                                    onChange={(e) => setNewRole({ ...newRole, label: e.target.value })}
                                    className={roleErrors.label ? 'error' : ''}
                                />
                                {roleErrors.label && <span className="error-text">{roleErrors.label}</span>}
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={newRole.is_active}
                                        onChange={(e) => setNewRole({ ...newRole, is_active: e.target.checked })}
                                    />
                                    <span>Actif</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsAddingRole(false);
                                setNewRole({ code: '', label: '', is_active: true });
                                setRoleErrors({});
                            }}>
                                Annuler
                            </button>
                            <button className="save-pill-btn" onClick={handleAddRole} disabled={isRoleLoading}>
                                {isRoleLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Création...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} /> Créer
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Role Modal */}
            {editingRole && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="modal-header">
                            <h2>Modifier le Rôle</h2>
                            <button className="close-btn" onClick={() => {
                                setEditingRole(null);
                                setNewRole({ code: '', label: '', is_active: true });
                                setRoleErrors({});
                            }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Code *</label>
                                <input
                                    type="text"
                                    placeholder="ADMIN, MANAGER, etc."
                                    value={newRole.code}
                                    onChange={(e) => setNewRole({ ...newRole, code: e.target.value.toUpperCase() })}
                                    className={roleErrors.code ? 'error' : ''}
                                />
                                {roleErrors.code && <span className="error-text">{roleErrors.code}</span>}
                                <small className="form-hint">Uniquement majuscules et underscores</small>
                            </div>
                            <div className="form-group">
                                <label>Label *</label>
                                <input
                                    type="text"
                                    placeholder="Administrateur"
                                    value={newRole.label}
                                    onChange={(e) => setNewRole({ ...newRole, label: e.target.value })}
                                    className={roleErrors.label ? 'error' : ''}
                                />
                                {roleErrors.label && <span className="error-text">{roleErrors.label}</span>}
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={newRole.is_active}
                                        onChange={(e) => setNewRole({ ...newRole, is_active: e.target.checked })}
                                    />
                                    <span>Actif</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setEditingRole(null);
                                setNewRole({ code: '', label: '', is_active: true });
                                setRoleErrors({});
                            }}>
                                Annuler
                            </button>
                            <button className="save-pill-btn" onClick={handleUpdateRole} disabled={isRoleLoading}>
                                {isRoleLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Sauvegarde...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} /> Sauvegarder
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Role Confirmation Modal */}
            {deletingRole && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '400px' }}
                    >
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.1rem' }}>Confirmer la suppression</h2>
                            <button className="close-btn" onClick={() => setDeletingRole(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '15px 20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    margin: '0 auto 12px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Trash2 size={22} color="#ef4444" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Voulez-vous vraiment supprimer ce rôle ?<br />
                                    Cette action est irréversible.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setDeletingRole(null)}>
                                Annuler
                            </button>
                            <button
                                className="save-pill-btn"
                                onClick={confirmDeleteRole}
                                style={{ background: '#ef4444' }}
                            >
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Bank Add/Edit Modal */}
            {(isAddingBank || editingBank) && (
                <div className="admin-overlay" onClick={() => {
                    setIsAddingBank(false);
                    setEditingBank(null);
                    setNewBank({ code: '', label: '' });
                    setBankErrors({});
                }}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><Banknote size={22} style={{ display: 'inline', marginRight: '10px' }} />{editingBank ? 'Modifier la Banque' : 'Ajouter une Banque'}</h2>
                            <button className="close-btn" onClick={() => {
                                setIsAddingBank(false);
                                setEditingBank(null);
                                setNewBank({ code: '', label: '' });
                                setBankErrors({});
                            }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Code *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: BMCE, BP, ..."
                                    value={newBank.code}
                                    onChange={(e) => setNewBank({ ...newBank, code: e.target.value.toUpperCase() })}
                                    className={bankErrors.code ? 'error' : ''}
                                    style={{ textTransform: 'uppercase' }}
                                />
                                {bankErrors.code && <span className="error-text">{bankErrors.code}</span>}
                            </div>
                            <div className="form-group">
                                <label>Label *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: BMCE Bank, Banque Populaire, ..."
                                    value={newBank.label}
                                    onChange={(e) => setNewBank({ ...newBank, label: e.target.value })}
                                    className={bankErrors.label ? 'error' : ''}
                                />
                                {bankErrors.label && <span className="error-text">{bankErrors.label}</span>}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsAddingBank(false);
                                setEditingBank(null);
                                setNewBank({ code: '', label: '' });
                                setBankErrors({});
                            }}>
                                Annuler
                            </button>
                            <button className="save-pill-btn" onClick={editingBank ? handleUpdateBank : handleAddBank} disabled={isBankLoading}>
                                {isBankLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> {editingBank ? 'Modification...' : 'Création...'}
                                    </>
                                ) : (
                                    <>
                                        {editingBank ? <><Save size={18} /> Modifier</> : <><Plus size={18} /> Créer</>}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Bank Confirmation Modal */}
            {deletingBank && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '400px' }}
                    >
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.1rem' }}>Confirmer la suppression</h2>
                            <button className="close-btn" onClick={() => setDeletingBank(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '15px 20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    margin: '0 auto 12px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Trash2 size={22} color="#ef4444" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Voulez-vous vraiment supprimer cette banque ?<br />
                                    Cette action est irréversible.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setDeletingBank(null)}>
                                Annuler
                            </button>
                            <button
                                className="save-pill-btn"
                                onClick={() => handleDeleteBank(deletingBank)}
                                style={{ background: '#ef4444' }}
                            >
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete User Confirmation Modal */}
            {deletingUser && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '400px' }}
                    >
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.1rem' }}>Confirmer la suppression</h2>
                            <button className="close-btn" onClick={() => setDeletingUser(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '15px 20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    margin: '0 auto 12px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Trash2 size={22} color="#ef4444" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Voulez-vous vraiment supprimer cet utilisateur ?<br />
                                    Cette action est irréversible.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setDeletingUser(null)}>
                                Annuler
                            </button>
                            <button
                                className="save-pill-btn"
                                onClick={confirmDeleteUser}
                                style={{ background: '#ef4444' }}
                            >
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Category Confirmation Modal */}
            {deletingCategory && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '400px' }}
                    >
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.1rem' }}>Confirmer la suppression</h2>
                            <button className="close-btn" onClick={() => setDeletingCategory(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '15px 20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    margin: '0 auto 12px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Trash2 size={22} color="#ef4444" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Voulez-vous vraiment supprimer cette catégorie ?<br />
                                    Cette action est irréversible.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setDeletingCategory(null)}>
                                Annuler
                            </button>
                            <button
                                className="save-pill-btn"
                                onClick={confirmDeleteCategory}
                                style={{ background: '#ef4444' }}
                            >
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Product Confirmation Modal */}
            {deletingProduct && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '400px' }}
                    >
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.1rem' }}>Confirmer la suppression</h2>
                            <button className="close-btn" onClick={() => setDeletingProduct(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '15px 20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    margin: '0 auto 12px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Trash2 size={22} color="#ef4444" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Voulez-vous vraiment supprimer ce produit ?<br />
                                    Cette action est irréversible.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setDeletingProduct(null)}>
                                Annuler
                            </button>
                            <button
                                className="save-pill-btn"
                                onClick={confirmDeleteProduct}
                                style={{ background: '#ef4444' }}
                            >
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Modal de détails de commande */}
            {viewingOrder && (
                <div className="admin-overlay" onClick={() => setViewingOrder(null)}>
                    <motion.div
                        className="admin-modal large"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><ShoppingCart size={22} style={{ display: 'inline', marginRight: '10px' }} />Détails de la commande #{viewingOrder.id}</h2>
                            <button className="close-btn" onClick={() => setViewingOrder(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {/* Informations du client */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Client</label>
                                    <div style={{
                                        padding: '12px',
                                        background: 'var(--bg-main)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            background: 'linear-gradient(135deg, var(--primary), #d4af37)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '700',
                                            fontSize: '1rem'
                                        }}>
                                            {(viewingOrder.customer_name || 'C').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '1rem' }}>{viewingOrder.customer_name || 'Client'}</div>
                                            {viewingOrder.customer_email && (
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{viewingOrder.customer_email}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Date de commande</label>
                                    <div style={{
                                        padding: '12px',
                                        background: 'var(--bg-main)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontWeight: '600'
                                    }}>
                                        <Clock size={18} style={{ color: 'var(--primary)' }} />
                                        {new Date(viewingOrder.created_at).toLocaleDateString('fr-FR', { 
                                            day: '2-digit', 
                                            month: 'long', 
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Adresse */}
                            <div className="form-row">
                                {viewingOrder.customer_phone && (
                                    <div className="form-group">
                                        <label>Téléphone</label>
                                        <div style={{
                                            padding: '12px',
                                            background: 'var(--bg-main)',
                                            borderRadius: '8px',
                                            fontWeight: '600'
                                        }}>
                                            {viewingOrder.customer_phone}
                                        </div>
                                    </div>
                                )}
                                {viewingOrder.customer_address && (
                                    <div className="form-group">
                                        <label>Adresse</label>
                                        <div style={{
                                            padding: '12px',
                                            background: 'var(--bg-main)',
                                            borderRadius: '8px',
                                            fontWeight: '600'
                                        }}>
                                            {viewingOrder.customer_address}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Statut et Montants */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Statut actuel</label>
                                    <div style={{
                                        padding: '12px 16px',
                                        background: `${ORDER_STATUSES.find(s => s.value === viewingOrder.status)?.color}15`,
                                        border: `2px solid ${ORDER_STATUSES.find(s => s.value === viewingOrder.status)?.color}`,
                                        borderRadius: '12px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontWeight: '700',
                                        fontSize: '0.95rem',
                                        color: ORDER_STATUSES.find(s => s.value === viewingOrder.status)?.color
                                    }}>
                                        {ORDER_STATUSES.find(s => s.value === viewingOrder.status)?.icon}
                                        {ORDER_STATUSES.find(s => s.value === viewingOrder.status)?.label}
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Sous-total</label>
                                    <div style={{
                                        padding: '12px',
                                        background: 'var(--bg-main)',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '1.1rem'
                                    }}>
                                        {parseFloat(viewingOrder.subtotal || 0).toFixed(2)} DH
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Remise (%)</label>
                                    <div style={{
                                        padding: '12px',
                                        background: 'var(--bg-main)',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        color: '#ef4444'
                                    }}>
                                        {viewingOrder.remise ? 
                                            `${parseFloat(viewingOrder.remise).toFixed(2)} %` 
                                            : '0.00 %'
                                        }
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Montant total</label>
                                    <div style={{
                                        padding: '12px',
                                        background: 'var(--bg-main)',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '1.3rem',
                                        color: '#10b981'
                                    }}>
                                        {parseFloat(viewingOrder.total || 0).toFixed(2)} DH
                                    </div>
                                </div>
                            </div>

                            {/* Articles de la commande */}
                            {viewingOrder.lines && viewingOrder.lines.length > 0 && (
                                <div className="form-group">
                                    <label>Articles ({viewingOrder.lines.length})</label>
                                    <div style={{
                                        background: 'var(--bg-main)',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        maxHeight: '300px',
                                        overflowY: 'auto'
                                    }}>
                                        {viewingOrder.lines.map((line, index) => (
                                            <div key={line.id || index} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '12px',
                                                background: 'var(--bg-card)',
                                                borderRadius: '8px',
                                                marginBottom: index < viewingOrder.lines.length - 1 ? '10px' : '0'
                                            }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                                                        Produit #{line.product_id}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        {line.quantity} × {parseFloat(line.unit_price).toFixed(2)} DH
                                                    </div>
                                                </div>
                                                <div style={{
                                                    fontWeight: '700',
                                                    fontSize: '1.1rem',
                                                    color: 'var(--primary)'
                                                }}>
                                                    {parseFloat(line.final_price).toFixed(2)} DH
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Historique des statuts */}
                            {viewingOrder.status_history && viewingOrder.status_history.length > 0 && (
                                <div className="form-group">
                                    <label>Historique des statuts ({viewingOrder.status_history.length})</label>
                                    <div style={{
                                        background: 'var(--bg-main)',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        maxHeight: '300px',
                                        overflowY: 'auto'
                                    }}>
                                        {viewingOrder.status_history.map((history, index) => {
                                            const statusInfo = ORDER_STATUSES.find(s => s.value.toLowerCase() === history.status.toLowerCase());
                                            return (
                                                <div key={history.id || index} style={{
                                                    padding: '12px',
                                                    background: 'var(--bg-card)',
                                                    borderRadius: '8px',
                                                    marginBottom: index < viewingOrder.status_history.length - 1 ? '10px' : '0',
                                                    borderLeft: `4px solid ${statusInfo?.color || '#999'}`
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '8px'
                                                    }}>
                                                        <div style={{
                                                            fontWeight: '700',
                                                            color: statusInfo?.color,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}>
                                                            {statusInfo?.icon}
                                                            {statusInfo?.label}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.85rem',
                                                            color: 'var(--text-muted)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}>
                                                            <Clock size={14} />
                                                            {new Date(history.changed_at).toLocaleDateString('fr-FR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                    {history.notes && (
                                                        <div style={{
                                                            fontSize: '0.9rem',
                                                            color: 'var(--text-muted)',
                                                            fontStyle: 'italic',
                                                            marginTop: '6px',
                                                            padding: '8px',
                                                            background: 'var(--bg-main)',
                                                            borderRadius: '6px'
                                                        }}>
                                                            "{history.notes}"
                                                        </div>
                                                    )}
                                                    {history.changed_by && (
                                                        <div style={{
                                                            fontSize: '0.8rem',
                                                            color: 'var(--text-muted)',
                                                            marginTop: '4px'
                                                        }}>
                                                            Par utilisateur #{history.changed_by}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setViewingOrder(null)}>
                                Fermer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Modal des méthodes de paiement */}
            {paymentModal.show && paymentModal.order && (
                <div className="admin-overlay" onClick={() => setPaymentModal({ show: false, order: null })}>
                    <motion.div
                        className="admin-modal large"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>
                                <CreditCard size={22} style={{ display: 'inline', marginRight: '10px' }} />
                                Méthodes de paiement - Commande #{paymentModal.order.id}
                            </h2>
                            <button className="close-btn" onClick={() => setPaymentModal({ show: false, order: null })}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {/* Info commande minimale */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Client</label>
                                    <div style={{
                                        padding: '12px',
                                        background: 'var(--bg-main)',
                                        borderRadius: '8px',
                                        fontWeight: '600'
                                    }}>
                                        {paymentModal.order.customer_name || 'Client'}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Montant total</label>
                                    <div style={{
                                        padding: '12px',
                                        background: 'var(--bg-main)',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '1.2rem',
                                        color: (() => {
                                            const totalPaid = paymentMethods.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                                            const orderTotal = parseFloat(paymentModal.order.total || 0);
                                            return totalPaid >= orderTotal ? '#10b981' : '#ef4444';
                                        })()
                                    }}>
                                        {parseFloat(paymentModal.order.total || 0).toFixed(2)} DH
                                        {(() => {
                                            const totalPaid = paymentMethods.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                                            const orderTotal = parseFloat(paymentModal.order.total || 0);
                                            if (totalPaid > 0) {
                                                return (
                                                    <div style={{
                                                        fontSize: '0.85rem',
                                                        marginTop: '4px',
                                                        color: totalPaid >= orderTotal ? '#10b981' : '#f59e0b'
                                                    }}>
                                                        Payé: {totalPaid.toFixed(2)} DH ({((totalPaid / orderTotal) * 100).toFixed(0)}%)
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Liste des méthodes de paiement */}
                            {paymentMethods.length > 0 && (
                                <div className="form-group">
                                    <label>Méthodes de paiement renseignées ({paymentMethods.length})</label>
                                    <div style={{
                                        background: 'var(--bg-main)',
                                        borderRadius: '12px',
                                        padding: '15px'
                                    }}>
                                        {paymentMethods.map((payment, index) => (
                                            <div key={payment.id || index} style={{
                                                padding: '12px',
                                                background: 'var(--bg-card)',
                                                borderRadius: '8px',
                                                marginBottom: index < paymentMethods.length - 1 ? '10px' : '0',
                                                borderLeft: `4px solid ${payment.isExisting ? '#10b981' : 'var(--primary)'}`
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '8px'
                                                }}>
                                                    <div style={{
                                                        fontWeight: '700',
                                                        color: 'var(--primary)',
                                                        textTransform: 'uppercase',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}>
                                                        {payment.type}
                                                        {payment.isExisting && (
                                                            <span style={{
                                                                fontSize: '0.7rem',
                                                                background: '#10b981',
                                                                color: 'white',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                fontWeight: '600'
                                                            }}>
                                                                Enregistré
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{
                                                            fontWeight: '700',
                                                            fontSize: '1.1rem',
                                                            color: '#10b981'
                                                        }}>
                                                            {parseFloat(payment.amount).toFixed(2)} DH
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeletePayment(payment)}
                                                            style={{
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                border: '1px solid #ef4444',
                                                                color: '#ef4444',
                                                                borderRadius: '6px',
                                                                padding: '4px 8px',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '0.85rem',
                                                                fontWeight: '600',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.background = '#ef4444';
                                                                e.currentTarget.style.color = 'white';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                                                e.currentTarget.style.color = '#ef4444';
                                                            }}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {payment.bank_code && (
                                                    <div style={{
                                                        fontSize: '0.9rem',
                                                        color: 'var(--text-muted)'
                                                    }}>
                                                        <strong>Code banque:</strong> {payment.bank_code}
                                                    </div>
                                                )}
                                                {payment.payment_date && (
                                                    <div style={{
                                                        fontSize: '0.9rem',
                                                        color: 'var(--text-muted)',
                                                        marginTop: '4px'
                                                    }}>
                                                        <strong>Date:</strong> {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
                                                    </div>
                                                )}
                                                {payment.comment && (
                                                    <div style={{
                                                        fontSize: '0.9rem',
                                                        color: 'var(--text-muted)',
                                                        marginTop: '4px',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        <strong>Commentaire:</strong> {payment.comment}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Formulaire d'ajout */}
                            <div className="form-group">
                                <label>Ajouter une méthode de paiement</label>
                                <div style={{
                                    background: 'var(--bg-main)',
                                    borderRadius: '12px',
                                    padding: '20px'
                                }}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Type de paiement *</label>
                                            <select
                                                value={newPayment.type}
                                                onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border-color)',
                                                    background: 'var(--bg-card)',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                <option value="cash">Cash</option>
                                                <option value="virement">Virement</option>
                                                <option value="cheque">Chèque</option>
                                                <option value="autre">Autre</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Montant * {(() => {
                                                const totalPaid = paymentMethods.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                                                const orderTotal = parseFloat(paymentModal.order.total || 0);
                                                const remaining = orderTotal - totalPaid;
                                                return remaining > 0 ? (
                                                    <span style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: '600' }}>
                                                        (Reste: {remaining.toFixed(2)} DH)
                                                    </span>
                                                ) : null;
                                            })()}</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max={(() => {
                                                    const totalPaid = paymentMethods.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                                                    const orderTotal = parseFloat(paymentModal.order.total || 0);
                                                    return Math.max(0, orderTotal - totalPaid);
                                                })()}
                                                placeholder="0.00"
                                                value={newPayment.amount}
                                                onChange={(e) => {
                                                    const totalPaid = paymentMethods.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                                                    const orderTotal = parseFloat(paymentModal.order.total || 0);
                                                    const remaining = orderTotal - totalPaid;
                                                    const value = parseFloat(e.target.value) || 0;
                                                    if (value <= remaining) {
                                                        setNewPayment({ ...newPayment, amount: e.target.value });
                                                    }
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border-color)',
                                                    background: 'var(--bg-card)',
                                                    fontWeight: '600'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Code de la banque</label>
                                            <select
                                                value={newPayment.bank_code}
                                                onChange={(e) => setNewPayment({ ...newPayment, bank_code: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border-color)',
                                                    background: 'var(--bg-card)',
                                                    color: 'var(--text-main)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="">-- Sélectionner une banque --</option>
                                                {banks && banks.length > 0 ? (
                                                    banks.map(bank => (
                                                        <option key={bank.id} value={bank.code}>
                                                            {bank.code} - {bank.label}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Aucune banque disponible</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Date de paiement</label>
                                            <input
                                                type="date"
                                                value={newPayment.payment_date}
                                                onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border-color)',
                                                    background: 'var(--bg-card)',
                                                    color: 'var(--text-main)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Commentaire ({(newPayment.comment || '').length}/255)</label>
                                            <textarea
                                                placeholder="Ex: Paiement effectué par..."
                                                value={newPayment.comment}
                                                onChange={(e) => setNewPayment({ ...newPayment, comment: e.target.value })}
                                                maxLength="255"
                                                rows="3"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border-color)',
                                                    background: 'var(--bg-card)',
                                                    color: 'var(--text-main)',
                                                    resize: 'vertical',
                                                    fontFamily: 'inherit'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className="save-pill-btn"
                                        onClick={() => {
                                            if (newPayment.type && newPayment.amount) {
                                                setPaymentMethods([...paymentMethods, { ...newPayment, isExisting: false }]);
                                                setNewPayment({ type: 'cash', bank_code: '', amount: '', payment_date: '', comment: '' });
                                            }
                                        }}
                                        disabled={!newPayment.type || !newPayment.amount}
                                        style={{ marginTop: '10px' }}
                                    >
                                        <Plus size={18} /> Ajouter
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="cancel-pill-btn" 
                                onClick={() => {
                                    setPaymentModal({ show: false, order: null });
                                    setPaymentMethods([]);
                                    setNewPayment({ type: 'cash', bank_code: '', label: '', amount: '' });
                                }}
                            >
                                Annuler
                            </button>
                            <button 
                                className="save-pill-btn"
                                onClick={async () => {
                                    const token = sessionStorage.getItem('token');
                                    const orderId = paymentModal.order.id;
                                    
                                    // Filtrer uniquement les nouveaux paiements (pas encore enregistrés)
                                    const newPaymentsToSave = paymentMethods.filter(p => !p.isExisting);
                                    
                                    if (newPaymentsToSave.length === 0) {
                                        showToast('Aucun nouveau paiement à enregistrer', 'info');
                                        setPaymentModal({ show: false, order: null });
                                        setPaymentMethods([]);
                                        setNewPayment({ type: 'cash', bank_code: '', amount: '', payment_date: '', comment: '' });
                                        return;
                                    }
                                    
                                    setIsSavingPayment(true);
                                    try {
                                        // Envoyer chaque nouvelle méthode de paiement au backend
                                        for (const payment of newPaymentsToSave) {
                                            // Trouver l'ID de la banque à partir du code
                                            const bank = banks.find(b => b.code === payment.bank_code);
                                            
                                            const paymentData = {
                                                bank_id: bank ? bank.id : null,
                                                payment_method: payment.type.toUpperCase(),
                                                amount: parseFloat(payment.amount),
                                                payment_date: payment.payment_date || null,
                                                notes: payment.comment || null
                                            };
                                            
                                            await orderService.addPaymentToOrder(orderId, paymentData, token);
                                        }
                                        
                                        showToast(`${newPaymentsToSave.length} paiement(s) enregistré(s) avec succès`, 'success');
                                        setPaymentModal({ show: false, order: null });
                                        setPaymentMethods([]);
                                        setNewPayment({ type: 'cash', bank_code: '', amount: '', payment_date: '', comment: '' });
                                        
                                        // Recharger les commandes pour mettre à jour l'affichage
                                        dispatch(getOrdersByUser(token));
                                    } catch (error) {
                                        showToast('Erreur lors de l\'enregistrement des paiements', 'error');
                                    } finally {
                                        setIsSavingPayment(false);
                                    }
                                }}
                                disabled={paymentMethods.filter(p => !p.isExisting).length === 0 || isSavingPayment}
                            >
                                {isSavingPayment ? (
                                    <>
                                        <Loader2 size={18} className="spinning" style={{ animation: 'spin 1s linear infinite' }} />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} /> Enregistrer {paymentMethods.filter(p => !p.isExisting).length > 0 && `(${paymentMethods.filter(p => !p.isExisting).length})`}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Modal de modification de remise */}
            {discountModal.show && discountModal.order && (
                <div className="admin-overlay" onClick={() => setDiscountModal({ show: false, order: null })}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>
                                <Edit2 size={22} style={{ display: 'inline', marginRight: '10px' }} />
                                Modifier la remise - Commande #{discountModal.order.id}
                            </h2>
                            <button className="close-btn" onClick={() => setDiscountModal({ show: false, order: null })}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>
                                    Montant de la remise jusqu'à 100 (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    placeholder="0.00 %"
                                    value={discountData.discount_amount}
                                    onChange={(e) => setDiscountData({ ...discountData, discount_amount: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-card)',
                                        fontWeight: '600',
                                        fontSize: '1.1rem'
                                    }}
                                />
                            </div>
                            <div style={{
                                padding: '12px',
                                background: 'var(--bg-main)',
                                borderRadius: '8px',
                                marginTop: '15px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Sous-total:</span>
                                    <span style={{ fontWeight: '600' }}>{parseFloat(discountModal.order.subtotal || 0).toFixed(2)} DH</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Remise:</span>
                                    <span style={{ fontWeight: '600', color: '#ef4444' }}>
                                        {(() => {
                                            const amount = parseFloat(discountData.discount_amount) || 0;
                                            const subtotal = parseFloat(discountModal.order.subtotal || 0);
                                            return `- ${((subtotal * amount) / 100).toFixed(2)} DH (${amount}%)`;
                                        })()}
                                    </span>
                                </div>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    paddingTop: '8px',
                                    borderTop: '2px solid var(--border-color)'
                                }}>
                                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total:</span>
                                    <span style={{ fontWeight: '700', fontSize: '1.3rem', color: '#10b981' }}>
                                        {(() => {
                                            const amount = parseFloat(discountData.discount_amount) || 0;
                                            const subtotal = parseFloat(discountModal.order.subtotal || 0);
                                            const discount = (subtotal * amount) / 100;
                                            return Math.max(0, subtotal - discount).toFixed(2);
                                        })()} DH
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="cancel-pill-btn" 
                                onClick={() => setDiscountModal({ show: false, order: null })}
                            >
                                Annuler
                            </button>
                            <button 
                                className="save-pill-btn"
                                onClick={handleUpdateDiscount}
                            >
                                <Save size={18} /> Enregistrer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Modal de commentaire pour changement de statut */}
            {statusChangeModal.show && (
                <div className="admin-overlay">
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Changer le statut de la commande</h2>
                            <button 
                                className="close-btn" 
                                onClick={() => {
                                    setStatusChangeModal({ show: false, orderId: null, newStatus: null });
                                    setStatusComment('');
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nouveau statut</label>
                                <div style={{
                                    padding: '12px',
                                    background: 'var(--bg-main)',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    color: ORDER_STATUSES.find(s => s.value === statusChangeModal.newStatus)?.color
                                }}>
                                    {ORDER_STATUSES.find(s => s.value === statusChangeModal.newStatus)?.label}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Commentaire <span style={{ color: '#ef4444' }}>*</span></label>
                                <textarea
                                    className="admin-textarea"
                                    placeholder="Ajoutez un commentaire pour ce changement de statut..."
                                    value={statusComment}
                                    onChange={(e) => setStatusComment(e.target.value)}
                                    rows={4}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="cancel-pill-btn" 
                                onClick={() => {
                                    setStatusChangeModal({ show: false, orderId: null, newStatus: null });
                                    setStatusComment('');
                                }}
                            >
                                Annuler
                            </button>
                            <button 
                                className="save-pill-btn" 
                                onClick={confirmStatusChange}
                                disabled={!statusComment.trim()}
                            >
                                <CheckCircle2 size={18} /> Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        className={`toast-notification ${toastType}`}
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        transition={{ duration: 0.3 }}
                    >
                        {toastType === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PO Details Modal */}
            {viewingPO && (
                <div className="admin-overlay" onClick={() => setViewingPO(null)}>
                    <motion.div
                        className="admin-modal large"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>Détails Commande PO-{viewingPO.id}</h3>
                            <button onClick={() => setViewingPO(null)} className="close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Fournisseur</label>
                                    <input type="text" value={viewingPO.supplier_name || 'N/A'} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Entrepôt</label>
                                    <input type="text" value={`${viewingPO.warehouse_id || 'N/A'}`} disabled />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Statut</label>
                                    <select
                                        value={viewingPO.status}
                                        onChange={(e) => {
                                            setViewingPO({ ...viewingPO, status: e.target.value });
                                            if (sessionStorage.getItem('token')) {
                                                dispatch(updatePurchaseOrderStatus({ id: viewingPO.id, status: e.target.value, token: sessionStorage.getItem('token') }));
                                            }
                                        }}
                                    >
                                        <option value="draft">Brouillon</option>
                                        <option value="sent">Envoyée</option>
                                        <option value="received">Reçue</option>
                                        <option value="cancelled">Annulée</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Montant Total</label>
                                    <input type="text" value={new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(viewingPO.total_amount || 0)} disabled />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Notes</label>
                                <textarea value={viewingPO.notes || ''} disabled rows="3" />
                            </div>

                            {/* Items Section */}
                            <div className="po-details-items">
                                <h4>Articles ({(viewingPO.lines?.length || viewingPO.items?.length) || 0})</h4>
                                {(viewingPO.lines && viewingPO.lines.length > 0) || (viewingPO.items && viewingPO.items.length > 0) ? (
                                    <table className="po-items-table">
                                        <thead>
                                            <tr>
                                                <th>Produit</th>
                                                <th>Quantité</th>
                                                <th>Prix Unitaire</th>
                                                <th>Total</th>
                                                {(viewingPO.lines?.length > 0) && <th>Quantité Reçue</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(viewingPO.lines || viewingPO.items || []).map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.product_name || 'N/A'}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.unit_price || 0)}</td>
                                                    <td className="amount">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((item.quantity || 0) * (item.unit_price || 0))}</td>
                                                    {(viewingPO.lines?.length > 0) && <td>{item.received_quantity || 0}</td>}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="no-data">Aucun article dans cette commande</p>
                                )}
                            </div>

                            {/* History Section */}
                            <div className="po-details-history">
                                <h4>Historique</h4>
                                {poHistoryState && poHistoryState.length > 0 ? (
                                    <div className="history-timeline">
                                        {poHistoryState.map((event, idx) => (
                                            <div key={idx} className="history-item">
                                                <div className="history-dot"></div>
                                                <div className="history-content">
                                                    <div className="history-action">{event.action || 'Mise à jour'}</div>
                                                    <div className="history-date">{new Date(event.created_at || event.timestamp).toLocaleDateString('fr-FR')}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-data">Aucun historique disponible</p>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setViewingPO(null)} className="btn-cancel">
                                Fermer
                            </button>
                            {viewingPO.status === 'sent' && (
                            <button
                                onClick={() => {
                                    setIsReceivingPO(viewingPO.id);
                                    setViewingPO(null);
                                }}
                                className="btn-save"
                            >
                                <CheckCircle2 size={16} /> Réceptionner
                            </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete PO Confirmation Modal */}
            {deletingPO && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '400px' }}
                    >
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.1rem' }}>Confirmer la suppression</h2>
                            <button className="close-btn" onClick={() => setDeletingPO(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '15px 20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    margin: '0 auto 12px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Trash2 size={22} color="#ef4444" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Voulez-vous vraiment supprimer cette commande d'achat ?<br />
                                    Cette action est irréversible.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setDeletingPO(null)}>
                                Annuler
                            </button>
                            <button
                                className="save-pill-btn"
                                onClick={confirmDeletePurchaseOrder}
                                style={{ background: '#ef4444' }}
                            >
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Receive PO Modal */}
            {isReceivingPO && (
                <div className="admin-overlay" onClick={() => setIsReceivingPO(false)}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>Réceptionner Commande</h3>
                            <button onClick={() => setIsReceivingPO(false)} className="close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Confirmer la réception de la commande PO-{isReceivingPO}?</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px' }}>
                                Cela mettra à jour le statut en "Reçue" et ajustera les stocks de l'entrepôt.
                            </p>
                            <div className="po-receive-items">
                                <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Articles à Réceptionner</h4>
                                {purchaseOrders.find(po => po.id === isReceivingPO)?.items?.map((item, idx) => (
                                    <div key={idx} className="receive-item">
                                        <div className="receive-item-info">
                                            <div className="receive-item-name">{item.product_name}</div>
                                            <div className="receive-item-qty">Quantité: {item.quantity}</div>
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            max={item.quantity}
                                            placeholder="Reçu"
                                            value={poReceiveItems[item.id] || ''}
                                            onChange={(e) => setPoReceiveItems({ ...poReceiveItems, [item.id]: parseInt(e.target.value) || 0 })}
                                            className="receive-qty-input"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setIsReceivingPO(false)} className="btn-cancel">
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    dispatch(receivePurchaseOrder({ 
                                        id: isReceivingPO, 
                                        receivedItems: poReceiveItems, 
                                        token: sessionStorage.getItem('token') 
                                    }));
                                    showToast('Commande reçue avec succès', 'success');
                                    setIsReceivingPO(false);
                                    setPoReceiveItems({});
                                }}
                                className="btn-save"
                            >
                                <CheckCircle2 size={16} /> Confirmer Réception
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Create Warehouse Modal */}
            {isCreatingWarehouse && (
                <div className="admin-overlay" onClick={() => { setIsCreatingWarehouse(false); setNewWarehouse({ name: '', location: '', city: '', capacity: 0, is_active: true }); }}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3><Building2 size={20} style={{ marginRight: '10px' }} />Nouvel Entrepôt</h3>
                            <button onClick={() => { setIsCreatingWarehouse(false); setNewWarehouse({ name: '', location: '', city: '', capacity: 0, is_active: true }); }} className="close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom de l'Entrepôt</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Entrepôt Principal"
                                    value={newWarehouse.name}
                                    onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Localisation</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 123 Rue de Paris"
                                    value={newWarehouse.location}
                                    onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ville</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Paris"
                                        value={newWarehouse.city}
                                        onChange={(e) => setNewWarehouse({ ...newWarehouse, city: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Capacité (unités)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={newWarehouse.capacity}
                                        onChange={(e) => setNewWarehouse({ ...newWarehouse, capacity: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newWarehouse.is_active}
                                        onChange={(e) => setNewWarehouse({ ...newWarehouse, is_active: e.target.checked })}
                                    />
                                    <span style={{ marginLeft: '8px' }}>Entrepôt actif</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                onClick={() => { setIsCreatingWarehouse(false); setNewWarehouse({ name: '', location: '', city: '', capacity: 0, is_active: true }); }} 
                                className="btn-cancel"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    if (newWarehouse.name && newWarehouse.location && newWarehouse.city && newWarehouse.capacity > 0) {
                                        dispatch(createWarehouse({ warehouseData: newWarehouse, token: sessionStorage.getItem('token') }));
                                        setNewWarehouse({ name: '', location: '', city: '', capacity: 0, is_active: true });
                                        setIsCreatingWarehouse(false);
                                        showToast('Entrepôt créé avec succès', 'success');
                                        setTimeout(() => dispatch(getAllWarehouses(sessionStorage.getItem('token'))), 500);
                                    } else {
                                        showToast('Veuillez remplir tous les champs correctement', 'error');
                                    }
                                }}
                                className="btn-save"
                            >
                                <Save size={16} /> Créer Entrepôt
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Warehouse Modal */}
            {editingWarehouse && (
                <div className="admin-overlay" onClick={() => setEditingWarehouse(null)}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3><Building2 size={20} style={{ marginRight: '10px' }} />Modifier l'Entrepôt</h3>
                            <button disabled={isSavingWarehouse} onClick={() => setEditingWarehouse(null)} className="close-btn" style={{ opacity: isSavingWarehouse ? 0.6 : 1, cursor: isSavingWarehouse ? 'not-allowed' : 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom de l'Entrepôt</label>
                                <input
                                    disabled={isSavingWarehouse}
                                    type="text"
                                    placeholder="Ex: Entrepôt Principal"
                                    value={editingWarehouse.name}
                                    onChange={(e) => setEditingWarehouse({ ...editingWarehouse, name: e.target.value })}
                                    style={{ opacity: isSavingWarehouse ? 0.6 : 1, cursor: isSavingWarehouse ? 'not-allowed' : 'default' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Localisation</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 123 Rue de Paris"
                                    value={editingWarehouse.location}
                                    onChange={(e) => setEditingWarehouse({ ...editingWarehouse, location: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ville</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Paris"
                                        value={editingWarehouse.city}
                                        onChange={(e) => setEditingWarehouse({ ...editingWarehouse, city: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Capacité (unités)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={editingWarehouse.capacity}
                                        onChange={(e) => setEditingWarehouse({ ...editingWarehouse, capacity: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editingWarehouse.is_active}
                                        onChange={(e) => setEditingWarehouse({ ...editingWarehouse, is_active: e.target.checked })}
                                    />
                                    <span style={{ marginLeft: '8px' }}>Entrepôt actif</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                disabled={isSavingWarehouse}
                                onClick={() => setEditingWarehouse(null)} 
                                className="btn-cancel"
                                style={{ opacity: isSavingWarehouse ? 0.6 : 1, cursor: isSavingWarehouse ? 'not-allowed' : 'pointer' }}
                            >
                                Annuler
                            </button>
                            <button
                                disabled={isSavingWarehouse}
                                onClick={() => {
                                    if (editingWarehouse.name && editingWarehouse.location && editingWarehouse.city && editingWarehouse.capacity > 0) {
                                        setIsSavingWarehouse(true);
                                        dispatch(updateWarehouse({ id: editingWarehouse.id, warehouseData: editingWarehouse, token: sessionStorage.getItem('token') }));
                                        setTimeout(() => {
                                            setEditingWarehouse(null);
                                            setIsSavingWarehouse(false);
                                            showToast('Entrepôt modifié avec succès', 'success');
                                            dispatch(getAllWarehouses(sessionStorage.getItem('token')));
                                        }, 500);
                                    } else {
                                        showToast('Veuillez remplir tous les champs correctement', 'error');
                                    }
                                }}
                                className="btn-save"
                                style={{ opacity: isSavingWarehouse ? 0.6 : 1, cursor: isSavingWarehouse ? 'not-allowed' : 'pointer' }}
                            >
                                {isSavingWarehouse ? <Loader size={16} style={{animation: 'spin 1s linear infinite', marginRight: '8px'}} /> : <Save size={16} style={{marginRight: '8px'}} />} {isSavingWarehouse ? 'En cours...' : 'Enregistrer les modifications'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Warehouse Confirmation Modal */}
            {deletingWarehouse && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '400px' }}
                    >
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.1rem' }}>Confirmer la suppression</h2>
                            <button className="close-btn" onClick={() => setDeletingWarehouse(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '15px 20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    margin: '0 auto 12px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Trash2 size={22} color="#ef4444" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Voulez-vous vraiment supprimer cet entrep\u00f4t ?<br />
                                    Cette action est irr\u00e9versible.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setDeletingWarehouse(null)}>
                                Annuler
                            </button>
                            <button
                                className="save-pill-btn"
                                onClick={confirmDeleteWarehouse}
                                style={{ background: '#ef4444' }}
                            >
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Create Supplier Modal */}
            {isCreatingSupplier && (
                <div className="admin-overlay" onClick={() => { setIsCreatingSupplier(false); setNewSupplier({ name: '', email: '', phone: '', address: '', city: '', postal_code: '', country: '', payment_terms: '', is_active: true }); }}>
                    <motion.div
                        className="admin-modal large"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3><Factory size={20} style={{ marginRight: '10px' }} />Nouveau Fournisseur</h3>
                            <button onClick={() => { setIsCreatingSupplier(false); setNewSupplier({ name: '', email: '', phone: '', address: '', city: '', postal_code: '', country: '', payment_terms: '', is_active: true }); }} className="close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom de l'Entreprise *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: AMS Foods Supplier"
                                    value={newSupplier.name}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="contact@supplier.com"
                                        value={newSupplier.email}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Téléphone</label>
                                    <input
                                        type="tel"
                                        placeholder="01 23 45 67 89"
                                        value={newSupplier.phone}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Adresse</label>
                                <input
                                    type="text"
                                    placeholder="123 Rue de la Paix"
                                    value={newSupplier.address}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ville</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Paris"
                                        value={newSupplier.city}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, city: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Code Postal</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 75001"
                                        value={newSupplier.postal_code}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, postal_code: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Pays</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: France"
                                        value={newSupplier.country}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Conditions de Paiement</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Net 30"
                                        value={newSupplier.payment_terms}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, payment_terms: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newSupplier.is_active}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, is_active: e.target.checked })}
                                    />
                                    <span style={{ marginLeft: '8px' }}>Fournisseur actif</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                onClick={() => { setIsCreatingSupplier(false); setNewSupplier({ name: '', email: '', phone: '', address: '', city: '', postal_code: '', country: '', payment_terms: '', is_active: true }); }} 
                                className="btn-cancel"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    if (newSupplier.name) {
                                        dispatch(createSupplier({ supplierData: newSupplier, token: sessionStorage.getItem('token') }));
                                        setNewSupplier({ name: '', email: '', phone: '', address: '', city: '', postal_code: '', country: '', payment_terms: '', is_active: true });
                                        setIsCreatingSupplier(false);
                                        showToast('Fournisseur créé avec succès', 'success');
                                        setTimeout(() => dispatch(getAllSuppliers(sessionStorage.getItem('token'))), 500);
                                    } else {
                                        showToast('Le nom du fournisseur est requis', 'error');
                                    }
                                }}
                                className="btn-save"
                            >
                                <Save size={16} /> Créer Fournisseur
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Supplier Modal */}
            {editingSupplier && (
                <div className="admin-overlay" onClick={() => setEditingSupplier(null)}>
                    <motion.div
                        className="admin-modal large"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3><Factory size={20} style={{ marginRight: '10px' }} />Modifier le Fournisseur</h3>
                            <button 
                                disabled={isSavingSupplier}
                                onClick={() => setEditingSupplier(null)} 
                                className="close-btn"
                                style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom de l'Entreprise *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: AMS Foods Supplier"
                                    value={editingSupplier.name}
                                    onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                                    disabled={isSavingSupplier}
                                    style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'default' }}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="contact@supplier.com"
                                        value={editingSupplier.email || ''}
                                        onChange={(e) => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                                        disabled={isSavingSupplier}
                                        style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'default' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Téléphone</label>
                                    <input
                                        type="tel"
                                        placeholder="01 23 45 67 89"
                                        value={editingSupplier.phone || ''}
                                        onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                                        disabled={isSavingSupplier}
                                        style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'default' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Adresse</label>
                                <input
                                    type="text"
                                    placeholder="123 Rue de la Paix"
                                    value={editingSupplier.address || ''}
                                    onChange={(e) => setEditingSupplier({ ...editingSupplier, address: e.target.value })}
                                    disabled={isSavingSupplier}
                                    style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'default' }}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ville</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Paris"
                                        value={editingSupplier.city || ''}
                                        onChange={(e) => setEditingSupplier({ ...editingSupplier, city: e.target.value })}
                                        disabled={isSavingSupplier}
                                        style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'default' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Code Postal</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 75001"
                                        value={editingSupplier.postal_code || ''}
                                        onChange={(e) => setEditingSupplier({ ...editingSupplier, postal_code: e.target.value })}
                                        disabled={isSavingSupplier}
                                        style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'default' }}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Pays</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: France"
                                        value={editingSupplier.country || ''}
                                        onChange={(e) => setEditingSupplier({ ...editingSupplier, country: e.target.value })}
                                        disabled={isSavingSupplier}
                                        style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'default' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Conditions de Paiement</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Net 30"
                                        value={editingSupplier.payment_terms || ''}
                                        onChange={(e) => setEditingSupplier({ ...editingSupplier, payment_terms: e.target.value })}
                                        disabled={isSavingSupplier}
                                        style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'default' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editingSupplier.is_active}
                                        onChange={(e) => setEditingSupplier({ ...editingSupplier, is_active: e.target.checked })}
                                        disabled={isSavingSupplier}
                                    />
                                    <span style={{ marginLeft: '8px', opacity: isSavingSupplier ? 0.6 : 1 }}>Fournisseur actif</span>
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                disabled={isSavingSupplier}
                                onClick={() => setEditingSupplier(null)} 
                                className="btn-cancel"
                                style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'pointer' }}
                            >
                                Annuler
                            </button>
                            <button
                                disabled={isSavingSupplier}
                                onClick={() => {
                                    if (editingSupplier.name) {
                                        setIsSavingSupplier(true);
                                        dispatch(updateSupplier({ id: editingSupplier.id, supplierData: editingSupplier, token: sessionStorage.getItem('token') }));
                                        setTimeout(() => {
                                            setEditingSupplier(null);
                                            setIsSavingSupplier(false);
                                            showToast('Fournisseur modifié avec succès', 'success');
                                            dispatch(getAllSuppliers(sessionStorage.getItem('token')));
                                        }, 500);
                                    } else {
                                        showToast('Le nom du fournisseur est requis', 'error');
                                    }
                                }}
                                className="btn-save"
                                style={{ opacity: isSavingSupplier ? 0.6 : 1, cursor: isSavingSupplier ? 'not-allowed' : 'pointer' }}
                            >
                                {isSavingSupplier ? <Loader size={16} style={{animation: 'spin 1s linear infinite', marginRight: '8px'}} /> : <Save size={16} style={{marginRight: '8px'}} />} {isSavingSupplier ? 'En cours...' : 'Enregistrer les modifications'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Supplier Confirmation Modal */}
            {deletingSupplier && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '400px' }}
                    >
                        <div className="modal-header">
                            <h2 style={{ fontSize: '1.1rem' }}>Confirmer la suppression</h2>
                            <button className="close-btn" onClick={() => setDeletingSupplier(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '15px 20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    margin: '0 auto 12px',
                                    borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Trash2 size={22} color="#ef4444" />
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    Voulez-vous vraiment supprimer ce fournisseur ?<br />
                                    Cette action est irréversible.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setDeletingSupplier(null)}>
                                Annuler
                            </button>
                            <button
                                className="save-pill-btn"
                                onClick={confirmDeleteSupplier}
                                style={{ background: '#ef4444' }}
                            >
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Create Customer Return Modal */}
            {isCreatingCustomerReturn && (
                <div className="admin-overlay" onClick={() => { setIsCreatingCustomerReturn(false); setNewCustomerReturn({ order_id: '', product_id: '', quantity_returned: 0, reason: '', notes: '' }); setCustomerReturnProductSearch(''); setIsCustomerReturnProductSearching(false); }}>
                    <motion.div className="admin-modal large" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                        <div className="modal-header">
                            <h3><RotateCcw size={20} style={{ marginRight: '10px' }} />Créer un Retour Client</h3>
                            <button onClick={() => { setIsCreatingCustomerReturn(false); setNewCustomerReturn({ order_id: '', product_id: '', quantity_returned: 0, reason: '', notes: '' }); setCustomerReturnProductSearch(''); setIsCustomerReturnProductSearching(false); }} className="close-btn">✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Numéro de Commande *</label>
                                <input type="text" placeholder="ex: ORD-892" value={newCustomerReturn.order_id} onChange={(e) => setNewCustomerReturn({ ...newCustomerReturn, order_id: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Produit *</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Rechercher un produit..." 
                                        value={customerReturnProductSearch} 
                                        onChange={(e) => setCustomerReturnProductSearch(e.target.value)}
                                        onFocus={() => setIsCustomerReturnProductSearching(true)}
                                        onBlur={() => setTimeout(() => setIsCustomerReturnProductSearching(false), 200)}
                                        style={{ width: '100%' }}
                                    />
                                    {isCustomerReturnProductSearching && customerReturnProductSearch && products?.filter(p => p.name.toLowerCase().includes(customerReturnProductSearch.toLowerCase())).length > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            background: 'white',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '4px',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            zIndex: 1000,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}>
                                            {products.filter(p => p.name.toLowerCase().includes(customerReturnProductSearch.toLowerCase())).map(product => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => {
                                                        setNewCustomerReturn({ ...newCustomerReturn, product_id: product.id });
                                                        setCustomerReturnProductSearch(product.name);
                                                        setIsCustomerReturnProductSearching(false);
                                                    }}
                                                    style={{
                                                        padding: '10px 12px',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid var(--border-color)',
                                                        hover: { background: 'var(--bg-hover)' }
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                                >
                                                    {product.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input 
                                    type="hidden" 
                                    value={newCustomerReturn.product_id}
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantité Retournée *</label>
                                <input type="number" min="1" value={newCustomerReturn.quantity_returned} onChange={(e) => setNewCustomerReturn({ ...newCustomerReturn, quantity_returned: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="form-group">
                                <label>Raison du Retour *</label>
                                <select value={newCustomerReturn.reason} onChange={(e) => setNewCustomerReturn({ ...newCustomerReturn, reason: e.target.value })}>
                                    <option value="">Sélectionner une raison</option>
                                    <option value="Produit expiré">Produit expiré</option>
                                    <option value="Produit défectueux">Produit défectueux</option>
                                    <option value="Quantité incorrecte">Quantité incorrecte</option>
                                    <option value="Mauvais produit">Mauvais produit</option>
                                    <option value="Droit de rétractation">Droit de rétractation</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Notes (Optionnel)</label>
                                <textarea placeholder="Détails supplémentaires..." value={newCustomerReturn.notes} onChange={(e) => setNewCustomerReturn({ ...newCustomerReturn, notes: e.target.value })} rows="3"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => { setIsCreatingCustomerReturn(false); setNewCustomerReturn({ order_id: '', product_id: '', quantity_returned: 0, reason: '', notes: '' }); setCustomerReturnProductSearch(''); setIsCustomerReturnProductSearching(false); }} className="btn-cancel">Annuler</button>
                            <button onClick={() => {
                                if (newCustomerReturn.order_id && newCustomerReturn.product_id && newCustomerReturn.quantity_returned > 0 && newCustomerReturn.reason) {
                                    dispatch(createCustomerReturn({ returnData: { ...newCustomerReturn, return_number: `RET-CUS-${Math.floor(Math.random() * 10000)}`, customer_name: 'Client', refund_amount: 0, refund_status: 'pending', status: 'pending', created_at: new Date().toISOString().split('T')[0] }, token: sessionStorage.getItem('token') }));
                                    setNewCustomerReturn({ order_id: '', product_id: '', quantity_returned: 0, reason: '', notes: '' });
                                    setCustomerReturnProductSearch('');
                                    setIsCustomerReturnProductSearching(false);
                                    setIsCreatingCustomerReturn(false);
                                    showToast('Retour client créé avec succès', 'success');
                                } else {
                                    showToast('Veuillez remplir tous les champs requis', 'error');
                                }
                            }} className="btn-save"><Save size={16} /> Créer Retour</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Create Supplier Return Modal */}
            {isCreatingSupplierReturn && (
                <div className="admin-overlay" onClick={() => { setIsCreatingSupplierReturn(false); setNewSupplierReturn({ po_id: '', product_id: '', quantity_returned: 0, reason: '', notes: '' }); setSupplierReturnProductSearch(''); setIsSupplierReturnProductSearching(false); }}>
                    <motion.div className="admin-modal large" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                        <div className="modal-header">
                            <h3><RotateCcw size={20} style={{ marginRight: '10px' }} />Créer un Retour Fournisseur</h3>
                            <button onClick={() => { setIsCreatingSupplierReturn(false); setNewSupplierReturn({ po_id: '', product_id: '', quantity_returned: 0, reason: '', notes: '' }); setSupplierReturnProductSearch(''); setIsSupplierReturnProductSearching(false); }} className="close-btn">✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Numéro de Commande Achat *</label>
                                <input type="text" placeholder="ex: PO-001" value={newSupplierReturn.po_id} onChange={(e) => setNewSupplierReturn({ ...newSupplierReturn, po_id: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Produit *</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Rechercher un produit..." 
                                        value={supplierReturnProductSearch} 
                                        onChange={(e) => setSupplierReturnProductSearch(e.target.value)}
                                        onFocus={() => setIsSupplierReturnProductSearching(true)}
                                        onBlur={() => setTimeout(() => setIsSupplierReturnProductSearching(false), 200)}
                                        style={{ width: '100%' }}
                                    />
                                    {isSupplierReturnProductSearching && supplierReturnProductSearch && products?.filter(p => p.name.toLowerCase().includes(supplierReturnProductSearch.toLowerCase())).length > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            background: 'white',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '4px',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            zIndex: 1000,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}>
                                            {products.filter(p => p.name.toLowerCase().includes(supplierReturnProductSearch.toLowerCase())).map(product => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => {
                                                        setNewSupplierReturn({ ...newSupplierReturn, product_id: product.id });
                                                        setSupplierReturnProductSearch(product.name);
                                                        setIsSupplierReturnProductSearching(false);
                                                    }}
                                                    style={{
                                                        padding: '10px 12px',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid var(--border-color)',
                                                        hover: { background: 'var(--bg-hover)' }
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                                >
                                                    {product.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input 
                                    type="hidden" 
                                    value={newSupplierReturn.product_id}
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantité Retournée *</label>
                                <input type="number" min="1" value={newSupplierReturn.quantity_returned} onChange={(e) => setNewSupplierReturn({ ...newSupplierReturn, quantity_returned: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="form-group">
                                <label>Raison du Retour *</label>
                                <select value={newSupplierReturn.reason} onChange={(e) => setNewSupplierReturn({ ...newSupplierReturn, reason: e.target.value })}>
                                    <option value="">Sélectionner une raison</option>
                                    <option value="Qualité insuffisante">Qualité insuffisante</option>
                                    <option value="Date expiration trop proche">Date expiration trop proche</option>
                                    <option value="Produit cassé/défectueux">Produit cassé/défectueux</option>
                                    <option value="Erreur de formulaire">Erreur de formulaire</option>
                                    <option value="Double envoi">Double envoi</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Notes (Optionnel)</label>
                                <textarea placeholder="Détails supplémentaires..." value={newSupplierReturn.notes} onChange={(e) => setNewSupplierReturn({ ...newSupplierReturn, notes: e.target.value })} rows="3"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => { setIsCreatingSupplierReturn(false); setNewSupplierReturn({ po_id: '', product_id: '', quantity_returned: 0, reason: '', notes: '' }); setSupplierReturnProductSearch(''); setIsSupplierReturnProductSearching(false); }} className="btn-cancel">Annuler</button>
                            <button onClick={() => {
                                if (newSupplierReturn.po_id && newSupplierReturn.product_id && newSupplierReturn.quantity_returned > 0 && newSupplierReturn.reason) {
                                    dispatch(createSupplierReturn({ returnData: { ...newSupplierReturn, return_number: `RET-SUP-${Math.floor(Math.random() * 10000)}`, supplier_name: 'Fournisseur', credit_amount: 0, credit_status: 'pending', status: 'pending', created_at: new Date().toISOString().split('T')[0] }, token: sessionStorage.getItem('token') }));
                                    setNewSupplierReturn({ po_id: '', product_id: '', quantity_returned: 0, reason: '', notes: '' });
                                    setSupplierReturnProductSearch('');
                                    setIsSupplierReturnProductSearching(false);
                                    setIsCreatingSupplierReturn(false);
                                    showToast('Retour fournisseur créé avec succès', 'success');
                                } else {
                                    showToast('Veuillez remplir tous les champs requis', 'error');
                                }
                            }} className="btn-save"><Save size={16} /> Créer Retour</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Customer Return Details Modal */}
            {viewingCustomerReturn && (
                <div className="admin-overlay" onClick={() => setViewingCustomerReturn(null)}>
                    <motion.div className="admin-modal large" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                        <div className="modal-header">
                            <h3><RotateCcw size={20} style={{ marginRight: '10px' }} />Détails Retour Client</h3>
                            <button onClick={() => setViewingCustomerReturn(null)} className="close-btn">✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '5px' }}>Numéro Retour</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewingCustomerReturn.return_number}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '5px' }}>Client</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewingCustomerReturn.customer_name}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '5px' }}>Commande</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewingCustomerReturn.order_id}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '5px' }}>Statut</div>
                                    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', background: viewingCustomerReturn.status === 'approved' ? '#d1fae5' : viewingCustomerReturn.status === 'received' ? '#dbeafe' : '#fef3c7', color: viewingCustomerReturn.status === 'approved' ? '#065f46' : viewingCustomerReturn.status === 'received' ? '#0c4a6e' : '#78350f' }}>{viewingCustomerReturn.status}</span>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginBottom: '15px' }}>
                                <h4 style={{ marginBottom: '10px' }}>Produit</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nom</div>
                                        <div style={{ fontWeight: '600' }}>{viewingCustomerReturn.product_name}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Quantité</div>
                                        <div style={{ fontWeight: '600' }}>{viewingCustomerReturn.quantity_returned}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Raison</div>
                                        <div style={{ fontWeight: '600' }}>{viewingCustomerReturn.reason}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginBottom: '15px' }}>
                                <h4 style={{ marginBottom: '10px' }}>Remboursement</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Montant</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>{viewingCustomerReturn.refund_amount.toFixed(2)} DH</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Statut Remboursement</div>
                                        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', background: viewingCustomerReturn.refund_status === 'processed' ? '#d1fae5' : '#fef3c7', color: viewingCustomerReturn.refund_status === 'processed' ? '#065f46' : '#78350f' }}>{viewingCustomerReturn.refund_status}</span>
                                    </div>
                                </div>
                            </div>

                            {viewingCustomerReturn.notes && (
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginBottom: '15px' }}>
                                    <h4 style={{ marginBottom: '10px' }}>Notes</h4>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{viewingCustomerReturn.notes}</p>
                                </div>
                            )}

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Date Création</div>
                                        <div style={{ fontWeight: '600' }}>{viewingCustomerReturn.created_at}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Dernière Modification</div>
                                        <div style={{ fontWeight: '600' }}>{viewingCustomerReturn.updated_at}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <select value={viewingCustomerReturn.status} onChange={(e) => setViewingCustomerReturn({ ...viewingCustomerReturn, status: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                <option value="pending">En attente</option>
                                <option value="approved">Approuvé</option>
                                <option value="received">Reçu</option>
                            </select>
                            <button onClick={() => setViewingCustomerReturn(null)} className="btn-cancel">Fermer</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Supplier Return Details Modal */}
            {viewingSupplierReturn && (
                <div className="admin-overlay" onClick={() => setViewingSupplierReturn(null)}>
                    <motion.div className="admin-modal large" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                        <div className="modal-header">
                            <h3><RotateCcw size={20} style={{ marginRight: '10px' }} />Détails Retour Fournisseur</h3>
                            <button onClick={() => setViewingSupplierReturn(null)} className="close-btn">✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '5px' }}>Numéro Retour</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewingSupplierReturn.return_number}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '5px' }}>Fournisseur</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewingSupplierReturn.supplier_name}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '5px' }}>Commande Achat</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewingSupplierReturn.po_id}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '5px' }}>Statut</div>
                                    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', background: viewingSupplierReturn.status === 'sent' ? '#bfdbfe' : viewingSupplierReturn.status === 'received' ? '#d1fae5' : '#fef3c7', color: viewingSupplierReturn.status === 'sent' ? '#1e3a8a' : viewingSupplierReturn.status === 'received' ? '#065f46' : '#78350f' }}>{viewingSupplierReturn.status}</span>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginBottom: '15px' }}>
                                <h4 style={{ marginBottom: '10px' }}>Produit</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nom</div>
                                        <div style={{ fontWeight: '600' }}>{viewingSupplierReturn.product_name}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Quantité</div>
                                        <div style={{ fontWeight: '600' }}>{viewingSupplierReturn.quantity_returned}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Raison</div>
                                        <div style={{ fontWeight: '600' }}>{viewingSupplierReturn.reason}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginBottom: '15px' }}>
                                <h4 style={{ marginBottom: '10px' }}>Crédit Fournisseur</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Montant</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>{viewingSupplierReturn.credit_amount.toFixed(2)} DH</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Statut Crédit</div>
                                        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', background: viewingSupplierReturn.credit_status === 'processed' ? '#d1fae5' : '#fef3c7', color: viewingSupplierReturn.credit_status === 'processed' ? '#065f46' : '#78350f' }}>{viewingSupplierReturn.credit_status}</span>
                                    </div>
                                </div>
                            </div>

                            {viewingSupplierReturn.notes && (
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginBottom: '15px' }}>
                                    <h4 style={{ marginBottom: '10px' }}>Notes</h4>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{viewingSupplierReturn.notes}</p>
                                </div>
                            )}

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Date Création</div>
                                        <div style={{ fontWeight: '600' }}>{viewingSupplierReturn.created_at}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Dernière Modification</div>
                                        <div style={{ fontWeight: '600' }}>{viewingSupplierReturn.updated_at}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <select value={viewingSupplierReturn.status} onChange={(e) => setViewingSupplierReturn({ ...viewingSupplierReturn, status: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                <option value="pending">En attente</option>
                                <option value="approved">Approuvé</option>
                                <option value="sent">Envoyé</option>
                                <option value="received">Reçu</option>
                            </select>
                            <button onClick={() => setViewingSupplierReturn(null)} className="btn-cancel">Fermer</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
