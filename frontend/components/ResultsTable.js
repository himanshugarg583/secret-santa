"use client";

export default function ResultsTable({ assignments, csvData }) {
  function handleDownload() {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `secret-santa-${new Date().getFullYear()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="results">
      <div className="results-header">
        <h2>Assignments</h2>
        <span className="count-badge">{assignments.length} pairs</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Giver</th>
              <th>Email</th>
              <th></th>
              <th>Secret Child</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i}>
                <td className="col-num">{i + 1}</td>
                <td>{a.Employee_Name}</td>
                <td className="col-email">{a.Employee_EmailID}</td>
                <td className="col-arrow">→</td>
                <td>{a.Secret_Child_Name}</td>
                <td className="col-email">{a.Secret_Child_EmailID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn-download" onClick={handleDownload}>
        Download CSV
      </button>
    </div>
  );
}
