const Employee = require("../src/models/Employee");
const Assignment = require("../src/models/Assignment");
const AssignmentEngine = require("../src/services/AssignmentEngine");

describe("AssignmentEngine", () => {
  const employees = [
    new Employee("Alice", "alice@acme.com"),
    new Employee("Bob", "bob@acme.com"),
    new Employee("Charlie", "charlie@acme.com"),
    new Employee("Diana", "diana@acme.com"),
    new Employee("Eve", "eve@acme.com"),
  ];

  test("generates correct count", () => {
    const engine = new AssignmentEngine(employees);
    const result = engine.generate();
    expect(result).toHaveLength(5);
  });

  test("no self-assignments", () => {
    const engine = new AssignmentEngine(employees);
    const result = engine.generate();
    result.forEach((a) => expect(a.giver.equals(a.child)).toBe(false));
  });

  test("every employee gives exactly once", () => {
    const engine = new AssignmentEngine(employees);
    const result = engine.generate();
    const givers = result.map((a) => a.giver.email).sort();
    expect(givers).toEqual(employees.map((e) => e.email).sort());
  });

  test("every employee receives exactly once", () => {
    const engine = new AssignmentEngine(employees);
    const result = engine.generate();
    const children = result.map((a) => a.child.email).sort();
    expect(children).toEqual(employees.map((e) => e.email).sort());
  });

  test("avoids previous year pairings", () => {
    const prev = [
      new Assignment(employees[0], employees[1]),
      new Assignment(employees[1], employees[0]),
    ];
    const engine = new AssignmentEngine(employees, prev);
    const blockedKeys = prev.map((p) => p.key);

    // run a bunch of times to be confident
    for (let i = 0; i < 50; i++) {
      const result = engine.generate();
      result.forEach((a) => expect(blockedKeys).not.toContain(a.key));
    }
  });

  test("throws with < 2 employees", () => {
    expect(() => new AssignmentEngine([employees[0]])).toThrow("At least 2");
  });

  test("handles exactly 2 employees (must swap)", () => {
    const two = [employees[0], employees[1]];
    const engine = new AssignmentEngine(two);
    const result = engine.generate();
    expect(result).toHaveLength(2);
    expect(result[0].giver.equals(result[1].child)).toBe(true);
    expect(result[1].giver.equals(result[0].child)).toBe(true);
  });
});
