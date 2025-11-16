
/* --------------------------------------------------
File: src/pages/Home/Tabs.tsx
Tabs component
-------------------------------------------------- */
import React from 'react'

export default function Tabs({ active, onChange }:{ active:'input'|'summary'|'leaderboard', onChange:(t:'input'|'summary'|'leaderboard')=>void }){
  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-4">
          <button onClick={()=>onChange('input')} className={`py-4 px-8 font-bold rounded-t-2xl transition-all ${active==='input' ? 'bg-gradient-to-b from-[#CFE8F9] to-[#DFF0F8] text-[#1f4b59] shadow-inner' : 'bg-gray-50 text-gray-500'}`}>
            📝 Input Keputusan
          </button>
          <button onClick={()=>onChange('summary')} className={`py-4 px-8 font-bold rounded-t-2xl transition-all ${active==='summary' ? 'bg-gradient-to-b from-[#CFE8F9] to-[#DFF0F8] text-[#1f4b59] shadow-inner' : 'bg-gray-50 text-gray-500'}`}>
            📊 Ringkasan
          </button>
          <button onClick={()=>onChange('leaderboard')} className={`py-4 px-8 font-bold rounded-t-2xl transition-all ${active==='leaderboard' ? 'bg-gradient-to-b from-[#CFE8F9] to-[#DFF0F8] text-[#1f4b59] shadow-inner' : 'bg-gray-50 text-gray-500'}`}>
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}