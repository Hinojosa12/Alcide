import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ShoppingCart, Heart, Minus, Plus, Check } from 'lucide-react'

function StarRating({ rating = 0, reviewCount = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(s => (
          <svg key={s} className={`w-4 h-4 ${s <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      {reviewCount > 0 && (
        <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
      )}
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    setLoading(true)
    // Obtener el producto actual
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Product not found')
        return r.json()
      })
      .then(data => {
        setProduct(data)
        // Obtener productos relacionados (misma categoría)
        return fetch(`${import.meta.env.VITE_API_URL}/api/products?category=${data.category}`)
      })
      .then(r => r.json())
      .then(related => {
        // Filtrar el producto actual de los relacionados
        const filtered = related.filter(p => p.id !== parseInt(id)).slice(0, 4)
        setRelatedProducts(filtered)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400 text-lg">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-screen-xl mx-auto px-16 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-gray-600">Home</Link>
        <span>›</span>
        <Link to="/shop" className="hover:text-gray-600">Shop</Link>
        <span>›</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-gray-600">{product.category}</Link>
        <span>›</span>
        <span className="text-gray-600">{product.name}</span>
      </div>

      {/* Product Main Section */}
      <div className="flex gap-12 mb-12">
        {/* Product Image */}
        <div className="w-1/2">
          <div className="sticky top-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-contain"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          {/* Brand & SKU */}
          {product.brand && (
            <p className="text-sm text-gray-500 mb-4">
              Brand: <span className="font-medium text-gray-700">{product.brand}</span>
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-4 mb-4">
            <StarRating rating={4} reviewCount={12} />
            <button className="text-sm text-blue-600 hover:text-blue-700">Write a review</button>
          </div>

          {/* Price */}
          <div className="mb-6">
            {product.old_price ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">${product.price.toLocaleString()}</span>
                <span className="text-lg text-gray-400 line-through">${product.old_price.toLocaleString()}</span>
                <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded">
                  Save {Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">${product.price.toLocaleString()}</span>
            )}
            <p className="text-sm text-green-600 mt-1">In stock</p>
          </div>

          {/* Short Description */}
          {product.description && (
            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed line-clamp-3">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={decrementQuantity}
                className="px-3 py-2 hover:bg-gray-100 transition"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="px-3 py-2 hover:bg-gray-100 transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              {addedToCart ? <Check size={20} /> : <ShoppingCart size={20} />}
              {addedToCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded font-semibold hover:bg-gray-50 transition flex items-center gap-2">
              <Heart size={18} />
              Wishlist
            </button>
          </div>

          {/* Buy Now Button */}
          <button
            onClick={() => {
              handleAddToCart()
            }}
            className="w-full bg-gray-900 text-white py-3 rounded font-semibold hover:bg-gray-800 transition"
          >
            Buy Now
          </button>

          {/* Meta Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-500">
            <p>SKU: {product.id}</p>
            <p>Category: <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-blue-600 hover:underline">{product.category}</Link></p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-12">
        <div className="border-b border-gray-200">
          <div className="flex gap-2 flex-wrap">
            <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}>
              Description
            </TabButton>
            <TabButton active={activeTab === 'additional'} onClick={() => setActiveTab('additional')}>
              Additional Information
            </TabButton>
            <TabButton active={activeTab === 'brand'} onClick={() => setActiveTab('brand')}>
              Brand
            </TabButton>
            <TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
              Reviews
            </TabButton>
            <TabButton active={activeTab === 'policies'} onClick={() => setActiveTab('policies')}>
              Store Policies
            </TabButton>
            <TabButton active={activeTab === 'inquiries'} onClick={() => setActiveTab('inquiries')}>
              Inquiries
            </TabButton>
          </div>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}
          {activeTab === 'additional' && (
            <div className="text-gray-600">
              <p>Additional product information will be displayed here. You can add details like dimensions, weight, materials, care instructions, etc.</p>
            </div>
          )}
          {activeTab === 'brand' && product.brand && (
            <div className="text-gray-600">
              <p><strong>Brand:</strong> {product.brand}</p>
              <p className="mt-2">Learn more about {product.brand} products and collections.</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="text-gray-600">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          )}
          {activeTab === 'policies' && (
            <div className="text-gray-600">
              <h4 className="font-semibold text-gray-800 mb-2">Store Policies</h4>
              <p>Shipping, returns, and exchange policies will be displayed here.</p>
            </div>
          )}
          {activeTab === 'inquiries' && (
            <div className="text-gray-600">
              <p>For any questions about this product, please contact us at <a href="mailto:info@carib-zoom.com" className="text-blue-600">info@carib-zoom.com</a> or call +592 613 7666.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-4 gap-5">
            {relatedProducts.map(relProduct => (
              <Link key={relProduct.id} to={`/product/${relProduct.id}`} className="group border border-gray-100 bg-white hover:shadow-md transition overflow-hidden cursor-pointer">
                <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1 / 1' }}>
                  <img
                    src={relProduct.image}
                    alt={relProduct.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{relProduct.category}</p>
                  <h3 className="text-[13px] text-gray-800 leading-snug mb-1 line-clamp-2">{relProduct.name}</h3>
                  {relProduct.price > 0 && <p className="text-[14px] font-bold text-gray-800">${relProduct.price.toLocaleString()}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}