// src/utils/okrGenerator.js
import { MATURITY_LEVELS } from '@/data/questions'

export class OKRGenerator {
  constructor(responses, sections, selectedEvaluator) {
    this.responses = responses
    this.sections = sections
    this.evaluator = selectedEvaluator
    this.globalScore = this.calculateGlobalScore()
    this.globalMaturityLevel = this.getGlobalMaturityLevel()
  }

  calculateGlobalScore() {
    return this.sections.reduce((total, section, index) => {
      return total + this.getSectionScore(index)
    }, 0)
  }

  getSectionScore(sectionIndex) {
    const section = this.sections[sectionIndex]
    let score = 0
    section.questions.forEach(question => {
      if (this.responses[question.id] !== undefined) {
        score += this.responses[question.id]
      }
    })
    return score
  }

  getGlobalMaturityLevel() {
    const score = this.globalScore
    if (score <= 16) return 0
    if (score <= 35) return 1
    if (score <= 55) return 2
    if (score <= 70) return 3
    return 4
  }

  // Génération des OKRs selon la méthodologie SEC-GROW
  generateOKRs() {
    const okrs = {
      metadata: {
        company: 'KOALOO',
        evaluator: this.evaluator.name,
        maturityLevel: this.globalMaturityLevel,
        maturityName: MATURITY_LEVELS[this.globalMaturityLevel].name,
        businessObjective: "Acquérir 10 000 nouveaux utilisateurs actifs",
        riskAnalysis: this.analyzeBusinessRisks()
      },
      cascade: this.generateCascadeOKRs()
    }
    return okrs
  }

  analyzeBusinessRisks() {
    const risks = []
    
    // Risques selon niveau de maturité
    if (this.globalMaturityLevel === 0) {
      risks.push({
        risk: "Compromission complète des systèmes",
        impact: "CRITIQUE - Survie de l'entreprise menacée",
        probability: "ÉLEVÉE"
      })
    }
    
    // Risques spécifiques par pilier faible
    this.sections.forEach((section, index) => {
      const score = this.getSectionScore(index)
      if (score < 8) {
        risks.push(this.getSectionSpecificRisks(section.title, score))
      }
    })
    
    return risks
  }

  getSectionSpecificRisks(sectionTitle, score) {
    const riskMap = {
      'Gouvernance et Organisation': {
        risk: "Absence de cadre réglementaire pour fintech",
        impact: "Sanctions, perte de confiance client",
        probability: "MOYENNE"
      },
      'Sécurité Technique': {
        risk: "Fuite de données ESG clients",
        impact: "Amendes RGPD, perte clients corporates", 
        probability: "ÉLEVÉE"
      },
      'Processus et Conformité': {
        risk: "Non-conformité réglementaire fintech",
        impact: "Blocage expansion, sanctions",
        probability: "ÉLEVÉE"
      },
      'Culture et Facteur Humain': {
        risk: "Erreurs humaines critiques",
        impact: "Incidents sécurité, interruption service",
        probability: "MOYENNE"
      }
    }
    return riskMap[sectionTitle] || { risk: "Risque générique", impact: "Modéré", probability: "FAIBLE" }
  }

  generateCascadeOKRs() {
    return {
      topManagement: this.generateTopManagementOKRs(),
      cto: this.generateCTOOKRs(),
      leadDev: this.generateLeadDevOKRs(),
      securityManager: this.generateSecurityManagerOKRs(),
      devOps: this.generateDevOpsOKRs()
    }
  }

  generateTopManagementOKRs() {
    const objectiveBase = "Croissance utilisateurs sécurisée"
    const krs = [
      "10 000 nouveaux comptes créés d'ici fin trimestre",
      "Taux d'activation > 70% (utilisateurs qui complètent l'onboarding)"
    ]

    // KRs sécurité selon niveau de maturité
    if (this.globalMaturityLevel === 0) {
      krs.push("0 incident de sécurité impactant les utilisateurs")
      krs.push("Audit sécurité basique réussi avant campagne d'acquisition")
    } else if (this.globalMaturityLevel === 1) {
      krs.push("Score de confiance sécurité > 4/5 dans enquêtes utilisateurs")
      krs.push("100% conformité aux exigences de protection des données")
    } else if (this.globalMaturityLevel >= 2) {
      krs.push("Certification sécurité obtenue (ISO 27001 ou SOC2)")
      krs.push("Sécurité valorisée dans 80% des communications marketing")
    }

    return {
      role: "Top Management (CEO/Fondateurs)",
      objective: objectiveBase,
      details: "Acquérir 10 000 nouveaux utilisateurs actifs sans compromettre la sécurité organisationnelle",
      keyResults: krs
    }
  }

  generateCTOOKRs() {
    const weakSections = this.getWeakSections()
    const objectiveBase = this.globalMaturityLevel === 0 ? 
      "Sécuriser l'infrastructure avant la montée en charge" :
      "Infrastructure robuste et processus sécurisés"

    const krs = []

    // KRs selon niveau de maturité
    if (this.globalMaturityLevel === 0) {
      krs.push("100% des accès administrateur sécurisés (MDP uniques + MFA) sous 7 jours")
      krs.push("100% des services exposés accessibles uniquement en HTTPS sous 14 jours")
      krs.push("0 données utilisateurs stockées en clair (chiffrement minimal déployé) sous 21 jours")
      krs.push("Processus de sauvegarde automatisé et testé avant le pic d'inscriptions")
    } else if (this.globalMaturityLevel === 1) {
      krs.push("100% des accès critiques protégés par MFA sous 4 semaines")
      krs.push("95% des secrets techniques gérés centralement (Vault/AWS Secrets)")
      krs.push("Cloisonnement complet dev/test/prod avec 0 fuite de données")
      krs.push("Tests de sécurité intégrés dans 100% des déploiements")
    } else if (this.globalMaturityLevel >= 2) {
      krs.push("90% du code analysé automatiquement par des outils de sécurité")
      krs.push("Délai moyen de correction des vulnérabilités critiques < 15 jours")
      krs.push("100% des incidents sécurité traités selon la procédure documentée")
      krs.push("Tests d'intrusion trimestriels avec score > 85/100")
    }

    return {
      role: "CTO (Chief Technical Officer)",
      objective: objectiveBase,
      details: this.globalMaturityLevel === 0 ? 
        "Éliminer les vulnérabilités critiques et établir les bases sécuritaires minimales AVANT d'accueillir 10 000 nouveaux utilisateurs" :
        "Industrialiser la sécurité pour supporter une croissance durable",
      keyResults: krs
    }
  }

  generateLeadDevOKRs() {
    const krs = []
    
    if (this.globalMaturityLevel === 0) {
      krs.push("100% des endpoints d'inscription/login en HTTPS avec certificats valides")
      krs.push("100% des mots de passe utilisateurs hachés avec algorithme sécurisé (bcrypt/Argon2)")
      krs.push("0 données personnelles stockées en clair dans la base de données")
      krs.push("Tests de charge sur parcours d'inscription validés jusqu'à 500 users/minute")
    } else {
      krs.push("100% du code analysé par outils SAST avant production")
      krs.push("0 secret technique hardcodé dans le code source")
      krs.push("API sécurisées avec authentification et rate limiting")
      krs.push("Documentation sécurité à jour pour toutes les fonctionnalités")
    }

    return {
      role: "Lead Developer / Responsable Produit",
      objective: "Application sécurisée pour les nouveaux utilisateurs",
      keyResults: krs
    }
  }

  generateSecurityManagerOKRs() {
    const krs = []
    
    if (this.globalMaturityLevel === 0) {
      krs.push("100% des comptes admin inventoriés et sécurisés (audit complet en 48h)")
      krs.push("Procédure de sauvegarde documentée et testée avec succès")
      krs.push("Plan de réponse aux incidents basique rédigé et communiqué")
      krs.push("Formation sécurité dispensée à 100% de l'équipe technique")
    } else {
      krs.push("Politique de sécurité complète documentée et approuvée")
      krs.push("100% des employés formés aux bonnes pratiques sécurité")
      krs.push("Processus de gestion d'incident testé et opérationnel")
      krs.push("Inventaire des actifs critiques maintenu à jour")
    }

    return {
      role: "Responsable Sécurité",
      objective: this.globalMaturityLevel === 0 ? 
        "Processus de sécurité opérationnels avant croissance" :
        "Gouvernance et culture sécurité établies",
      keyResults: krs
    }
  }

  generateDevOpsOKRs() {
    const krs = []
    
    if (this.globalMaturityLevel === 0) {
      krs.push("100% des serveurs avec patches sécurité critiques appliqués")
      krs.push("Auto-scaling configuré et testé avec monitoring intégré")
      krs.push("Certificats SSL/TLS déployés sur tous les domaines avec renouvellement automatique")
      krs.push("Logs de sécurité centralisés et conservés (authentifications, accès admin)")
    } else {
      krs.push("100% des environnements isolés avec contrôles d'accès")
      krs.push("Sauvegardes automatisées testées mensuellement")
      krs.push("Logs centralisés avec rétention 90 jours minimum")
      krs.push("Patches sécurité appliqués sous 7 jours (critiques)")
    }

    return {
      role: "Équipe DevOps/SysAdmin",
      objective: "Infrastructure sécurisée et scalable",
      keyResults: krs
    }
  }

  getWeakSections() {
    return this.sections.filter((section, index) => this.getSectionScore(index) < 10)
  }

  // Génération des mesures techniques
  generateTechnicalMeasures() {
    const measures = []
    
    // Pour chaque KR, générer les mesures techniques correspondantes
    const ctoOKRs = this.generateCTOOKRs()
    
    ctoOKRs.keyResults.forEach((kr, index) => {
      measures.push({
        kr: kr,
        technicalMeasures: this.deriveTechnicalMeasures(kr, index)
      })
    })
    
    return measures
  }

  deriveTechnicalMeasures(kr, krIndex) {
    // Logique de dérivation KR → Mesures techniques
    const measureMap = {
      0: { // Premier KR
        whatToMeasure: "Pourcentage d'accès administrateur sécurisés",
        howToCollect: "Audit automatisé des comptes + Dashboard temps réel",
        whatToImplement: "MFA (Google Authenticator) + Politique mots de passe + Audit comptes",
        howToValidate: "Tests d'authentification + Scan conformité + Audit final"
      },
      1: { // Deuxième KR
        whatToMeasure: "Pourcentage de services en HTTPS avec certificats valides",
        howToCollect: "Monitoring SSL/TLS + Tests automatisés + SSL Labs scoring",
        whatToImplement: "Certificats Let's Encrypt + Redirection forcée + Headers sécurité",
        howToValidate: "Tests SSL Labs + Validation navigateurs + Scan ports"
      }
      // Ajouter d'autres mappings selon les KRs
    }
    
    return measureMap[krIndex] || {
      whatToMeasure: "Métrique spécifique à définir",
      howToCollect: "Outils de mesure à identifier",
      whatToImplement: "Technologies à déployer",
      howToValidate: "Tests de validation à effectuer"
    }
  }
}