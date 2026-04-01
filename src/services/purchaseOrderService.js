const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const purchaseOrderService = {
  async getAllPurchaseOrders(token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes d\'achat');
    }
    return response.json();
  },

  async getPurchaseOrderById(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la commande d\'achat');
    }
    return response.json();
  },

  async createPurchaseOrder(orderData, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la création de la commande d\'achat');
    }
    return response.json();
  },

  async updatePurchaseOrder(id, orderData, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de la commande d\'achat');
    }
    return response.json();
  },

  async deletePurchaseOrder(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de la commande d\'achat');
    }
    return response.json();
  },

  async addPurchaseOrderLine(orderId, lineData, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders/${orderId}/lines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(lineData),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout de la ligne de commande');
    }
    return response.json();
  },

  async removePurchaseOrderLine(orderId, lineId, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders/${orderId}/lines/${lineId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de la ligne de commande');
    }
    return response.json();
  },

  async updatePurchaseOrderStatus(id, status, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du statut');
    }
    return response.json();
  },

  async receivePurchaseOrder(id, receivedItems, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders/${id}/receive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ received_items: receivedItems }),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la réception de la commande');
    }
    return response.json();
  },

  async getPurchaseOrdersBySupplier(supplierId, token) {
    const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}/purchase-orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes du fournisseur');
    }
    return response.json();
  },

  async getPurchaseOrdersByStatus(status, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders?status=${status}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes');
    }
    return response.json();
  },

  async getPurchaseOrderHistory(orderId, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders/${orderId}/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'historique');
    }
    return response.json();
  },

  async generatePurchaseOrderPDF(orderId, token) {
    const response = await fetch(`${API_BASE_URL}/api/purchase-orders/${orderId}/pdf`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la génération du PDF');
    }
    return response.blob();
  },
};
