const Employee = require("../src/models/Employee");
const Assignment = require("../src/models/Assignment");
const Validator = require("../src/utils/Validator");

describe("Validator", () => {
  const employees = [
    new Employee("Alice", "alice@acme.com"),
    new Employee("Bob", "bob@acme.com"),
    new Employee("Charlie", "charlie@acme.com"),
  ];

  test("passes for valid assignments", () => {
    const assignments = [
      new Assignment(employees[0], employees[1]),
      new Assignment(employees[1], employees[2]),
      new Assignment(employees[2], employees[0]),
    ];
    const result = Validator.validate(assignments, employees);
    expect(result.valid).toBe(true);
  });

  test("catches wrong count", () => {
    const assignments = [new Assignment(employees[0], employees[1])];
    const result = Validator.validate(assignments, employees);
    expect(result.valid).toBe(false);
  });

  test("catches repeated previous-year pairing", () => {
    const prev = [new Assignment(employees[0], employees[1])];
    const assignments = [
      new Assignment(employees[0], employees[1]),
      new Assignment(employees[1], employees[2]),
      new Assignment(employees[2], employees[0]),
    ];
    const result = Validator.validate(assignments, employees, prev);
    expect(result.valid).toBe(false);
  });
});
