import { useState, useEffect, useRef } from 'react'

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0)
    }
  }, [open])

  return (
    <div
      className={`border-l-4 transition-all duration-300 ${
        open ? 'border-[#1a9fd4] bg-white shadow-sm' : 'border-[#1a9fd4] bg-gray-50 hover:bg-white hover:shadow-sm'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className={`font-semibold text-[15px] transition-colors duration-200 ${open ? 'text-[#1a9fd4]' : 'text-[#1a9fd4]'}`}>
          {question}
        </span>
        <span
          className="ml-4 flex-shrink-0 text-[#1a9fd4] transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)', fontSize: '22px', lineHeight: 1 }}
        >
          +
        </span>
      </button>

      <div
        style={{
          maxHeight: height + 'px',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div ref={contentRef} className="px-6 pb-5">
          <div className="border-t border-gray-100 pt-4">
            <p className="text-gray-500 text-[14px] leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/faq`)
      .then(r => r.json())
      .then(data => { setFaqs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span>›</span>
        <span className="text-gray-500 font-medium text-xs tracking-widest uppercase">FAQ</span>
      </div>

      {faqs.length === 0 ? (
        <p className="text-center text-gray-400 mt-16">No FAQs yet. Add some from the Admin panel.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {faqs.map(faq => (
            <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      )}
    </div>
  )
}