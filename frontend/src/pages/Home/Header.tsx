
import React from 'react'

export default function Header({ currentUser, currentQuarter, onLogout }:{ currentUser?:any, currentQuarter:number, onLogout:()=>void }){
  return (
    <div className="p-8 shadow-lg relative overflow-hidden" style={{background:'linear-gradient(90deg, #F9E9B6 0%, #F7DAC0 40%, #F4C28B 100%)'}}>
      <div className="relative z-10 flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold mb-2">Ready, Set, Sell! 🎮</h1>
          <p className="text-yellow-900 text-lg"><span id="userInfo">{currentUser ? `${currentUser.username} (Kelompok ${currentUser.kelompok})` : 'Belum login'}</span> - Kuartil <span id="currentQuarter">{currentQuarter}</span></p>
        </div>
        <button onClick={onLogout} className="bg-white bg-opacity-60 px-6 py-3 rounded-2xl font-bold hover:bg-opacity-80 transition-all">Logout</button>
      </div>
    </div>
  )
}