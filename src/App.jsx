import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import MyOrders from './pages/MyOrders'
import About from './pages/About'
import FAQ from './pages/FAQ'
import BrandsPage from './pages/BrandsPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TopDeals from './components/TopDeals'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      <TopDeals />
      <Footer />
    </BrowserRouter>
  )
}

export default App