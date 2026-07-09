const Employee = require("../src/models/Employee");

describe("Employee", () => {
  test("creates with valid inputs", () => {
    const emp = new Employee("Alice Smith", "alice@acme.com");
    expect(emp.name).toBe("Alice Smith");
    expect(emp.email).toBe("alice@acme.com");
  });

  test("trims name and lowercases email", () => {
    const emp = new Employee("  Bob  ", "  BOB@Acme.COM  ");
    expect(emp.name).toBe("Bob");
    expect(emp.email).toBe("bob@acme.com");
  });

  test("rejects empty name", () => {
    expect(() => new Employee("", "a@b.com")).toThrow("Invalid employee name");
  });

  test("rejects bad email", () => {
    expect(() => new Employee("Alice", "not-an-email")).toThrow("Invalid employee email");
  });

  test("equals by email", () => {
    const a = new Employee("Alice", "alice@acme.com");
    const b = new Employee("Alice Smith", "alice@acme.com");
    const c = new Employee("Alice", "bob@acme.com");
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
