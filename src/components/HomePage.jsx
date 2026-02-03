import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronRight, ShoppingBag, User, LogOut, Settings, Sun, Moon, Eye, ShoppingCart, Trash2, Plus, Minus, Facebook, Instagram, Linkedin, FileText, CheckCircle, Loader2, Zap, MessageSquare } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getAllProducts } from '../store/slices/productSlice';
import { getAllCategories } from '../store/slices/categorySlice';
import { getAllRoles } from '../store/slices/roleSlice';
import { getProfile } from '../store/slices/authSlice';
import { orderService } from '../services/orderService';
import { FaWhatsapp } from "react-icons/fa";
import LogisticsBackground from './LogisticsBackground';
import InvoicePage from './InvoicePage';
import InvoiceHistory from './InvoiceHistory';
import AdminDashboard from './AdminDashboard';
import Toast from './Toast';
import './HomePage.css';

// --- Mock Data ---

const CATEGORIES = [
    { id: 'biscuits', name: 'Biscuits', icon: '🍪' },
    { id: 'chocolats', name: 'Chocolats', icon: '🍫' },
    { id: 'candy', name: 'Candy', icon: '🍬' },
    { id: 'boisson', name: 'Boisson', icon: '🥤' }
];

// FILTERS will be dynamically extracted from products

const FLAVOR_COLORS = {
    'Amande': '#EEDC82', // Buff/Beige
    'Chocolat': '#795548', // Brown
    'Noir Intense': '#3E2723', // Dark Brown
    'Lait Crémeux': '#D7CCC8', // Light Brown/Cream
    'Fruits Mélangés': '#FF5722', // Orange/Red
    'Caramel Classique': '#D4A017', // Gold/Caramel
    'Arabica': '#6F4E37', // Coffee
    'Vert Nature': '#4CAF50' // Green
};

const PRODUCTS = [
    // Biscuits
    { id: 1, name: 'Sablés Amande', category: 'biscuits', brand: 'Larch', flavor: 'Amande', price: 25.00, packageUnit: '12 pcs' },
    { id: 2, name: 'Choco Delight', category: 'biscuits', brand: 'Kamara', flavor: 'Chocolat', price: 30.50, packageUnit: '10 pcs' },
    { id: 3, name: 'Biscuit Caramel', category: 'biscuits', brand: 'Sweetco', flavor: 'Caramel Classique', price: 22.00, packageUnit: '24 pcs' },
    { id: 4, name: 'Larch Original', category: 'biscuits', brand: 'Larch', flavor: 'Lait Crémeux', price: 28.00, packageUnit: '12 pcs' },

    { id: 14, name: 'Crispy Oat', category: 'biscuits', brand: 'Larch', flavor: 'Amande', price: 26.00, packageUnit: '18 pcs' },
    { id: 15, name: 'Dark Biscuit', category: 'biscuits', brand: 'Kamara', flavor: 'Noir Intense', price: 32.00, packageUnit: '10 pcs' },
    { id: 16, name: 'Sunny Side', category: 'biscuits', brand: 'Sweetco', flavor: 'Fruits Mélangés', price: 24.50, packageUnit: '20 pcs' },
    { id: 17, name: 'Coco Crunch', category: 'biscuits', brand: 'Larch', flavor: 'Chocolat', price: 29.00, packageUnit: '15 pcs' },
    { id: 18, name: 'Butter Joy', category: 'biscuits', brand: 'Kamara', flavor: 'Lait Crémeux', price: 27.50, packageUnit: '12 pcs' },

    // Chocolats
    { id: 5, name: 'Dark Soul', category: 'chocolats', brand: 'Kamara', flavor: 'Noir Intense', price: 45.00, packageUnit: 'Barre 100g' },
    { id: 6, name: 'Milk Dream', category: 'chocolats', brand: 'Sweetco', flavor: 'Lait Crémeux', price: 38.00, packageUnit: 'Barre 100g' },
    { id: 7, name: 'Nutty Bar', category: 'chocolats', brand: 'Larch', flavor: 'Amande', price: 42.00, packageUnit: 'Barre 120g' },
    { id: 19, name: 'Ruby Rare', category: 'chocolats', brand: 'Sweetco', flavor: 'Fruits Mélangés', price: 55.00, packageUnit: 'Barre 90g' },
    { id: 20, name: 'Mint Choco', category: 'chocolats', brand: 'Larch', flavor: 'Vert Nature', price: 40.00, packageUnit: 'Barre 100g' },

    // Candy
    { id: 8, name: 'Fruit Mix', category: 'candy', brand: 'Sweetco', flavor: 'Fruits Mélangés', price: 15.00, packageUnit: 'Sachet 200g' },
    { id: 9, name: 'Green Gummy', category: 'candy', brand: 'Kamara', flavor: 'Vert Nature', price: 18.00, packageUnit: 'Sachet 250g' },
    { id: 10, name: 'Caramel Chew', category: 'candy', brand: 'Larch', flavor: 'Caramel Classique', price: 16.50, packageUnit: 'Boîte 150g' },
    { id: 21, name: 'Sour Power', category: 'candy', brand: 'Larch', flavor: 'Vert Nature', price: 14.00, packageUnit: 'Sachet 180g' },
    { id: 22, name: 'Berry Blast', category: 'candy', brand: 'Sweetco', flavor: 'Fruits Mélangés', price: 16.00, packageUnit: 'Sachet 200g' },

    // Boisson
    { id: 11, name: 'Ice Coffee', category: 'boisson', brand: 'Larch', flavor: 'Arabica', price: 12.00, packageUnit: 'Canette 33cl' },
    { id: 12, name: 'Choco Shake', category: 'boisson', brand: 'Sweetco', flavor: 'Chocolat', price: 14.00, packageUnit: 'Bouteille 25cl' },
    { id: 13, name: 'Green Tea', category: 'boisson', brand: 'Kamara', flavor: 'Vert Nature', price: 10.00, packageUnit: 'Bouteille 50cl' },
    { id: 23, name: 'Vanilla Latte', category: 'boisson', brand: 'Kamara', flavor: 'Lait Crémeux', price: 13.50, packageUnit: 'Canette 33cl' },
    { id: 24, name: 'Caramel Macchiato', category: 'boisson', brand: 'Larch', flavor: 'Caramel Classique', price: 15.00, packageUnit: 'Gobelet 30cl' },
];

// Add descriptions and specs to products (Helper for demo)
PRODUCTS.forEach(p => {
    if (!p.description) {
        p.description = `Découvrez notre ${p.name}, un produit de qualité supérieure de la marque ${p.brand}. Parfait pour vos pauses gourmandes.`;
    }
    if (!p.ingredients) {
        p.ingredients = "Farine de blé, Sucre, Beurre concentré, Œufs frais, Arômes naturels, Sel.";
    }

    // Detailed specific fields with varied examples
    p.manufacturer = p.manufacturer || (p.category === 'biscuits' ? "Bakery Joy S.A." : "Liquid Fresh Ltd");
    p.origin = p.origin || (p.id % 4 === 0 ? "Italie" : p.id % 3 === 0 ? "France" : p.id % 2 === 0 ? "Espagne" : "Maroc");
    p.format = p.format || p.packageUnit;
    p.dimensions = p.dimensions || (p.category === 'biscuits' ? "18 x 12 x 4 cm" : "6 x 6 x 22 cm");
    p.packagingType = p.packagingType || (p.category === 'biscuits' ? "Sachet protecteur Carton" : "Bouteille Verre / Gobelet");
    p.contentName = p.contentName || p.name;
});

const ITEMS_PER_PAGE = 8;

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, categories = [] }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const [imageError, setImageError] = useState(false);

    // Get category name from category_id
    const getCategoryName = () => {
        if (product.category_id && categories.length > 0) {
            const category = categories.find(cat => cat.id === product.category_id);
            return category ? category.name : product.category_id;
        }
        return product.category || 'N/A';
    };

    // Function to check if image URL exists
    const checkImageExists = (url) => {
        return new Promise((resolve) => {
            if (!url) {
                resolve(false);
                return;
            }
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };

    // Handle flavor selection with image validation
    const handleFlavorSelect = async (flavor) => {
        console.log('🎨 Flavor cliqué:', flavor);
        setSelectedFlavor(flavor);
        if (flavor.image) {
            const isValid = await checkImageExists(flavor.image);
            if (!isValid) {
                console.warn('⚠️ Image non valide pour le flavor:', flavor.name);
                setImageError(true);
            } else {
                console.log('✅ Image valide');
                setImageError(false);
            }
        } else {
            setImageError(true);
        }
    };

    // Reset state when product changes
    useEffect(() => {
        if (product) {
            setQuantity(1);
            setSelectedFlavor(product.flavors && product.flavors.length > 0 ? product.flavors[0] : null);
            setImageError(false);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    // Get product image - use selected flavor image if available
    const getProductImage = () => {
        console.log('🖼️ Selected Flavor:', selectedFlavor);
        if (imageError) {
            console.log('❌ Image error, showing fallback');
            return null;
        }
        if (selectedFlavor && selectedFlavor.image) {
            console.log('✅ Using selected flavor image:', selectedFlavor.image);
            return selectedFlavor.image;
        }
        if (product.flavors && product.flavors.length > 0) {
            console.log('🔄 Using first flavor image:', product.flavors[0].image);
            return product.flavors[0].image || product.image;
        }
        console.log('📦 Using product image:', product.image);
        return product.image;
    };

    const productImage = getProductImage();

    const imagePlaceholderStyle = selectedFlavor
        ? { backgroundColor: selectedFlavor.color }
        : product.flavors && product.flavors.length > 0
            ? { backgroundColor: product.flavors[0].color }
            : { backgroundColor: FLAVOR_COLORS[product.flavor] || '#e0e0e0' };

    const handleAdd = () => {
        onAddToCart(null, { ...product, quantityToAdd: quantity });
        onClose();
    };

    return (
        <div className="product-detail-overlay" onClick={onClose}>
            <motion.div
                className="product-detail-modal"
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25 }}
            >
                <button className="close-detail-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="detail-grid">
                    {/* Image Column */}
                    <div className="detail-image-col">
                        <div className="detail-image-placeholder" style={imagePlaceholderStyle}>
                            {productImage && !imageError ? (
                                <img
                                    src={productImage}
                                    alt=""
                                    onError={() => setImageError(true)}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '12px 12px 0 0'
                                    }}
                                />
                            ) : (
                                <span style={{
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '1.5rem',
                                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                    textAlign: 'center',
                                    padding: '0 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%'
                                }}>
                                    {selectedFlavor ? selectedFlavor.name :
                                        product.flavors && product.flavors.length > 0 ? product.flavors[0].name :
                                            product.flavor || 'Image'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info Column */}
                    <div className="detail-info-col">
                        <div className="detail-header">
                            <span className="detail-brand">{product.brand || product.marque}</span>
                            <h2>{product.name}</h2>
                            <div className="detail-price">{product.price.toFixed(2)} DH</div>
                        </div>

                        <div className="detail-body">
                            {product.ingredients && (
                                <div className="detail-ingredients">
                                    <strong>Ingrédients:</strong>
                                    <p>{product.ingredients}</p>
                                </div>
                            )}

                            {/* Afficher la description comme paragraphe si elle n'est pas structurée */}
                            {product.description && !product.description.includes('/') && !product.description.includes(',') && (
                                <div className="detail-description-section">
                                    <strong>Description:</strong>
                                    <p>{product.description}</p>
                                </div>
                            )}

                            <div className="detail-specs">
                                <h3>Caractéristiques Techniques</h3>
                                <div className="specs-table">
                                    {/* Afficher la description structurée si elle contient "/" et "," */}
                                    {product.description && product.description.includes('/') && product.description.includes(',') && (
                                        <>
                                            {product.description.split('/').map((row, idx) => {
                                                const parts = row.split(',').map(s => s.trim());
                                                if (parts.length >= 2) {
                                                    return (
                                                        <div className="spec-row" key={`desc-${idx}`}>
                                                            <div className="spec-cell label">{parts[0]}</div>
                                                            <div className="spec-cell value">{parts[1]}</div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </>
                                    )}
                                    <div className="spec-row">
                                        <div className="spec-cell label">Catégorie</div>
                                        <div className="spec-cell value">{getCategoryName()}</div>
                                    </div>
                                    <div className="spec-row">
                                        <div className="spec-cell label">Marque</div>
                                        <div className="spec-cell value">{product.brand || product.marque || 'N/A'}</div>
                                    </div>
                                    {product.stock !== undefined && (
                                        <div className="spec-row">
                                            <div className="spec-cell label">Stock disponible</div>
                                            <div className="spec-cell value">{product.stock} unités</div>
                                        </div>
                                    )}
                                    {product.packageUnit && (
                                        <div className="spec-row">
                                            <div className="spec-cell label">Unité d'emballage</div>
                                            <div className="spec-cell value">{product.packageUnit} produits/paquet</div>
                                        </div>
                                    )}
                                    {product.manufacturer && (
                                        <div className="spec-row">
                                            <div className="spec-cell label">Fabricant</div>
                                            <div className="spec-cell value">{product.manufacturer}</div>
                                        </div>
                                    )}
                                    {product.origin && (
                                        <div className="spec-row">
                                            <div className="spec-cell label">Pays d'origine</div>
                                            <div className="spec-cell value">{product.origin}</div>
                                        </div>
                                    )}
                                    {product.format && (
                                        <div className="spec-row">
                                            <div className="spec-cell label">Format</div>
                                            <div className="spec-cell value">{product.format}</div>
                                        </div>
                                    )}
                                    {product.dimensions && (
                                        <div className="spec-row">
                                            <div className="spec-cell label">Dimensions</div>
                                            <div className="spec-cell value">{product.dimensions}</div>
                                        </div>
                                    )}
                                    {product.packagingType && (
                                        <div className="spec-row">
                                            <div className="spec-cell label">Emballage</div>
                                            <div className="spec-cell value">{product.packagingType}</div>
                                        </div>
                                    )}
                                    {product.contentName && (
                                        <div className="spec-row">
                                            <div className="spec-cell label">Contenu</div>
                                            <div className="spec-cell value">{product.contentName}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="detail-selection">
                            {product.flavors && product.flavors.length > 1 && (
                                <div className="variant-select-section">
                                    <label>Flavors disponibles :</label>
                                    <div className="variants-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {product.flavors.map(flavor => (
                                            <button
                                                key={flavor.id}
                                                className={`flavor-chip ${selectedFlavor?.id === flavor.id ? 'selected' : ''}`}
                                                onClick={() => {
                                                    handleFlavorSelect(flavor);
                                                }}
                                                style={{
                                                    '--chip-color': flavor.color
                                                }}
                                            >
                                                <span className="chip-indicator" style={{ backgroundColor: flavor.color }}></span>
                                                <span className="chip-label">{flavor.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="quantity-add-section">
                                <div className="qty-selector large">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stock || product.quantity_in_stock || undefined}
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            const maxStock = product.stock || product.quantity_in_stock;
                                            setQuantity(Math.max(1, maxStock ? Math.min(val, maxStock) : val));
                                        }}
                                    />
                                    <button onClick={() => setQuantity(q => {
                                        const maxStock = product.stock || product.quantity_in_stock;
                                        return maxStock ? Math.min(q + 1, maxStock) : q + 1;
                                    })}>+</button>
                                </div>
                                <button className="add-to-cart-btn-large" onClick={handleAdd}>
                                    <ShoppingCart size={20} />
                                    <span>Ajouter au panier</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const ProductCard = ({ product, onAddToCart, onViewProduct, categories = [] }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedFlavor, setSelectedFlavor] = useState(
        product.flavors && product.flavors.length > 0 ? product.flavors[0] : null
    );
    const [imageError, setImageError] = useState(false);

    // Get category icon from category_id
    const getCategoryIcon = () => {
        // Try to find in Redux categories using category_id
        if (product.category_id && categories.length > 0) {
            const category = categories.find(cat => Number(cat.id) === Number(product.category_id));
            if (category) {
                return category.emoji || category.icon || '❔';
            }
        }

        // Try to find in mock CATEGORIES using category field (for demo mode)
        if (product.category) {
            const mockCategory = CATEGORIES.find(cat => cat.id === product.category);
            if (mockCategory?.icon) return mockCategory.icon;
        }

        // Default fallback
        return '❔';
    };

    // Function to check if image URL exists
    const checkImageExists = (url) => {
        return new Promise((resolve) => {
            if (!url) {
                resolve(false);
                return;
            }
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };

    // Handle flavor selection with image validation
    const handleFlavorSelect = async (flavor) => {
        setSelectedFlavor(flavor);
        if (flavor.image) {
            const isValid = await checkImageExists(flavor.image);
            if (!isValid) {
                console.warn('⚠️ Image non valide pour le flavor:', flavor.name);
                setImageError(true);
            } else {
                setImageError(false);
            }
        } else {
            setImageError(true);
        }
    };

    // Get product image - use selected flavor image if available
    const getProductImage = () => {
        if (imageError) return null;
        if (selectedFlavor && selectedFlavor.image) {
            return selectedFlavor.image;
        }
        if (product.flavors && product.flavors.length > 0) {
            return product.flavors[0].image || product.image;
        }
        return product.image;
    };

    const productImage = getProductImage();

    // Dynamic styles based on selected flavor
    const imagePlaceholderStyle = selectedFlavor
        ? { backgroundColor: selectedFlavor.color }
        : product.flavors && product.flavors.length > 0
            ? { backgroundColor: product.flavors[0].color }
            : { backgroundColor: '#e0e0e0' };

    const handleAdd = (e) => {
        e.stopPropagation();
        onAddToCart(e, { ...product, quantityToAdd: quantity });
    };

    const handleQuantityChange = (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        const maxStock = product.stock || product.quantity_in_stock;
        if (maxStock && val > maxStock) {
            val = maxStock;
        }
        setQuantity(val);
    };

    const adjustQty = (delta) => {
        const maxStock = product.stock || product.quantity_in_stock;
        setQuantity(prev => {
            const newVal = prev + delta;
            if (maxStock) {
                return Math.max(1, Math.min(newVal, maxStock));
            }
            return Math.max(1, newVal);
        });
    };

    return (
        <div className="product-card">
            <div className="product-image-placeholder" style={imagePlaceholderStyle}>
                {productImage && !imageError ? (
                    <img
                        src={productImage}
                        alt=""
                        onError={() => setImageError(true)}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '8px 8px 0 0'
                        }}
                    />
                ) : (
                    <span style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        textAlign: 'center',
                        padding: '0 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                    }}>
                        {selectedFlavor ? selectedFlavor.name :
                            product.flavors && product.flavors.length > 0 ? product.flavors[0].name : 'Image'}
                    </span>
                )}

                <div className="product-hover-overlay">
                    <div className="product-actions-container">
                        <button
                            className="product-action-btn view-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewProduct(product);
                            }}
                        >
                            <span className="btn-icon">👁️</span>
                            <span className="btn-text">Voir</span>
                        </button>
                        <button
                            className="product-action-btn cart-btn"
                            onClick={handleAdd}
                        >
                            <span className="btn-icon">🛒</span>
                            <span className="btn-text">Ajouter</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="product-info">
                <div className="product-header-row">
                    <div className="product-brand">{product.brand || product.marque}</div>
                    <div className="product-price">{product.price.toFixed(2)} DH</div>
                </div>

                <div className="product-name">{product.name}</div>

                <div className="product-footer-row">
                    <div className="product-meta">
                        {product.flavors && product.flavors.length > 0 ? (
                            <div className="variants-dots" style={{ display: 'flex', gap: '5px' }}>
                                {product.flavors.map(flavor => (
                                    <div
                                        key={flavor.id}
                                        className="flavor-dot"
                                        title={`Flavor : ${flavor.name}`}
                                        style={{
                                            backgroundColor: flavor.color || '#ccc',
                                            cursor: 'pointer',
                                            border: selectedFlavor?.id === flavor.id ? '2px solid #ffffff' : 'none',
                                            transform: selectedFlavor?.id === flavor.id ? 'scale(1.2)' : 'scale(1)',
                                            transition: 'all 0.2s ease',
                                            boxShadow: selectedFlavor?.id === flavor.id ? '0 0 0 2px rgba(0,0,0,0.2)' : 'none'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFlavorSelect(flavor);
                                        }}
                                    />
                                ))}
                            </div>
                        ) : product.flavor ? (
                            <div
                                className="flavor-dot"
                                title={`Flavor : ${product.flavor}`}
                                style={{ backgroundColor: FLAVOR_COLORS[product.flavor] || '#ccc', border: 'none' }}
                            />
                        ) : null}
                        <span className="package-unit" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

                            <span>{product.packageUnit || product.stock || ''}</span>
                        </span>
                        <span style={{ fontSize: '0.9rem' }}>{getCategoryIcon()}</span>
                    </div>
                </div>

                {/* Quantity & Add Row */}
                <div className="product-actions-row" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div className="qty-selector" style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); adjustQty(-1); }}
                            style={{ border: 'none', background: 'var(--bg-secondary)', padding: '4px 8px', cursor: 'pointer' }}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={product.stock || product.quantity_in_stock || undefined}
                            value={quantity}
                            onChange={handleQuantityChange}
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '40px', textAlign: 'center', border: 'none', padding: '4px 0', fontSize: '0.9rem', MozAppearance: 'textfield' }}
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); adjustQty(1); }}
                            style={{ border: 'none', background: 'var(--bg-secondary)', padding: '4px 8px', cursor: 'pointer' }}
                        >
                            +
                        </button>
                    </div>
                    <button
                        className="add-to-cart-btn-small"
                        onClick={handleAdd}
                        style={{
                            flex: 1,
                            background: 'var(--primary-accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontWeight: '500',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <ShoppingCart size={14} /> Ajouter
                    </button>


                </div>
            </div>
        </div>
    );
};



const HomePage = ({ onLogout }) => {
    const dispatch = useAppDispatch();
    const { products: reduxProducts = [], loading: productsLoading } = useAppSelector(state => state.product);
    const { categories: reduxCategories = [], loading: categoriesLoading } = useAppSelector(state => state.category);
    const { user: currentUser } = useAppSelector(state => state.auth);
    const { roles = [] } = useAppSelector(state => state.role);

    // Extract actual user object from API response
    const user = currentUser?.data?.user || null;
    console.log('🏠 HomePage - Utilisateur actuel:', user);

    const isDemoMode = (reduxProducts.length === 0 || reduxCategories.length === 0) && !productsLoading && !categoriesLoading;
    const products = isDemoMode ? PRODUCTS : reduxProducts;
    const categories = isDemoMode ? CATEGORIES : reduxCategories;

    // Log pour debug
    useEffect(() => {
        console.log('🏠 HomePage - Mode:', isDemoMode ? 'DEMO' : 'API');
        console.log('🏠 HomePage - Nombre de produits:', products.length);
        if (products.length > 0 && !isDemoMode) {
            console.log('🏠 HomePage - Exemple de produit API:', products[0]);
            console.log('🏠 HomePage - Flavors du produit:', products[0]?.flavors);
        }
    }, [products, isDemoMode]);

    // Theme State
    const [theme, setTheme] = useState(() => {
        return sessionStorage.getItem('theme') || 'light';
    });

    // Toggle Theme
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        sessionStorage.setItem('theme', newTheme);
    };

    // Apply Theme Effect
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Data State
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedFlavors, setSelectedFlavors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Cart State
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Product Detail State
    const [selectedProduct, setSelectedProduct] = useState(null);

    // User Menu State
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Navigation State
    const [currentView, setCurrentView] = useState('shop'); // 'shop', 'invoice', 'admin', 'history'
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // User Data from Redux
    const userData = user ? {
        firstName: user.first_name || 'Utilisateur',
        lastName: user.last_name || '',
        role: roles.find(r => r.id === user.role_id)?.code || user.role_code || 'CLIENT',
        pendingInvoices: user.pendingInvoices || 0
    } : {
        firstName: 'Utilisateur',
        lastName: '',
        role: 'Invité',
        pendingInvoices: 0
    };

    // Fetch initial data
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            dispatch(getProfile(token));
            dispatch(getAllProducts({ category: null, token })).then((result) => {
                console.log('🔍 HomePage - Produits récupérés:', result.payload);
                if (result.payload && result.payload.length > 0) {
                    console.log('🔍 Premier produit:', result.payload[0]);
                    console.log('🔍 Flavors du premier produit:', result.payload[0]?.flavors);
                }
            });
            dispatch(getAllCategories(token));
            dispatch(getAllRoles(token));
        }
    }, [dispatch]);

    // Fetch products when category changes
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token && !isDemoMode) {
            console.log('🔄 Récupération des produits pour la catégorie:', selectedCategory);
            dispatch(getAllProducts({ category: selectedCategory, token })).then((result) => {
                console.log('✅ Produits récupérés pour catégorie', selectedCategory, ':', result.payload?.length || 0);
            });
        }
    }, [selectedCategory, dispatch, isDemoMode]);

    const handleNavigate = (view) => {
        setIsLoading(true);
        setIsUserMenuOpen(false);

        // Simulate loading time
        setTimeout(() => {
            setCurrentView(view);
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 600);
    };

    // Handler pour la déconnexion avec nettoyage complet
    const handleLogout = () => {
        // Vider le panier
        setCartItems([]);

        // Vider le sessionStorage
        sessionStorage.clear();

        // Vider le localStorage
        localStorage.clear();

        // Appeler la fonction de déconnexion parent
        if (onLogout) {
            onLogout();
        }
    };

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedBrands, selectedFlavors]);

    // Handlers
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? [] : [brand]
        );
    };

    const toggleFlavor = (flavor) => {
        setSelectedFlavors(prev =>
            prev.includes(flavor) ? [] : [flavor]
        );
    };

    // Product Detail Handler
    const handleViewProduct = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseProductModal = () => {
        setSelectedProduct(null);
    };

    // Cart Handlers
    const handleAddToCart = (e, product) => {
        if (e) e.stopPropagation(); // Make event optional for modal call
        const quantityToAdd = product.quantityToAdd || 1;

        // Vérifier le stock disponible
        const stockAvailable = product.stock || product.quantity_in_stock;

        if (stockAvailable !== undefined && stockAvailable !== null) {
            const existing = cartItems.find(item => item.id === product.id);
            const currentQuantityInCart = existing ? existing.quantity : 0;
            const totalQuantity = currentQuantityInCart + quantityToAdd;

            if (totalQuantity > stockAvailable) {
                // Afficher un message d'erreur
                setNotification({
                    type: 'error',
                    message: `Stock insuffisant ! Disponible: ${stockAvailable} unités. Dans le panier: ${currentQuantityInCart} unités.`
                });
                return; // Ne pas ajouter au panier
            }
        }

        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
                );
            }
            // Ensure we don't store the helper prop 'quantityToAdd' in the state
            const { quantityToAdd: _, ...productData } = product;
            return [...prev, { ...productData, quantity: quantityToAdd }];
        });
        setNotification({
            type: 'success',
            message: `${quantityToAdd} x ${product.name} ajouté au panier.`
        });
        // Optional: Open cart on add? Or just badge? let's stick to badge for now.
    };

    const updateQuantity = (id, valueOrDelta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                let newQty;
                // Vérifier le stock disponible
                const stockAvailable = item.stock || item.quantity_in_stock;

                // If it's a direct value (from input change)
                if (typeof valueOrDelta === 'object' && valueOrDelta.target) {
                    const value = parseInt(valueOrDelta.target.value, 10);
                    // Allow typing (if NaN or 0, just use what's typed but ensure state validity eventually)
                    // For logic: if invalid/negative, default to 1 or keep current if empty string handling needed
                    newQty = isNaN(value) || value < 1 ? 1 : value;

                    // Vérifier le stock si disponible
                    if (stockAvailable !== undefined && stockAvailable !== null && newQty > stockAvailable) {
                        setNotification({
                            type: 'error',
                            message: `Stock insuffisant ! Maximum disponible: ${stockAvailable} unités.`
                        });
                        newQty = stockAvailable;
                    }
                } else {
                    // It's a delta (+1 or -1)
                    newQty = Math.max(1, item.quantity + valueOrDelta);

                    // Vérifier le stock si disponible
                    if (stockAvailable !== undefined && stockAvailable !== null && newQty > stockAvailable) {
                        setNotification({
                            type: 'error',
                            message: `Stock insuffisant ! Maximum disponible: ${stockAvailable} unités.`
                        });
                        newQty = stockAvailable;
                    }
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Order Handlers
    const handleGoToCheckout = () => {
        setIsCartOpen(false);
        setCurrentView('invoice');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOrderValidation = async (customerData) => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            setNotification({
                type: 'error',
                message: 'Vous devez être connecté pour passer une commande.'
            });
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        if (!user || !user.id) {
            setNotification({
                type: 'error',
                message: 'Impossible de récupérer les informations utilisateur.'
            });
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        try {
            // Calculer les totaux
            const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const total = cartTotal;

            // Préparer les données de la commande selon le format API
            const orderData = {
                user_id: user.id,
                status: "pending",
                subtotal: subtotal,
                total: total,
                customer_name: customerData.name,
                customer_email: customerData.email,
                customer_phone: customerData.phone,
                customer_address: customerData.address,
                lines: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    final_price: item.price * item.quantity
                }))
            };

            console.log('📦 Envoi de la commande:', orderData);

            // Envoyer la commande à l'API
            const response = await orderService.createOrder(orderData, token);
            console.log('✅ Commande créée:', response);

            // Clear Cart
            setCartItems([]);

            // Show Success Toast
            setTimeout(() => {
                setNotification({
                    type: 'success',
                    message: 'Votre commande a été validée avec succès !'
                });
            }, 100);

            return response;
        } catch (error) {
            console.error('❌ Erreur lors de la création de la commande:', error);
            setNotification({
                type: 'error',
                message: 'Erreur lors de la validation de la commande. Veuillez réessayer.'
            });
            throw error;
        }
    };

    const handleOrderCancel = () => {
        setCurrentView('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Extract unique brands from products
    const availableBrands = useMemo(() => {
        const brandsSet = new Set();
        products.forEach(product => {
            if (product.brand) {
                brandsSet.add(product.brand);
            } else if (product.marque) {
                brandsSet.add(product.marque);
            }
        });
        return Array.from(brandsSet).sort();
    }, [products]);

    // Extract unique flavors from products
    const availableFlavors = useMemo(() => {
        const flavorsSet = new Set();
        products.forEach(product => {
            // Check for flavors array (multi-variant products)
            if (product.flavors && Array.isArray(product.flavors)) {
                product.flavors.forEach(flavor => {
                    if (flavor.name) {
                        flavorsSet.add(flavor.name);
                    }
                });
            }
            // Check for single flavor field
            if (product.flavor) {
                flavorsSet.add(product.flavor);
            }
        });
        return Array.from(flavorsSet).sort();
    }, [products]);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Category Match - handle both category (demo) and category_id (API)
            if (selectedCategory) {
                const productCategory = product.category_id || product.category;
                if (productCategory !== selectedCategory) return false;
            }

            // Brand Match (if any selected)
            const productBrand = product.brand || product.marque;
            if (selectedBrands.length > 0 && !selectedBrands.includes(productBrand)) return false;

            // Flavor Match (if any selected)
            if (selectedFlavors.length > 0) {
                // For multi-variant products with flavors array
                if (product.flavors && Array.isArray(product.flavors)) {
                    const hasMatchingFlavor = product.flavors.some(flavor =>
                        selectedFlavors.includes(flavor.name)
                    );
                    if (!hasMatchingFlavor) return false;
                } else if (product.flavor && !selectedFlavors.includes(product.flavor)) {
                    return false;
                } else if (!product.flavor && !product.flavors) {
                    return false;
                }
            }

            return true;
        });
    }, [selectedCategory, selectedBrands, selectedFlavors, products]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="home-container">
            <LogisticsBackground />

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <ProductDetailModal
                        product={selectedProduct}
                        isOpen={!!selectedProduct}
                        onClose={handleCloseProductModal}
                        onAddToCart={handleAddToCart}
                        categories={categories}
                    />
                )}
            </AnimatePresence>

            {/* Cart Modal */}
            <AnimatePresence>
                {isCartOpen && (
                    <div className="cart-modal-overlay">
                        <motion.div
                            className="cart-modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                        />
                        <motion.div
                            className="cart-modal-content"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <div className="cart-header">
                                <h2>Mon Panier ({cartCount})</h2>
                                <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="empty-cart-state">
                                    <ShoppingBag size={48} />
                                    <p>Votre panier est vide.</p>
                                    <button onClick={() => { setIsCartOpen(false); setCurrentView('shop'); }}>Continuer mes achats</button>
                                </div>
                            ) : (
                                <div className="cart-grid">
                                    {/* Left Column: Product List */}
                                    <div className="cart-items-list">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="cart-item-row">
                                                <div className="cart-item-image">
                                                    {/* Placeholder */}
                                                </div>
                                                <div className="cart-item-details">
                                                    <h4>{item.name}</h4>
                                                    <div className="cart-item-meta">
                                                        <span>{item.brand}</span>
                                                        {item.flavor && (
                                                            <span className="cart-item-flavor" style={{ marginLeft: '8px', color: 'var(--primary-accent)' }}>
                                                                ● {item.flavor}
                                                            </span>
                                                        )}
                                                        <span className="cart-item-unit">{item.packageUnit}</span>
                                                    </div>
                                                    <div className="cart-item-price">
                                                        {(item.price * item.quantity).toFixed(2)} DH
                                                        <div style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                                                            ({item.price.toFixed(2)} DH / paquet)
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="cart-item-actions">
                                                    <div className="qty-controls">
                                                        <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={item.stock || item.quantity_in_stock || undefined}
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, e)}
                                                            className="qty-input"
                                                        />
                                                        <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                                                    </div>
                                                    <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Column: Order Summary */}
                                    <div className="cart-summary-col">
                                        <h3>Résumé de la commande</h3>
                                        <div className="summary-row">
                                            <span>Sous-total</span>
                                            <span>{cartTotal.toFixed(2)} DH</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Livraison</span>
                                            <span>Gratuit</span>
                                        </div>
                                        <div className="summary-divider"></div>
                                        <div className="summary-row total">
                                            <span>Total</span>
                                            <span>{cartTotal.toFixed(2)} DH</span>
                                        </div>
                                        <button
                                            className="checkout-btn"
                                            onClick={handleGoToCheckout}
                                        >
                                            Commander
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            {/* Header */}
            <header className="home-header">
                <div
                    className="header-brand"
                    onClick={() => {
                        handleNavigate('shop');
                        // Recharger les produits depuis l'API
                        dispatch(getAllProducts());
                        dispatch(getAllCategories());
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src={theme === 'light' ? '/lightmode_logo.png' : '/darkmode_logo.png'}
                        alt="AMS FOOD Logo"
                        style={{ height: '32px', objectFit: 'contain' }}
                    />
                </div>
                <div className="header-actions">
                    {/* Cart in Header */}
                    {currentView !== 'admin' && (
                        <div
                            className="header-icon-wrapper"
                            style={{ position: 'relative', cursor: 'pointer' }}
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag size={20} className="header-icon" />
                            {cartCount > 0 && (
                                <span className="cart-badge" style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: 'var(--primary-accent)',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>{cartCount}</span>
                            )}
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <button
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label="Toggle Dark Mode"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.4rem',
                            borderRadius: '50%',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {currentView === 'shop' && (
                        <button
                            className={`filter-toggle-btn ${!isSidebarOpen ? 'pulse' : ''}`}
                            onClick={toggleSidebar}
                        >
                            {isSidebarOpen ? <X size={18} /> : <Filter size={18} />}
                            <span>Filtres</span>
                        </button>
                    )}

                    {/* User Profile Section */}
                    <div
                        className="user-profile-section"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                        tabIndex={0}
                    >
                        <div className="user-avatar">
                            <User size={22} />
                        </div>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    className="dropdown-menu"
                                    initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: -15 }}
                                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.9, rotateX: -15 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                >
                                    <div className="profile-card-header">
                                        <div className="profile-card-avatar">
                                            {userData.firstName?.[0]}{userData.lastName?.[0]}
                                        </div>
                                        <h3 className="profile-card-name">{userData.firstName} {userData.lastName}</h3>
                                        <p className="profile-card-role">{userData.role}</p>
                                    </div>

                                    <div className="dropdown-item factures-btn" onClick={() => handleNavigate('history')}>
                                        <div className="dropdown-item-content">
                                            <FileText size={18} />
                                            <span>Mes Devis</span>
                                        </div>
                                        {userData.pendingInvoices > 0 && (
                                            <span className="facture-badge pulse">{userData.pendingInvoices}</span>
                                        )}
                                    </div>

                                    {/* Admin menu - only for ADMIN and MANAGER roles */}
                                    {(userData.role === 'ADMIN' || userData.role === 'MANAGER') && (
                                        <div className="dropdown-item" onClick={() => handleNavigate('admin')}>
                                            <div className="dropdown-item-content">
                                                <Settings size={18} />
                                                <span>Administration</span>
                                            </div>
                                            <ChevronRight size={14} />
                                        </div>
                                    )}

                                    <div className="dropdown-item danger" onClick={handleLogout}>
                                        <div className="dropdown-item-content">
                                            <LogOut size={18} />
                                            <span>Déconnexion</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            <div className="main-content">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loader"
                            className="page-loader-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '60vh',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <Loader2 size={48} color="var(--primary-accent)" />
                            </motion.div>
                            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Chargement...</p>
                        </motion.div>
                    ) : currentView === 'shop' ? (
                        <motion.div
                            key="shop"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', width: '100vw' }}
                        >
                            {/* Sidebar */}
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.aside
                                        className="filter-sidebar"
                                        initial={{ x: -320, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -320, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        <div className="sidebar-title">Filtres</div>

                                        <div className="filter-group">
                                            <div className="filter-group-title">Marque</div>
                                            {availableBrands.length > 0 ? (
                                                availableBrands.map(brand => (
                                                    <label key={brand} className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedBrands.includes(brand)}
                                                            onChange={() => toggleBrand(brand)}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <span className="custom-checkbox">
                                                            {selectedBrands.includes(brand) && <div className="check-dot" style={{ width: 10, height: 10, background: 'white', borderRadius: 2 }} />}
                                                        </span>
                                                        {brand}
                                                    </label>
                                                ))
                                            ) : (
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>Aucune marque disponible</p>
                                            )}
                                        </div>

                                        <div className="filter-group">
                                            <div className="filter-group-title">Flavours</div>
                                            {availableFlavors.length > 0 ? (
                                                availableFlavors.map(flavor => (
                                                    <label key={flavor} className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFlavors.includes(flavor)}
                                                            onChange={() => toggleFlavor(flavor)}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <span className="custom-checkbox">
                                                            {selectedFlavors.includes(flavor) && <div className="check-dot" style={{ width: 10, height: 10, background: 'white', borderRadius: 2 }} />}
                                                        </span>
                                                        {flavor}
                                                    </label>
                                                ))
                                            ) : (
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>Aucune saveur disponible</p>
                                            )}
                                        </div>
                                    </motion.aside>
                                )}
                            </AnimatePresence>

                            {/* Product Area */}
                            <div
                                className="product-area"
                                style={{ marginLeft: isSidebarOpen ? 300 : 0 }}
                            >
                                {/* Categories */}
                                <div className="categories-container">
                                    {categories.map(cat => (
                                        <div
                                            key={cat.id}
                                            className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                                        >
                                            <span className="category-icon">{cat.emoji}</span>
                                            <div className="category-name">{cat.name}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Product Grid */}
                                <div className="products-title" style={{ marginBottom: '1rem', fontWeight: 600 }}>
                                    {selectedCategory
                                        ? `Produits : ${categories.find(c => c.id === selectedCategory)?.name || 'Catégorie inconnue'}`
                                        : 'Tous les produits'}
                                    <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        ({filteredProducts.length})
                                    </span>
                                </div>

                                <div className="products-grid">
                                    {currentProducts.length > 0 ? (
                                        console.log(currentProducts),
                                        currentProducts.map(product => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onAddToCart={handleAddToCart}
                                                onViewProduct={handleViewProduct}
                                                categories={categories}
                                            />
                                        ))
                                    ) : (
                                        <div className="empty-state">
                                            Aucun produit ne correspond aux filtres sélectionnés.
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="pagination-container">
                                        <button
                                            className="page-btn page-nav-btn"
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            Précédent
                                        </button>

                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i + 1}
                                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                                onClick={() => handlePageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            className="page-btn page-nav-btn"
                                            disabled={currentPage === totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : currentView === 'invoice' ? (
                        <motion.div
                            key="invoice"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                            style={{ width: '100%' }}
                        >
                            <InvoicePage
                                items={cartItems}
                                onValidate={handleOrderValidation}
                                onCancel={handleOrderCancel}
                                user={user}
                            />
                        </motion.div>
                    ) : currentView === 'history' ? (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            style={{ width: '100%' }}
                        >
                            <InvoiceHistory onBack={() => handleNavigate('shop')} />
                        </motion.div>
                    ) : (
                        /* Admin Dashboard View */
                        <motion.div
                            key="admin"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{ width: '100%' }}
                        >
                            <AdminDashboard
                                initialProducts={PRODUCTS}
                                initialCategories={CATEGORIES}
                                onBack={() => handleNavigate('shop')}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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

            {/* Footer */}
            <footer className="main-footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <div className="footer-brand">
                            <img
                                src={theme === 'light' ? '/lightmode_logo.png' : '/darkmode_logo.png'}
                                alt="AMS FOOD Logo"
                                style={{ height: '24px', objectFit: 'contain' }}
                            />
                        </div>
                        <p className="footer-copyright">© 2026 AMS FOOD. Tous droits réservés.</p>
                    </div>

                    <div className="footer-center">
                        <nav className="footer-links">
                            <a href="#">Mentions légales</a>
                            <a href="#">Politique de confidentialité</a>
                            <a href="#">Conditions d'utilisation</a>
                        </nav>
                    </div>

                    <div className="footer-right">
                        <div className="social-icons">
                            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                            <a
                                href="https://wa.me/212600028348"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                onMouseEnter={(e) => {
                                    const icon = e.currentTarget.querySelector('svg');
                                    if (icon) icon.style.color = '#25D366';
                                }}
                                onMouseLeave={(e) => {
                                    const icon = e.currentTarget.querySelector('svg');
                                    if (icon) icon.style.color = '#888';
                                }}
                            >
                                <FaWhatsapp size={18} color="#888" style={{ transition: 'color 0.3s ease' }} />
                            </a>

                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
