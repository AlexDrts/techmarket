import Product from './Product.js';

const API_URL = 'https://fakestoreapi.com/products';
const OFFLINE_URL = 'data/products.json'; // snapshot used if the API is unavailable

async function fetchJson(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function loadProducts() {
  try {
    const data = await fetchJson(API_URL, 8000);
    return { products: data.map(Product.fromApi), source: 'api' };
  } catch (error) {
    console.warn('Fake Store API unavailable, using offline data:', error.message);
    const data = await fetchJson(OFFLINE_URL, 8000);
    return { products: data.map(Product.fromApi), source: 'offline' };
  }
}
