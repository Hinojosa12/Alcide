const db = require('./database')

const products = [
  { name: "Coach Crossbody Bags", price: 6500, image: "https://site.carib-zoom.com/wp-content/uploads/2026/04/488-300x300.png", category: "Accessories", brand: "D'Jango", description: "Stylish crossbody bag from Coach" },
  { name: "Black Horse Vital Honey Packs", price: 1000, image: "https://site.carib-zoom.com/wp-content/uploads/2026/04/72-300x300.png", category: "Male Wellness", brand: "Health", description: "Vital honey packs for male wellness" },
  { name: "Sokany Coffee Maker", price: 12000, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/Home-Essentials-Stock-3-2-300x300.png", category: "Appliances", brand: "Home Essentials", description: "Modern coffee maker for your kitchen" },
  { name: "Sokany 3-1 Breakfast Maker", price: 15000, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/437-300x300.png", category: "Appliances", brand: "Home Essentials", description: "3 in 1 breakfast maker" },
  { name: "Guess 3pcs Handbags", price: 0, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/283-300x300.png", category: "Accessories", brand: "Guess", description: "Set of 3 Guess handbags" },
  { name: "7pcs Air-Tight Storage Containers", price: 8000, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/470-1-300x300.png", category: "Kitchen", brand: "Home Essentials", description: "7 piece air-tight storage set" },
  { name: "Baby Feeding Chair", price: 25000, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/485-300x300.webp", category: "Baby & Kids", brand: "Destiny's Clothing", description: "Comfortable baby feeding chair" },
  { name: "Baby Bedside Dell", price: 5000, image: "https://site.carib-zoom.com/wp-content/uploads/2025/10/433-1-300x300.webp", category: "Baby & Kids", brand: "Destiny's Clothing", description: "Baby bedside crib" },
  { name: "Portable Satin Baby Bed", price: 4500, image: "https://site.carib-zoom.com/wp-content/uploads/2026/05/163-300x300.png", category: "Baby & Kids", brand: "Destiny's Clothing", description: "Portable satin baby bed" },
  { name: "Mielle Rosemary Mint Hair Care Set", price: 6000, image: "https://site.carib-zoom.com/wp-content/uploads/2026/05/486-300x300.png", category: "Beauty", brand: "Pieces Plus Sized", description: "Full rosemary mint hair care set" },
  { name: "Kids Learning Foam Clock", price: 1000, image: "https://site.carib-zoom.com/wp-content/uploads/2026/05/355-300x300.png", category: "Stationery", brand: "The Office Depot", description: "Educational foam clock for kids" },
  { name: "Batana Oil Full Hair Care Set", price: 6500, image: "https://site.carib-zoom.com/wp-content/uploads/2026/04/103-300x300.png", category: "Beauty", brand: "Pieces Plus Sized", description: "Complete batana oil hair care set" },
]

const insert = db.prepare(
  'INSERT INTO products (name, price, image, category, brand, description) VALUES (?, ?, ?, ?, ?, ?)'
)

const insertMany = db.transaction((products) => {
  for (const p of products) {
    insert.run(p.name, p.price, p.image, p.category, p.brand, p.description)
  }
})

insertMany(products)
console.log('Productos insertados ✅')