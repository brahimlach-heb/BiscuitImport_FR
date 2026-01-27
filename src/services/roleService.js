const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const roleService = {
  async getAllRoles(token) {
    const response = await fetch(`${API_BASE_URL}/api/roles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get roles');
    }
    return response.json();
  },

  async createRole(roleData, token) {
    const response = await fetch(`${API_BASE_URL}/api/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(roleData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create role');
    }
    return response.json();
  },

  async getRoleById(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get role');
    }
    return response.json();
  },

  async getRoleByCode(code, token) {
    const response = await fetch(`${API_BASE_URL}/api/roles/code/${code}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get role by code');
    }
    return response.json();
  },

  async updateRole(id, roleData, token) {
    const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(roleData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update role');
    }
    return response.json();
  },

  async deleteRole(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete role');
    }
    return response.json();
  },
};
