const express = require("express");
const upload = require("../middleware/upload");
const SecretSantaController = require("../controllers/SecretSantaController");

const router = express.Router();

router.post(
  "/assign",
  upload.fields([
    { name: "employees", maxCount: 1 },
    { name: "previous", maxCount: 1 },
  ]),
  SecretSantaController.assign
);

router.get("/health", SecretSantaController.health);

module.exports = router;
