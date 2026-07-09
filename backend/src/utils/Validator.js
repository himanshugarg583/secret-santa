// Post-generation validation.
// Independently checks that assignments satisfy all constraints
// so we don't rely solely on the engine being correct.

class Validator {
  static validate(assignments, employees, previousAssignments = []) {
    const errors = [];

    if (assignments.length !== employees.length) {
      errors.push(`Expected ${employees.length} assignments, got ${assignments.length}`);
    }

    for (const a of assignments) {
      if (a.giver.equals(a.child)) {
        errors.push(`Self-assignment: ${a.giver.name}`);
      }
    }

    const giverEmails = new Set(assignments.map((a) => a.giver.email));
    if (giverEmails.size !== employees.length) {
      errors.push("Not every employee is assigned as a giver exactly once");
    }

    const childEmails = new Set(assignments.map((a) => a.child.email));
    if (childEmails.size !== employees.length) {
      errors.push("Not every employee is a secret child exactly once");
    }

    const blockedSet = new Set(previousAssignments.map((a) => a.key));
    for (const a of assignments) {
      if (blockedSet.has(a.key)) {
        errors.push(`Repeated previous-year assignment: ${a.giver.name} -> ${a.child.name}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }
}

module.exports = Validator;
