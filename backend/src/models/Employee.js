class Employee {
  constructor(name, email) {
    if (!name || typeof name !== "string" || !name.trim()) {
      throw new Error(`Invalid employee name: "${name}"`);
    }
    if (!email || !Employee.isValidEmail(email)) {
      throw new Error(`Invalid employee email: "${email}"`);
    }

    this.name = name.trim();
    this.email = email.trim().toLowerCase();
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  get key() {
    return this.email;
  }

  equals(other) {
    return other instanceof Employee && this.email === other.email;
  }

  toJSON() {
    return { name: this.name, email: this.email };
  }
}

module.exports = Employee;
