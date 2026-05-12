const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./database')
const productsRouter     = require('./routes/products')
const authRouter         = require('./routes/auth')
const mmgRouter          = require('./routes/mmg')
const ordersRouter       = require('./routes/orders')
const slidesRouter       = require('./routes/slides')
const brandsRouter       = require('./routes/brands')
const shopBannerRouter   = require('./routes/shopbanner')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/products',    productsRouter)
app.use('/api/auth',        authRouter)
app.use('/api/mmg',         mmgRouter)
app.use('/api/orders',      ordersRouter)
app.use('/api/slides',      slidesRouter)
app.use('/api/brands',      brandsRouter)
app.use('/api/shop-banner', shopBannerRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Carib Zoom API funcionando ✅' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})