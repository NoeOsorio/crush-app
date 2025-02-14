import { useState, useEffect } from 'react'
import { AnalysisLoader } from '../AnalysisLoader/AnalysisLoader'
import { InitialLoader } from '../InitialLoader/InitialLoader'
import { openAIService } from '../../services/openai'

type QuizProps = {
  onComplete: (answers: string[]) => void
}

type Option = {
  text: string
  emoji: string
  value: number
}

export function Quiz({ onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState<string>('')
  const [options, setOptions] = useState<Option[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [answers, setAnswers] = useState<string[]>([])
  const [isPositive, setIsPositive] = useState(true)
  const [analysisMessages, setAnalysisMessages] = useState<string[]>([])
  const [isPreparingResult, setIsPreparingResult] = useState(false)

  const loadNextQuestion = async () => {
    try {
      const response = await openAIService.generateQuestion(answers)
      setCurrentQuestion(response.question)
      setOptions(response.options)
    } catch (error) {
      console.error('Error generando pregunta:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    openAIService.resetQuestions()
    if (answers.length === 0) {
      loadNextQuestion()
    }
  }, [])

  const handleAnswer = async (option: Option) => {
    setIsAnalyzing(true)
    
    try {
      const analysis = await openAIService.generateAnalysisMessages(option.text)
      setIsPositive(option.value >= 1)
      setAnalysisMessages(analysis.messages)
      
      const newAnswers = [...answers, option.text]
      setAnswers(newAnswers)

      if (newAnswers.length >= 5) {
        setIsPreparingResult(true)
        setTimeout(() => {
          onComplete(newAnswers)
        }, 2000)
      } else {
        await loadNextQuestion()
        setTimeout(() => {
          setIsAnalyzing(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Error analizando respuesta:', error)
      setIsAnalyzing(false)
    }
  }

  if (isLoading) {
    return <InitialLoader />
  }

  if (isPreparingResult) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin text-4xl">
          💝
        </div>
        <p className="text-gray-600 animate-pulse">
          Analizando todas tus respuestas...
        </p>
        <p className="text-sm text-gray-500">
          Preparando el veredicto final
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Pregunta {answers.length + 1} de 5
        </p>
      </div>

      <div className="text-center transform transition-all duration-300 ease-in-out">
        <h2 className="text-xl font-semibold text-gray-800">
          {currentQuestion}
        </h2>
      </div>

      {isAnalyzing ? (
        <AnalysisLoader isPositive={isPositive} messages={analysisMessages} />
      ) : (
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`
                w-full py-3 px-4 text-left rounded-lg
                transform transition-all duration-200
                bg-pink-50 hover:bg-pink-100 hover:scale-102
                hover:shadow-md flex items-center justify-between
              `}
            >
              <span>{option.text}</span>
              <span className="text-2xl">{option.emoji}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 