const fs = require("fs");
const CsvService = require("../services/CsvService");
const AssignmentEngine = require("../services/AssignmentEngine");
const Validator = require("../utils/Validator");

class SecretSantaController {
  static async assign(req, res, next) {
    try {
      if (!req.files?.employees?.[0]) {
        const err = new Error("Employee list file is required");
        err.statusCode = 400;
        throw err;
      }

      const employeeFile = req.files.employees[0].path;
      const previousFile = req.files.previous?.[0]?.path;

      const employees = CsvService.parseEmployeeFile(employeeFile);

      let previousAssignments = [];
      if (previousFile) {
        previousAssignments = CsvService.parsePreviousAssignments(previousFile);
      }

      const engine = new AssignmentEngine(employees, previousAssignments);
      const assignments = engine.generate();

      // double-check with independent validation
      const validation = Validator.validate(assignments, employees, previousAssignments);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join("; ")}`);
      }

      const csvString = CsvService.generateCsv(assignments);

      cleanup(employeeFile, previousFile);

      res.json({
        success: true,
        count: assignments.length,
        assignments: assignments.map((a) => a.toJSON()),
        csv: csvString,
      });
    } catch (err) {
      cleanup(req.files?.employees?.[0]?.path, req.files?.previous?.[0]?.path);
      next(err);
    }
  }

  static health(_req, res) {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  }
}

function cleanup(...paths) {
  for (const p of paths) {
    if (p && fs.existsSync(p)) {
      try { fs.unlinkSync(p); } catch (_) { /* ignore */ }
    }
  }
}

module.exports = SecretSantaController;
