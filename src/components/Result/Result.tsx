import { useState, useEffect } from 'react'
import { openAIService } from '../../services/openai'

type ResultProps = {
  answers: string[]
  onRestart: () => void
}

type ResultData = {
  title: string
  description: string
  emoji: string
  advice: string
  compatibility: number
}

export function Result({ answers, onRestart }: ResultProps) {
  const [result, setResult] = useState<ResultData>({
    title: '',
    description: '',
    emoji: '🤔',
    advice: '',
    compatibility: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateResult()
  }, [])

  const generateResult = async () => {
    try {
      const response = await openAIService.generateResult(answers)
      setResult(response)
    } catch (error) {
      console.error('Error generando resultado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <p className="animate-pulse">Procesando el veredicto final... 💭</p>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl animate-bounce transition-all duration-500 hover:scale-110">
        {result.emoji}
      </div>
      
      <div className="transform transition-all duration-500 hover:scale-105">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {result.title}
        </h2>
        <p className="mt-2 text-gray-600">
          {result.description}
        </p>
        
        <div className="mt-4">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${result.compatibility}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Compatibilidad: {result.compatibility}%
          </p>
        </div>

        <p className="mt-4 text-pink-600 italic">
          "{result.advice}"
        </p>
      </div>

      <div className="pt-4 space-y-4">
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg
            transform transition-all duration-200 hover:scale-105 hover:shadow-lg
            active:scale-95"
        >
          Intentar con otro crush 💘
        </button>
        
        <div className="space-y-2">
          <button
            onClick={() => {
              navigator.share?.({
                title: '¡Mi resultado en el Detector de Crush!',
                text: `${result.title}\n${result.description}`
              }).catch(() => {
                alert('¡Comparte tu resultado con tus amigos!')
              })
            }}
            className="text-pink-500 hover:text-pink-600 text-sm font-medium"
          >
            Compartir resultado 🔄
          </button>

          <p className="text-xs text-gray-500 pt-2">
            ¿Te gustó el test? 
            <a 
              href="https://www.buymeacoffee.com/noeosorio" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 ml-1"
            >
              ¡Invítame un café! ☕️
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 