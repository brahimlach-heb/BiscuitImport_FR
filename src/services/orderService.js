const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const orderService = {
  async createOrder(orderData, token) {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    return response.json();
  },

  async getOrdersByUser(token) {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get orders');
    }
    return response.json();
  },

  async getOrderById(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get order');
    }
    return response.json();
  },

  async updateOrderStatus(id, status, comment, token) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status, notes: comment }),
    });
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    return response.json();
  },

  async getPaymentsByOrder(orderId, token) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get payments');
    }
    return response.json();
  },

  async addPaymentToOrder(orderId, paymentData, token) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) {
      throw new Error('Failed to add payment');
    }
    return response.json();
  },

  async deletePayment(orderId, paymentId, token) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payments/${paymentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete payment');
    }
    return response.json();
  },

  async updateOrderDiscount(orderId, discountData, token) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/remise`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(discountData),
    });
    if (!response.ok) {
      throw new Error('Failed to update order discount');
    }
    return response.json();
  },

  async downloadQuote(orderId, token) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/devis`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to download quote');
    }
    // Retourner le blob pour télécharger le PDF
    const blob = await response.blob();
    return blob;
  },

  async deleteOrder(orderId, token) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete order');
    }
    return response.json();
  },
};