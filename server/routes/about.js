const express = require('express')
const router = express.Router()
const db = require('../database')

// GET
router.get('/', (req, res) => {
  const data = db.prepare('SELECT * FROM about_us LIMIT 1').get()
  res.json(data || {})
})

// PUT — actualiza el único registro
router.put('/', (req, res) => {
  const fields = [
    'hero_subtitle','hero_title','hero_description',
    'story_label','story_heading','story_text','story_image1','story_image2',
    'mission_title','mission_text','vision_title','vision_text','quality_title','quality_text',
    'team_title','team_image','team_text',
    'promise_label','promise_heading','promise_text','promise_image',
    'stat1_number','stat1_label','stat2_number','stat2_label','stat3_number','stat3_label'
  ]
  const row = db.prepare('SELECT id FROM about_us LIMIT 1').get()
  if (!row) {
    db.prepare('INSERT INTO about_us DEFAULT VALUES').run()
  }
  const id = (row || db.prepare('SELECT id FROM about_us LIMIT 1').get()).id
  const sets = fields.map(f => `${f} = ?`).join(', ')
  const vals = fields.map(f => req.body[f] ?? '')
  db.prepare(`UPDATE about_us SET ${sets} WHERE id = ?`).run(...vals, id)
  res.json({ success: true })
})

module.exports = router