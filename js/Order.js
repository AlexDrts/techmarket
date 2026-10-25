const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Each step is simulated with a delay and a small chance of failure
// to show how a chain of async operations is handled.
export const ORDER_STEPS = [
  { label: 'Creating order',   duration: 1000, error: 'The manager lost your order.' },
  { label: 'Processing order', duration: 2000, error: 'Something went wrong while processing your order.' },
  { label: 'Delivering order', duration: 3000, error: 'The courier lost your parcel.' },
];

export default class Order {
  constructor({ customer, items, city, delivery, gift = false, insurance = false, failureRate = 0.1 }) {
    this.id = Date.now();
    this.customer = customer;
    this.items = items.map(item => ({ ...item }));
    this.city = city;
    this.delivery = delivery;
    this.gift = gift;
    this.insurance = insurance;
    this.failureRate = failureRate;
    this.status = 'new';
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  showOrder() {
    return `Order #${this.id}`;
  }

  // Runs the steps one after another; onStep(index, state) reports progress.
  async place(onStep = () => {}) {
    for (const [index, step] of ORDER_STEPS.entries()) {
      onStep(index, 'active');
      await wait(step.duration);
      if (Math.random() < this.failureRate) {
        onStep(index, 'failed');
        this.status = 'failed';
        throw new Error(step.error);
      }
      onStep(index, 'done');
    }
    this.status = 'delivered';
    return this;
  }
}
