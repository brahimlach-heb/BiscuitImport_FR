// Return Service - Gestion des retours clients et fournisseurs
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ===== CUSTOMER RETURNS =====

export const getAllCustomerReturns = async (token) => {
    try {
        const response = await fetch(`${API_BASE}/customer-returns`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch customer returns');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getCustomerReturnById = async (id, token) => {
    try {
        const response = await fetch(`${API_BASE}/customer-returns/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch customer return');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createCustomerReturn = async (returnData, token) => {
    try {
        const response = await fetch(`${API_BASE}/customer-returns`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(returnData)
        });
        if (!response.ok) throw new Error('Failed to create customer return');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateCustomerReturn = async (id, returnData, token) => {
    try {
        const response = await fetch(`${API_BASE}/customer-returns/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(returnData)
        });
        if (!response.ok) throw new Error('Failed to update customer return');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteCustomerReturn = async (id, token) => {
    try {
        const response = await fetch(`${API_BASE}/customer-returns/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete customer return');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateReturnStatus = async (id, status, token) => {
    try {
        const response = await fetch(`${API_BASE}/customer-returns/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update return status');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const processReturnRefund = async (id, refundData, token) => {
    try {
        const response = await fetch(`${API_BASE}/customer-returns/${id}/refund`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(refundData)
        });
        if (!response.ok) throw new Error('Failed to process refund');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getCustomerReturnsByOrder = async (orderId, token) => {
    try {
        const response = await fetch(`${API_BASE}/customer-returns?order_id=${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch returns by order');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getReturnReport = async (filters, token) => {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE}/returns/report?${queryString}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch return report');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

// ===== SUPPLIER RETURNS =====

export const getAllSupplierReturns = async (token) => {
    try {
        const response = await fetch(`${API_BASE}/supplier-returns`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch supplier returns');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getSupplierReturnById = async (id, token) => {
    try {
        const response = await fetch(`${API_BASE}/supplier-returns/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch supplier return');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createSupplierReturn = async (returnData, token) => {
    try {
        const response = await fetch(`${API_BASE}/supplier-returns`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(returnData)
        });
        if (!response.ok) throw new Error('Failed to create supplier return');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateSupplierReturn = async (id, returnData, token) => {
    try {
        const response = await fetch(`${API_BASE}/supplier-returns/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(returnData)
        });
        if (!response.ok) throw new Error('Failed to update supplier return');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteSupplierReturn = async (id, token) => {
    try {
        const response = await fetch(`${API_BASE}/supplier-returns/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete supplier return');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateSupplierReturnStatus = async (id, status, token) => {
    try {
        const response = await fetch(`${API_BASE}/supplier-returns/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update supplier return status');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const processSupplierCredit = async (id, creditData, token) => {
    try {
        const response = await fetch(`${API_BASE}/supplier-returns/${id}/credit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(creditData)
        });
        if (!response.ok) throw new Error('Failed to process supplier credit');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getSupplierReturnsByPO = async (poId, token) => {
    try {
        const response = await fetch(`${API_BASE}/supplier-returns?po_id=${poId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch returns by PO');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getSupplierReturnReport = async (filters, token) => {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE}/supplier-returns/report?${queryString}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch supplier return report');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};

export const returnService = {
    // Customer Returns
    getAllCustomerReturns,
    getCustomerReturnById,
    createCustomerReturn,
    updateCustomerReturn,
    deleteCustomerReturn,
    updateReturnStatus,
    processReturnRefund,
    getCustomerReturnsByOrder,
    getReturnReport,
    
    // Supplier Returns
    getAllSupplierReturns,
    getSupplierReturnById,
    createSupplierReturn,
    updateSupplierReturn,
    deleteSupplierReturn,
    updateSupplierReturnStatus,
    processSupplierCredit,
    getSupplierReturnsByPO,
    getSupplierReturnReport
};

export default returnService;
