const express = require('express')
const router = express.Router()
const db = require('../database')

router.get('/', (req, res) => {
  const banners = db.prepare('SELECT * FROM brand_banners ORDER BY sort_order ASC').all()
  res.json(banners)
})

router.post('/', (req, res) => {
  const { image, title, description, button_text, button_url, sort_order } = req.body
  const result = db.prepare(
    'INSERT INTO brand_banners (image, title, description, button_text, button_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(image, title, description, button_text, button_url, sort_order || 0)
  res.json({ id: result.lastInsertRowid, message: 'Banner creado ✅' })
})

router.put('/:id', (req, res) => {
  const { image, title, description, button_text, button_url, sort_order } = req.body
  db.prepare(
    'UPDATE brand_banners SET image=?, title=?, description=?, button_text=?, button_url=?, sort_order=? WHERE id=?'
  ).run(image, title, description, button_text, button_url, sort_order || 0, req.params.id)
  res.json({ message: 'Banner actualizado ✅' })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM brand_banners WHERE id=?').run(req.params.id)
  res.json({ message: 'Banner eliminado ✅' })
})

module.exports = router