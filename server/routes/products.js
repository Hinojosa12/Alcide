const express = require('express')
const router = express.Router()
const db = require('../database')

// Obtener todos los productos
router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all()
  res.json(products)
})

// Obtener un producto por id
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
  res.json(product)
})

// Crear un producto
router.post('/', (req, res) => {
  const { name, price, image, category, brand, description } = req.body
  const result = db.prepare(
    'INSERT INTO products (name, price, image, category, brand, description) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, price, image, category, brand, description)
  res.json({ id: result.lastInsertRowid, message: 'Producto creado ✅' })
})

// Eliminar un producto
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
  res.json({ message: 'Producto eliminado ✅' })
})

module.exports = router