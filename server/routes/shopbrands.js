const express = require('express')
const router = express.Router()
const db = require('../database')

router.get('/', (req, res) => {
  const brands = db.prepare('SELECT * FROM shop_brands ORDER BY sort_order ASC, id ASC').all()
  res.json(brands)
})

router.post('/', (req, res) => {
  const { image, title, description, button_text, button_url, whatsapp, size, text_x, text_y, text_color, sort_order } = req.body
  const result = db.prepare(
    'INSERT INTO shop_brands (image, title, description, button_text, button_url, whatsapp, size, text_x, text_y, text_color, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(image, title, description, button_text, button_url, whatsapp||'', size||'square', text_x||5, text_y||20, text_color||'#1a1a1a', sort_order||0)
  res.json({ id: result.lastInsertRowid, message: 'Shop brand created ✅' })
})

router.put('/:id', (req, res) => {
  const { image, title, description, button_text, button_url, whatsapp, size, text_x, text_y, text_color, sort_order } = req.body
  db.prepare(
    'UPDATE shop_brands SET image=?, title=?, description=?, button_text=?, button_url=?, whatsapp=?, size=?, text_x=?, text_y=?, text_color=?, sort_order=? WHERE id=?'
  ).run(image, title, description, button_text, button_url, whatsapp||'', size||'square', text_x||5, text_y||20, text_color||'#1a1a1a', sort_order||0, req.params.id)
  res.json({ message: 'Shop brand updated ✅' })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM shop_brands WHERE id = ?').run(req.params.id)
  res.json({ message: 'Shop brand deleted ✅' })
})

module.exports = router