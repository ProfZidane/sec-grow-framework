export const REGULATIONS = {
  RGPD: {
    id: 'RGPD',
    name: 'RGPD',
    fullName: 'Règlement Général sur la Protection des Données',
    zone: ['EU'],
    sectors: ['all'],
    sizes: ['all'],
    description: 'Encadre la collecte et le traitement des données personnelles des citoyens européens.',
    url: 'https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on'
  },
  NIS2: {
    id: 'NIS2',
    name: 'NIS2',
    fullName: 'Network and Information Security Directive 2',
    zone: ['EU'],
    sectors: ['fintech', 'healthcare', 'energy', 'transport', 'infrastructure'],
    sizes: ['medium', 'large'],
    description: 'Renforce la cybersécurité des entités essentielles et importantes en Europe.',
    url: 'https://www.enisa.europa.eu/topics/cybersecurity-policy/nis-directive-new'
  },
  DORA: {
    id: 'DORA',
    name: 'DORA',
    fullName: 'Digital Operational Resilience Act',
    zone: ['EU'],
    sectors: ['fintech', 'banking', 'insurance', 'finance'],
    sizes: ['all'],
    description: 'Impose la résilience opérationnelle numérique pour le secteur financier européen.',
    url: 'https://www.eba.europa.eu/regulation-and-policy/dora'
  },
  ISO27001: {
    id: 'ISO27001',
    name: 'ISO 27001',
    fullName: 'ISO/IEC 27001 - Système de Management de la Sécurité de l\'Information',
    zone: ['all'],
    sectors: ['all'],
    sizes: ['all'],
    description: 'Standard international pour la gestion de la sécurité de l\'information.',
    url: 'https://www.iso.org/isoiec-27001-information-security.html'
  },
  SOC2: {
    id: 'SOC2',
    name: 'SOC 2',
    fullName: 'Service Organization Control 2',
    zone: ['US', 'GLOBAL'],
    sectors: ['saas', 'fintech', 'tech', 'cloud'],
    sizes: ['all'],
    description: 'Certifie la sécurité, disponibilité et confidentialité des systèmes SaaS.',
    url: 'https://www.aicpa.org/resources/landing/system-and-organization-controls-soc-suite-of-services'
  },
  HIPAA: {
    id: 'HIPAA',
    name: 'HIPAA',
    fullName: 'Health Insurance Portability and Accountability Act',
    zone: ['US'],
    sectors: ['healthcare', 'medtech', 'health'],
    sizes: ['all'],
    description: 'Protège la confidentialité des données de santé aux États-Unis.',
    url: 'https://www.hhs.gov/hipaa/index.html'
  },
  PCIДSS: {
    id: 'PCIDSS',
    name: 'PCI DSS',
    fullName: 'Payment Card Industry Data Security Standard',
    zone: ['all'],
    sectors: ['fintech', 'ecommerce', 'banking', 'payment', 'finance'],
    sizes: ['all'],
    description: 'Standard de sécurité pour les organisations qui traitent des paiements par carte.',
    url: 'https://www.pcisecuritystandards.org/'
  },
  CCPA: {
    id: 'CCPA',
    name: 'CCPA',
    fullName: 'California Consumer Privacy Act',
    zone: ['US'],
    sectors: ['all'],
    sizes: ['medium', 'large'],
    description: 'Protège la vie privée des consommateurs californiens.',
    url: 'https://oag.ca.gov/privacy/ccpa'
  },
  CYBER_ESSENTIALS: {
    id: 'CYBER_ESSENTIALS',
    name: 'Cyber Essentials',
    fullName: 'Cyber Essentials (UK)',
    zone: ['UK'],
    sectors: ['all'],
    sizes: ['all'],
    description: 'Certification gouvernementale britannique pour la cybersécurité de base.',
    url: 'https://www.ncsc.gov.uk/cyberessentials/overview'
  },
  LGPD: {
    id: 'LGPD',
    name: 'LGPD',
    fullName: 'Lei Geral de Proteção de Dados',
    zone: ['BR'],
    sectors: ['all'],
    sizes: ['all'],
    description: 'Loi brésilienne de protection des données personnelles, équivalent du RGPD.',
    url: 'https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd'
  }
}

export const SECTORS = [
  { id: 'fintech', label: 'Fintech / Finance' },
  { id: 'healthcare', label: 'Santé / Medtech' },
  { id: 'saas', label: 'SaaS / Tech' },
  { id: 'ecommerce', label: 'E-commerce / Retail' },
  { id: 'energy', label: 'Énergie / Utilities' },
  { id: 'transport', label: 'Transport / Logistique' },
  { id: 'education', label: 'Éducation / EdTech' },
  { id: 'other', label: 'Autre' }
]

export const COMPANY_SIZES = [
  { id: 'startup', label: 'Startup (< 10 pers.)' },
  { id: 'small', label: 'PME (10–50 pers.)' },
  { id: 'medium', label: 'ETI (50–250 pers.)' },
  { id: 'large', label: 'Grande entreprise (250+)' }
]

export const GEO_ZONES = [
  { id: 'EU', label: 'Union Européenne' },
  { id: 'UK', label: 'Royaume-Uni' },
  { id: 'US', label: 'États-Unis' },
  { id: 'BR', label: 'Brésil' },
  { id: 'GLOBAL', label: 'International / Global' }
]

/**
 * Calcule les normes applicables et leur score de pertinence (0-100%)
 * basé sur le secteur, la taille et la zone géographique
 */
export function getApplicableRegulations(sector, size, zones) {
  const results = []

  for (const reg of Object.values(REGULATIONS)) {
    let score = 0
    let reasons = []

    // Zone géographique
    const zoneMatch = reg.zone.includes('all') || zones.some(z => reg.zone.includes(z))
    if (!zoneMatch) continue // Norme non applicable dans cette zone

    if (reg.zone.includes('all')) {
      score += 30
    } else {
      const matchCount = zones.filter(z => reg.zone.includes(z)).length
      score += Math.min(30, matchCount * 30)
      reasons.push(`Zone ${zones.filter(z => reg.zone.includes(z)).join(', ')}`)
    }

    // Secteur
    if (reg.sectors.includes('all')) {
      score += 40
      reasons.push('Tous secteurs')
    } else if (reg.sectors.includes(sector)) {
      score += 40
      reasons.push(`Secteur ${sector}`)
    } else {
      score += 10 // Pertinence partielle
    }

    // Taille
    if (reg.sizes.includes('all')) {
      score += 30
    } else if (reg.sizes.includes(size)) {
      score += 30
      reasons.push(`Taille ${size}`)
    } else {
      score += 5
    }

    results.push({
      ...reg,
      relevanceScore: Math.min(100, score),
      reasons
    })
  }

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

/**
 * Mappe le score SEC-GROW sur la couverture estimée d'une norme
 */
export function getSecGrowCoverage(globalScore, regulationId) {
  const coverageMap = {
    RGPD:        { base: 20, perPoint: 0.8 },
    NIS2:        { base: 10, perPoint: 0.9 },
    DORA:        { base: 10, perPoint: 0.85 },
    ISO27001:    { base: 5,  perPoint: 0.95 },
    SOC2:        { base: 15, perPoint: 0.85 },
    HIPAA:       { base: 10, perPoint: 0.8 },
    PCIDSS:      { base: 10, perPoint: 0.9 },
    CCPA:        { base: 20, perPoint: 0.75 },
    CYBER_ESSENTIALS: { base: 25, perPoint: 0.85 },
    LGPD:        { base: 20, perPoint: 0.8 }
  }

  const map = coverageMap[regulationId] || { base: 10, perPoint: 0.8 }
  const coverage = map.base + (globalScore / 80) * (100 - map.base) * (map.perPoint)
  return Math.min(100, Math.round(coverage))
}