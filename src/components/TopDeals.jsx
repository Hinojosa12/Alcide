function TopDeals() {
  return (
    <section className="bg-gray-900 py-12 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-16 flex-wrap">
        
        <h2 className="text-4xl font-black text-white uppercase leading-tight text-center">
          TOP FASHION<br />DEALS
        </h2>

        <button className="bg-gray-800 text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-gray-700 transition border border-gray-600">
          VIEW SALE
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-white text-gray-900 px-4 py-2 font-bold text-sm">
            Exclusive COUPON
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white text-xs font-bold uppercase" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>UP TO</span>
            <div className="bg-red-500 text-white px-4 py-2 font-black text-3xl">
              $100
            </div>
            <span className="text-white font-bold text-xl">OFF</span>
          </div>
        </div>

      </div>
    </section>
  )
}

export default TopDeals