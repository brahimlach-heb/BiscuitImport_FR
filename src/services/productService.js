const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const productService = {
  async getAllProducts(token, category = null) {
    let url = `${API_BASE_URL}/api/products`;
    // Swagger: category est un paramètre de query string optionnel
    if (category !== null && category !== undefined && category !== "") {
      url += `?category=${encodeURIComponent(category)}`;
    }
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
  async exportProductsToExcel(token) {
    const response = await fetch(`${API_BASE_URL}/api/products/export/excel`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to export products to Excel');
    }
    return response.blob(); // Excel file as blob
  },

  async importProductsFromExcel(file, token) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/api/products/import/excel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to import products from Excel');
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