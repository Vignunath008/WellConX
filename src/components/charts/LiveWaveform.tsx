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
  height = 150,
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

    const width = canvas.width
    const height = canvas.height
    const centerY = height / 2

    const draw = () => {
      // Clear canvas with black background
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.15)'
        ctx.lineWidth = 1
        
        // Major grid lines (every 50px)
        for (let x = 0; x < width; x += 50) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        
        for (let y = 0; y < height; y += 25) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }

        // Minor grid lines (every 10px)
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.08)'
        for (let x = 0; x < width; x += 10) {
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
      ctx.lineWidth = 2
      ctx.beginPath()

      let hasStarted = false
      for (let x = 0; x < width; x++) {
        const dataIndex = Math.floor((x + offsetRef.current) % data.length)
        const value = data[dataIndex] || 0
        const y = centerY - (value * amplitude * centerY * 0.7)
        
        // Fade effect for older traces
        const distanceFromSweep = Math.abs(x - sweepX)
        const fadeDistance = 100
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
      ctx.shadowBlur = 10
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(sweepX, 0)
      ctx.lineTo(sweepX, height)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Fade effect behind sweep line (phosphor persistence)
      const gradient = ctx.createLinearGradient(sweepX, 0, sweepX + 80, 0)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(sweepX, 0, 80, height)

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
  }, [data, color, speed, amplitude, showGrid, isPlaying])

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
    <div className="bg-black rounded-xl border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <h3 className="text-green-400 font-mono text-sm font-semibold">{title}</h3>
          {unit && <span className="text-green-300 text-xs font-mono">{unit}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full pulse-ring" />
          <span className="text-green-400 text-xs font-mono">LIVE</span>
          <button
            onClick={togglePlayPause}
            className="text-green-400 hover:text-green-300 transition-colors text-sm ml-2"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        className="w-full"
        style={{ backgroundColor: '#000' }}
      />
    </div>
  )
}

export default LiveWaveform