const express = require('express')
const router = express.Router()
const db = require('../database')

// GET - obtener el banner actual
router.get('/', (req, res) => {
  const banner = db.prepare('SELECT * FROM shop_banner LIMIT 1').get()
  res.json(banner || {})
})

// PUT - actualizar el banner (siempre es 1 solo registro)
router.put('/', (req, res) => {
  const {
    image = '',
    top_text = 'Find the Boundaries. Push Through!',
    title = 'Summer Sale',
    subtitle = '30% OFF',
    price_text = '$19999',
    button_text = 'GET YOURS!',
    button_url = '/shop',
    bg_color = '#2d8a6e'
  } = req.body

  const existing = db.prepare('SELECT id FROM shop_banner LIMIT 1').get()
  if (existing) {
    db.prepare(`
      UPDATE shop_banner SET
        image = ?, top_text = ?, title = ?, subtitle = ?,
        price_text = ?, button_text = ?, button_url = ?, bg_color = ?
      WHERE id = ?
    `).run(image, top_text, title, subtitle, price_text, button_text, button_url, bg_color, existing.id)
  } else {
    db.prepare(`
      INSERT INTO shop_banner (image, top_text, title, subtitle, price_text, button_text, button_url, bg_color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(image, top_text, title, subtitle, price_text, button_text, button_url, bg_color)
  }
  res.json({ success: true })
})

module.exports = router