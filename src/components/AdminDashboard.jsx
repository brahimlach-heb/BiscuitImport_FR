import React, { useState, useEffect } from 'react';
import { productService, categoryService, userService, orderService, authService, roleService, bankService } from '../services';
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
    List
} from 'lucide-react';
import './AdminDashboard.css';
import './AdminDashboard_additions.css';
import './AdminDashboard_period_filter.css';

const MOCK_USERS = [
    { id: 1, name: 'Admin User', email: 'admin@amsfood.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jean Dupont', email: 'jean.dupont@gmail.com', role: 'Client', status: 'Active' },
    { id: 3, name: 'Marie Larch', email: 'm.larch@larch.com', role: 'Manager', status: 'Active' },
];

const MOCK_ORDERS = [
    { id: 'ORD-892', customer: 'Jean Dupont', date: '2026-01-12', total: '150.00', status: 'Pending' },
    { id: 'ORD-891', customer: 'Marie Larch', date: '2026-01-11', total: '320.50', status: 'Validated' },
    { id: 'ORD-890', customer: 'Ahmed Ben', date: '2026-01-10', total: '85.00', status: 'Delivered' },
];

const MOCK_ROLES = [
    { id: 1, code: 'ADMIN', label: 'Administrateur', is_active: true },
    { id: 2, code: 'MANAGER', label: 'Gestionnaire', is_active: true },
    { id: 3, code: 'CLIENT', label: 'Client', is_active: true },
    { id: 4, code: 'GUEST', label: 'Invité', is_active: false },
];

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
    { label: 'Payée', value: 'PAID', icon: <CheckCircle2 size={14} />, color: '#22c55e' }, // Vert clair
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
    const dispatch = useAppDispatch();

    // Redux state
    const { products: productsState = [], loading: productsLoading, error: productsError } = useAppSelector(state => state.product);
    const { categories: categoriesState = [], loading: categoriesLoading, error: categoriesError } = useAppSelector(state => state.category);
    const { users: usersState = [], loading: usersLoading, error: usersError } = useAppSelector(state => state.user);
    const { orders: ordersState = [], loading: ordersLoading, error: ordersError } = useAppSelector(state => state.order);
    const { roles: rolesState = [], loading: rolesLoading, error: rolesError } = useAppSelector(state => state.role);

    // Combined loading state
    const loading = productsLoading || categoriesLoading || usersLoading || ordersLoading || rolesLoading;

    // Use Redux state with demo fallbacks
    // Fix: Prioritize real data if token exists, preventing "Demo Mode" from hiding empty or newly created states
    const token = sessionStorage.getItem('token');
    const isDemoMode = !token;

    const products = isDemoMode ? (initialProducts || []) : productsState;
    const categories = isDemoMode ? (initialCategories || []) : categoriesState;
    const users = (usersState.length > 0 || !isDemoMode) ? usersState : MOCK_USERS;
    const orders = (ordersState.length > 0 || !isDemoMode) ? ordersState : MOCK_ORDERS;
    const roles = (Array.isArray(rolesState) && rolesState.length > 0 || !isDemoMode) ? (Array.isArray(rolesState) ? rolesState : MOCK_ROLES) : MOCK_ROLES;

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
    const [userRole, setUserRole] = useState(null);
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
                            console.log('🔐 User Role:', role?.data?.code, '| Is ADMIN:',role?.data?.code === 'ADMIN');
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
        if (!token) return;

        switch(activeTab) {
            case 'products':
                dispatch(getAllProducts({ category: null, token }));
                break;
            case 'users':
                // Only load users if user is ADMIN
                if (userRole?.code === 'ADMIN') {
                    dispatch(getAllUsers(token));
                }
                break;
            case 'orders':
                dispatch(getOrdersByUser(token));
                break;
            case 'banks':
                // Only load banks if user is ADMIN
                if (userRole?.code === 'ADMIN') {
                    dispatch(getAllBanks(token));
                }
                break;
            case 'overview':
                // Load all data for overview
                dispatch(getAllProducts({ category: null, token }));
                if (userRole?.code === 'ADMIN') {
                    dispatch(getAllUsers(token));
                }
                dispatch(getOrdersByUser(token));
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
        </div>
    );
};

export default AdminDashboard;
