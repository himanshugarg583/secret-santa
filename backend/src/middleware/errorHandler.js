function errorHandler(err, req, res, _next) {
  console.error("[error]", err.message);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large (max 5 MB)" });
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ error: "Unexpected file field" });
  }

  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
}

module.exports = errorHandler;
