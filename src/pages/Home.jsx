import HeroSlider from '../components/HeroSlider'
import Brands from '../components/Brands'
import FeaturedProducts from '../components/FeaturedProducts'
import NewArrivals from '../components/NewArrivals'

function Home() {
  return (
    <div>
      <HeroSlider />
      <Brands />
      <FeaturedProducts />
      <NewArrivals />
    </div>
  )
}

export default Home