const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const historyService = {
  async getHistory(token) {
    const response = await fetch(`${API_BASE_URL}/api/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get history');
    }
    return response.json();
  },
};