const Employee = require("../src/models/Employee");
const Assignment = require("../src/models/Assignment");

describe("Assignment", () => {
  const alice = new Employee("Alice", "alice@acme.com");
  const bob = new Employee("Bob", "bob@acme.com");

  test("creates valid assignment", () => {
    const a = new Assignment(alice, bob);
    expect(a.giver).toBe(alice);
    expect(a.child).toBe(bob);
  });

  test("prevents self-assignment", () => {
    expect(() => new Assignment(alice, alice)).toThrow("cannot be their own secret child");
  });

  test("key is giver->child format", () => {
    const a = new Assignment(alice, bob);
    expect(a.key).toBe("alice@acme.com->bob@acme.com");
  });

  test("toJSON has correct shape", () => {
    const a = new Assignment(alice, bob);
    expect(a.toJSON()).toEqual({
      Employee_Name: "Alice",
      Employee_EmailID: "alice@acme.com",
      Secret_Child_Name: "Bob",
      Secret_Child_EmailID: "bob@acme.com",
    });
  });

  test("toRow returns flat array", () => {
    const a = new Assignment(alice, bob);
    expect(a.toRow()).toEqual(["Alice", "alice@acme.com", "Bob", "bob@acme.com"]);
  });
});
