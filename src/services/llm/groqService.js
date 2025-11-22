/**
 * @fileoverview Service Groq LLM pour les appels API vers Groq
 * @module services/llm/groqService
 */

const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

// Modèles LLM disponibles
const MODELS = 'meta-llama/llama-4-scout-17b-16e-instruct';

/**
 * @typedef {Object} GroqMessage
 * @property {'system'|'user'|'assistant'} role - Rôle du message
 * @property {string} content - Contenu du message
 */

/**
 * @typedef {Object} GroqOptions
 * @property {string} [model=MODELS] - Modèle LLM à utiliser
 * @property {number} [temperature=0.7] - Température de génération (0-1)
 * @property {number} [maxTokens=2000] - Nombre maximum de tokens
 */

/**
 * Effectue un appel générique à l'API Groq
 * @async
 * @function callGroq
 * @param {GroqMessage[]} messages - Messages de conversation
 * @param {GroqOptions} [options={}] - Options de configuration
 * @returns {Promise<string>} Réponse générée par le LLM
 * @throws {Error} Erreur API ou de réseau
 */
export const callGroq = async (messages, options = {}) => {
  const {
    model = MODELS,
    temperature = 0.7,
    maxTokens = 2000
  } = options

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content

  } catch (error) {
    console.error('Erreur Groq Service:', error)
    throw new Error(`Impossible de générer les recommandations: ${error.message}`)
  }
}

/**
 * Génère des recommandations de sécurité personnalisées
 * @async
 * @function generateSecurityRecommendations
 * @param {Object} diagnosticData - Données du diagnostic (non utilisé directement)
 * @param {string} systemPrompt - Prompt système pour les recommandations
 * @param {string} userPrompt - Prompt utilisateur avec données contextuelles
 * @returns {Promise<string>} Recommandations de sécurité au format JSON
 * @throws {Error} Erreur de génération LLM
 */
export const generateSecurityRecommendations = async (diagnosticData, systemPrompt, userPrompt) => {
  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user', 
      content: userPrompt
    }
  ]

  return await callGroq(messages, {
    model: MODELS,
    temperature: 0.3,
    maxTokens: 3000
  })
}

/**
 * Analyse les points forts et faiblesses d'un diagnostic
 * @async
 * @function analyzeStrengthsWeaknesses
 * @param {Object} diagnosticData - Données du diagnostic (non utilisé directement)
 * @param {string} systemPrompt - Prompt système pour l'analyse
 * @param {string} userPrompt - Prompt utilisateur avec données contextuelles
 * @returns {Promise<string>} Analyse des forces/faiblesses au format JSON
 * @throws {Error} Erreur de génération LLM
 */
export const analyzeStrengthsWeaknesses = async (diagnosticData, systemPrompt, userPrompt) => {
  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: userPrompt
    }
  ]

  return await callGroq(messages, {
    model: MODELS,
    temperature: 0.2,
    maxTokens: 1500
  })
}

/**
 * Génère des OKRs (Objectives and Key Results) personnalisés
 * @async
 * @function generateOKRs
 * @param {Object} diagnosticData - Données du diagnostic (non utilisé directement)
 * @param {string} systemPrompt - Prompt système pour les OKRs
 * @param {string} userPrompt - Prompt utilisateur avec données contextuelles
 * @returns {Promise<string>} OKRs personnalisés au format JSON
 * @throws {Error} Erreur de génération LLM
 */
export const generateOKRs = async (diagnosticData, systemPrompt, userPrompt) => {
  const messages = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: userPrompt
    }
  ]

  return await callGroq(messages, {
    model: MODELS,
    temperature: 0.4,
    maxTokens: 2500
  })
}