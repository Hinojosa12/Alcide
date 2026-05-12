const express = require('express')
const router = express.Router()
const db = require('../database')

router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY id DESC').all()
  res.json(products)
})

router.post('/', (req, res) => {
  const { name, price, image, category, brand, description } = req.body
  const result = db.prepare(
    'INSERT INTO products (name, price, image, category, brand, description) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, price, image, category, brand, description)
  res.json({ id: result.lastInsertRowid, message: 'Producto creado ✅' })
})

router.put('/:id', (req, res) => {
  const { name, price, image, category, brand, description } = req.body
  db.prepare(
    'UPDATE products SET name=?, price=?, image=?, category=?, brand=?, description=? WHERE id=?'
  ).run(name, price, image, category, brand, description, req.params.id)
  res.json({ message: 'Producto actualizado ✅' })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM products WHERE id=?').run(req.params.id)
  res.json({ message: 'Producto eliminado ✅' })
})

module.exports = router