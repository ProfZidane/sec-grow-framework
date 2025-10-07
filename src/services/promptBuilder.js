/**
 * @fileoverview Constructeur de prompts utilisateur dynamiques
 * @module services/promptBuilder
 */

/**
 * @typedef {Object} DiagnosticData
 * @property {Object} responses - Réponses aux questions du diagnostic
 * @property {Object} context - Contexte de l'entreprise
 * @property {Object} evaluator - Profil de l'évaluateur
 * @property {Array} sections - Sections du diagnostic
 */

/**
 * @typedef {Object} SectionScore
 * @property {string} name - Nom de la section
 * @property {number} score - Score obtenu
 * @property {number} maxScore - Score maximum possible
 * @property {number} percentage - Pourcentage de réussite
 */

/**
 * Construit le prompt pour générer des recommandations de sécurité
 * @function buildSecurityRecommendationsPrompt
 * @param {DiagnosticData} diagnosticData - Données complètes du diagnostic
 * @returns {string} Prompt formaté pour les recommandations
 */
export const buildSecurityRecommendationsPrompt = (diagnosticData) => {
  const { responses, context, evaluator, sections } = diagnosticData
    
  // Calculer les scores par section
  const sectionScores = sections.map((section, index) => {
    const score = section.questions.reduce((total, question) => {
      return total + (responses[question.id] || 0)
    }, 0)
    return {
      name: section.title,
      score: score,
      maxScore: section.questions.length * 4,
      percentage: Math.round((score / (section.questions.length * 4)) * 100)
    }
  })

  const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0)
  const maxTotalScore = sections.reduce((total, section) => total + (section.questions.length * 4), 0)

  return `DIAGNOSTIC CYBERSÉCURITÉ - ANALYSE COMPLÈTE

    CONTEXTE ENTREPRISE:
    - Nom: ${context.companyName}
    - Secteur: ${context.sector}
    - Mission: ${context.mission}
    - Équipe: ${context.teamSize} opérationnels + ${context.boardSize} board
    - Produit: ${context.productType}
    - Fonctionnalités: ${context.mainFeatures}
    - Types de données: ${context.dataTypes.join(', ')}
    - Rôles clés: ${context.roles.join(', ')}

    ÉVALUATEUR:
    - Profil: ${evaluator.name}
    - Perspective: ${evaluator.description}

    RÉSULTATS DIAGNOSTIC:
    Score global: ${totalScore}/${maxTotalScore} (${Math.round((totalScore/maxTotalScore)*100)}%)

    Scores par pilier:
    ${sectionScores.map(section => 
      `- ${section.name}: ${section.score}/${section.maxScore} (${section.percentage}%)`
    ).join('\n')}

    RÉPONSES DÉTAILLÉES:
    ${sections.map(section => {
      const sectionResponses = section.questions.map(question => {
        const response = responses[question.id]
        return `  • ${question.text}: ${response}/4 (${question.options[response] || 'Non répondu'})`
      }).join('\n')
      return `${section.title}:\n${sectionResponses}`
    }).join('\n\n')}

    DEMANDE:
    Génère des recommandations de sécurité personnalisées pour ${context.companyName}, en tenant compte de leur contexte ${context.sector} et de leur niveau de maturité actuel.

    Concentre-toi sur les piliers les plus faibles et propose des actions concrètes adaptées à une équipe de ${context.teamSize} personnes.`
}

/**
 * Construit le prompt pour analyser les forces et faiblesses
 * @function buildStrengthsWeaknessesPrompt
 * @param {DiagnosticData} diagnosticData - Données complètes du diagnostic
 * @returns {string} Prompt formaté pour l'analyse forces/faiblesses
 */
export const buildStrengthsWeaknessesPrompt = (diagnosticData) => {
  const { responses, context, sections } = diagnosticData
    
  const sectionScores = sections.map((section, _) => {
    const score = section.questions.reduce((total, question) => {
      return total + (responses[question.id] || 0)
    }, 0)
    return {
      name: section.title,
      score: score,
      maxScore: section.questions.length * 4,
      percentage: Math.round((score / (section.questions.length * 4)) * 100)
    }
  });

  return `ANALYSE FORCES ET FAIBLESSES - ${context.companyName}
  CONTEXTE:
  - Entreprise: ${context.companyName} (${context.sector})
  - Équipe: ${context.teamSize} ops + ${context.boardSize} board
  - Produit: ${context.productType}

  SCORES PAR PILIER:
  ${sectionScores.map(section => 
    `- ${section.name}: ${section.score}/${section.maxScore} (${section.percentage}%)`
  ).join('\n')}

  RÉPONSES CLÉS:
  ${sections.map(section => {
    const sectionResponses = section.questions.map(question => {
      const response = responses[question.id]
      return `  • ${question.text}: ${response}/4`
    }).join('\n')
    return `${section.title}:\n${sectionResponses}`
  }).join('\n\n')}

  DEMANDE:
  Identifie les points forts et faiblesses de ${context.companyName} basés sur ces résultats.
  Explique l'impact business de chaque point dans le contexte ${context.sector}.`
}

/**
 * Construit le prompt pour générer des OKRs personnalisés
 * @function buildOKRsPrompt
 * @param {DiagnosticData} diagnosticData - Données complètes du diagnostic
 * @returns {string} Prompt formaté pour la génération d'OKRs
 */
export const buildOKRsPrompt = (diagnosticData) => {
    const { responses, context, sections } = diagnosticData
    
    const sectionScores = sections.map((section, _) => {
      const score = section.questions.reduce((total, question) => {
        return total + (responses[question.id] || 0)
      }, 0)
      return {
        name: section.title,
        score: score,
        maxScore: section.questions.length * 4,
        percentage: Math.round((score / (section.questions.length * 4)) * 100)
      }
    })

    // Identifier les piliers les plus faibles
    const weakestPillars = sectionScores
      .filter(section => section.percentage < 60)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3)

    return `GÉNÉRATION OKRs CYBERSÉCURITÉ - ${context.companyName}
    CONTEXTE ENTREPRISE:
    - Nom: ${context.companyName}
    - Secteur: ${context.sector} 
    - Mission: ${context.mission}
    - Équipe: ${context.teamSize} opérationnels + ${context.boardSize} board
    - Ressources: Startup/PME avec ressources limitées

    MATURITÉ ACTUELLE:
    ${sectionScores.map(section => 
      `- ${section.name}: ${section.percentage}% (${section.score}/${section.maxScore})`
    ).join('\n')}

    PILIERS PRIORITAIRES (les plus faibles):
    ${weakestPillars.map(pillar => 
      `- ${pillar.name}: ${pillar.percentage}% - Nécessite amélioration`
    ).join('\n')}

    CONTRAINTES:
    - Budget limité (startup)
    - Équipe technique de ${context.teamSize} personnes
    - Secteur ${context.sector} avec exigences spécifiques
    - Timeline: 3 mois (1 trimestre)

    DEMANDE:
    Crée 2-3 OKRs cybersécurité pour ${context.companyName} qui:
    1. Adressent les piliers les plus faibles
    2. Sont réalisables avec leurs ressources
    3. Ont un impact business mesurable
    4. Sont adaptés au secteur ${context.sector}

    Chaque OKR doit avoir 2-4 Key Results quantifiables et ambitieux mais atteignables.`
}
