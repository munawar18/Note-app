import express from 'express';
import { authenticateJWT } from '../middlewares/auth';
import Note from '../models/Note';

const router = express.Router();

router.get('/', authenticateJWT, async (req, res) => {
  const userId = (req as any).user.id;
  const notes = await Note.find({ userId });
  res.json(notes);
});

router.post('/', authenticateJWT, async (req, res) => {
  const userId = (req as any).user.id;
  const note = new Note({ content: req.body.content, userId });
  await note.save();
  res.json(note);
});

router.delete('/:id', authenticateJWT, async (req, res) => {
  const userId = (req as any).user.id;
  const note = await Note.findOneAndDelete({ _id: req.params.id, userId });
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json({ message: 'Note deleted' });
});

export default router;
