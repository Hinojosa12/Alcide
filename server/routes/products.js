const express = require('express')
const router = express.Router()
const db = require('../database')

router.get('/', (req, res) => {
  const { category, limit } = req.query
  try {
    let query = 'SELECT * FROM products'
    const params = []
    
    if (category) {
      query += ' WHERE category = ?'
      params.push(category)
    }
    
    query += ' ORDER BY id DESC'
    
    if (limit) {
      query += ' LIMIT ?'
      params.push(parseInt(limit))
    }
    
    const products = db.prepare(query).all(...params)
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

// Obtener un solo producto por ID
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

router.post('/', (req, res) => {
  try {
    const { name, price, image, category, brand, description } = req.body
    const result = db.prepare(
      'INSERT INTO products (name, price, image, category, brand, description) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, price, image, category, brand, description)
    res.json({ id: result.lastInsertRowid, message: 'Producto creado ✅' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', (req, res) => {
  try {
    const { name, price, image, category, brand, description } = req.body
    db.prepare(
      'UPDATE products SET name=?, price=?, image=?, category=?, brand=?, description=? WHERE id=?'
    ).run(name, price, image, category, brand, description, req.params.id)
    res.json({ message: 'Producto actualizado ✅' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id
    // Elimina referencias en order_items primero para evitar FK constraint
    db.prepare('DELETE FROM order_items WHERE product_id=?').run(id)
    db.prepare('DELETE FROM products WHERE id=?').run(id)
    res.json({ message: 'Producto eliminado ✅' })
  } catch (err) {
    console.error('Error eliminando producto:', err)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router