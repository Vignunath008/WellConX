import React, { useEffect, useRef, useState } from 'react'
import { AIWaveformFactory, VitalReadings, GeneratedWaveform } from '../../utils/waveformGenerator'
import { motion } from 'framer-motion'
import { Play, Pause, Download, Settings, Zap, Activity } from 'lucide-react'

interface AIWaveformDisplayProps {
  vitals: VitalReadings
  waveformType: 'ecg' | 'plethysmography' | 'bloodPressure' | 'respiration' | 'capnography'
  title: string
  color: string
  height?: number
  showControls?: boolean
  pathologyLevel?: number
}

const AIWaveformDisplay: React.FC<AIWaveformDisplayProps> = ({
  vitals,
  waveformType,
  title,
  color,
  height = 200,
  showControls = true,
  pathologyLevel = 0.1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [isPlaying, setIsPlaying] = useState(true)
  const [waveformData, setWaveformData] = useState<GeneratedWaveform | null>(null)
  const [displayBuffer, setDisplayBuffer] = useState<number[]>([])
  const [sweepPosition, setSweepPosition] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [config, setConfig] = useState({
    sampleRate: 250,
    noiseLevel: 0.02,
    pathologyFactor: pathologyLevel,
    sweepSpeed: 1
  })

  // Generate waveform data
  useEffect(() => {
    let waveform: GeneratedWaveform
    
    switch (waveformType) {
      case 'ecg':
        waveform = AIWaveformFactory.generateECG(vitals, {
          sampleRate: config.sampleRate,
          noiseLevel: config.noiseLevel,
          pathologyFactor: config.pathologyFactor,
          duration: 10
        })
        break
      case 'plethysmography':
        waveform = AIWaveformFactory.generatePlethysmography(vitals, {
          sampleRate: 100,
          noiseLevel: config.noiseLevel,
          pathologyFactor: config.pathologyFactor,
          duration: 10
        })
        break
      case 'bloodPressure':
        waveform = AIWaveformFactory.generateBloodPressure(vitals, {
          sampleRate: 125,
          noiseLevel: config.noiseLevel * 10,
          pathologyFactor: config.pathologyFactor,
          duration: 10
        })
        break
      case 'respiration':
        waveform = AIWaveformFactory.generateRespiration(vitals, {
          sampleRate: 50,
          noiseLevel: config.noiseLevel,
          pathologyFactor: config.pathologyFactor,
          duration: 30
        })
        break
      case 'capnography':
        waveform = AIWaveformFactory.generateCapnography(vitals, {
          sampleRate: 50,
          noiseLevel: config.noiseLevel * 5,
          pathologyFactor: config.pathologyFactor,
          duration: 30
        })
        break
      default:
        return
    }
    
    setWaveformData(waveform)
    setDisplayBuffer(new Array(600).fill(0)) // 600 points for display
  }, [vitals, waveformType, config])

  // Animation loop
  useEffect(() => {
    if (!waveformData || !isPlaying) return

    const animate = () => {
      setSweepPosition(prev => {
        const newPos = (prev + config.sweepSpeed) % 600
        
        // Update display buffer with new data point
        setDisplayBuffer(prevBuffer => {
          const newBuffer = [...prevBuffer]
          const dataIndex = Math.floor((newPos / 600) * waveformData.data.length) % waveformData.data.length
          newBuffer[Math.floor(newPos)] = waveformData.data[dataIndex]
          return newBuffer
        })
        
        return newPos
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [waveformData, isPlaying, config.sweepSpeed])

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas with black background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.15)'
    ctx.lineWidth = 1
    
    // Major grid lines
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

    // Minor grid lines
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.08)'
    for (let x = 0; x < width; x += 10) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Center line
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)'
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()

    // Draw waveform with phosphor effect
    const centerY = height / 2
    const amplitude = height * 0.35

    // Draw the main waveform
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    let hasStarted = false
    for (let x = 0; x < width; x++) {
      const bufferIndex = Math.floor((x / width) * displayBuffer.length)
      const value = displayBuffer[bufferIndex] || 0
      const y = centerY - (value * amplitude)
      
      // Fade effect for older traces
      const distanceFromSweep = Math.abs(x - (sweepPosition / 600) * width)
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
    const sweepX = (sweepPosition / 600) * width
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
    ctx.shadowBlur = 10
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(sweepX, 0)
    ctx.lineTo(sweepX, height)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Fade effect behind sweep line
    const gradient = ctx.createLinearGradient(sweepX, 0, sweepX + 80, 0)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(sweepX, 0, 80, height)
  }, [displayBuffer, sweepPosition, color])

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 255, b: 0 }
  }

  const exportWaveform = () => {
    if (!waveformData) return
    
    const exportData = {
      waveformType,
      vitals,
      waveformData,
      timestamp: new Date().toISOString(),
      config
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${waveformType}_waveform_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-black rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Activity className="h-4 w-4 text-green-400" />
          <h3 className="text-green-400 font-mono text-sm font-semibold">{title}</h3>
          {waveformData && (
            <div className="flex items-center space-x-4 text-xs text-green-300">
              <span>Quality: {(waveformData.quality * 100).toFixed(1)}%</span>
              <span>Morphology: {waveformData.features.morphology}</span>
              <span>Amplitude: {waveformData.features.amplitude.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        {showControls && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full pulse-ring" />
            <span className="text-green-400 text-xs font-mono">AI-GENERATED</span>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-green-400 hover:text-green-300 transition-colors p-1"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-green-400 hover:text-green-300 transition-colors p-1"
            >
              <Settings className="h-4 w-4" />
            </button>
            
            <button
              onClick={exportWaveform}
              className="text-green-400 hover:text-green-300 transition-colors p-1"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="bg-gray-800 border-b border-gray-700 p-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-green-400 block mb-1">Sample Rate (Hz)</label>
              <input
                type="number"
                value={config.sampleRate}
                onChange={(e) => setConfig(prev => ({ ...prev, sampleRate: parseInt(e.target.value) }))}
                className="w-full bg-gray-900 text-green-300 border border-gray-600 rounded px-2 py-1"
                min="50"
                max="500"
              />
            </div>
            
            <div>
              <label className="text-green-400 block mb-1">Noise Level</label>
              <input
                type="range"
                value={config.noiseLevel}
                onChange={(e) => setConfig(prev => ({ ...prev, noiseLevel: parseFloat(e.target.value) }))}
                className="w-full"
                min="0"
                max="0.1"
                step="0.001"
              />
              <span className="text-green-300">{(config.noiseLevel * 100).toFixed(1)}%</span>
            </div>
            
            <div>
              <label className="text-green-400 block mb-1">Pathology Level</label>
              <input
                type="range"
                value={config.pathologyFactor}
                onChange={(e) => setConfig(prev => ({ ...prev, pathologyFactor: parseFloat(e.target.value) }))}
                className="w-full"
                min="0"
                max="1"
                step="0.01"
              />
              <span className="text-green-300">{(config.pathologyFactor * 100).toFixed(0)}%</span>
            </div>
            
            <div>
              <label className="text-green-400 block mb-1">Sweep Speed</label>
              <input
                type="range"
                value={config.sweepSpeed}
                onChange={(e) => setConfig(prev => ({ ...prev, sweepSpeed: parseFloat(e.target.value) }))}
                className="w-full"
                min="0.1"
                max="3"
                step="0.1"
              />
              <span className="text-green-300">{config.sweepSpeed.toFixed(1)}x</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Waveform Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        className="w-full"
        style={{ backgroundColor: '#000' }}
      />
      
      {/* Footer with AI Insights */}
      {waveformData && (
        <div className="bg-gray-900 p-2 text-xs text-green-300 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>🤖 AI Analysis:</span>
              <span>Peaks: {waveformData.features.peaks.length}</span>
              <span>Freq: {waveformData.features.frequency.toFixed(2)} Hz</span>
              {waveformData.features.intervals.length > 0 && (
                <span>Avg Interval: {(waveformData.features.intervals.reduce((a, b) => a + b, 0) / waveformData.features.intervals.length).toFixed(0)}ms</span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>Real-time AI Generation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIWaveformDisplay