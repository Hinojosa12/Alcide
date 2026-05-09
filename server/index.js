const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./database')
const productsRouter = require('./routes/products')
const authRouter = require('./routes/auth')
const mmgRouter = require('./routes/mmg')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/auth', authRouter)
app.use('/api/mmg', mmgRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Carib Zoom API funcionando ✅' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})