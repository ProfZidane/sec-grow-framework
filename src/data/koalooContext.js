// src/data/koalooContext.js - Contexte enrichi pour KOALOO

export const KOALOO_ENHANCED_CONTEXT = {
  company: {
    name: 'KOALOO',
    sector: 'Fintech ESG/Sustainability',
    stage: 'Early Stage Startup',
    mission: 'Améliorer le score ESG des corporates via leurs fournisseurs',
    vision: 'Devenir la référence européenne du tracking ESG B2B'
  },
  
  team: {
    operational: 4,
    board: 5,
    structure: {
      leadership: ['Chairman', 'CEO'],
      tech: ['CTO', 'Data Scientist'],
      ops: ['Operations Manager', 'Business Developer']
    }
  },
  
  product: {
    type: 'SaaS B2B',
    description: 'Plateforme de tracking et amélioration des KPIs ESG',
    clients: 'Grandes entreprises et ETI',
    integrations: ['ERP clients', 'APIs fournisseurs', 'Bases de données ESG']
  },
  
  businessChallenges: [
    {
      challenge: 'Acquisition 10k utilisateurs actifs',
      timeline: 'Q1 2025',
      securityImplications: ['Scalabilité infrastructure', 'Protection données masse', 'Conformité RGPD renforcée']
    },
    {
      challenge: 'Levée de fonds Série A',
      timeline: 'Q2 2025', 
      securityImplications: ['Due diligence sécurité', 'Certifications ISO/SOC2', 'Audit complet infrastructure']
    },
    {
      challenge: 'Expansion européenne',
      timeline: 'H2 2025',
      securityImplications: ['Conformité multi-pays', 'Localisation données', 'Partenariats sécurisés']
    }
  ],
  
  securitySpecifics: {
    regulatoryRequirements: ['RGPD', 'Directive NIS2', 'DORA (Digital Operational Resilience Act)'],
    dataTypes: ['Données ESG corporates', 'Métriques fournisseurs', 'Indicateurs performance'],
    criticalAssets: ['Base données clients', 'Algorithmes scoring ESG', 'API intégrations'],
    threatLandscape: ['Espionnage industriel', 'Ransomware', 'Fraude aux données ESG']
  },
  
  competitiveAdvantage: {
    securityDifferentiators: [
      'Transparence totale sur la sécurité des données ESG',
      'Certification sécurité comme argument commercial',
      'Conformité réglementaire proactive',
      'Trust & Safety comme valeur core business'
    ]
  }
}

// Fonction pour personnaliser les recommandations selon le contexte KOALOO
export function generateKoalooSpecificRecommendations(maturityLevel, sectionScores) {
  const recommendations = []
  
  // Recommandations spécifiques au secteur fintech ESG
  if (maturityLevel === 0) {
    recommendations.push({
      priority: 1,
      title: 'Sécurisation urgente des données ESG',
      description: 'Mise en place d\'un chiffrement pour protéger les données ESG sensibles des clients corporates',
      koalooContext: 'Essentiel pour maintenir la confiance des grandes entreprises clientes',
      businessImpact: 'Éviter la perte de clients existants et débloquer de nouveaux contrats',
      timeline: '7 jours',
      investmentRequired: '< 5k€',
      roi: 'Protection de 100% du CA existant'
    })
  }
  
  if (sectionScores[0] < 10) { // Gouvernance faible
    recommendations.push({
      priority: 2,
      title: 'Politique sécurité fintech ESG conforme',
      description: 'Créer une politique adaptée aux exigences RGPD + NIS2 + DORA',
      koalooContext: 'Obligatoire pour les audits clients et la future levée de fonds',
      businessImpact: 'Accélération des cycles de vente B2B et facilitation due diligence',
      timeline: '2 semaines',
      investmentRequired: '2-3k€ (conseil juridique)',
      roi: 'Déblocage pipeline commercial estimé à 200k€'
    })
  }
  
  if (sectionScores[1] < 10) { // Technique faible
    recommendations.push({
      priority: 3,
      title: 'Sécurisation API et intégrations',
      description: 'Renforcer la sécurité de votre plateforme SaaS et des intégrations clients',
      koalooContext: 'Protection des connexions avec les ERP et systèmes clients',
      businessImpact: 'Augmentation du taux de conversion et réduction du churn',
      timeline: '1 mois',
      investmentRequired: '10-15k€',
      roi: 'Réduction de 50% des incidents client'
    })
  }
  
  return recommendations.slice(0, 3) // Top 3 priorités
}

// Fonction pour générer des OKRs contextualisés KOALOO
export function generateKoalooOKRs(maturityLevel, businessObjective = "Acquérir 10 000 nouveaux utilisateurs actifs") {
  const context = KOALOO_ENHANCED_CONTEXT
  
  return {
    businessContext: {
      objective: businessObjective,
      sector: context.company.sector,
      stage: context.company.stage,
      keyChallenge: context.businessChallenges[0].challenge
    },
    
    riskAnalysis: {
      primaryRisk: 'Perte de confiance des clients corporates suite à un incident de sécurité',
      businessImpact: 'Arrêt des nouveaux contrats + churn existant = -70% CA',
      complianceRisk: 'Non-conformité RGPD/DORA = amendes + interdiction opérer UE'
    },
    
    contextualizedOKRs: {
      ceo: {
        objective: `Croissance sécurisée vers 10k utilisateurs tout en préparant la Série A`,
        keyResults: [
          '10 000 nouveaux utilisateurs corporates actifs d\'ici fin Q1',
          'Score de confiance sécurité > 4.5/5 dans les enquêtes clients',
          '0 incident affectant les données ESG des clients',
          'Certification sécurité obtenue pour faciliter due diligence investisseurs'
        ]
      },
      
      cto: {
        objective: `Infrastructure scalable et sécurisée pour supporter la croissance`,
        keyResults: maturityLevel === 0 ? [
          '100% des accès aux données ESG protégés par MFA sous 7 jours',
          '100% des API clients chiffrées (TLS 1.3) sous 14 jours', 
          '0 données ESG stockées en clair sous 21 jours',
          'Tests de charge validés jusqu\'à 15k utilisateurs simultanés'
        ] : [
          '99.9% d\'uptime de la plateforme ESG',
          'API rate limiting et monitoring déployés sur 100% des endpoints',
          'Délai de détection d\'anomalies < 15 minutes',
          'Backup et recovery testés mensuellement'
        ]
      }
    }
  }
}