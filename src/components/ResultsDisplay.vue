<template>
  <div class="results-container">
    <!-- Header des résultats -->
    <div class="results-header">
      <h2>🎯 Résultats du Diagnostic KOALOO</h2>
      <p>Évaluation par {{ selectedEvaluator.name }} - {{ new Date().toLocaleDateString('fr-FR') }}</p>
      <button @click="$emit('back-to-diagnostic')" class="back-btn">
        ← Retour au diagnostic
      </button>
    </div>
    
    <div class="results-content">
      <div class="results-grid">
        
        <!-- Score global -->
        <div class="global-score-section">
          <div class="score-visual">
            <div class="score-circle">
              <svg width="140" height="140" class="progress-ring">
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="#E5E7EB"
                  stroke-width="8"
                  fill="none"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  :stroke="globalMaturity.color"
                  stroke-width="8"
                  fill="none"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="strokeDashoffset"
                  class="progress-circle"
                />
              </svg>
              <div class="score-text">
                <div class="score-number">{{ globalScore }}</div>
                <div class="score-total">/80</div>
              </div>
            </div>
          </div>
          
          <div 
            class="maturity-badge" 
            :style="{ backgroundColor: globalMaturity.color }"
          >
            Niveau {{ globalMaturityLevel }} - {{ globalMaturity.name }}
          </div>
          
          <p class="maturity-description">{{ globalMaturity.description }}</p>
          
          <div class="score-interpretation">
            <h4>📊 Interprétation</h4>
            <p>{{ getScoreInterpretation() }}</p>
          </div>
        </div>

        <!-- Scores par section -->
        <div class="sections-scores">
          <h3>📋 Détail par pilier</h3>
          <div class="sections-list">
            <div 
              v-for="(section, index) in sections" 
              :key="section.id"
              class="section-result"
            >
              <div class="section-info">
                <span class="section-icon">{{ section.icon }}</span>
                <div class="section-details">
                  <span class="section-name">{{ section.title }}</span>
                  <div class="section-progress-bar">
                    <div 
                      class="progress-fill"
                      :style="{ 
                        width: (getSectionScore(index) / 20) * 100 + '%',
                        backgroundColor: getSectionMaturity(index).color 
                      }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="section-score-info">
                <span class="score">{{ getSectionScore(index) }}/20</span>
                <span 
                  class="maturity"
                  :style="{ color: getSectionMaturity(index).color }"
                >
                  {{ getSectionMaturity(index).name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Points forts et faiblesses -->
      <div class="analysis-section">
        <div class="strengths-weaknesses">
          <div class="strengths">
            <h3>💪 Points forts</h3>
            <div class="points-list">
              <div 
                v-for="strength in getStrengths()" 
                :key="strength.title"
                class="point-item success"
              >
                <div class="point-icon">✅</div>
                <div class="point-content">
                  <h4>{{ strength.title }}</h4>
                  <p>{{ strength.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="weaknesses">
            <h3>⚠️ Axes d'amélioration</h3>
            <div class="points-list">
              <div 
                v-for="weakness in getWeaknesses()" 
                :key="weakness.title"
                class="point-item warning"
              >
                <div class="point-icon">🔧</div>
                <div class="point-content">
                  <h4>{{ weakness.title }}</h4>
                  <p>{{ weakness.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommandations KOALOO -->
      <div class="recommendations">
        <h3>🎯 Recommandations prioritaires pour KOALOO</h3>
        <p class="recommendations-intro">
          Basées sur votre profil de fintech ESG et les résultats du diagnostic
        </p>
        
        <div class="recommendations-list">
          <div 
            v-for="rec in koalooRecommendations" 
            :key="rec.priority"
            class="recommendation"
          >
            <div class="rec-priority">{{ rec.priority }}</div>
            <div class="rec-content">
              <h4>{{ rec.title }}</h4>
              <p>{{ rec.description }}</p>
              <div class="rec-context">
                <span class="context-label">Contexte KOALOO:</span>
                {{ rec.context }}
              </div>
              <div class="rec-impact">
                <span class="impact-label">Impact attendu:</span>
                {{ rec.impact }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prochaines étapes -->
      <div class="next-steps">
        <h3>📅 Prochaines étapes - Planning SEC-GROW</h3>
        <div class="steps-timeline">
          <div class="step completed">
            <div class="step-number">✓</div>
            <div class="step-content">
              <h4>Semaine 3 - Diagnostic</h4>
              <p>Évaluation de maturité réalisée</p>
            </div>
          </div>
          <div class="step next">
            <div class="step-number">4</div>
            <div class="step-content">
              <h4>Semaine 4 - Définition des OKRs</h4>
              <p>Atelier d'1 journée avec CEO, CTO, Data Scientist</p>
            </div>
          </div>
          <div class="step future">
            <div class="step-number">5</div>
            <div class="step-content">
              <h4>Semaine 5 - Planification CFR</h4>
              <p>Mise en place du système de suivi</p>
            </div>
          </div>
        </div>
      </div>

      <!-- OKRs Sécuritaires Générés -->;
      <OkrsDisplay 
        :okrs="generatedOKRs"
        :technical-measures="technicalMeasures"
      />;

      <!-- Actions -->
      <div class="actions">
        <button @click="exportResults" class="action-btn primary">
          📄 Exporter les résultats
        </button>
        <button @click="planOKRSession" class="action-btn success">
          📅 Planifier session OKRs
        </button>
        <button @click="shareResults" class="action-btn secondary">
          📤 Partager avec l'équipe
        </button>
        <button @click="$emit('restart')" class="action-btn danger">
          🔄 Nouvelle évaluation
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { MATURITY_LEVELS } from '@/data/questions';
import { OKRGenerator } from '@/utils/okrGenerator'
import OkrsDisplay from './OkrsDisplay.vue';

export default {
  name: 'ResultsDisplay',
  
  components: {
    OkrsDisplay
  },
  
  props: {
    selectedEvaluator: {
      type: Object,
      required: true
    },
    responses: {
      type: Object,
      required: true
    },
    sections: {
      type: Array,
      required: true
    }
  },
  
  emits: ['restart', 'back-to-diagnostic'],
  
  data() {
    return {
      maturityLevels: MATURITY_LEVELS
    }
  },
  
  computed: {
    globalScore() {
      return this.sections.reduce((total, section, index) => {
        return total + this.getSectionScore(index)
      }, 0)
    },
    
    globalMaturityLevel() {
      const score = this.globalScore
      if (score <= 16) return 0
      if (score <= 35) return 1
      if (score <= 55) return 2
      if (score <= 70) return 3
      return 4
    },
    
    globalMaturity() {
      return this.maturityLevels[this.globalMaturityLevel]
    },
    
    circumference() {
      return 2 * Math.PI * 60
    },
    
    strokeDashoffset() {
      const progress = this.globalScore / 80
      return this.circumference - (progress * this.circumference)
    },
    
    koalooRecommendations() {
      const recs = []
      
      if (this.globalMaturityLevel === 0) {
        recs.push({
          priority: 1,
          title: "Sécurisation urgente des données ESG",
          description: "Mise en place d'un chiffrement pour protéger les données sensibles des clients",
          context: "Critique pour la conformité fintech et la confiance clients",
          impact: "Réduction immédiate des risques de violation de données"
        })
      }
      
      if (this.getSectionScore(0) < 10) {
        recs.push({
          priority: 2,
          title: "Formalisation politique sécurité fintech",
          description: "Créer une politique adaptée aux exigences réglementaires du secteur financier",
          context: "Essentiel pour les audits et certifications futures",
          impact: "Facilitation des levées de fonds et partenariats corporates"
        })
      }
      
      if (this.getSectionScore(1) < 10) {
        recs.push({
          priority: 3,
          title: "Sécurisation API et intégrations SaaS",
          description: "Renforcer la sécurité de votre plateforme de tracking ESG",
          context: "Protection des connexions avec les systèmes clients",
          impact: "Amélioration de la confiance client et réduction des incidents"
        })
      }
      
      return recs.slice(0, 3)
    },
    generatedOKRs() {
      const generator = new OKRGenerator(this.responses, this.sections, this.selectedEvaluator)
      return generator.generateOKRs()
    },
    
    technicalMeasures() {
      const generator = new OKRGenerator(this.responses, this.sections, this.selectedEvaluator)
      return generator.generateTechnicalMeasures()
    }
  },
  
  methods: {
    getSectionScore(sectionIndex) {
      const section = this.sections[sectionIndex]
      let score = 0
      section.questions.forEach(question => {
        if (this.responses[question.id] !== undefined) {
          score += this.responses[question.id]
        }
      })
      return score
    },
    
    getSectionMaturity(sectionIndex) {
      const score = this.getSectionScore(sectionIndex)
      if (score <= 4) return this.maturityLevels[0]
      if (score <= 9) return this.maturityLevels[1]
      if (score <= 14) return this.maturityLevels[2]
      if (score <= 17) return this.maturityLevels[3]
      return this.maturityLevels[4]
    },
    
    getScoreInterpretation() {
      const level = this.globalMaturityLevel
      const interpretations = {
        0: "KOALOO se situe au niveau initial. Il est urgent de mettre en place les bases de la sécurité pour protéger votre activité fintech.",
        1: "KOALOO a établi quelques bases sécuritaires. L'objectif est maintenant de structurer et d'organiser ces pratiques.",
        2: "KOALOO dispose d'une sécurité bien organisée. L'étape suivante consiste à intégrer la sécurité dans tous les processus produit.",
        3: "KOALOO a une sécurité intégrée exemplaire. Vous pouvez maintenant viser l'excellence et faire de la sécurité un avantage compétitif.",
        4: "KOALOO atteint l'excellence en sécurité. Vous êtes une référence et pouvez influencer positivement tout l'écosystème fintech ESG."
      }
      return interpretations[level]
    },
    
    getStrengths() {
      const strengths = []
      this.sections.forEach((section, index) => {
        const score = this.getSectionScore(index)
        if (score >= 15) {
          strengths.push({
            title: section.title,
            description: `Excellent niveau avec ${score}/20 points. Ce pilier est une force de KOALOO.`
          })
        }
      })
      
      if (strengths.length === 0 && this.globalScore > 40) {
        strengths.push({
          title: "Démarche structurée",
          description: "KOALOO montre une approche cohérente de la sécurité sur l'ensemble des piliers."
        })
      }
      
      return strengths.slice(0, 3)
    },
    
    getWeaknesses() {
      const weaknesses = []
      this.sections.forEach((section, index) => {
        const score = this.getSectionScore(index)
        if (score < 8) {
          weaknesses.push({
            title: section.title,
            description: `Nécessite une attention prioritaire (${score}/20 points). Des actions immédiates sont recommandées.`
          })
        }
      })
      
      return weaknesses.slice(0, 3)
    },
    
    exportResults() {
      const results = {
        metadata: {
          company: 'KOALOO',
          evaluator: this.selectedEvaluator.name,
          date: new Date().toLocaleDateString('fr-FR'),
          timestamp: new Date().toISOString()
        },
        scores: {
          global: this.globalScore,
          maturity: this.globalMaturity.name,
          sections: this.sections.map((section, index) => ({
            title: section.title,
            score: this.getSectionScore(index),
            maturity: this.getSectionMaturity(index).name
          }))
        },
        analysis: {
          strengths: this.getStrengths(),
          weaknesses: this.getWeaknesses(),
          recommendations: this.koalooRecommendations
        },
        okrs: this.generatedOKRs,
        technicalMeasures: this.technicalMeasures,
        responses: this.responses
      }
      
      const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `SEC-GROW-KOALOO-${this.selectedEvaluator.name}-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
    
    planOKRSession() {
      alert(`🎯 Session OKRs planifiée !

📅 Semaine 4 du planning SEC-GROW
👥 Participants : CEO, CTO, Data Scientist
⏱️ Durée : 1 journée complète
🎯 Objectif : Définir les objectifs sécuritaires alignés business

Prochaines étapes :
1. Programmer la session avec tous les participants
2. Préparer les OKRs basés sur ce diagnostic
3. Définir la roadmap d'implémentation`)
    },
    
    shareResults() {
      if (navigator.share) {
        navigator.share({
          title: 'Résultats SEC-GROW KOALOO',
          text: `Diagnostic de maturité cybersécurité KOALOO - Score: ${this.globalScore}/80 (${this.globalMaturity.name})`,
          url: window.location.href
        })
      } else {
        // Fallback : copier dans le presse-papier
        const text = `Résultats SEC-GROW KOALOO
Évaluateur: ${this.selectedEvaluator.name}
Score global: ${this.globalScore}/80
Niveau: ${this.globalMaturity.name}
Date: ${new Date().toLocaleDateString('fr-FR')}`
        
        navigator.clipboard.writeText(text).then(() => {
          alert('Résultats copiés dans le presse-papier !')
        })
      }
    }
  }
}
</script>

<style scoped>
.results-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
}

.results-header {
  background: linear-gradient(135deg, var(--success), var(--primary));
  color: white;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
}

.results-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.results-header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.back-btn {
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.results-content {
  padding: 2rem;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.global-score-section {
  text-align: center;
}

.score-visual {
  margin-bottom: 1.5rem;
}

.score-circle {
  position: relative;
  display: inline-block;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-circle {
  transition: stroke-dashoffset 0.8s ease;
  stroke-linecap: round;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--gray-900);
}

.score-total {
  font-size: 1.2rem;
  color: var(--gray-600);
}

.maturity-badge {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  color: white;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.maturity-description {
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.score-interpretation {
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: 10px;
  text-align: left;
}

.score-interpretation h4 {
  margin-bottom: 0.75rem;
  color: var(--gray-900);
}

.score-interpretation p {
  color: var(--gray-700);
  line-height: 1.6;
}

.sections-scores h3 {
  margin-bottom: 1.5rem;
  color: var(--gray-900);
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: 10px;
  border-left: 4px solid var(--gray-300);
}

.section-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.section-icon {
  font-size: 1.5rem;
}

.section-details {
  flex: 1;
}

.section-name {
  font-weight: 600;
  color: var(--gray-900);
  display: block;
  margin-bottom: 0.5rem;
}

.section-progress-bar {
  width: 100%;
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 3px;
}

.section-score-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: right;
}

.section-score-info .score {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--gray-900);
}

.section-score-info .maturity {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: rgba(107, 114, 128, 0.1);
}

.analysis-section {
  margin: 2rem 0;
}

.strengths-weaknesses {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.strengths h3, .weaknesses h3 {
  margin-bottom: 1rem;
  color: var(--gray-900);
}

.points-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.point-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid;
}

.point-item.success {
  background: #F0FDF4;
  border-left-color: var(--success);
}

.point-item.warning {
  background: #FFFBEB;
  border-left-color: var(--warning);
}

.point-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.point-content h4 {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--gray-900);
}

.point-content p {
  color: var(--gray-700);
  font-size: 0.9rem;
  line-height: 1.4;
}

.recommendations {
  background: #FFF7ED;
  border: 1px solid #FED7AA;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
}

.recommendations h3 {
  margin-bottom: 0.5rem;
  color: var(--gray-900);
}

.recommendations-intro {
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  font-style: italic;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recommendation {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  border: 1px solid #FED7AA;
}

.rec-priority {
  background: var(--warning);
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.rec-content h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--gray-900);
  font-weight: 600;
}

.rec-content p {
  color: var(--gray-700);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.rec-context, .rec-impact {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.context-label, .impact-label {
  font-weight: 600;
  color: var(--gray-800);
}

.rec-context {
  color: var(--gray-600);
}

.rec-impact {
  color: var(--success);
}

.next-steps {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
}

.next-steps h3 {
  margin-bottom: 1.5rem;
  color: var(--gray-900);
}

.steps-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.step.completed {
  background: #F0FDF4;
  border-left: 4px solid var(--success);
}

.step.next {
  background: #EBF8FF;
  border-left: 4px solid var(--primary);
}

.step.future {
  background: white;
  border-left: 4px solid var(--gray-300);
}

.step-number {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step.completed .step-number {
  background: var(--success);
  color: white;
}

.step.next .step-number {
  background: var(--primary);
  color: white;
}

.step.future .step-number {
  background: var(--gray-300);
  color: var(--gray-600);
}

.step-content h4 {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--gray-900);
}

.step-content p {
  color: var(--gray-600);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 2rem;
  border-top: 1px solid var(--gray-200);
  margin-top: 2rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  flex: 1;
  min-width: 180px;
}

.action-btn.primary {
  background: var(--primary);
  color: white;
}

.action-btn.success {
  background: var(--success);
  color: white;
}

.action-btn.secondary {
  background: var(--gray-200);
  color: var(--gray-700);
}

.action-btn.danger {
  background: var(--danger);
  color: white;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .results-header {
    padding: 2rem 1rem;
  }
  
  .back-btn {
    position: static;
    margin-bottom: 1rem;
  }
  
  .results-content {
    padding: 1rem;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .strengths-weaknesses {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .actions {
    flex-direction: column;
    padding: 1.5rem;
  }
  
  .action-btn {
    min-width: unset;
  }
  
  .section-result {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-score-info {
    align-self: flex-end;
  }
  
  .recommendation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .rec-priority {
    align-self: flex-start;
  }
  
  .score-number {
    font-size: 2rem;
  }
  
  .score-total {
    font-size: 1rem;
  }
  
  .maturity-badge {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .results-header h2 {
    font-size: 1.5rem;
  }
  
  .results-header p {
    font-size: 1rem;
  }
  
  .score-circle svg {
    width: 120px;
    height: 120px;
  }
  
  .score-number {
    font-size: 1.8rem;
  }
  
  .recommendations, .next-steps {
    padding: 1.5rem;
  }
  
  .point-item, .recommendation, .step {
    padding: 1rem;
  }
}
</style>