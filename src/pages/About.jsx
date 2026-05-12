import { useState, useEffect, useRef } from 'react'

function AnimatedStat({ value, label }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          // Extraer número y sufijo (e.g. "100,000+" → num=100000, suffix="+")
          const raw = value.replace(/,/g, '')
          const match = raw.match(/^(\d+)(.*)$/)
          if (!match) { setDisplay(value); return }
          const target = parseInt(match[1])
          const suffix = match[2] || ''
          const duration = 2000
          const steps = 60
          const increment = target / steps
          let current = 0
          let step = 0
          const timer = setInterval(() => {
            step++
            current = Math.min(Math.round(increment * step), target)
            setDisplay(current.toLocaleString() + suffix)
            if (current >= target) clearInterval(timer)
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-center">
      <p className="text-5xl font-extrabold text-gray-900 mb-2">{display}</p>
      <p className="text-gray-500 text-[15px]">{label}</p>
    </div>
  )
}

const DEFAULT = {
  hero_subtitle: 'Who We Are', hero_title: 'About Us',
  hero_description: 'We are your ultimate destination for quality, convenience, and style — offering a collection of trusted brands that bring together innovation, fashion, and everyday essentials.',
  story_label: 'Since 2019', story_heading: 'Our story is one of growth, creativity, and purpose.',
  story_text: 'Founded in March 2019, Carib-Zoom Inc began as a small social commerce venture and has evolved into a powerhouse of diverse brands serving customers nationwide.',
  story_image1: '', story_image2: '',
  mission_title: 'Our Mission', mission_text: 'Our focus on simplicity, transparency, and user-centric design drives us to create a trusted platform that makes every transaction smarter and more efficient.',
  vision_title: 'Our Vision', vision_text: "To be Guyana's most trusted and innovative ecommerce and social commerce leader, connecting communities to the best products in fashion, home, lifestyle, and beyond.",
  quality_title: 'Our Quality', quality_text: "Every product we offer — whether it's stylish apparel, stunning jewelry, or essential home décor — represents our dedication to quality and detail.",
  team_title: 'Our Team', team_image: '', team_text: 'Behind every brand is a dedicated team of professionals who bring passion, creativity, and excellence to everything we do.',
  promise_label: 'Our Promise', promise_heading: 'We go the extra mile to keep every customer happy',
  promise_text: 'We provide fast, reliable service while staying committed to sustainability and innovation, reducing waste, supporting local businesses, and using modern technology to make shopping easier and more convenient.',
  promise_image: '',
  stat1_number: '100,000+', stat1_label: 'Sales in 8 Years',
  stat2_number: '99%',      stat2_label: 'Customer Satisfaction Rate',
  stat3_number: '2,000+',   stat3_label: 'Products Available',
}

export default function About() {
  const [d, setD] = useState(DEFAULT)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/about`)
      .then(r => r.json())
      .then(data => { if (data && data.id) setD({ ...DEFAULT, ...data }) })
      .catch(() => {})
  }, [])

  return (
    <div className="w-full">

      {/* ── 1. HERO ── */}
      <section className="bg-gray-100 py-28 text-center">
        <p className="text-blue-500 font-semibold text-base mb-3">{d.hero_subtitle}</p>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">{d.hero_title}</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">{d.hero_description}</p>
      </section>

      {/* ── 2. STORY ── */}
      <section className="max-w-screen-xl mx-auto px-8 py-20 flex flex-col md:flex-row items-center gap-16">
        {/* Imágenes solapadas */}
        <div className="relative flex-shrink-0 w-full md:w-[480px] h-[380px]">
          {d.story_image1 && (
            <img src={d.story_image1} alt="Story 1"
              className="absolute top-0 left-0 w-[70%] h-[75%] object-cover shadow-lg z-10" />
          )}
          {d.story_image2 && (
            <img src={d.story_image2} alt="Story 2"
              className="absolute bottom-0 right-0 w-[65%] h-[70%] object-cover shadow-xl z-20 border-4 border-white" />
          )}
          {!d.story_image1 && !d.story_image2 && (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
              Agrega imágenes desde Admin
            </div>
          )}
        </div>
        {/* Texto */}
        <div className="flex-1">
          <p className="text-blue-500 font-semibold text-base mb-3">{d.story_label}</p>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-6">{d.story_heading}</h2>
          <p className="text-gray-500 text-[17px] leading-relaxed">{d.story_text}</p>
        </div>
      </section>

      {/* ── 3. MISSION / VISION / QUALITY ── */}
      <section className="bg-[#1a9fd4] py-20 px-8">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
          {[
            { title: d.mission_title, text: d.mission_text },
            { title: d.vision_title,  text: d.vision_text  },
            { title: d.quality_title, text: d.quality_text },
          ].map((item, i) => (
            <div key={i} className="px-4">
              <h3 className="text-xl font-bold mb-5">{item.title}</h3>
              <p className="text-white/80 text-[15px] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. TEAM ── */}
      <section className="max-w-screen-xl mx-auto px-8 py-20 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10">{d.team_title}</h2>
        {d.team_image && (
          <img src={d.team_image} alt="Our Team"
            className="w-full max-w-3xl mx-auto object-cover shadow-md mb-8" />
        )}
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">{d.team_text}</p>
      </section>

      {/* ── 5. PROMISE ── */}
      <section className="flex flex-col md:flex-row min-h-[420px]">
        <div className="flex-1 bg-gray-100 flex items-center px-16 py-20">
          <div className="max-w-lg">
            <p className="text-blue-500 font-semibold text-base mb-3">{d.promise_label}</p>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-6">{d.promise_heading}</h2>
            <p className="text-gray-500 text-[16px] leading-relaxed">{d.promise_text}</p>
          </div>
        </div>
        <div className="flex-1 min-h-[300px]">
          {d.promise_image
            ? <img src={d.promise_image} alt="Promise" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-400 text-sm">Agrega imagen desde Admin</div>
          }
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedStat value={d.stat1_number} label={d.stat1_label} />
          <AnimatedStat value={d.stat2_number} label={d.stat2_label} />
          <AnimatedStat value={d.stat3_number} label={d.stat3_label} />
        </div>
      </section>

    </div>
  )
}