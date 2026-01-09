const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const multer = require('multer');
const { ObjectId } = require('mongodb');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/nudges', async (req, res) => {
  const db = getDB();
  const { id, type, limit = 5, page = 1 } = req.query;

  try {
    if (id) {
      const nudge = await db.collection('nudges').findOne({ _id: new ObjectId(id) });
      return res.json(nudge);
    } else if (type === 'latest') {
      const nudges = await db.collection('nudges')
        .find()
        .sort({ send_time: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .toArray();
      return res.json(nudges);
    } else {
      return res.status(400).json({ error: 'Invalid query' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/nudges', upload.single('image'), async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Request body missing' });
  }

  const payload = {
    type: 'nudge',
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
  const result = await db.collection('nudges').insertOne(payload);
  res.json({ id: result.insertedId });
});


router.put('/nudges/:id', upload.single('image'), async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const updateData = { ...req.body };
  if (req.file) updateData.image = req.file.filename;

  try {
    await db.collection('nudges').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    res.json({ message: 'Nudge updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/nudges/:id', async (req, res) => {
  const db = getDB();
  const { id } = req.params;

  try {
    await db.collection('nudges').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Nudge deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
