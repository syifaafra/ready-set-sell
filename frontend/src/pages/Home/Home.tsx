import React, { useEffect, useState } from 'react'
import AuthModal from './AuthModal'
import Header from './Header'
import Tabs from './Tabs'
import InputTab from './InputTab'
import SummaryTab from './SummaryTab'
import LeaderboardTab from './LeaderboardTab'

import { getStoredUser } from './api'

export default function Home(){
  const [currentUser, setCurrentUser] = useState<any>(getStoredUser())
  const [currentQuarter, setCurrentQuarter] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<'input'|'summary'|'leaderboard'>('input')
  const [showAuth, setShowAuth] = useState(!currentUser)

  useEffect(()=>{
    // if stored user exists, hide modal and set data
    const u = getStoredUser()
    if(u){
      setCurrentUser(u)
    }
  }, [])

  function onLogin(user:any){
    setCurrentUser(user)
    setShowAuth(false)
  }

  function onLogout(){
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    setShowAuth(true)
  }

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #CFE8F9 0%, #F9F6E8 45%, #F9F1DC 100%)'}}>
      <Header currentUser={currentUser} currentQuarter={currentQuarter} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto p-6">
        <Tabs active={activeTab} onChange={t=>setActiveTab(t)} />

        <div className="mt-6">
          {activeTab === 'input' && <InputTab currentQuarter={currentQuarter} onSaved={()=>{ if(currentQuarter<8) setCurrentQuarter(q=>q+1)}} />}
          {activeTab === 'summary' && <SummaryTab />}
          {activeTab === 'leaderboard' && <LeaderboardTab kelompok={currentUser?.kelompok} />}
        </div>
      </div>

      {showAuth && <AuthModal onLogin={onLogin} />}
    </div>
  )
}

