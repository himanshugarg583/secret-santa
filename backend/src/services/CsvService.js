const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");
const XLSX = require("xlsx");
const Employee = require("../models/Employee");
const Assignment = require("../models/Assignment");

class CsvService {
  // Parse employee list from CSV/XLSX
  // Expects columns: Employee_Name, Employee_EmailID
  static parseEmployeeFile(filePath) {
    const records = CsvService._readFile(filePath);

    if (records.length === 0) {
      throw new Error("Employee file is empty - no data rows found");
    }

    return records.map((row, idx) => {
      const name = row["Employee_Name"] || row["employee_name"];
      const email = row["Employee_EmailID"] || row["employee_emailid"];

      if (!name || !email) {
        throw new Error(`Row ${idx + 2}: missing Employee_Name or Employee_EmailID`);
      }
      return new Employee(name, email);
    });
  }

  // Parse previous year's assignments
  // Expects: Employee_Name, Employee_EmailID, Secret_Child_Name, Secret_Child_EmailID
  static parsePreviousAssignments(filePath) {
    const records = CsvService._readFile(filePath);

    return records.map((row, idx) => {
      const giverName = row["Employee_Name"] || row["employee_name"];
      const giverEmail = row["Employee_EmailID"] || row["employee_emailid"];
      const childName = row["Secret_Child_Name"] || row["secret_child_name"];
      const childEmail = row["Secret_Child_EmailID"] || row["secret_child_emailid"];

      if (!giverName || !giverEmail || !childName || !childEmail) {
        throw new Error(`Row ${idx + 2}: missing required fields in previous assignments file`);
      }

      return new Assignment(new Employee(giverName, giverEmail), new Employee(childName, childEmail));
    });
  }

  static generateCsv(assignments) {
    const rows = assignments.map((a) => a.toRow());
    return stringify(rows, {
      header: true,
      columns: ["Employee_Name", "Employee_EmailID", "Secret_Child_Name", "Secret_Child_EmailID"],
    });
  }

  static writeAssignmentsToFile(assignments, outputPath) {
    const csv = CsvService.generateCsv(assignments);
    fs.writeFileSync(outputPath, csv, "utf-8");
    return outputPath;
  }

  // Reads CSV or XLSX and returns array of row objects
  static _readFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".xlsx" || ext === ".xls") {
      return CsvService._readExcel(filePath);
    }

    const content = fs.readFileSync(filePath, "utf-8");
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  }

  static _readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
  }
}

module.exports = CsvService;
