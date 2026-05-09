const express = require('express')
const router = express.Router()
const crypto = require('crypto')

// ── CREDENCIALES MMG (UAT) ─────────────────────────────
const SECRET_KEY = '5//tT92n2xB8fab+YXkEwYRLODo3sMkh3imGOpAB1lqcz8JcdZHxVLDanBHYpl5A'
const MERCHANT_ID = '9991123'
const CLIENT_ID = 'b9afbdc1-3093-4224-bf52-637d95d0ed0c'
const MERCHANT_NAME = 'Carib Zoom Inc'
const BASE_URL = 'https://mmgpg.mmgtest.net/mmg-pg/web/payments'

const MMG_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtpSDu125ZaS/L6V/diKM
FRINuEdJG8xojtFYwlJAh0K0fcuXyRu3m042gJBWXa7Ccyx/UORbFn8EXKn4Y+PQ
AWxL+CJ0K1KzVNQKsab/bTwO1xOMVpxbvXs5g/yucjVA3qVRarzVLwUrKG8Znt+C
5zyrRMqI3NDm6KCZElsf5zsvLpo12H4Rj4gHF5BF9vBc++des3C0oZIu4tp83cMu
CD/ZjK3Sm+yc6dNvLc0ArNZBZB3PzeESh/EAxqzGRu0YVqSPtaYhkUHh6Rn9TOO7
SyshWNeczYWT9HJAjFCT7TtAbGkrIhghsRMd8b7GpnsqT9RYBHH8vI728KhktAdI
748fEuwTBNgN7jqvmG6dpkfgi2ESxzA8aT37uypPaNdsax/pGbdL1Gwtry0/PbajK
r6N3nuF1xL9qcanAb2m80nLDlDFyuFiLa+/FN3B1482HOCkETEA+jqjGd4x5kPJj
sSNaiTLKYW5vb14NrWYlwHXx5c6dmTbTft14dn4CA5XzkQjlwmrynZSqPDOXhrFs
knOJTFe81O5H4xFhkJ/qoctNw3suTI/yTmNqL8GJwR3A6JRumTjreiqaEUkKiZ3F
hf8Id4cNJOubgTB/8PaKy0INNhQxWS6oYCWVYFwI4fKUTeGW3o5EC3OB06kAcCbn
sufV0axUesDJpVtwfzAga0CAwEAAQ==
-----END PUBLIC KEY-----`

// Generar checkout URL
router.post('/generate-checkout', (req, res) => {
  try {
    const { amount, description, nombre, email } = req.body

    const timestamp = Math.floor(Date.now() / 1000)
    const merchantTransactionId = String(timestamp)

    const checkoutObject = {
      secretKey: SECRET_KEY,
      amount: String(amount),
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      productDescription: description || 'Carib Zoom Order',
      requestInitiationTime: timestamp,
      merchantName: MERCHANT_NAME
    }

    const jsonBytes = Buffer.from(JSON.stringify(checkoutObject), 'latin1')

    const encrypted = crypto.publicEncrypt(
      {
        key: MMG_PUBLIC_KEY,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      jsonBytes
    )

    const token = encrypted.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    const checkoutUrl = `${BASE_URL}?token=${token}&merchantId=${MERCHANT_ID}&X-Client-ID=${CLIENT_ID}`

    res.json({ checkoutUrl, merchantTransactionId })
  } catch (err) {
    console.error('MMG Error:', err)
    res.status(500).json({ message: 'Error generating MMG checkout' })
  }
})

module.exports = router