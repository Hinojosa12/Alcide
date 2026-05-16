import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

const API           = import.meta.env.VITE_API_URL
const SLIDER_HEIGHT = 600   // altura real del slider en producción

const FONTS = [
  { label:'Default', value:'' },
  { label:'Serif',   value:'Georgia, serif' },
  { label:'Impact',  value:'Impact, sans-serif' },
  { label:'Mono',    value:'"Courier New", monospace' },
  { label:'Cursive', value:'cursive' },
  { label:'Narrow',  value:'"Arial Narrow", Arial, sans-serif' },
]

function defaultSlideEls(f) {
  return [
    { id:'title',    label:'Título',      text:f.title||'Título',          x:8, y:25, color:'#1a1a1a', font:'', size:48, bold:true,  italic:true,  width:40 },
    { id:'subtitle', label:'Subtítulo',   text:f.subtitle||'',             x:8, y:47, color:'#1a1a1a', font:'', size:60, bold:true,  italic:false, width:40 },
    { id:'desc',     label:'Descripción', text:f.description||'',          x:8, y:67, color:'#555555', font:'', size:15, bold:false, italic:false, width:40 },
    { id:'btn',      label:'Botón',       text:f.button_text||'SHOP NOW!', x:8, y:75, color:'#ffffff', font:'', size:13, bold:true,  italic:false, width:15, url:f.button_url||'/shop' },
  ]
}

function mergeElements(saved, defaults) {
  if (!saved || !saved.length) return defaults
  const savedIds = new Set(saved.map(e => e.id))
  return [...saved, ...defaults.filter(e => !savedIds.has(e.id))]
}

function elStyle(el) {
  return {
    color:      el.color  || '#1a1a1a',
    fontFamily: el.font   || 'inherit',
    fontSize:   `${el.size || 16}px`,
    fontWeight: el.bold   ? 'bold'   : 'normal',
    fontStyle:  el.italic ? 'italic' : 'normal',
    lineHeight: 1.2,
    whiteSpace: 'pre-wrap',
    wordBreak:  'break-word',
    display:    'block',
  }
}

function parseEls(raw) {
  if (!raw) return []
  if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
  return Array.isArray(raw) ? raw : []
}

/* ── Resize handle ── */
function Handle({ pos, onMouseDown }) {
  const p = {
    nw:{top:0,left:0,transform:'translate(-50%,-50%)',cursor:'nw-resize'},
    n: {top:0,left:'50%',transform:'translate(-50%,-50%)',cursor:'n-resize'},
    ne:{top:0,right:0,transform:'translate(50%,-50%)',cursor:'ne-resize'},
    e: {top:'50%',right:0,transform:'translate(50%,-50%)',cursor:'e-resize'},
    se:{bottom:0,right:0,transform:'translate(50%,50%)',cursor:'se-resize'},
    s: {bottom:0,left:'50%',transform:'translate(-50%,50%)',cursor:'s-resize'},
    sw:{bottom:0,left:0,transform:'translate(-50%,50%)',cursor:'sw-resize'},
    w: {top:'50%',left:0,transform:'translate(-50%,-50%)',cursor:'w-resize'},
  }
  return (
    <div onMouseDown={e=>{e.stopPropagation();e.preventDefault();onMouseDown(pos)}}
      style={{position:'absolute',width:10,height:10,background:'white',border:'2px solid #3b82f6',borderRadius:2,zIndex:30,...p[pos]}}/>
  )
}

/* ─────────────────────────────────────────────────────────────────
   SlideEditor — overlay full-screen que muestra el slide al mismo
   ancho que producción. Lo que ves ES lo que sale.
   ───────────────────────────────────────────────────────────────── */
function SlideEditor({ slide, onClose, onSaved }) {
  const [elements, setElements]   = useState(() => mergeElements(parseEls(slide.elements), defaultSlideEls(slide)))
  const [selectedId, setSelectedId] = useState(null)
  const [saving, setSaving]       = useState(false)
  const canvasRef = useRef(null)
  const moving    = useRef(null)
  const resizing  = useRef(null)
  const selected  = elements.find(e => e.id === selectedId)

  const getPct = useCallback(e => {
    const r = canvasRef.current.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(90, Math.round(((e.clientX - r.left) / r.width)  * 100))),
      y: Math.max(0, Math.min(90, Math.round(((e.clientY - r.top)  / r.height) * 100))),
    }
  }, [])

  const onMove = useCallback(e => {
    if (!canvasRef.current) return
    if (moving.current) {
      const {x,y} = getPct(e)
      setElements(prev => prev.map(el => el.id===moving.current ? {...el,x,y} : el))
      return
    }
    if (resizing.current) {
      const {id,handle,startX,startY,startSize,startWidth} = resizing.current
      const r  = canvasRef.current.getBoundingClientRect()
      const dx = ((e.clientX - startX) / r.width)  * 100
      const dy = ((e.clientY - startY) / r.height) * 100
      setElements(prev => prev.map(el => {
        if (el.id !== id) return el
        let u = {...el}
        if (['e','ne','se'].includes(handle)) u.width = Math.max(5,Math.min(95,Math.round(startWidth+dx)))
        if (['w','nw','sw'].includes(handle)) u.width = Math.max(5,Math.min(95,Math.round(startWidth-dx)))
        if (['se','sw','ne','nw','s'].includes(handle)) {
          const delta = ['ne','nw'].includes(handle) ? -dy : dy
          u.size = Math.max(6,Math.min(300,Math.round(startSize+delta*1.5)))
        }
        return u
      }))
    }
  }, [getPct])

  const onUp = useCallback(() => { moving.current=null; resizing.current=null }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => { window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp) }
  }, [onMove, onUp])

  const updateEl = (id, patch) => setElements(prev => prev.map(el => el.id===id ? {...el,...patch} : el))

  const handleSave = async () => {
    setSaving(true)
    await fetch(`${API}/api/slides/${slide.id}`, {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({...slide, elements})
    })
    setSaving(false)
    onSaved()
    onClose()
  }

  const s = { border:'1px solid #d1d5db', borderRadius:6, padding:'6px 10px', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box' }

  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.93)',overflow:'auto',display:'flex',flexDirection:'column',alignItems:'center',padding:'16px 0 60px'}}>

      {/* Barra superior */}
      <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px 14px',color:'white',flexShrink:0}}>
        <span style={{fontWeight:'bold',fontSize:15}}>✏️ Editando slide — arrastra los textos, usa los handles para cambiar tamaño y ancho</span>
        <div style={{display:'flex',gap:10}}>
          <button onClick={handleSave} disabled={saving}
            style={{background:'#2563eb',color:'white',border:'none',padding:'9px 24px',borderRadius:6,cursor:'pointer',fontWeight:'bold',fontSize:14,opacity:saving?.6:1}}>
            {saving ? 'Guardando...' : '💾 Guardar'}
          </button>
          <button onClick={onClose}
            style={{background:'#374151',color:'white',border:'none',padding:'9px 18px',borderRadius:6,cursor:'pointer',fontSize:14}}>
            ✕ Cancelar
          </button>
        </div>
      </div>

      {/* ── Canvas al 100% del ancho — igual que producción ── */}
      <div style={{width:'100%',flexShrink:0}}>
        <div ref={canvasRef}
          style={{position:'relative',width:'100%',height:SLIDER_HEIGHT,overflow:'hidden',cursor:'default'}}
          onClick={() => setSelectedId(null)}>

          <img src={slide.image} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',pointerEvents:'none'}}/>

          {elements.map(el => {
            const isSel = selectedId === el.id
            return (
              <div key={el.id}
                style={{position:'absolute',left:`${el.x}%`,top:`${el.y}%`,width:`${el.width||40}%`,zIndex:10,cursor:'move',
                  outline: isSel ? '2px solid #3b82f6' : '1px dashed rgba(255,255,255,0.25)'}}
                onMouseDown={e=>{e.stopPropagation();setSelectedId(el.id);moving.current=el.id}}
                onClick={e=>e.stopPropagation()}>

                {el.id==='btn'
                  ? <span style={{...elStyle(el),display:'inline-block',background:'#111827',color:'#fff',padding:'8px 20px',textTransform:'uppercase'}}>{el.text||'Botón'}</span>
                  : el.id==='wa'
                    ? <span style={{...elStyle(el),display:'inline-flex',alignItems:'center',gap:6,background:'#22c55e',color:'#fff',padding:'6px 14px',borderRadius:4}}>📱 {el.text||'WhatsApp'}</span>
                    : <span style={elStyle(el)}>{el.text}</span>
                }

                {isSel && ['nw','n','ne','e','se','s','sw','w'].map(pos=>(
                  <Handle key={pos} pos={pos} onMouseDown={handle=>{
                    resizing.current={id:el.id,handle,startX:0,startY:0,startSize:el.size||16,startWidth:el.width||40}
                    const cap=ev=>{resizing.current.startX=ev.clientX;resizing.current.startY=ev.clientY;window.removeEventListener('mousemove',cap,{once:true})}
                    window.addEventListener('mousemove',cap,{once:true})
                    moving.current=null
                  }}/>
                ))}

                {isSel && (
                  <div style={{position:'absolute',top:-22,left:0,background:'#2563eb',color:'white',fontSize:11,padding:'2px 8px',borderRadius:3,whiteSpace:'nowrap',pointerEvents:'none'}}>
                    {el.label} — {el.width||40}% ancho · {el.size||16}px
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Panel de estilos del elemento seleccionado */}
      {selected && (
        <div style={{width:'100%',background:'white',borderTop:'3px solid #3b82f6',padding:'20px 24px',flexShrink:0}}>
          <p style={{fontWeight:'bold',color:'#1d4ed8',marginBottom:14,fontSize:14}}>✏️ Editando: {selected.label}</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,maxWidth:1100}}>
            <div style={{gridColumn:'1/3'}}>
              <label style={{fontSize:12,color:'#6b7280',display:'block',marginBottom:4}}>Texto (Enter = salto de línea)</label>
              <textarea value={selected.text||''} onChange={e=>updateEl(selected.id,{text:e.target.value})} rows={2} style={{...s,resize:'vertical'}}/>
            </div>
            {(selected.id==='btn'||selected.id==='wa') && (
              <div style={{gridColumn:'3/5'}}>
                <label style={{fontSize:12,color:'#6b7280',display:'block',marginBottom:4}}>{selected.id==='wa'?'Número WhatsApp':'URL del botón'}</label>
                <input value={selected.url||''} onChange={e=>updateEl(selected.id,{url:e.target.value})} style={s} placeholder={selected.id==='wa'?'+5071234567':'/shop'}/>
              </div>
            )}
            <div>
              <label style={{fontSize:12,color:'#6b7280',display:'block',marginBottom:4}}>Fuente</label>
              <select value={selected.font||''} onChange={e=>updateEl(selected.id,{font:e.target.value})} style={{...s,background:'white'}}>
                {FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:12,color:'#6b7280',display:'block',marginBottom:4}}>Tamaño (px)</label>
              <input type="number" min="6" max="300" value={selected.size||16} onChange={e=>updateEl(selected.id,{size:parseInt(e.target.value)||16})} style={s}/>
            </div>
            <div>
              <label style={{fontSize:12,color:'#6b7280',display:'block',marginBottom:4}}>Ancho (%)</label>
              <input type="number" min="5" max="95" value={selected.width||40} onChange={e=>updateEl(selected.id,{width:parseInt(e.target.value)||40})} style={s}/>
            </div>
            <div>
              <label style={{fontSize:12,color:'#6b7280',display:'block',marginBottom:4}}>Color</label>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <input type="color" value={selected.color||'#1a1a1a'} onChange={e=>updateEl(selected.id,{color:e.target.value})} style={{width:38,height:34,border:'1px solid #d1d5db',borderRadius:4,cursor:'pointer',padding:2}}/>
                <input value={selected.color||'#1a1a1a'} onChange={e=>updateEl(selected.id,{color:e.target.value})} style={{...s,flex:1}}/>
              </div>
            </div>
            <div style={{gridColumn:'1/-1',display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
              <button onClick={()=>updateEl(selected.id,{bold:!selected.bold})} style={{padding:'7px 16px',fontWeight:'bold',borderRadius:4,border:'1px solid #d1d5db',cursor:'pointer',background:selected.bold?'#111827':'white',color:selected.bold?'white':'#374151'}}>B</button>
              <button onClick={()=>updateEl(selected.id,{italic:!selected.italic})} style={{padding:'7px 16px',fontStyle:'italic',borderRadius:4,border:'1px solid #d1d5db',cursor:'pointer',background:selected.italic?'#111827':'white',color:selected.italic?'white':'#374151'}}>I</button>
              <button onClick={()=>updateEl(selected.id,{color:'#ffffff'})} style={{padding:'7px 14px',background:'#111827',color:'white',border:'none',borderRadius:4,cursor:'pointer',fontSize:12}}>Blanco</button>
              <button onClick={()=>updateEl(selected.id,{color:'#1a1a1a'})} style={{padding:'7px 14px',background:'white',color:'#111827',border:'1px solid #d1d5db',borderRadius:4,cursor:'pointer',fontSize:12}}>Negro</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── HeroSlider principal ─── */
function HeroSlider() {
  const [banners, setBanners] = useState([])
  const [editSlide, setEditSlide] = useState(null)
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const load = () => fetch(`${API}/api/slides`).then(r=>r.json()).then(setBanners).catch(()=>{})

  useEffect(() => { load() }, [])

  if (banners.length === 0) return null

  return (
    <>
      {/* Editor inline — aparece cuando admin hace clic en "Editar slide" */}
      {editSlide && (
        <SlideEditor
          slide={editSlide}
          onClose={() => setEditSlide(null)}
          onSaved={load}
        />
      )}

      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={isAdmin ? false : { delay:5000, disableOnInteraction:false }}
        speed={800}
        navigation
        loop={banners.length >= 3}
        slidesPerView={1}
      >
        {banners.map(banner => {
          const els = parseEls(banner.elements)
          return (
            <SwiperSlide key={banner.id}>
              <div style={{position:'relative',width:'100%',height:SLIDER_HEIGHT,overflow:'hidden'}}>
                <img src={banner.image} alt={banner.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>

                {/* Renderiza elementos del canvas */}
                {els.length > 0
                  ? els.map(el => {
                      if (!el.text) return null
                      const w = el.width || 40
                      if (el.id === 'btn') return (
                        <div key={el.id} style={{position:'absolute',left:`${el.x}%`,top:`${el.y}%`,width:`${w}%`}}>
                          <a href={el.url||'#'} style={{display:'inline-block',background:'#111827',color:'#fff',padding:'8px 20px',fontSize:`${el.size||13}px`,fontWeight:'bold',textTransform:'uppercase',fontFamily:el.font||'inherit',textDecoration:'none',lineHeight:1.2}}>
                            {el.text}
                          </a>
                        </div>
                      )
                      if (el.id === 'wa' && el.url) return (
                        <div key={el.id} style={{position:'absolute',left:`${el.x}%`,top:`${el.y}%`,width:`${w}%`}}>
                          <a href={`https://wa.me/${el.url.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer"
                            style={{display:'inline-flex',alignItems:'center',gap:6,background:'#22c55e',color:'#fff',padding:'6px 14px',borderRadius:4,fontSize:`${el.size||12}px`,fontWeight:'bold',textDecoration:'none'}}>
                            📱 {el.text}
                          </a>
                        </div>
                      )
                      return (
                        <div key={el.id} style={{position:'absolute',left:`${el.x}%`,top:`${el.y}%`,width:`${w}%`}}>
                          <span style={{color:el.color||'#1a1a1a',fontFamily:el.font||'inherit',fontSize:`${el.size||16}px`,fontWeight:el.bold?'bold':'normal',fontStyle:el.italic?'italic':'normal',lineHeight:1.2,whiteSpace:'pre-wrap',wordBreak:'break-word',display:'block'}}>
                            {el.text}
                          </span>
                        </div>
                      )
                    })
                  : /* Fallback legacy */
                    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 48px'}}>
                      {banner.title    && <h2 style={{fontSize:48,fontWeight:'bold',color:'#1a1a1a',margin:0,fontStyle:'italic'}}>{banner.title}</h2>}
                      {banner.subtitle && <p  style={{fontSize:60,fontWeight:'bold',color:'#1a1a1a',margin:'8px 0'}}>{banner.subtitle}</p>}
                      {banner.description && <p style={{fontSize:15,color:'#555',margin:'8px 0'}}>{banner.description}</p>}
                      {banner.button_text && <a href={banner.button_url||'#'} style={{display:'inline-block',background:'#111827',color:'#fff',padding:'8px 20px',marginTop:8,fontWeight:'bold',textTransform:'uppercase',textDecoration:'none',width:'fit-content'}}>{banner.button_text}</a>}
                    </div>
                }

                {/* Botón de edición — solo visible para admins */}
                {isAdmin && (
                  <button
                    onClick={() => setEditSlide({...banner, elements: parseEls(banner.elements)})}
                    style={{position:'absolute',top:12,right:12,background:'#2563eb',color:'white',border:'none',padding:'7px 16px',borderRadius:6,cursor:'pointer',fontWeight:'bold',fontSize:12,zIndex:20,boxShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>
                    ✏️ Editar slide
                  </button>
                )}
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}

export default HeroSlider