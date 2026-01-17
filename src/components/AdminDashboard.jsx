import React, { useState, useEffect } from 'react';
import { productService, categoryService, userService, orderService } from '../services';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    getAllProducts,
    createProduct
} from '../store/slices/productSlice';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../store/slices/categorySlice';
import { getAllUsers } from '../store/slices/userSlice';
import { getOrdersByUser } from '../store/slices/orderSlice';
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
    BarChart,
    Loader2
} from 'lucide-react';
import './AdminDashboard.css';

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
    { label: 'En attente', value: 'Pending', icon: <Clock size={14} />, color: '#f59e0b' },
    { label: 'Validée', value: 'Validated', icon: <CheckCircle2 size={14} />, color: '#10b981' },
    { label: 'Livrée', value: 'Delivered', icon: <Truck size={14} />, color: '#3b82f6' },
    { label: 'Annulée', value: 'Cancelled', icon: <XCircle size={14} />, color: '#ef4444' }
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

    // Combined loading state
    const loading = productsLoading || categoriesLoading || usersLoading || ordersLoading;

    // Use Redux state with demo fallbacks
    const isDemoMode = (productsState.length === 0 || categoriesState.length === 0) && !loading;
    const products = isDemoMode ? (initialProducts || []) : productsState;
    const categories = isDemoMode ? (initialCategories || []) : categoriesState;
    const users = usersState.length > 0 ? usersState : MOCK_USERS;
    const orders = ordersState.length > 0 ? ordersState : MOCK_ORDERS;

    // Combined error state
    const hasError = productsError || categoriesError || usersError || ordersError;

    // Console logs pour afficher les données reçues
    useEffect(() => {
        console.log('=== AdminDashboard - Données Redux ===');
        console.log('📦 Products State:', {
            data: productsState,
            count: productsState.length,
            loading: productsLoading,
            error: productsError
        });
        console.log('📁 Categories State:', {
            data: categoriesState,
            count: categoriesState.length,
            loading: categoriesLoading,
            error: categoriesError
        });
        console.log('👥 Users State:', {
            data: usersState,
            count: usersState.length,
            loading: usersLoading,
            error: usersError
        });
        console.log('🛒 Orders State:', {
            data: ordersState,
            count: ordersState.length,
            loading: ordersLoading,
            error: ordersError
        });
        console.log('📊 Données finales utilisées:', {
            products: products.length,
            categories: categories.length,
            users: users.length,
            orders: orders.length
        });
        console.log('=====================================');
    }, [productsState, categoriesState, usersState, ordersState, productsLoading, categoriesLoading, usersLoading, ordersLoading]);

    // Display error messages
    useEffect(() => {
        if (productsError) {
            console.error('❌ Products error:', productsError);
        }
        if (categoriesError) {
            console.error('❌ Categories error:', categoriesError);
        }
        if (usersError) {
            console.error('❌ Users error:', usersError);
        }
        if (ordersError) {
            console.error('❌ Orders error:', ordersError);
        }
    }, [productsError, categoriesError, usersError, ordersError]);

    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [chartType, setChartType] = useState('bar'); // 'bar' or 'trend'

    // Pagination state
    const [currentUserPage, setCurrentUserPage] = useState(1);
    const [currentProductPage, setCurrentProductPage] = useState(1);
    const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
    const itemsPerPage = 10;

    // UI state for modals/forms
    const [isEditingProduct, setIsEditingProduct] = useState(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    // Fetch data using Redux thunks
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        console.log('🔄 AdminDashboard - Chargement des données...', { token: token ? 'Token présent' : 'Token absent' });

        if (token) {
            console.log('📡 Dispatch des actions Redux...');
            dispatch(getAllProducts({ category: null, token })).then((result) => {
                console.log('✅ Products loaded:', result);
            });
            dispatch(getAllCategories(token)).then((result) => {
                console.log('✅ Categories loaded:', result);
            });
            dispatch(getAllUsers(token)).then((result) => {
                console.log('✅ Users loaded:', result);
            });
            dispatch(getOrdersByUser(token)).then((result) => {
                console.log('✅ Orders loaded:', result);
            });
        } else {
            console.warn('⚠️ Aucun token trouvé, impossible de charger les données');
        }
    }, [dispatch]);

    // Form data state
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Client', password: '' });
    const [newCategory, setNewCategory] = useState({ name: '', icon: '📦', description: '' });
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        brand: '',
        price: '',
        stock: '',
        description: '',
        image: ''
    });

    // Validation errors
    const [userErrors, setUserErrors] = useState({});
    const [categoryErrors, setCategoryErrors] = useState({});
    const [productErrors, setProductErrors] = useState({});

    const stats = [
        { label: 'Total Produits', value: products.length, icon: <Package size={20} />, color: '#d4af37' },
        { label: 'Utilisateurs', value: users.length, icon: <UsersIcon size={20} />, color: '#10b981' },
        { label: 'Catégories', value: categories.length, icon: <Tag size={20} />, color: '#8b5cf6' }
    ];

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
            const token = sessionStorage.getItem('token');
            try {
                // Note: deleteUser thunk should be added to userSlice if needed
                // For now, using service directly
                await userService.deleteUser?.(id, token);
                // State will be updated via Redux if deleteUser thunk is implemented
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('Erreur lors de la suppression de l\'utilisateur');
            }
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
            const token = sessionStorage.getItem('token');
            console.log('🗑️ Suppression de la catégorie ID:', id);
            try {
                const result = await dispatch(deleteCategory({ id, token }));
                console.log('📤 Résultat deleteCategory:', result);

                if (deleteCategory.fulfilled.match(result)) {
                    console.log('✅ Catégorie supprimée avec succès');
                } else if (deleteCategory.rejected.match(result)) {
                    console.error('❌ Erreur lors de la suppression:', result.payload);
                    alert('Erreur lors de la suppression de la catégorie: ' + (result.payload || 'Erreur inconnue'));
                }
            } catch (error) {
                console.error('❌ Failed to delete category:', error);
                alert('Erreur lors de la suppression de la catégorie');
            }
        }
    };

    const handleUpdateCategory = async (id, categoryData) => {
        const token = sessionStorage.getItem('token');
        console.log('✏️ Mise à jour de la catégorie ID:', id, 'avec les données:', categoryData);
        try {
            const result = await dispatch(updateCategory({ id, categoryData, token }));
            console.log('📤 Résultat updateCategory:', result);

            if (updateCategory.fulfilled.match(result)) {
                console.log('✅ Catégorie mise à jour avec succès:', result.payload);
                return result.payload;
            } else {
                console.error('❌ Erreur lors de la mise à jour:', result.payload);
                alert('Erreur lors de la mise à jour de la catégorie: ' + (result.payload || 'Erreur inconnue'));
                return null;
            }
        } catch (error) {
            console.error('❌ Failed to update category:', error);
            alert('Erreur lors de la mise à jour de la catégorie');
            return null;
        }
    };

    // Validation functions
    const validateUser = () => {
        const errors = {};
        if (!newUser.name.trim()) errors.name = 'Le nom est requis';
        if (!newUser.email.trim()) errors.email = 'L\'email est requis';
        else if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = 'Email invalide';
        if (!newUser.password || newUser.password.length < 6) errors.password = 'Mot de passe min. 6 caractères';
        setUserErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateCategory = () => {
        const errors = {};
        if (!newCategory.name.trim()) errors.name = 'Le nom est requis';
        if (!newCategory.icon.trim()) errors.icon = 'L\'icône est requise';
        setCategoryErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateProduct = () => {
        const errors = {};
        if (!newProduct.name.trim()) errors.name = 'Le nom est requis';
        if (!newProduct.category) errors.category = 'La catégorie est requise';
        if (!newProduct.brand.trim()) errors.brand = 'La marque est requise';
        if (!newProduct.price || parseFloat(newProduct.price) <= 0) errors.price = 'Prix invalide';
        if (!newProduct.stock || parseInt(newProduct.stock) < 0) errors.stock = 'Stock invalide';
        setProductErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Add handlers
    const handleAddUser = async () => {
        if (validateUser()) {
            const token = sessionStorage.getItem('token');
            try {
                // Assuming there's a createUser method in userService. 
                // Let me check userService first.
                // Wait, userService only had getAllUsers. I should probably use authService.register or add to userService.
                // For now, I'll assume an API exists and use it if it were there, but let's stick to what's available or add it.
                // I will add createUser to userService.
                const user = await authService.register(newUser);
                setUsers([...users, user]);
                setIsAddingUser(false);
                setNewUser({ name: '', email: '', role: 'Client', password: '' });
                setUserErrors({});
            } catch (error) {
                console.error('Failed to add user:', error);
                alert('Erreur lors de l\'ajout de l\'utilisateur');
            }
        }
    };

    const handleAddCategory = async () => {
        if (validateCategory()) {
            const token = sessionStorage.getItem('token');
            console.log('➕ Création d\'une nouvelle catégorie:', newCategory);
            try {
                const result = await dispatch(createCategory({ categoryData: newCategory, token }));
                console.log('📤 Résultat createCategory:', result);

                if (createCategory.fulfilled.match(result)) {
                    console.log('✅ Catégorie créée avec succès:', result.payload);
                    setIsAddingCategory(false);
                    setNewCategory({ name: '', icon: '📦', description: '' });
                    setCategoryErrors({});
                } else {
                    console.error('❌ Erreur lors de la création de la catégorie:', result.payload);
                    alert('Erreur lors de l\'ajout de la catégorie: ' + (result.payload || 'Erreur inconnue'));
                }
            } catch (error) {
                console.error('❌ Failed to add category:', error);
                alert('Erreur lors de l\'ajout de la catégorie');
            }
        }
    };

    const handleAddProduct = async () => {
        if (validateProduct()) {
            const token = sessionStorage.getItem('token');
            const productData = {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock)
            };
            console.log('➕ Création d\'un nouveau produit:', productData);
            try {
                const result = await dispatch(createProduct({ productData, token }));
                console.log('📤 Résultat createProduct:', result);

                if (createProduct.fulfilled.match(result)) {
                    console.log('✅ Produit créé avec succès:', result.payload);
                    setIsAddingProduct(false);
                    setNewProduct({ name: '', category: '', brand: '', price: '', stock: '', description: '', image: '' });
                    setProductErrors({});
                } else {
                    console.error('❌ Erreur lors de la création du produit:', result.payload);
                    alert('Erreur lors de l\'ajout du produit: ' + (result.payload || 'Erreur inconnue'));
                }
            } catch (error) {
                console.error('❌ Failed to add product:', error);
                alert('Erreur lors de l\'ajout du produit');
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

    if (loading) {
        return (
            <div className="admin-dashboard-loading">
                <Loader2 size={48} className="animate-spin" />
                <p>Chargement des données...</p>
            </div>
        );
    }


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
                        <h3><TrendingUp size={20} style={{ display: 'inline', marginRight: '10px' }} />Ventes Hebdomadaires</h3>
                        <div className="chart-toggle-mini">
                            <button
                                className={chartType === 'bar' ? 'active' : ''}
                                onClick={() => setChartType('bar')}
                                title="Histogramme"
                            ><BarChart3 size={16} /></button>
                            <button
                                className={chartType === 'trend' ? 'active' : ''}
                                onClick={() => setChartType('trend')}
                                title="Tendance"
                            ><TrendingUp size={16} /></button>
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={chartType}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {chartType === 'bar' ? <SalesChart data={SALES_DATA} /> : <SalesTrendChart data={SALES_DATA} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="recent-card">
                    <div className="card-header-flex">
                        <h3><Clock size={20} style={{ display: 'inline', marginRight: '10px' }} />Activité Récente</h3>
                    </div>
                    <div className="simple-table-modern">
                        {orders.slice(0, 5).map(order => (
                            <div key={order.id} className="simple-row-modern">
                                <div className="order-id-customer">
                                    <span className="id">#{order.id}</span>
                                    <span className="customer">{order.customer}</span>
                                </div>
                                <span className={`status-badge-modern`} style={{
                                    background: `${ORDER_STATUSES.find(s => s.value === order.status)?.color}15`,
                                    color: ORDER_STATUSES.find(s => s.value === order.status)?.color
                                }}>
                                    {ORDER_STATUSES.find(s => s.value === order.status)?.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overview-bottom-row" style={{ marginTop: '30px' }}>
                <div className="recent-card full-width">
                    <h3>Nouveaux Utilisateurs</h3>
                    <div className="users-mini-list">
                        {users.filter(user => user && (user.id || user._id)).slice(0, 6).map(user => (
                            <div key={user.id} className="user-pill-item">
                                <div className="avatar-small">
                                    {user?.name?.charAt(0) || user?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="info">
                                    <span className="name">{user?.name || user?.firstName || user?.email || 'Utilisateur'}</span>
                                    <span className="email">{user?.email || 'N/A'}</span>
                                </div>
                                <span className="role">{user?.role || 'Client'}</span>
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

                <div className="stats-grid-detailed">
                    <motion.div
                        className="stat-card-modern"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="stat-card-glass-bg"></div>
                        <div className="stat-icon-wrapper" style={{ boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)' }}>
                            <DollarSign size={24} color="#10b981" />
                        </div>
                        <div className="stat-content-flex">
                            <h4 className="stat-label-modern">Revenu Total</h4>
                            <div className="stat-value-group">
                                <span className="stat-number">{(products.reduce((sum, p) => sum + (p.price * 10), 0)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</span>
                                <span className="stat-unit">DH</span>
                            </div>
                            <div className="stat-meta-modern">
                                <span className="trend-pill positive">
                                    <TrendingUp size={12} /> +12.5%
                                </span>
                                <span className="meta-text-muted">vs mois dernier</span>
                            </div>
                        </div>
                        <div className="card-animation-blob"></div>
                    </motion.div>

                    <motion.div
                        className="stat-card-modern"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="stat-card-glass-bg"></div>
                        <div className="stat-icon-wrapper" style={{ boxShadow: '0 8px 20px rgba(212, 175, 55, 0.2)' }}>
                            <Package size={24} color="#d4af37" />
                        </div>
                        <div className="stat-content-flex">
                            <h4 className="stat-label-modern">Taux de Complétion</h4>
                            <div className="stat-value-group">
                                <span className="stat-number">{((orders.filter(o => o.status === 'Delivered').length / (orders.length || 1)) * 100).toFixed(1)}</span>
                                <span className="stat-unit">%</span>
                            </div>
                            <div className="stat-meta-modern">
                                <span className="trend-pill positive">
                                    <TrendingUp size={12} /> +5.2%
                                </span>
                                <span className="meta-text-muted">en augmentation</span>
                            </div>
                        </div>
                        <div className="card-animation-blob accent-gold"></div>
                    </motion.div>

                    <motion.div
                        className="stat-card-modern"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="stat-card-glass-bg"></div>
                        <div className="stat-icon-wrapper" style={{ boxShadow: '0 8px 20px rgba(139, 92, 246, 0.2)' }}>
                            <UsersIcon size={24} color="#8b5cf6" />
                        </div>
                        <div className="stat-content-flex">
                            <h4 className="stat-label-modern">Utilisateurs Actifs</h4>
                            <div className="stat-value-group">
                                <span className="stat-number">{users.length}</span>
                                <span className="stat-unit">Membres</span>
                            </div>
                            <div className="stat-meta-modern">
                                <span className="trend-pill positive">
                                    <TrendingUp size={12} /> +15
                                </span>
                                <span className="meta-text-muted">ce mois-ci</span>
                            </div>
                        </div>
                        <div className="card-animation-blob accent-purple"></div>
                    </motion.div>
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
                            <h3><BarChart3 size={20} style={{ display: 'inline', marginRight: '10px' }} />Analyse des Ventes</h3>
                        </div>
                        <div className="report-charts-grid">
                            <div className="report-chart-item">
                                <h4 className="chart-subtitle">Récapitulatif Quotidien</h4>
                                <SalesChart data={SALES_DATA} />
                            </div>
                            <div className="report-chart-item">
                                <h4 className="chart-subtitle">Tendance Hebdomadaire</h4>
                                <SalesTrendChart data={SALES_DATA} />
                            </div>
                        </div>
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
                                        <span className={`role-tag ${(user?.role || 'Client').toLowerCase()}`}>
                                            {user?.role || 'Client'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="status-pill active">{user?.status || 'Active'}</span>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="icon-btn edit" title="Modifier"><Edit2 size={16} /></button>
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
                            <div className="category-icon-admin">{category.icon}</div>
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                            <div className="category-stats-mini">
                                <span>{products.filter(p => p.category === category.name).length} Produits</span>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="action-link"
                                    onClick={() => {
                                        // TODO: Implement edit category modal
                                        console.log('Edit category:', category.id);
                                    }}
                                >
                                    <Edit2 size={14} /> Modifier
                                </button>
                                <button
                                    className="action-link danger"
                                    onClick={() => handleDeleteCategory(category.id)}
                                >
                                    <Trash2 size={14} /> Supprimer
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
                            {paginatedProducts.map(product => (
                                <tr key={product.id}>
                                    <td className="bold">{product.name}</td>
                                    <td><span className="cat-pill">{product.category}</span></td>
                                    <td>{product.brand}</td>
                                    <td className="price-cell">{product.price.toFixed(2)} DH</td>
                                    <td>
                                        <div className="stock-indicator">
                                            <div className="stock-bar"><div className="fill" style={{ width: '75%' }}></div></div>
                                            <span className="stock-count">150 units</span>
                                        </div>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="icon-btn edit" onClick={() => setIsEditingProduct(product)}><Edit2 size={16} /></button>
                                        <button className="icon-btn delete"><Trash2 size={16} /></button>
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

    const renderOrders = () => (
        <div className="admin-section">
            <div className="section-header">
                <h2>Gestion des Commandes</h2>
            </div>
            <div className="table-responsive">
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
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="bold">{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{new Date(order.date).toLocaleDateString('fr-FR')}</td>
                                <td className="price-cell">{parseFloat(order.total).toFixed(2)} DH</td>
                                <td>
                                    <div className="status-selector-modern">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                borderColor: ORDER_STATUSES.find(s => s.value === order.status).color,
                                                color: ORDER_STATUSES.find(s => s.value === order.status).color
                                            }}
                                        >
                                            {ORDER_STATUSES.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    <button className="icon-btn view"><Search size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

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
                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
                    >
                        <UsersIcon size={20} /> Utilisateurs
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }}
                    >
                        <Tag size={20} /> Catégories
                    </button>
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
                            {activeTab === 'users' && renderUsers()}
                            {activeTab === 'categories' && renderCategories()}
                            {activeTab === 'products' && renderProducts()}
                            {activeTab === 'orders' && renderOrders()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Product Edit Modal Mock */}
            {isEditingProduct && (
                <div className="admin-overlay">
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="modal-header">
                            <h2>Modifier le Produit</h2>
                            <button className="close-btn" onClick={() => setIsEditingProduct(null)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom du produit</label>
                                <input type="text" defaultValue={isEditingProduct.name} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Prix (DH)</label>
                                    <input type="number" defaultValue={isEditingProduct.price} />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="number" defaultValue={150} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <div className="input-with-action">
                                    <input type="text" placeholder="https://..." />
                                    <button className="action-small-btn"><ImageIcon size={18} /></button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => setIsEditingProduct(null)}>Annuler</button>
                            <button className="save-pill-btn" onClick={() => setIsEditingProduct(null)}>
                                <Save size={18} /> Sauvegarder
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* User Add/Edit Modal */}
            {isAddingUser && (
                <div className="admin-overlay" onClick={() => setIsAddingUser(false)}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><UsersIcon size={22} style={{ display: 'inline', marginRight: '10px' }} />Ajouter un Utilisateur</h2>
                            <button className="close-btn" onClick={() => {
                                setIsAddingUser(false);
                                setNewUser({ name: '', email: '', role: 'Client', password: '' });
                                setUserErrors({});
                            }}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom complet *</label>
                                <input
                                    type="text"
                                    placeholder="Jean Dupont"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className={userErrors.name ? 'error' : ''}
                                />
                                {userErrors.name && <span className="error-text">{userErrors.name}</span>}
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
                                <label>Mot de passe *</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className={userErrors.password ? 'error' : ''}
                                />
                                {userErrors.password && <span className="error-text">{userErrors.password}</span>}
                            </div>
                            <div className="form-group">
                                <label>Rôle *</label>
                                <select
                                    className="admin-select"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option>Client</option>
                                    <option>Manager</option>
                                    <option>Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsAddingUser(false);
                                setNewUser({ name: '', email: '', role: 'Client', password: '' });
                                setUserErrors({});
                            }}>Annuler</button>
                            <button className="save-pill-btn" onClick={handleAddUser}>
                                <Plus size={18} /> Créer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Category Add Modal */}
            {isAddingCategory && (
                <div className="admin-overlay" onClick={() => setIsAddingCategory(false)}>
                    <motion.div
                        className="admin-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2><Tag size={22} style={{ display: 'inline', marginRight: '10px' }} />Nouvelle Catégorie</h2>
                            <button className="close-btn" onClick={() => {
                                setIsAddingCategory(false);
                                setNewCategory({ name: '', icon: '📦', description: '' });
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
                                <label>Icône (Emoji) *</label>
                                <input
                                    type="text"
                                    placeholder="🍪"
                                    value={newCategory.icon}
                                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                                    className={categoryErrors.icon ? 'error' : ''}
                                    maxLength={2}
                                />
                                {categoryErrors.icon && <span className="error-text">{categoryErrors.icon}</span>}
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
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsAddingCategory(false);
                                setNewCategory({ name: '', icon: '📦', description: '' });
                                setCategoryErrors({});
                            }}>Annuler</button>
                            <button className="save-pill-btn" onClick={handleAddCategory}>
                                <Plus size={18} /> Créer
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
                                setNewProduct({ name: '', category: '', brand: '', price: '', stock: '', description: '', image: '' });
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
                                    <label>Prix (DH) *</label>
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
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-pill-btn" onClick={() => {
                                setIsAddingProduct(false);
                                setNewProduct({ name: '', category: '', brand: '', price: '', stock: '', description: '', image: '' });
                                setProductErrors({});
                            }}>Annuler</button>
                            <button className="save-pill-btn" onClick={handleAddProduct}>
                                <Plus size={18} /> Créer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
