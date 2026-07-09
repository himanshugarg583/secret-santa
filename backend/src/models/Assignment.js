const Employee = require("./Employee");

class Assignment {
  constructor(giver, child) {
    if (!(giver instanceof Employee)) {
      throw new Error("Giver must be an Employee instance");
    }
    if (!(child instanceof Employee)) {
      throw new Error("Child must be an Employee instance");
    }
    if (giver.equals(child)) {
      throw new Error(`Employee "${giver.name}" cannot be their own secret child`);
    }

    this.giver = giver;
    this.child = child;
  }

  get key() {
    return `${this.giver.email}->${this.child.email}`;
  }

  toJSON() {
    return {
      Employee_Name: this.giver.name,
      Employee_EmailID: this.giver.email,
      Secret_Child_Name: this.child.name,
      Secret_Child_EmailID: this.child.email,
    };
  }

  toRow() {
    return [this.giver.name, this.giver.email, this.child.name, this.child.email];
  }
}

module.exports = Assignment;
