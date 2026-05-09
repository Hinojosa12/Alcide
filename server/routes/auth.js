const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database')

const SECRET = process.env.JWT_SECRET || 'caribzoom_secret'

// Registro
router.post('/register', (req, res) => {
  const { name, email, password } = req.body
  
  const exists = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (exists) return res.status(400).json({ message: 'Email ya registrado' })

  const hashed = bcrypt.hashSync(password, 10)
  const result = db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  ).run(name, email, hashed)

  const token = jwt.sign({ id: result.lastInsertRowid, email }, SECRET, { expiresIn: '7d' })
  res.json({ token, name, email })
})

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) return res.status(400).json({ message: 'Usuario no encontrado' })

  const valid = bcrypt.compareSync(password, user.password)
  if (!valid) return res.status(400).json({ message: 'Contraseña incorrecta' })

  const token = jwt.sign({ id: user.id, email }, SECRET, { expiresIn: '7d' })
  res.json({ token, name: user.name, email: user.email })
})

module.exports = router