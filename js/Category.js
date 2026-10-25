// Fixes the API's spelling and makes nice labels: "men's clothing" -> "Men's Clothing"
const LABELS = { jewelery: 'Jewelry' };

export default class Category {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  static fromApi(name) {
    const title = LABELS[name] ?? name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    return new Category(name, title);
  }

  static all() {
    return new Category('all', 'All products');
  }

  static fromProducts(products) {
    const names = [...new Set(products.map(p => p.category))];
    return [Category.all(), ...names.map(Category.fromApi)];
  }
}
