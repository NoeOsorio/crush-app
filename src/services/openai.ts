import OpenAI from 'openai'
import { OPENAI_API_KEY } from '../config/env'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo
})

type GenerateQuestionResponse = {
  question: string
  options: Array<{
    text: string
    emoji: string
    value: number // 0 = mala señal, 1 = neutral, 2 = buena señal
  }>
}

type GenerateAnalysisResponse = {
  messages: string[]
  isPositive: boolean
}

type GenerateResultResponse = {
  title: string
  description: string
  emoji: string
  advice: string
  compatibility: number // 0-100
}

// Primero definimos un tipo para las preguntas usadas
type AskedQuestion = {
  question: string
  timestamp: number
}

// Agregamos un array para almacenar las preguntas ya realizadas
let askedQuestions: AskedQuestion[] = []

export const openAIService = {
  async generateQuestion(previousAnswers: string[]): Promise<GenerateQuestionResponse> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Eres un generador de preguntas para un test de cuanto le gustas a tu crush.
            Debes generar preguntas que sean divertidas y reveladoras sobre si alguien está siendo utilizado en una relación.
            Las preguntas deben ser cortas y directas.
            Son preguntas de opciones múltiples, con una respuesta positiva, negativa y neutral.
            
            IMPORTANTE: 
            - Debes responder SOLO con un JSON válido
            - La pregunta NO debe ser similar a ninguna de estas preguntas previas:
              ${askedQuestions.map(q => q.question).join(" | ")}
            - Las respuestas deben seguir este patrón:
              * Respuesta negativa (value: 0): Debe indicar una red flag o señal de desinterés. Usar emojis como 🚩💔😢🚫⛔️
              * Respuesta positiva (value: 2): Debe indicar interés romántico. Usar emojis como 💖💝💕💗💓
              * Respuesta neutral (value: 1): Debe indicar ambigüedad. Usar emojis como 🤔💭❓😅🫤

            Estructura JSON requerida:
            {
              "question": "¿Pregunta divertida?",
              "options": [
                {"text": "Respuesta negativa", "emoji": "🚩", "value": 0},
                {"text": "Respuesta positiva", "emoji": "💖", "value": 2},
                {"text": "Respuesta neutral", "emoji": "🤔", "value": 1}
              ]
            }
            Nota: "text" no debe ser un emoji, debe ser un texto claro y conciso.
            `
        },
        {
          role: "user",
          content: `Genera una nueva pregunta divertida. Respuestas previas: ${previousAnswers.join(", ")}`
        }
      ],
      temperature: 0.9, // Aumentamos la temperatura para más variedad
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    
    // Guardamos la pregunta en el historial
    askedQuestions.push({
      question: result.question,
      timestamp: Date.now()
    })

    // Limpiamos preguntas antiguas (opcional, después de 24 horas)
    askedQuestions = askedQuestions.filter(q => 
      Date.now() - q.timestamp < 24 * 60 * 60 * 1000
    )

    return result
  },

  // Método para reiniciar el historial de preguntas
  resetQuestions() {
    askedQuestions = []
  },

  async generateAnalysisMessages(answer: string): Promise<GenerateAnalysisResponse> {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Genera mensajes divertidos y sarcásticos para mostrar mientras se analiza una respuesta en un test de amor.
            IMPORTANTE: Debes responder SOLO con un JSON válido que siga exactamente esta estructura:
            {
              "messages": ["mensaje1 🤔", "mensaje2 💭", "mensaje3 💫"],
              "isPositive": boolean
            }`
        },
        {
          role: "user",
          content: `Genera 3 mensajes cortos y graciosos basados en esta respuesta: "${answer}"`
        }
      ],
      temperature: 0.9,
      response_format: { type: "json_object" }
    })

    return JSON.parse(response.choices[0].message.content || '{}')
  },

  async generateResult(answers: string[]): Promise<GenerateResultResponse> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Eres un experto en análisis de cuanto le gustas a tu crush con un toque de humor.
            Basándote en las respuestas del test, debes generar un resultado divertido pero revelador.

            IMPORTANTE:
            - Analiza el patrón de las respuestas para determinar:
              * Si hay muchas red flags (señales negativas)
              * Si hay señales mixtas o confusas
              * Si hay señales positivas claras
            
            - El porcentaje de compatibilidad debe calcularse así:
              * Respuestas muy negativas reducen 20-30%
              * Respuestas neutrales mantienen o reducen 5-10%
              * Respuestas positivas suman 20-25%
            
            - El consejo debe ser humorístico pero útil
            
            Estructura JSON requerida:
            {
              "title": "Título que resuma la situación de forma graciosa",
              "description": "Análisis detallado con toques de humor",
              "emoji": "Un emoji que represente la situación general",
              "advice": "Consejo sarcástico pero útil",
              "compatibility": número_entre_0_y_100
            }

            Ejemplos de títulos según el caso:
            - Bajo interés: "Houston, tenemos varios problemas 🚩"
            - Señales mixtas: "Ni contigo ni sin ti 🎭"
            - Alto interés: "¡Alerta de amor correspondido! 💘"
            `
        },
        {
          role: "user",
          content: `Analiza estas respuestas y genera un resultado: ${answers.join(" | ")}`
        }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    })

    return JSON.parse(response.choices[0].message.content || '{}')
  }
} 