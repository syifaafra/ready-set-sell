
/* --------------------------------------------------
File: src/pages/Home/LeaderboardTab.tsx
Loads leaderboard from API using saved kelompok
-------------------------------------------------- */
import React, { useEffect, useState } from 'react'
import { getLeaderboard } from './api'

export default function LeaderboardTab({ kelompok }:{ kelompok?:string }){
  const [board, setBoard] = useState<any[]>([])

  useEffect(()=>{
    async function load(){
      if(!kelompok) return
      try{
        const token = localStorage.getItem('authToken')
        const res = await getLeaderboard(kelompok, token||undefined)
        if(res && res.leaderboard) setBoard(res.leaderboard)
      }catch(e){ console.error(e) }
    }
    load()
  }, [kelompok])

  if(!kelompok) return <div className="text-gray-600">Tidak ada kelompok terpilih</div>

  return (
    <div className="bg-white p-8 rounded-3xl shadow" style={{border:'4px solid #F7E8A4'}}>
      <h2 className="text-3xl font-bold text-[#333033] mb-6">🏆 Leaderboard Kelompok {kelompok}</h2>
      {board.length===0 ? <p className="text-gray-500">Belum ada data leaderboard</p> : (
        <table className="w-full">
          <thead style={{background:'#F7E8A4'}}>
            <tr><th className="p-3">Rank</th><th className="p-3">Username</th><th className="p-3">Kuartil</th><th className="p-3">Kas Tertinggi</th></tr>
          </thead>
          <tbody>
            {board.map((u, idx)=> (
              <tr key={u.username} style={{borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
                <td className="p-3 font-bold">{idx+1}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.total_kuartil}</td>
                <td className="p-3" style={{color:'#2E7D32', fontWeight:700}}>{(u.kas_tertinggi/1000000).toFixed(1)} Jt</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
