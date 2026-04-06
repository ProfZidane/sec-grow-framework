import { defineStore } from 'pinia'

export const useContextStore = defineStore('context', {
  state: () => ({
    companyName: 'Z-TECH Industry',
    sector: 'fintech',
    size: 'startup',
    geoZones: ['EU'],
    mission: 'Améliorer le score ESG des entreprises corporates',
    teamSize: 4,
    boardSize: 5,
    roles: ['ceo', 'cto', 'data-scientist'],
    productType: 'saas',
    mainFeatures: 'Tracking des KPIs ESG, Dashboard analytics, Reporting automatisé',
    dataTypes: ['esg', 'analytics']
  }),

  getters: {
    // Getter pour le nom complet avec secteur
    companyFullName: (state) => `${state.companyName} - ${state.sector}`,
    
    // Getter pour la description de l'équipe
    teamDescription: (state) => `${state.teamSize} ops + ${state.boardSize} board`,
    
    // Getter pour les rôles formatés
    rolesFormatted: (state) => state.roles.map(role => {
      const roleNames = {
        'ceo': 'CEO',
        'cto': 'CTO', 
        'data-scientist': 'Data Scientist',
        'security-officer': 'Security Officer'
      }
      return roleNames[role] || role
    }),

    // Getter pour le type de données formaté
    dataTypesFormatted: (state) => state.dataTypes.map(type => {
      const typeNames = {
        'personal': 'Données personnelles',
        'financial': 'Données financières',
        'esg': 'Données ESG',
        'analytics': 'Analytics/Métriques'
      }
      return typeNames[type] || type
    })
  },

  actions: {
    // Mettre à jour tout le contexte
    updateContext(newContext) {
      this.companyName = newContext.companyName || this.companyName
      this.sector      = newContext.sector      || this.sector
      this.size        = newContext.size        || this.size
      this.geoZones    = newContext.geoZones    || this.geoZones
      this.mission     = newContext.mission     || this.mission
      this.teamSize    = newContext.teamSize    || this.teamSize
      this.boardSize   = newContext.boardSize   || this.boardSize
      this.roles       = newContext.roles       || this.roles
      this.productType = newContext.productType || this.productType
      this.mainFeatures= newContext.mainFeatures|| this.mainFeatures
      this.dataTypes   = newContext.dataTypes   || this.dataTypes
      this.saveToStorage()
    },

    // Mettre à jour un champ spécifique
    updateField(field, value) {
      this[field] = value
      this.saveToStorage()
    },

    // Sauvegarder dans localStorage
    saveToStorage() {
      const contextData = {
        companyName: this.companyName,
        sector:      this.sector,
        size:        this.size,
        geoZones:    this.geoZones,
        mission:     this.mission,
        teamSize:    this.teamSize,
        boardSize:   this.boardSize,
        roles:       this.roles,
        productType: this.productType,
        mainFeatures:this.mainFeatures,
        dataTypes:   this.dataTypes
      }
      localStorage.setItem('sec-grow-context', JSON.stringify(contextData))
    },

    // Charger depuis localStorage
    loadFromStorage() {
      const saved = localStorage.getItem('sec-grow-context')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          Object.assign(this, data)
        } catch (error) {
          console.error('Erreur chargement contexte:', error)
        }
      }
    },

    // Reset aux valeurs par défaut
    resetToDefaults() {
      this.companyName = 'KOALOO'
      this.sector = 'fintech'
      this.mission = 'Améliorer le score ESG des entreprises corporates'
      this.teamSize = 4
      this.boardSize = 5
      this.roles = ['ceo', 'cto', 'data-scientist']
      this.productType = 'saas'
      this.mainFeatures = 'Tracking des KPIs ESG, Dashboard analytics, Reporting automatisé'
      this.dataTypes = ['esg', 'analytics']
      this.saveToStorage()
    }
  }
})