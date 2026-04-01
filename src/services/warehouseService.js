const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const warehouseService = {
  async getAllWarehouses(token) {
    const response = await fetch(`${API_BASE_URL}/api/warehouses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des entrepôts');
    }
    return response.json();
  },

  async getWarehouseById(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/warehouses/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'entrepôt');
    }
    return response.json();
  },

  async createWarehouse(warehouseData, token) {
    const response = await fetch(`${API_BASE_URL}/api/warehouses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(warehouseData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'entrepôt');
    }
    return response.json();
  },

  async updateWarehouse(id, warehouseData, token) {
    const response = await fetch(`${API_BASE_URL}/api/warehouses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(warehouseData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de l\'entrepôt');
    }
    return response.json();
  },

  async deleteWarehouse(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/warehouses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'entrepôt');
    }
    return response.json();
  },

  async getWarehouseStock(warehouseId, token) {
    const response = await fetch(`${API_BASE_URL}/api/warehouses/${warehouseId}/stock`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du stock de l\'entrepôt');
    }
    return response.json();
  },

  async transferBetweenWarehouses(transferData, token) {
    const response = await fetch(`${API_BASE_URL}/api/warehouses/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(transferData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors du transfert entre entrepôts');
    }
    return response.json();
  },

  async getWarehouseTransfers(warehouseId, token) {
    const response = await fetch(`${API_BASE_URL}/api/warehouses/${warehouseId}/transfers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des transferts');
    }
    return response.json();
  },

  async getWarehouseCapacity(warehouseId, token) {
    const response = await fetch(`${API_BASE_URL}/api/warehouses/${warehouseId}/capacity`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la capacité');
    }
    return response.json();
  },
};
