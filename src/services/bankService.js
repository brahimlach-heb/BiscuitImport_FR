const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const bankService = {
  async getAllBanks(token) {
    const response = await fetch(`${API_BASE_URL}/api/banks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get banks');
    }
    return response.json();
  },

  async getBankById(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/banks/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get bank');
    }
    return response.json();
  },

  async createBank(bankData, token) {
    const response = await fetch(`${API_BASE_URL}/api/banks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bankData),
    });
    if (!response.ok) {
      throw new Error('Failed to create bank');
    }
    return response.json();
  },

  async updateBank(id, bankData, token) {
    const response = await fetch(`${API_BASE_URL}/api/banks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bankData),
    });
    if (!response.ok) {
      throw new Error('Failed to update bank');
    }
    return response.json();
  },

  async deleteBank(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/banks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete bank');
    }
    return response.json();
  },
};
