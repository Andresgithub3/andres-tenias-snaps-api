import express from "express";
import fs from "fs/promises"; // Using the promises API is cleaner with ES modules
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { v4 as uuidv4 } from "uuid";

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Helper functions using async/await
const readPhotosData = async () => {
  const data = await fs.readFile(
    join(__dirname, "../data/photos.json"),
    "utf8"
  );
  return JSON.parse(data);
};

const writePhotosData = async (data) => {
  await fs.writeFile(
    join(__dirname, "../data/photos.json"),
    JSON.stringify(data, null, 2),
    "utf8"
  );
};

// GET all photos
router.get("/", async (req, res) => {
  try {
    const photos = await readPhotosData();
    res.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

// GET single photo by ID
router.get("/:id", async (req, res) => {
  try {
    const photos = await readPhotosData();
    const photo = photos.find((p) => p.id === req.params.id);

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.json(photo);
  } catch (error) {
    console.error(`Error fetching photo with ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to fetch photo" });
  }
});

// GET comments for a photo
router.get("/:id/comments", async (req, res) => {
  try {
    const photos = await readPhotosData();
    const photo = photos.find((p) => p.id === req.params.id);

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.json(photo.comments || []);
  } catch (error) {
    console.error(`Error fetching comments for photo ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST a new comment to a photo
router.post("/:id/comments", async (req, res) => {
  try {
    const { name, comment } = req.body;

    if (
      !name ||
      !comment ||
      typeof name !== "string" ||
      typeof comment !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Name and comment are required and must be strings" });
    }

    const photos = await readPhotosData();
    const photoIndex = photos.findIndex((p) => p.id === req.params.id);

    if (photoIndex === -1) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Create new comment
    const newComment = {
      id: uuidv4(),
      name,
      comment,
      timestamp: Date.now(),
    };

    // Add to comments array
    if (!photos[photoIndex].comments) {
      photos[photoIndex].comments = [];
    }

    photos[photoIndex].comments.push(newComment);

    // Save updated data
    await writePhotosData(photos);

    res.status(201).json(newComment);
  } catch (error) {
    console.error(`Error adding comment to photo ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

export default router;
