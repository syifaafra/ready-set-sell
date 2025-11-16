/* --------------------------------------------------
File: src/pages/Home/api.ts
Small api helpers that mirror the original JS behaviour.
You can replace BASE_URL with your backend.
-------------------------------------------------- */
export const API_BASE_URL = 'http://localhost:3000/api'

export function getStoredUser(){
  try{
    const raw = localStorage.getItem('currentUser')
    if(!raw) return null
    return JSON.parse(raw)
  }catch(e){
    return null
  }
}

export async function postRegister(payload:any){
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })
  return res.json()
}

export async function postLogin(username:string){
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({username})
  })
  return res.json()
}

export async function postDecision(token:string, payload:any){
  const res = await fetch(`${API_BASE_URL}/game/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  })
  return res.json()
}

export async function getDecisions(token:string){
  const res = await fetch(`${API_BASE_URL}/game/decisions`, { headers: { Authorization: `Bearer ${token}` } })
  return res.json()
}

export async function getLeaderboard(kelompok:string, token?:string){
  const headers: any = {}
  if(token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE_URL}/game/leaderboard/${kelompok}`, { headers })
  return res.json()
}