export default class Customer {
  constructor({ name, phone, email }) {
    this.name = name.trim();
    this.phone = phone.trim();
    this.email = email.trim();
  }

  // Returns { field: message } for every invalid field (empty object = valid)
  validate() {
    const errors = {};
    if (this.name.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
    const digits = this.phone.replace(/\D/g, '');
    if (!/^[\d\s()+-]+$/.test(this.phone) || digits.length < 10 || digits.length > 15)
      errors.phone = 'Please enter a valid phone number (10–15 digits).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) errors.email = 'Please enter a valid email address.';
    return errors;
  }

  getProfile() {
    return `${this.name} (${this.email})`;
  }
}
