const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const supplierService = {
  async getAllSuppliers(token) {
    const response = await fetch(`${API_BASE_URL}/api/suppliers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des fournisseurs');
    }
    return response.json();
  },

  async getSupplierById(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du fournisseur');
    }
    return response.json();
  },

  async createSupplier(supplierData, token) {
    const response = await fetch(`${API_BASE_URL}/api/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(supplierData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création du fournisseur');
    }
    return response.json();
  },

  async updateSupplier(id, supplierData, token) {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(supplierData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du fournisseur');
    }
    return response.json();
  },

  async deleteSupplier(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du fournisseur');
    }
    return response.json();
  },

  async getSupplierProducts(supplierId, token) {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des produits du fournisseur');
    }
    return response.json();
  },

  async addSupplierProduct(supplierId, productData, token) {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout du produit fournisseur');
    }
    return response.json();
  },

  async updateSupplierProduct(supplierId, productId, productData, token) {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du produit fournisseur');
    }
    return response.json();
  },

  async removeSupplierProduct(supplierId, productId, token) {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du produit fournisseur');
    }
    return response.json();
  },

  async getSupplierPerformance(supplierId, token) {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}/performance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la performance du fournisseur');
    }
    return response.json();
  },

  async getSupplierHistory(supplierId, token) {
    const response = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'historique du fournisseur');
    }
    return response.json();
  },
};
