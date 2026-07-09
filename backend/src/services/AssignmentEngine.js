const Assignment = require("../models/Assignment");

const MAX_ATTEMPTS = 1000;

// Generates valid Secret Santa assignments using randomized derangement.
//
// Constraints:
//  - No self-assignment
//  - No repeats from previous year
//  - Everyone gives exactly one gift, everyone receives exactly one gift
//
// Uses Fisher-Yates shuffle with retry on constraint violation.
// For company-sized inputs (< few hundred employees) this converges fast.

class AssignmentEngine {
  constructor(employees, previousAssignments = []) {
    if (!Array.isArray(employees) || employees.length < 2) {
      throw new Error("At least 2 employees are required for Secret Santa");
    }

    this.employees = employees;
    this.blocked = new Set(previousAssignments.map((a) => a.key));
  }

  generate() {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const result = this._tryOnce();
      if (result) return result;
    }

    throw new Error(
      "Could not generate valid assignments after maximum attempts. " +
      "This usually means too many pairings are blocked by previous years."
    );
  }

  _tryOnce() {
    const givers = [...this.employees];
    const receivers = this._shuffle([...this.employees]);
    const assignments = [];

    for (let i = 0; i < givers.length; i++) {
      const giver = givers[i];
      const child = receivers[i];

      if (giver.equals(child)) return null;
      if (this.blocked.has(`${giver.email}->${child.email}`)) return null;

      assignments.push(new Assignment(giver, child));
    }

    return assignments;
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

module.exports = AssignmentEngine;
