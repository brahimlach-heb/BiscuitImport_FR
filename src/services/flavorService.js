const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const flavorService = {
  async getAllFlavors(token) {
    const response = await fetch(`${API_BASE_URL}/api/flavors`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get flavors');
    }
    return response.json();
  },

  async createFlavor(flavorData, token) {
    const response = await fetch(`${API_BASE_URL}/api/flavors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(flavorData),
    });
    if (!response.ok) {
      throw new Error('Failed to create flavor');
    }
    return response.json();
  },

  async getFlavorById(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/flavors/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get flavor');
    }
    return response.json();
  },

  async updateFlavor(id, flavorData, token) {
    const response = await fetch(`${API_BASE_URL}/api/flavors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(flavorData),
    });
    if (!response.ok) {
      throw new Error('Failed to update flavor');
    }
    return response.json();
  },

  async deleteFlavor(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/flavors/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete flavor');
    }
    return response.json();
  },
};