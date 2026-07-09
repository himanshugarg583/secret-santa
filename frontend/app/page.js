"use client";

import { useState } from "react";
import FileUpload from "../components/FileUpload";
import ResultsTable from "../components/ResultsTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Home() {
  const [employeeFile, setEmployeeFile] = useState(null);
  const [previousFile, setPreviousFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleGenerate() {
    if (!employeeFile) {
      setError("Please upload the employee list first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("employees", employeeFile);
      if (previousFile) {
        formData.append("previous", previousFile);
      }

      const res = await fetch(`${API_URL}/api/assign`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="header">
        <h1>Secret Santa</h1>
        <p>Upload your employee list to generate gift assignments.</p>
      </div>

      <FileUpload
        label="Required"
        title="Employee List"
        description="CSV or XLSX with Employee_Name and Employee_EmailID columns."
        accept=".csv,.xlsx,.xls"
        onFileSelect={setEmployeeFile}
      />

      <FileUpload
        label="Optional"
        title="Previous Year Assignments"
        description="Last year's results to avoid repeat pairings."
        accept=".csv,.xlsx,.xls"
        onFileSelect={setPreviousFile}
      />

      <button
        className="btn-primary"
        onClick={handleGenerate}
        disabled={loading || !employeeFile}
      >
        {loading ? (
          <><span className="spinner" /> Generating...</>
        ) : (
          "Generate Assignments"
        )}
      </button>

      {error && <div className="error-msg">{error}</div>}

      {result && (
        <ResultsTable
          assignments={result.assignments}
          csvData={result.csv}
        />
      )}
    </main>
  );
}
