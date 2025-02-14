import { useState } from 'react'
import { Quiz } from './components/Quiz/Quiz'
import { Result } from './components/Result/Result'
import { Footer } from './components/Footer/Footer'

type Step = 'start' | 'quiz' | 'result'

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('start')
  const [answers, setAnswers] = useState<string[]>([])

  const handleQuizComplete = (quizAnswers: string[]) => {
    setAnswers(quizAnswers)
    setCurrentStep('result')
  }

  const handleRestart = () => {
    setCurrentStep('start')
    setAnswers([])
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-500 to-purple-600">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-6">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-pink-600">
              💘 Detector de Crush 💘
            </h1>
            <p className="text-gray-600 mt-2">
              ¡Descubre si tu crush te corresponde o solo te está utilizando!
            </p>
          </header>

          {currentStep === 'start' && (
            <div className="text-center">
              <button
                onClick={() => setCurrentStep('quiz')}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transform transition hover:scale-105"
              >
                Descubrir la verdad 🔍
              </button>
            </div>
          )}

          {currentStep === 'quiz' && (
            <Quiz onComplete={handleQuizComplete} />
          )}

          {currentStep === 'result' && (
            <Result answers={answers} onRestart={handleRestart} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
