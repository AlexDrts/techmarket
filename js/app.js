import Cart from './Cart.js';
import Category from './Category.js';
import { loadProducts } from './api.js';
import { updateCartBadge, showToast, el } from './ui.js';

const cart = Cart.load();
const state = { products: [], category: 'all', query: '', sort: 'featured' };

const grid = document.getElementById('products');
const chips = document.getElementById('categories');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const resultCount = document.getElementById('resultCount');
const notice = document.getElementById('notice');

const SORTS = {
  featured: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating.rate - a.rating.rate,
};

function visibleProducts() {
  return state.products
    .filter(p => state.category === 'all' || p.category === state.category)
    .filter(p => p.matches(state.query))
    .sort(SORTS[state.sort]);
}

function renderCategories(categories) {
  chips.replaceChildren(...categories.map(category => {
    const chip = el('button', 'chip', category.title);
    chip.type = 'button';
    chip.setAttribute('aria-pressed', String(category.id === state.category));
    chip.addEventListener('click', () => {
      state.category = category.id;
      chips.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      renderProducts();
    });
    return chip;
  }));
}

function productCard(product) {
  const card = el('article', 'card');

  const imageWrap = el('div', 'card-image');
  const img = el('img');
  img.src = product.image;
  img.alt = product.title;
  img.loading = 'lazy';
  imageWrap.append(img);

  const body = el('div', 'card-body');
  const category = el('p', 'card-category', product.category);
  const title = el('h3', null, product.title);
  title.title = product.title;
  const rating = el('p', 'rating', `★ ${product.rating.rate.toFixed(1)} `);
  rating.append(el('span', null, `(${product.rating.count})`));
  rating.setAttribute('aria-label', `Rated ${product.rating.rate} out of 5 by ${product.rating.count} customers`);

  const footer = el('div', 'card-footer');
  const price = el('p', 'price', product.formattedPrice);
  const button = el('button', 'btn btn-primary', 'Add to cart');
  button.type = 'button';
  button.addEventListener('click', () => {
    cart.add(product);
    updateCartBadge(cart);
    showToast(`Added to cart: ${product.title}`);
  });
  footer.append(price, button);

  body.append(category, title, rating, footer);
  card.append(imageWrap, body);
  return card;
}

function renderProducts() {
  const list = visibleProducts();
  resultCount.textContent = `${list.length} ${list.length === 1 ? 'product' : 'products'}`;
  if (list.length === 0) {
    grid.replaceChildren(el('p', 'empty', `Nothing found for “${state.query}”. Try another search or category.`));
    return;
  }
  grid.replaceChildren(...list.map(productCard));
}

let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { state.query = searchInput.value.trim(); renderProducts(); }, 150);
});
sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; renderProducts(); });

async function init() {
  updateCartBadge(cart);
  try {
    const { products, source } = await loadProducts();
    state.products = products;
    renderCategories(Category.fromProducts(products));
    renderProducts();
    if (source === 'offline') {
      notice.textContent = 'The product API is not responding right now, so a saved copy of the catalog is shown.';
      notice.hidden = false;
    }
  } catch (error) {
    console.error(error);
    grid.replaceChildren(el('p', 'empty', 'Could not load products. Please refresh the page.'));
  }
}

init();
