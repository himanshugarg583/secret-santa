"use client";

import { useState, useRef } from "react";

export default function FileUpload({ label, title, description, accept, onFileSelect }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  function handleFile(f) {
    setFile(f);
    onFileSelect(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }

  function handleChange(e) {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  }

  return (
    <div className="upload-card">
      <div className="label">{label}</div>
      <h3>{title}</h3>
      <p className="desc">{description}</p>

      <div
        className={`dropzone ${dragActive ? "active" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
        />
        <div className="icon">+</div>
        <div className="text">
          {file ? "" : "Drop file here or click to browse"}
        </div>

        {file && (
          <div className="file-badge">
            ✓ {file.name}
          </div>
        )}
      </div>
    </div>
  );
}
