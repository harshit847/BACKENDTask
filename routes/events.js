const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const multer = require('multer');
const { ObjectId } = require('mongodb');

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// GET Event by id
router.get('/events', async (req, res) => {
  const db = getDB();
  const { id, type, limit = 5, page = 1 } = req.query;

  try {
    if (id) {
      const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
      return res.json(event);
    } else if (type === 'latest') {
      const events = await db.collection('events')
        .find()
        .sort({ schedule: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .toArray();
      return res.json(events);
    } else {
      return res.status(400).json({ error: 'Invalid query' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Create Event
router.post('/events', upload.single('image'), async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Request body missing' });
  }

  const payload = {
    type: 'event',
    name: req.body.name,
    tagline: req.body.tagline,
    schedule: req.body.schedule,
    description: req.body.description,
    moderator: req.body.moderator,
    category: req.body.category,
    sub_category: req.body.sub_category,
    rigor_rank: parseInt(req.body.rigor_rank),
    files: req.file ? [req.file.filename] : [],
    attendees: []
  };

  const db = getDB();
  const result = await db.collection('events').insertOne(payload);
  res.json({ id: result.insertedId });
});


// PUT Update Event
router.put('/events/:id', upload.single('image'), async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const updateData = { ...req.body };
  if (req.file) updateData.files = [req.file.filename];

  try {
    await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    res.json({ message: 'Event updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Event
router.delete('/events/:id', async (req, res) => {
  const db = getDB();
  const { id } = req.params;

  try {
    await db.collection('events').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
