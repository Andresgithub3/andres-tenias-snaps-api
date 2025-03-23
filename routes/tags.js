import express from "express";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// GET all tags
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(
      join(__dirname, "../data/tags.json"),
      "utf8"
    );
    const tags = JSON.parse(data);
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

export default router;
