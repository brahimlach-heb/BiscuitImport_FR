const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const stockService = {
  async getAllStocks(token) {
    const response = await fetch(`${API_BASE_URL}/api/stock/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des stocks');
    }
    return response.json();
  },

  async getStockByProduct(productId, token) {
    const response = await fetch(`${API_BASE_URL}/api/stock/product/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du stock');
    }
    return response.json();
  },

  async updateStock(productId, quantity, reason = 'adjustment', token) {
    const response = await fetch(`${API_BASE_URL}/api/stock/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity,
        reason
      }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du stock');
    }
    return response.json();
  },

  async adjustStock(productId, adjustmentQuantity, reason = 'adjustment', token) {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}/adjust-stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantity: adjustmentQuantity,
        reason
      }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajustement du stock');
    }
    return response.json();
  },

  async getStockMovements(productId = null, token) {
    const url = productId 
      ? `${API_BASE_URL}/api/stock/movements/${productId}`
      : `${API_BASE_URL}/api/stock/movements`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des mouvements');
    }
    return response.json();
  },

  async getStockReport(token) {
    const response = await fetch(`${API_BASE_URL}/api/stock/report`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la génération du rapport');
    }
    return response.json();
  },

  async getLowStockAlerts(threshold = 20, token) {
    const response = await fetch(`${API_BASE_URL}/api/stock/alerts?threshold=${threshold}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des alertes');
    }
    return response.json();
  },

  async transferStock(fromProductId, toProductId, quantity, reason = 'transfer', token) {
    const response = await fetch(`${API_BASE_URL}/api/stock/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        from_product_id: fromProductId,
        to_product_id: toProductId,
        quantity,
        reason
      }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors du transfert de stock');
    }
    return response.json();
  },

  async importStockData(data, token) {
    const response = await fetch(`${API_BASE_URL}/api/stock/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'import des données de stock');
    }
    return response.json();
  },
};
