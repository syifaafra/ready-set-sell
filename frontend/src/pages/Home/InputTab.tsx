import React, { useState } from 'react'
import { postDecision } from './api'

export default function InputTab({ currentQuarter=1, onSaved }:{ currentQuarter?:number, onSaved?:()=>void }){
  const [marketing1, setMarketing1] = useState('')
  const [marketing2, setMarketing2] = useState('')
  const [marketing3, setMarketing3] = useState('')

  async function saveDecision(){
    if(!marketing1||!marketing2||!marketing3){ alert('Mohon lengkapi semua strategi pemasaran!'); return }
    const token = localStorage.getItem('authToken')
    try{
      const payload = {
        kuartil: currentQuarter,
        marketing_1: marketing1,
        marketing_2: marketing2,
        marketing_3: marketing3,
        supplier_a: 0,
        supplier_b: 0,
        supplier_c: 0,
        supplier_d: 0,
        offline_price: 0,
        online_price: 0,
        kas_tersedia: 50000000,
        rating_offline: 4.2,
        rating_online: 4.5
      }
      const res = await postDecision(token||'', payload)
      if(res && res.message){ alert('✅ '+res.message); onSaved && onSaved() }
      else alert('Error: ' + (res.error || 'unknown'))
    }catch(e:any){ alert('Error: '+e.message) }
  }

  const options = ['Iklan Radio','Iklan Televisi','Brosur, Billboard & OOH','Upgrade Fasilitas Toko','Pameran Offline','Buzzer & Affiliate Toko','Iklan Sosial Media','SMS & Broadcast WA','Diskon Online Shop','Optimasi Search Engine']

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-lg p-8" style={{border:'4px solid #EADBBE'}}>
        <h2 className="text-3xl font-bold text-[#333033] mb-6">📈 Strategi Pemasaran</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-lg font-bold text-[#333033] mb-3">Strategi 1</label>
            <select value={marketing1} onChange={e=>setMarketing1(e.target.value)} className="w-full p-4" style={{background:'rgba(195,226,242,0.35)', border:'4px solid #7AA5BF', borderRadius:12, fontWeight:600}}>
              <option value="">Pilih Strategi</option>
              {options.map(o=> <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-lg font-bold text-[#333033] mb-3">Strategi 2</label>
            <select value={marketing2} onChange={e=>setMarketing2(e.target.value)} className="w-full p-4" style={{background:'rgba(195,226,242,0.35)', border:'4px solid #7AA5BF', borderRadius:12, fontWeight:600}}>
              <option value="">Pilih Strategi</option>
              {options.map(o=> <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-lg font-bold text-[#333033] mb-3">Strategi 3</label>
            <select value={marketing3} onChange={e=>setMarketing3(e.target.value)} className="w-full p-4" style={{background:'rgba(195,226,242,0.35)', border:'4px solid #7AA5BF', borderRadius:12, fontWeight:600}}>
              <option value="">Pilih Strategi</option>
              {options.map(o=> <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button onClick={saveDecision} className="w-full font-bold rounded-3xl py-4" style={{background:'linear-gradient(90deg,#F7E8A4,#F4C28B)', border:'4px solid #E6D48D'}}>💾 Simpan Keputusan Kuartil <span>{currentQuarter}</span></button>
    </div>
  )
}