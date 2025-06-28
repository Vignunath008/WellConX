import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface WaveformChartProps {
  title: string
  data: number[]
  color: string
  height?: number
  speed?: number
  amplitude?: number
  showGrid?: boolean
}

const WaveformChart: React.FC<WaveformChartProps> = ({
  title,
  data,
  color,
  height = 200,
  speed = 2,
  amplitude = 1,
  showGrid = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    let offset = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw grid
      if (showGrid) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.lineWidth = 1
        
        // Vertical lines
        for (let x = 0; x < width; x += 20) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
        
        // Horizontal lines
        for (let y = 0; y < height; y += 20) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }
      }

      // Draw waveform
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      const centerY = height / 2
      const pointsPerPixel = data.length / width

      for (let x = 0; x < width; x++) {
        const dataIndex = Math.floor((x + offset) * pointsPerPixel) % data.length
        const value = data[dataIndex] || 0
        const y = centerY - (value * amplitude * centerY * 0.8)
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      // Draw sweep line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.lineWidth = 2
      const sweepX = (offset * speed) % width
      ctx.beginPath()
      ctx.moveTo(sweepX, 0)
      ctx.lineTo(sweepX, height)
      ctx.stroke()

      if (isPlaying) {
        offset += speed
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
    <motion.div 
      className="bg-black rounded-xl p-4 border border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        <button
          onClick={togglePlayPause}
          className="text-white hover:text-gray-300 transition-colors"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={height}
        className="w-full rounded"
        style={{ backgroundColor: '#000' }}
      />
    </motion.div>
  )
}

export default WaveformChart