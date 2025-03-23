const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

// GET all tags
router.get('/', async (req, res) => {
  try {
    const tags = await fs.readJSON(path.join(__dirname, '../data/tags.json'));
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

module.exports = router;