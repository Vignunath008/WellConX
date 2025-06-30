import React, { useEffect, useRef, useState } from 'react'

interface LiveWaveformProps {
  title: string
  data: number[]
  color: string
  height?: number
  speed?: number
  amplitude?: number
  showGrid?: boolean
  unit?: string
}

const LiveWaveform: React.FC<LiveWaveformProps> = ({
  title, 
  data, 
  color, 
  height = 120, 
  speed = 1, 
  amplitude = 1, 
  showGrid = true, 
  unit = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(true)
  const offsetRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size based on container
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const centerY = height / 2

    const draw = () => {
      // Clear canvas with black background
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.15)'
        ctx.lineWidth = 1
        
        // Major grid lines (every 50px on desktop, 25px on mobile)
        const majorGridSize = width < 400 ? 25 : 50
        for (let x = 0; x < width; x += majorGridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        
        for (let y = 0; y < height; y += 20) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }

        // Minor grid lines (every 10px)
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.08)'
        const minorGridSize = width < 400 ? 12 : 10
        for (let x = 0; x < width; x += minorGridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }

        // Center line
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, centerY)
        ctx.lineTo(width, centerY)
        ctx.stroke()
      }

      // Draw waveform with phosphor effect
      const sweepX = (offsetRef.current * speed) % width
      
      // Draw the main waveform
      ctx.strokeStyle = color
      ctx.lineWidth = width < 400 ? 1.5 : 2
      ctx.beginPath()

      let hasStarted = false
      for (let x = 0; x < width; x++) {
        const dataIndex = Math.floor((x + offsetRef.current) % data.length)
        const value = data[dataIndex] || 0
        const y = centerY - (value * amplitude * centerY * 0.7)
        
        // Fade effect for older traces
        const distanceFromSweep = Math.abs(x - sweepX)
        const fadeDistance = width < 400 ? 50 : 100
        let alpha = 1
        
        if (distanceFromSweep < fadeDistance) {
          alpha = Math.max(0.1, distanceFromSweep / fadeDistance)
        }
        
        // Set color with alpha
        const rgb = hexToRgb(color)
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
        
        if (!hasStarted) {
          ctx.moveTo(x, y)
          hasStarted = true
        } else {
          ctx.lineTo(x, y)
        }
        
        // Draw segment
        if (x > 0) {
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x, y)
        }
      }

      // Draw sweep line with glow effect
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
      ctx.shadowBlur = width < 400 ? 5 : 10
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.lineWidth = width < 400 ? 1.5 : 2
      ctx.beginPath()
      ctx.moveTo(sweepX, 0)
      ctx.lineTo(sweepX, height)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Fade effect behind sweep line (phosphor persistence)
      const gradient = ctx.createLinearGradient(sweepX, 0, sweepX + (width < 400 ? 40 : 80), 0)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(sweepX, 0, width < 400 ? 40 : 80, height)

      if (isPlaying) {
        offsetRef.current += speed * 0.5 // Slower sweep for more realistic display
        animationRef.current = requestAnimationFrame(draw)
      }
    }

    if (isPlaying) {
      draw()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [data, color, speed, amplitude, showGrid, isPlaying, height])

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 255, b: 0 }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="bg-black rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <h3 className="text-green-400 font-mono text-xs sm:text-sm font-semibold truncate">{title}</h3>
          {unit && <span className="text-green-300 text-xs font-mono flex-shrink-0">{unit}</span>}
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full pulse-ring" />
          <span className="text-green-400 text-xs font-mono">LIVE</span>
          <button
            onClick={togglePlayPause}
            className="text-green-400 hover:text-green-300 transition-colors text-sm ml-1 sm:ml-2 p-1"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{ height: `${height}px`, backgroundColor: '#000' }}
      />
    </div>
  )
}

export default LiveWaveform