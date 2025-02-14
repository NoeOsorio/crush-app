import { useEffect, useState } from 'react'

const funnyMessages = [
  "Analizando las señales... 🔍",
  "Ay amigo, date cuenta... 👀",
  "Procesando el nivel de friendzone... 💔",
  "No me gusta por donde va esto... 😅",
  "Consultando con Cupido... 💘",
  "Detectando red flags... 🚩",
  "¿Seguro que no es el hambre? 🤔",
  "Midiendo el nivel de ilusión... ✨",
  "Houston, tenemos un problema... 🚀",
  "Calculando probabilidades de éxito... 📊"
]

type AnalysisLoaderProps = {
  isPositive?: boolean
  messages: string[]
}

export function AnalysisLoader({ isPositive = true, messages }: AnalysisLoaderProps) {
  const [message, setMessage] = useState(messages[0] || funnyMessages[0])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(() => {
        const availableMessages = messages.length > 0 ? messages : 
          (isPositive 
            ? funnyMessages.filter(msg => !msg.includes("problema") && !msg.includes("date cuenta"))
            : funnyMessages.filter(msg => msg.includes("problema") || msg.includes("No me gusta")))
        const randomIndex = Math.floor(Math.random() * availableMessages.length)
        return availableMessages[randomIndex]
      })
    }, 800)

    return () => clearInterval(interval)
  }, [isPositive, messages])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev + 1) % 100)
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner">
        {/* Fondo con patrón de rayas */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #000 0px,
              #000 10px,
              transparent 10px,
              transparent 20px
            )`
          }}
        />
        
        {/* Barra de progreso principal */}
        <div 
          className="absolute h-full transition-all duration-300 ease-out rounded-full bg-gradient-to-r from-pink-300 to-pink-400"
          style={{ width: `${progress}%` }}
        >
          {/* Efecto brillante */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shine"></div>
        </div>

        {/* Pequeños detalles decorativos */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full animate-pulse mx-1"></div>
          <div className="w-1 h-1 bg-white rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-white rounded-full animate-pulse mx-1" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 font-medium animate-pulse">
        {message}
      </p>
    </div>
  )
} 