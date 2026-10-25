const STORAGE_KEY = 'techmarket-cart';
export const MAX_QUANTITY = 10;

// Shopping cart: one line per product with a quantity, saved in localStorage
export default class Cart {
  constructor(items = []) {
    this.items = items; // [{ id, title, price, image, quantity }]
  }

  static load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) {
        return new Cart(saved.filter(i => i && i.id != null && Number.isFinite(i.price) && i.quantity > 0));
      }
    } catch { /* storage unavailable or corrupted: start with an empty cart */ }
    return new Cart();
  }

  save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items)); } catch { /* ignore */ }
  }

  find(id) {
    return this.items.find(item => item.id === id);
  }

  add(product, quantity = 1) {
    const item = this.find(product.id);
    if (item) {
      item.quantity = Math.min(item.quantity + quantity, MAX_QUANTITY);
    } else {
      const { id, title, price, image } = product;
      this.items.push({ id, title, price, image, quantity: Math.min(quantity, MAX_QUANTITY) });
    }
    this.save();
  }

  setQuantity(id, quantity) {
    if (quantity <= 0) return this.remove(id);
    const item = this.find(id);
    if (item) item.quantity = Math.min(quantity, MAX_QUANTITY);
    this.save();
  }

  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
  }

  clear() {
    this.items = [];
    this.save();
  }

  get count() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get isEmpty() {
    return this.items.length === 0;
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
