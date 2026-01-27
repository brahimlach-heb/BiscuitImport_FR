const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const productService = {
  async getAllProducts(category = null, token) {
    const url = category ? `${API_BASE_URL}/api/products?category=${category}` : `${API_BASE_URL}/api/products`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get products');
    }
    return response.json();
  },

  async createProduct(productData, token) {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  },

  async updateProduct(id, productData, token) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    return response.json();
  },

  async getProductById(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get product');
    }
    return response.json();
  },

  async deleteProduct(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    return response.json();
  },

  async addFlavorToProduct(productId, flavorId, token) {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}/flavors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ flavor_id: flavorId }),
    });
    if (!response.ok) {
      throw new Error('Failed to add flavor to product');
    }
    return response.json();
  },

  async removeFlavorFromProduct(productId, flavorId, token) {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}/flavors/${flavorId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to remove flavor from product');
    }
    return response.json();
  },
};