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
  speed = 2,
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
      // Clear canvas
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)'
        ctx.lineWidth = 1
        
        // Vertical lines (time grid)
        for (let x = 0; x < width; x += 25) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        
        // Horizontal lines (amplitude grid)
        for (let y = 0; y < height; y += 25) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }

        // Center line
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, centerY)
        ctx.lineTo(width, centerY)
        ctx.stroke()
      }

      // Draw waveform
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      const pointsPerPixel = data.length / width
      let hasStarted = false

      for (let x = 0; x < width; x++) {
        const dataIndex = Math.floor((x + offsetRef.current) * pointsPerPixel) % data.length
        const value = data[dataIndex] || 0
        const y = centerY - (value * amplitude * centerY * 0.8)
        
        if (!hasStarted) {
          ctx.moveTo(x, y)
          hasStarted = true
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      // Draw sweep line (phosphor effect)
      const sweepX = (offsetRef.current * speed) % width
      
      // Fade effect behind sweep line
      const gradient = ctx.createLinearGradient(sweepX, 0, sweepX + 50, 0)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(sweepX, 0, 50, height)

      // Sweep line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(sweepX, 0)
      ctx.lineTo(sweepX, height)
      ctx.stroke()

      if (isPlaying) {
        offsetRef.current += speed
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
          <button
            onClick={togglePlayPause}
            className="text-green-400 hover:text-green-300 transition-colors text-sm"
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