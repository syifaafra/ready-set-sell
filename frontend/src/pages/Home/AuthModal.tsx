
/* --------------------------------------------------
File: src/pages/Home/AuthModal.tsx
Handles register & login; maps to original UI. One component file.
-------------------------------------------------- */
import React, { useState, useEffect } from 'react'
import { postRegister, postLogin } from './api'

export default function AuthModal({ onLogin }:{ onLogin: (user:any)=>void }){
  const [username, setUsername] = useState('')
  const [kelompok, setKelompok] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [waktu, setWaktu] = useState('')

  useEffect(()=>{
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth()+1).padStart(2,'0')
    const dd = String(now.getDate()).padStart(2,'0')
    setTanggal(`${yyyy}-${mm}-${dd}`)
  }, [])

  async function handleRegister(){
    if(!username||!kelompok||!tanggal||!waktu){ alert('Mohon lengkapi semua field!'); return }
    try{
      const data = await postRegister({ username, kelompok, tanggal_main: tanggal, waktu_main: waktu })
      if(data && data.data){
        const token = data.data.token
        const user = data.data.user
        localStorage.setItem('authToken', token)
        localStorage.setItem('currentUser', JSON.stringify(user))
        onLogin(user)
        alert('Registrasi berhasil!')
      } else {
        alert('Error: ' + (data.error || 'unknown'))
      }
    }catch(e:any){ alert('Error: '+e.message) }
  }

  async function handleLogin(){
    if(!username){ alert('Masukkan username'); return }
    try{
      const data = await postLogin(username)
      if(data && data.data){
        const token = data.data.token
        const user = data.data.user
        localStorage.setItem('authToken', token)
        localStorage.setItem('currentUser', JSON.stringify(user))
        onLogin(user)
        alert('Login berhasil!')
      } else {
        alert('Error: ' + (data.error || 'unknown'))
      }
    }catch(e:any){ alert('Error: '+e.message) }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4 p-8 rounded-3xl shadow-2xl" style={{background:'#F9F1DC', border:'4px solid #E6D48D'}}>
        <h2 className="text-3xl font-bold text-[#333033] mb-6 text-center">🎮 Ready, Set, Sell!</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-lg font-bold text-[#333033] mb-2">Username</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full p-4" style={{background:'rgba(195,226,242,0.35)', border:'4px solid #7AA5BF', borderRadius:12, fontWeight:600}} placeholder="Masukkan username" />
          </div>

          <div>
            <label className="block text-lg font-bold text-[#333033] mb-2">Kelompok</label>
            <select value={kelompok} onChange={e=>setKelompok(e.target.value)} className="w-full p-4" style={{background:'rgba(215,237,198,0.45)', border:'4px solid #9DC897', borderRadius:12, fontWeight:600}}>
              <option value="">Pilih Kelompok</option>
              {['A','B','C','D','E','F','G','H'].map(k=> <option key={k} value={k}>Kelompok {k}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-lg font-bold text-[#333033] mb-2">Tanggal</label>
              <input type="date" value={tanggal} readOnly className="w-full p-4" style={{background:'#f5f5f5', border:'4px solid #EADBBE', borderRadius:12}} />
            </div>
            <div>
              <label className="block text-lg font-bold text-[#333033] mb-2">Waktu</label>
              <input type="time" value={waktu} onChange={e=>setWaktu(e.target.value)} className="w-full p-4" style={{background:'rgba(195,226,242,0.35)', border:'4px solid #7AA5BF', borderRadius:12}} />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={handleLogin} className="flex-1 font-bold rounded-2xl py-3" style={{background:'linear-gradient(90deg,#CFE8F9,#9FCFE8)', border:'4px solid #7AA5BF', color:'#fff'}}>Login</button>
            <button onClick={handleRegister} className="flex-1 font-bold rounded-2xl py-3" style={{background:'linear-gradient(90deg,#F7E8A4,#F4C28B)', border:'4px solid #E6D48D', color:'#2b2b2b'}}>Register</button>
          </div>
        </div>
      </div>
    </div>
  )
}