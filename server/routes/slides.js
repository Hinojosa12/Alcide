const express = require('express')
const router = express.Router()
const db = require('../database')

router.get('/', (req, res) => {
  const slides = db.prepare('SELECT * FROM slides ORDER BY sort_order ASC').all()
  res.json(slides)
})

router.post('/', (req, res) => {
  const { image, title, subtitle, description, button_text, button_url, sort_order } = req.body
  const result = db.prepare(
    'INSERT INTO slides (image, title, subtitle, description, button_text, button_url, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(image, title, subtitle, description, button_text, button_url, sort_order || 0)
  res.json({ id: result.lastInsertRowid, message: 'Slide creado ✅' })
})

router.put('/:id', (req, res) => {
  const { image, title, subtitle, description, button_text, button_url, sort_order } = req.body
  db.prepare(
    'UPDATE slides SET image=?, title=?, subtitle=?, description=?, button_text=?, button_url=?, sort_order=? WHERE id=?'
  ).run(image, title, subtitle, description, button_text, button_url, sort_order || 0, req.params.id)
  res.json({ message: 'Slide actualizado ✅' })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM slides WHERE id=?').run(req.params.id)
  res.json({ message: 'Slide eliminado ✅' })
})

module.exports = router