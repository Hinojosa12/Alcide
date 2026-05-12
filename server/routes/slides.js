const express = require('express')
const router = express.Router()
const db = require('../database')

router.get('/', (req, res) => {
  const slides = db.prepare('SELECT * FROM slides ORDER BY sort_order ASC').all()
  res.json(slides.map(s => ({ ...s, elements: s.elements ? JSON.parse(s.elements) : null })))
})

router.post('/', (req, res) => {
  const { image, title, subtitle, description, button_text, button_url, elements, sort_order } = req.body
  const result = db.prepare(
    'INSERT INTO slides (image, title, subtitle, description, button_text, button_url, elements, sort_order) VALUES (?,?,?,?,?,?,?,?)'
  ).run(image, title, subtitle, description, button_text, button_url, elements ? JSON.stringify(elements) : null, sort_order||0)
  res.json({ id: result.lastInsertRowid })
})

router.put('/:id', (req, res) => {
  const { image, title, subtitle, description, button_text, button_url, elements, sort_order } = req.body
  db.prepare(
    'UPDATE slides SET image=?,title=?,subtitle=?,description=?,button_text=?,button_url=?,elements=?,sort_order=? WHERE id=?'
  ).run(image, title, subtitle, description, button_text, button_url, elements ? JSON.stringify(elements) : null, sort_order||0, req.params.id)
  res.json({ message: 'Slide updated ✅' })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM slides WHERE id=?').run(req.params.id)
  res.json({ message: 'Slide deleted ✅' })
})

module.exports = router