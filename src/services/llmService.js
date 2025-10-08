/**
 * @fileoverview Service principal LLM - Orchestration des analyses
 * @module services/llmService
 */

import { generateSecurityRecommendations, analyzeStrengthsWeaknesses, generateOKRs } from './llm/groqService.js'
import { SYSTEM_PROMPTS } from './prompts.js'
import { buildSecurityRecommendationsPrompt, buildStrengthsWeaknessesPrompt, buildOKRsPrompt } from './promptBuilder.js'

/**
 * @typedef {Object} AnalysisResults
 * @property {Object|null} recommendations - Recommandations générées
 * @property {Object|null} analysis - Analyse forces/faiblesses
 * @property {Object|null} okrs - OKRs générés
 * @property {string[]} errors - Liste des erreurs rencontrées
 */

/**
 * @typedef {Object} DiagnosticData
 * @property {Object} responses - Réponses aux questions
 * @property {Object} context - Contexte entreprise
 * @property {Object} evaluator - Profil évaluateur
 * @property {Array} sections - Sections du diagnostic
 */

/**
 * Génère une analyse complète LLM pour un diagnostic
 * @async
 * @function generateFullAnalysis
 * @param {DiagnosticData} diagnosticData - Données du diagnostic
 * @returns {Promise<AnalysisResults>} Résultats de l'analyse complète
 */
export const generateFullAnalysis = async (diagnosticData) => {
  const results = {
    recommendations: null,
    analysis: null,
    okrs: null,
    errors: []
  }

  try {
    console.log('Génération des recommandations...')
    results.recommendations = await generateRecommendationsAnalysis(diagnosticData)
    
    console.log('Analyse des forces et faiblesses...')
    results.analysis = await generateStrengthsWeaknessesAnalysis(diagnosticData)
    
    console.log('Génération des OKRs...')
    results.okrs = await generateOKRsAnalysis(diagnosticData)
    
    console.log('Analyse LLM terminée avec succès')
    return results

  } catch (error) {
    console.error('Erreur lors de l\'analyse LLM:', error)
    results.errors.push(error.message)
    return results
  }
}

/**
 * Génère des recommandations de sécurité personnalisées
 * @async
 * @function generateRecommendationsAnalysis
 * @param {DiagnosticData} diagnosticData - Données du diagnostic
 * @returns {Promise<Object>} Recommandations parsées au format JSON
 * @throws {Error} Erreur de génération ou de parsing
 */
export const generateRecommendationsAnalysis = async (diagnosticData) => {
  try {
    const systemPrompt = SYSTEM_PROMPTS.SECURITY_RECOMMENDATIONS
    const userPrompt = buildSecurityRecommendationsPrompt(diagnosticData)
    
    const response = await generateSecurityRecommendations(
      diagnosticData, 
      systemPrompt, 
      userPrompt
    )
    
    return parseJSONResponse(response, 'recommendations')
    
  } catch (error) {
    console.error('Erreur génération recommandations:', error)
    throw new Error(`Impossible de générer les recommandations: ${error.message}`)
  }
}

/**
 * Génère l'analyse des forces et faiblesses
 * @async
 * @function generateStrengthsWeaknessesAnalysis
 * @param {DiagnosticData} diagnosticData - Données du diagnostic
 * @returns {Promise<Object>} Analyse parsée avec strengths et weaknesses
 * @throws {Error} Erreur de génération ou de parsing
 */
export const generateStrengthsWeaknessesAnalysis = async (diagnosticData) => {
  try {
    const systemPrompt = SYSTEM_PROMPTS.STRENGTHS_WEAKNESSES
    const userPrompt = buildStrengthsWeaknessesPrompt(diagnosticData)
    
    const response = await analyzeStrengthsWeaknesses(
      diagnosticData,
      systemPrompt,
      userPrompt
    )
    
    return parseJSONResponse(response, 'analysis')
    
  } catch (error) {
    console.error('Erreur génération analyse:', error)
    throw new Error(`Impossible de générer l'analyse: ${error.message}`)
  }
}

/**
 * Génère des OKRs (Objectives and Key Results) personnalisés
 * @async
 * @function generateOKRsAnalysis
 * @param {DiagnosticData} diagnosticData - Données du diagnostic
 * @returns {Promise<Object>} OKRs parsés au format JSON
 * @throws {Error} Erreur de génération ou de parsing
 */
export const generateOKRsAnalysis = async (diagnosticData) => {
  try {
    const systemPrompt = SYSTEM_PROMPTS.OKRS_GENERATION
    const userPrompt = buildOKRsPrompt(diagnosticData)
    
    const response = await generateOKRs(
      diagnosticData,
      systemPrompt,
      userPrompt
    )
    
    return parseJSONResponse(response, 'okrs')
    
  } catch (error) {
    console.error('Erreur génération OKRs:', error)
    throw new Error(`Impossible de générer les OKRs: ${error.message}`)
  }
}

/**
 * Parse la réponse JSON du LLM avec gestion d'erreurs robuste
 * @function parseJSONResponse
 * @param {string} response - Réponse brute du LLM
 * @param {'recommendations'|'analysis'|'okrs'} type - Type d'analyse pour validation
 * @returns {Object} Objet JSON parsé et validé
 */
export const parseJSONResponse = (response, type) => {
    try {
      // Nettoyer la réponse (enlever les markdown, etc.)
      let cleanResponse = response.trim()
      
      // Enlever les blocs de code markdown si présents
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '')
      }
      
      const parsed = JSON.parse(cleanResponse)
      
      // Validation basique de la structure
      if (type === 'recommendations' && !parsed.recommendations) {
        throw new Error('Format de réponse invalide: recommendations manquantes')
      }
      if (type === 'analysis' && (!parsed.strengths || !parsed.weaknesses)) {
        throw new Error('Format de réponse invalide: strengths ou weaknesses manquantes')
      }
      if (type === 'okrs' && !parsed.okrs) {
        throw new Error('Format de réponse invalide: okrs manquantes')
      }
      
      return parsed
      
    } catch (error) {
      console.error(`Erreur parsing JSON pour ${type}:`, error)
      console.error('Réponse brute:', response)
      
      // Retourner une structure par défaut en cas d'erreur
      return getDefaultResponse(type)
    }
  }

/**
 * Retourne une réponse par défaut en cas d'erreur de parsing
 * @function getDefaultResponse
 * @param {'recommendations'|'analysis'|'okrs'} type - Type de réponse par défaut
 * @returns {Object} Structure par défaut selon le type
 */
export const getDefaultResponse = (type) => {
    switch (type) {
      case 'recommendations':
        return {
          recommendations: [{
            priority: 1,
            title: "Analyse en cours",
            description: "Les recommandations sont en cours de génération. Veuillez réessayer.",
            pillar: "technical",
            impact: "medium",
            timeline: "immediate",
            effort: "low",
            context: "Erreur temporaire de génération"
          }]
        }
      
      case 'analysis':
        return {
          strengths: [{
            title: "Analyse en cours",
            description: "L'analyse des forces est en cours de génération.",
            pillar: "governance",
            score: "En cours",
            business_impact: "À déterminer"
          }],
          weaknesses: [{
            title: "Analyse en cours", 
            description: "L'analyse des faiblesses est en cours de génération.",
            pillar: "technical",
            score: "En cours",
            risk: "À évaluer",
            urgency: "medium"
          }]
        }
      
      case 'okrs':
        return {
          okrs: [{
            objective: "Améliorer la maturité cybersécurité",
            pillar: "governance",
            rationale: "Objectifs en cours de génération",
            key_results: [{
              description: "Définir les métriques de sécurité",
              target: "À déterminer",
              metric: "En cours",
              baseline: "À évaluer"
            }]
          }]
        }
      
      default:
        return {}
    }
  }
