const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./database')
const productsRouter = require('./routes/products')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/products', productsRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Carib Zoom API funcionando ✅' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})