const express = require('express')
const router = express.Router()
const db = require('../database')

// Obtener órdenes de un usuario por email
router.get('/', (req, res) => {
  try {
    const { email } = req.query
    if (!email) return res.status(400).json({ message: 'Email required' })

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) return res.json([])

    const orders = db.prepare(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
    ).all(user.id)

    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching orders' })
  }
})

module.exports = router