import React, { useState } from 'react'
import { motion } from 'framer-motion'

const WEATHER_TYPES = ['sunny','cloudy','rain','storm','snow','partly'] as const
export type WeatherType = typeof WEATHER_TYPES[number]

interface DayForecast {
  date: string
  type: WeatherType
  highC: number
  lowC: number
}

interface ForecastData {
  city: string
  days: DayForecast[]
}

function todayPlus(n: number) {
  const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10)
}

const demoForecast: ForecastData = {
  city: 'Tokyo',
  days: [
    { date: todayPlus(0), type: 'partly', highC: 27, lowC: 22 },
    { date: todayPlus(1), type: 'sunny', highC: 30, lowC: 24 },
    { date: todayPlus(2), type: 'cloudy', highC: 23, lowC: 19 },
    { date: todayPlus(3), type: 'rain', highC: 21, lowC: 18 },
    { date: todayPlus(4), type: 'storm', highC: 20, lowC: 17 },
    { date: todayPlus(5), type: 'sunny', highC: 28, lowC: 23 },
  ]
}

function cToF(c: number) { return Math.round((c * 9/5 + 32) * 10) / 10 }
function fmtDay(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('ja-JP', { weekday: 'short', month: 'numeric', day: 'numeric' }).format(d)
}

const pastelByWeather: Record<WeatherType, string> = {
  sunny:   'linear-gradient(135deg,#FFF7D1,#FFE4E1)',
  partly:  'linear-gradient(135deg,#E0F2FE,#FFF7D1)',
  cloudy:  'linear-gradient(135deg,#ECEFF4,#F5F7FA)',
  rain:    'linear-gradient(135deg,#E0F2FE,#EDE9FE)',
  storm:   'linear-gradient(135deg,#EDE9FE,#FCE7F3)',
  snow:    'linear-gradient(135deg,#ECFEFF,#F1F5F9)',
}

const SunIcon = () => (
  <svg viewBox="0 0 100 100" style={{width:'100%',height:'100%'}}>
    <circle cx="50" cy="50" r="18" fill="#FDE68A" />
    {Array.from({length:12}).map((_,i)=>{
      const a = (i*30) * Math.PI/180
      const x1 = 50 + Math.cos(a)*26, y1 = 50 + Math.sin(a)*26
      const x2 = 50 + Math.cos(a)*40, y2 = 50 + Math.sin(a)*40
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F59E0B" strokeWidth={4} strokeLinecap="round"/>
    })}
  </svg>
)
const CloudIcon = () => (
  <svg viewBox="0 0 120 80" style={{width:'100%',height:'100%'}}>
    <ellipse cx="50" cy="50" rx="30" ry="18" fill="#CBD5E1"/>
    <ellipse cx="75" cy="45" rx="24" ry="16" fill="#E2E8F0"/>
    <ellipse cx="90" cy="55" rx="20" ry="13" fill="#CBD5E1"/>
  </svg>
)
const PartlyIcon = () => (
  <div style={{position:'relative',width:'100%',height:'100%'}}>
    <div style={{position:'absolute',left:-16,top:-16,width:'40px',height:'40px'}}><SunIcon/></div>
    <CloudIcon/>
  </div>
)
const RainIcon = () => (
  <svg viewBox="0 0 120 100" style={{width:'100%',height:'100%'}}>
    <CloudIcon/>
    {Array.from({length:5}).map((_,i)=>(
      <line key={i} x1={40+i*12} y1={70} x2={45+i*12} y2={90} stroke="#60A5FA" strokeWidth={4} strokeLinecap="round"/>
    ))}
  </svg>
)
const StormIcon = () => (
  <svg viewBox="0 0 120 110" style={{width:'100%',height:'100%'}}>
    <CloudIcon/>
    <polygon points="60,72 48,95 68,95 56,118 88,85 70,85 82,72" fill="#818CF8"/>
  </svg>
)
const SnowIcon = () => (
  <svg viewBox="0 0 120 100" style={{width:'100%',height:'100%'}}>
    <CloudIcon/>
    {Array.from({length:5}).map((_,i)=>(
      <circle key={i} cx={40+i*12} cy={85} r={3.5} fill="#93C5FD"/>
    ))}
  </svg>
)

function labelFromType(t: WeatherType) {
  return ({ sunny:'晴れ', partly:'晴れ時々くもり', cloudy:'くもり', rain:'雨', storm:'雷雨', snow:'雪' }[t])
}

// Bichon Mascot with temperature-based states (per your spec)
function BichonMascot({ weather, tempC }: { weather: WeatherType; tempC: number }) {
  let mood: 'panting' | 'comfortable' | 'cool' | 'cold' | 'worried' = 'comfortable'
  if (weather === 'storm') mood = 'worried'
  else if (tempC > 25) mood = 'panting'         // 25℃以上 暑い: 舌出しパンティング
  else if (tempC >= 15 && tempC <= 25) mood = 'comfortable' // 快適
  else if (tempC > 10 && tempC < 15) mood = 'cool'          // 少し寒い
  else if (tempC <= 10) mood = 'cold'           // 寒い

  const face = {
    panting:     { eye: '◠', mouth: 'ᴖ', tongue: true, earTilt: -15, eyeNarrow: true, earsBack: true },
    comfortable: { eye: '◉', mouth: '‿', tongue: false, earTilt: 0, eyeNarrow: false, earsBack: false },
    cool:        { eye: '◉', mouth: '‿', tongue: false, earTilt: 5, eyeNarrow: false, earsBack: false },
    cold:        { eye: '◔', mouth: '︿', tongue: false, earTilt: -20, eyeNarrow: false, earsBack: true },
    worried:     { eye: '●', mouth: '_', tongue: false, earTilt: 0, eyeNarrow: false, earsBack: true },
  }[mood]

  const decoMap: Record<WeatherType, JSX.Element> = {
    sunny:  <SunIcon/>,
    partly: <PartlyIcon/>,
    cloudy: <CloudIcon/>,
    rain:   <RainIcon/>,
    storm:  <StormIcon/>,
    snow:   <SnowIcon/>,
  }

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      style={{display:'flex',alignItems:'center',justifyContent:'center'}}
    >
      <div style={{position:'absolute', top:-24, right:0, width:56, height:56}}>{decoMap[weather]}</div>
      <div style={{position:'relative', width:176, height:176, borderRadius:'50%', background:'white', boxShadow:'0 6px 16px rgba(0,0,0,.08)', border:'1px solid rgba(255,255,255,.7)'}}>
        {/* ears */}
        <motion.div
          style={{position:'absolute', left:-4, top:32, width:56, height:56, background:'white', borderRadius:'50%', border:'1px solid rgba(255,255,255,.7)'}}
          animate={{ rotate: face.earsBack ? -25 : face.earTilt }}
        />
        <motion.div
          style={{position:'absolute', right:-4, top:32, width:56, height:56, background:'white', borderRadius:'50%', border:'1px solid rgba(255,255,255,.7)'}}
          animate={{ rotate: face.earsBack ? 25 : -face.earTilt }}
        />

        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', userSelect:'none'}}>
          {/* eyes */}
          <div style={{display:'flex', gap:24, fontSize:44, lineHeight:1, marginTop:24, transform: face.eyeNarrow?'translateY(2px)':''}}>
            <div>{face.eye}</div>
            <div>{face.eye}</div>
          </div>

          {/* nose + mouth + tongue */}
          <motion.div
            style={{position:'relative', marginTop:4, display:'flex', flexDirection:'column', alignItems:'center'}}
            animate={mood === 'panting' ? { y: [0, 2, 0] } : (mood === 'cold' ? { y: [0, -1, 0, 1, 0] } : {})}
            transition={{ repeat: (mood==='panting'||mood==='cold')?Infinity:0, duration: mood==='panting'?0.35:0.8 }}
          >
            <div style={{width:24, height:20, background:'#0f172a', borderBottomLeftRadius:12, borderBottomRightRadius:12}}/>
            <div style={{fontSize:28, color:'#0f172a', textAlign:'center', marginTop:-4}}>{face.mouth}</div>
            {face.tongue && <motion.div animate={{ y:[0,2,0] }} transition={{ repeat: Infinity, duration: 0.35 }} style={{width:16, height:22, background:'#f9a8d4', borderBottomLeftRadius:12, borderBottomRightRadius:12, marginTop:2}}/>}
          </motion.div>

          {/* cheeks */}
          <div style={{position:'absolute', bottom:48, left:40, width:20, height:20, background:'rgba(244,114,182,.6)', borderRadius:'50%'}}/>
          <div style={{position:'absolute', bottom:48, right:40, width:20, height:20, background:'rgba(244,114,182,.6)', borderRadius:'50%'}}/>
        </div>
      </div>
    </motion.div>
  )
}

function ForecastCard({ day, unit }: { day: DayForecast; unit: 'C'|'F' }) {
  const high = unit === 'C' ? day.highC : cToF(day.highC)
  const low  = unit === 'C' ? day.lowC  : cToF(day.lowC)
  const icon = { sunny:<SunIcon/>, partly:<PartlyIcon/>, cloudy:<CloudIcon/>, rain:<RainIcon/>, storm:<StormIcon/>, snow:<SnowIcon/> }[day.type]
  return (
    <div style={{borderRadius:16, border:'1px solid rgba(255,255,255,.6)', background:'rgba(255,255,255,.7)', padding:12, minWidth:140, boxShadow:'0 4px 10px rgba(0,0,0,.04)'}}>
      <div style={{fontSize:12, color:'#64748b'}}>{fmtDay(day.date)}</div>
      <div style={{height:80}}>{icon}</div>
      <div style={{display:'flex', alignItems:'end', gap:8}}>
        <div style={{fontSize:20, fontWeight:700}}>{high}°{unit}</div>
        <div style={{fontSize:13, color:'#64748b'}}>/ {low}°{unit}</div>
      </div>
      <div style={{fontSize:12, color:'#64748b'}}>{labelFromType(day.type)}</div>
    </div>
  )
}

export default function App() {
  const [unit, setUnit] = useState<'C'|'F'>('C')
  const [city, setCity] = useState(demoForecast.city)
  const [data, setData] = useState<ForecastData>(demoForecast)
  const today = data.days[0]

  // Set dynamic pastel background
  const bg = pastelByWeather[today.type]

  async function fetchForecast(nextCity: string) {
    try {
      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nextCity)}&language=ja&count=1`
      ).then(r=>r.json())
      if (!geo?.results?.length) throw new Error('場所が見つかりません')
      const { latitude, longitude, name } = geo.results[0]
      const w = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&daily=weathercode,temperature_2m_max,temperature_2m_min`
      ).then(r=>r.json())

      const mapType = (code:number): WeatherType => {
        if ([0,1].includes(code)) return 'sunny'
        if ([2,3].includes(code)) return 'cloudy'
        if ([61,63,65,80,81,82].includes(code)) return 'rain'
        if ([95,96,99].includes(code)) return 'storm'
        if ([71,73,75,85,86].includes(code)) return 'snow'
        return 'partly'
      }
      const days = w.daily.time.map((date:string, i:number)=> ({
        date,
        type: mapType(w.daily.weathercode[i]),
        highC: Math.round(w.daily.temperature_2m_max[i]),
        lowC: Math.round(w.daily.temperature_2m_min[i]),
      }))
      setData({ city: name, days })
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <div style={{minHeight:'100vh', background:bg, color:'#0f172a'}}>
      <div style={{maxWidth:960, margin:'0 auto', padding:'24px 20px'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16}}>
          <h1 style={{fontSize:28, fontWeight:800}}>Kawaii Weather <span style={{color:'#64748b', fontSize:16}}>— かわいい天気</span></h1>
          <div style={{display:'flex', gap:8, background:'rgba(255,255,255,.7)', border:'1px solid rgba(255,255,255,.6)', borderRadius:999, padding:'6px 8px'}}>
            <button onClick={()=>setUnit('C')} style={{padding:'6px 12px', borderRadius:999, fontSize:14, background: unit==='C' ? '#0f172a' : 'transparent', color: unit==='C' ? 'white' : '#1f2937'}}>℃</button>
            <button onClick={()=>setUnit('F')} style={{padding:'6px 12px', borderRadius:999, fontSize:14, background: unit==='F' ? '#0f172a' : 'transparent', color: unit==='F' ? 'white' : '#1f2937'}}>℉</button>
          </div>
        </div>

        <div style={{marginTop:20, display:'flex', gap:12, flexWrap:'wrap'}}>
          <input value={city} onChange={e=>setCity(e.target.value)} placeholder="都市名（Tokyo/Osaka/Kyotoなど）" style={{flex:'1 1 auto', minWidth:240, borderRadius:12, padding:'12px 14px', background:'rgba(255,255,255,.8)', border:'1px solid rgba(255,255,255,.6)'}} />
          <button onClick={()=>fetchForecast(city)} style={{borderRadius:12, padding:'12px 16px', background:'#0f172a', color:'white'}}>予報を取得</button>
        </div>

        <div style={{marginTop:24, display:'grid', gridTemplateColumns:'1fr', gap:24}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr', gap:16}}>
            <div>
              <div style={{fontSize:14, color:'#64748b'}}>{data.city} のきょう</div>
              <div style={{marginTop:4, display:'flex', alignItems:'baseline', gap:12}}>
                <div style={{fontSize:44, fontWeight:800}}>{unit==='C'?today.highC:cToF(today.highC)}°{unit}</div>
                <div style={{fontSize:14, color:'#64748b'}}>/ {unit==='C'?today.lowC:cToF(today.lowC)}°{unit}</div>
              </div>
              <div style={{marginTop:2, color:'#64748b'}}>{labelFromType(today.type)}</div>
            </div>
            <div>
              <BichonMascot weather={today.type} tempC={today.highC} />
            </div>
          </div>

          <div>
            <div style={{fontSize:14, color:'#64748b', marginBottom:8}}>5日予報</div>
            <div style={{display:'flex', gap:12, overflowX:'auto', paddingBottom:4}}>
              {data.days.map((d,i)=>(<ForecastCard key={d.date+'-'+i} day={d} unit={unit}/>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}