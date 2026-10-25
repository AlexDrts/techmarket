const priceFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatPrice(value) {
  return priceFormat.format(value);
}

export default class Product {
  constructor({ id, title, price, image, category, description = '', rating = { rate: 0, count: 0 } }) {
    this.id = id;
    this.title = title.trim();
    this.price = Number(price);
    this.image = image;
    this.category = category;
    this.description = description;
    this.rating = rating;
  }

  static fromApi(data) {
    return new Product(data);
  }

  get formattedPrice() {
    return formatPrice(this.price);
  }

  matches(query) {
    if (!query) return true;
    const text = `${this.title} ${this.description}`.toLowerCase();
    return query.toLowerCase().split(/\s+/).every(word => text.includes(word));
  }
}
