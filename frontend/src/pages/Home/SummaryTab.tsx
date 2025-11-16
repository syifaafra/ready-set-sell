import React, { useEffect, useRef } from 'react'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale)

export default function SummaryTab(){
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(()=>{
    const ctx = canvasRef.current
    if(!ctx) return

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Q1','Q2','Q3','Q4'],
        datasets: [{ label: 'Kas', data: [50,60,55,70], borderWidth: 2 }]
      }
    })

    return ()=> chart.destroy()
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow" style={{border:'4px solid #EADBBE'}}>
      <h3 className="text-lg font-semibold mb-4">Ringkasan Keuangan</h3>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}
