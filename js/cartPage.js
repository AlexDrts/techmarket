import Cart, { MAX_QUANTITY } from './Cart.js';
import Customer from './Customer.js';
import Order, { ORDER_STEPS } from './Order.js';
import { formatPrice } from './Product.js';
import { updateCartBadge, showToast, el } from './ui.js';
import { saveOrder } from './firebase.js';

const cart = Cart.load();

const itemsBox = document.getElementById('cartItems');
const summary = document.getElementById('summary');
const totalBox = document.getElementById('total');
const countBox = document.getElementById('itemCount');
const checkout = document.getElementById('checkout');
const form = document.getElementById('orderForm');
const submitBtn = document.getElementById('submitBtn');
const progress = document.getElementById('orderProgress');

function renderCart() {
  updateCartBadge(cart);
  if (cart.isEmpty) {
    const empty = el('div', 'empty-cart');
    empty.append(el('p', null, 'Your cart is empty.'));
    const link = el('a', 'btn btn-primary', 'Browse products');
    link.href = 'index.html';
    empty.append(link);
    itemsBox.replaceChildren(empty);
    summary.hidden = true;
    checkout.hidden = true;
    return;
  }

  itemsBox.replaceChildren(...cart.items.map(item => {
    const row = el('article', 'cart-item');

    const img = el('img');
    img.src = item.image;
    img.alt = '';

    const info = el('div', 'cart-item-info');
    info.append(el('h3', null, item.title), el('p', 'unit-price', `${formatPrice(item.price)} each`));

    const stepper = el('div', 'stepper');
    const minus = el('button', 'step', '−');
    const qty = el('span', 'qty', String(item.quantity));
    const plus = el('button', 'step', '+');
    minus.type = plus.type = 'button';
    minus.setAttribute('aria-label', `Decrease quantity of ${item.title}`);
    plus.setAttribute('aria-label', `Increase quantity of ${item.title}`);
    plus.disabled = item.quantity >= MAX_QUANTITY;
    qty.setAttribute('aria-live', 'polite');
    minus.addEventListener('click', () => { cart.setQuantity(item.id, item.quantity - 1); renderCart(); });
    plus.addEventListener('click', () => { cart.setQuantity(item.id, item.quantity + 1); renderCart(); });
    stepper.append(minus, qty, plus);

    const lineTotal = el('p', 'line-total', formatPrice(item.price * item.quantity));

    const remove = el('button', 'remove', 'Remove');
    remove.type = 'button';
    remove.setAttribute('aria-label', `Remove ${item.title} from cart`);
    remove.addEventListener('click', () => {
      cart.remove(item.id);
      renderCart();
      showToast('Item removed from cart');
    });

    row.append(img, info, stepper, lineTotal, remove);
    return row;
  }));

  countBox.textContent = `${cart.count} ${cart.count === 1 ? 'item' : 'items'}`;
  totalBox.textContent = formatPrice(cart.getTotal());
  summary.hidden = false;
  checkout.hidden = false;
}

// ---- checkout ----
function showErrors(errors) {
  for (const field of ['name', 'phone', 'email']) {
    const input = document.getElementById(field);
    const message = document.getElementById(`${field}Error`);
    input.setAttribute('aria-invalid', String(Boolean(errors[field])));
    message.textContent = errors[field] ?? '';
  }
  const first = Object.keys(errors)[0];
  if (first) document.getElementById(first).focus();
}

function renderSteps() {
  progress.replaceChildren(...ORDER_STEPS.map(step => {
    const li = el('li', 'step-item', step.label);
    li.dataset.state = 'pending';
    return li;
  }));
}

function setStep(index, state) {
  progress.children[index].dataset.state = state;
}

function showResult(text, ok) {
  const result = el('li', ok ? 'result ok' : 'result fail', text);
  progress.append(result);
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const customer = new Customer({
    name: form.elements.name.value,
    phone: form.elements.phone.value,
    email: form.elements.email.value,
  });
  const errors = customer.validate();
  showErrors(errors);
  if (Object.keys(errors).length) return;

  const order = new Order({
    customer,
    items: cart.items,
    city: form.elements.city.value,
    delivery: form.elements.delivery.value,
    gift: form.elements.gift.checked,
    insurance: form.elements.insurance.checked,
  });
  console.log(order.showOrder(), order);

  submitBtn.disabled = true;
  submitBtn.textContent = 'Placing order…';
  renderSteps();
  progress.hidden = false;

  try {
    await order.place(setStep);
    await saveOrder(order);
    showResult(`${order.showOrder()} has been delivered to ${order.city}. Thank you, ${customer.name}!`, true);
    cart.clear();
    updateCartBadge(cart);
    itemsBox.replaceChildren();
    summary.hidden = true;
    form.hidden = true;
  } catch (error) {
    showResult(`${error.message} Your cart is saved, please try again.`, false);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Try again';
  }
});

renderCart();
