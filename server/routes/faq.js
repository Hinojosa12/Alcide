const express = require('express')
const router = express.Router()
const db = require('../database')

router.get('/', (req, res) => {
  const faqs = db.prepare('SELECT * FROM faqs ORDER BY sort_order ASC, id ASC').all()
  res.json(faqs)
})

router.post('/', (req, res) => {
  const { question, answer, sort_order } = req.body
  const result = db.prepare(
    'INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)'
  ).run(question, answer, sort_order || 0)
  res.json({ id: result.lastInsertRowid, message: 'FAQ created ✅' })
})

router.put('/:id', (req, res) => {
  const { question, answer, sort_order } = req.body
  db.prepare(
    'UPDATE faqs SET question=?, answer=?, sort_order=? WHERE id=?'
  ).run(question, answer, sort_order || 0, req.params.id)
  res.json({ message: 'FAQ updated ✅' })
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM faqs WHERE id = ?').run(req.params.id)
  res.json({ message: 'FAQ deleted ✅' })
})

module.exports = router