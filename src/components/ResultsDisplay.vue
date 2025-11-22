<template>
  <div class="results-container">
    <!-- Header des résultats -->
    <div class="results-header">
      <h2>Résultats du Diagnostic {{ companyName }}</h2>
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
            <h4>Interprétation</h4>
            <p>{{ getScoreInterpretation() }}</p>
          </div>
        </div>

        <!-- Scores par section -->
        <div class="sections-scores">
          <h3>Détail par pilier</h3>
          <div class="sections-list">
            <div 
              v-for="(section, index) in sections" 
              :key="section.id"
              class="section-result"
            >
              <div class="section-info">
                <!-- <span class="section-icon">{{ section.icon }}</span> -->
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
            <h3>
              <span v-if="llmLoading">Analyse des points forts...</span>
              <span v-else-if="llmResults?.analysis">Points forts (IA)</span>
              <span v-else>Points forts</span>
            </h3>
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
            <h3>
              <span v-if="llmLoading">Analyse des faiblesses...</span>
              <span v-else-if="llmResults?.analysis">Axes d'amélioration (IA)</span>
              <span v-else>Axes d'amélioration</span>
            </h3>
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

      <!-- Recommandations IA -->
      <div class="recommendations">
        <h3>
          <span v-if="llmLoading">Génération des recommandations IA...</span>
          <span v-else-if="llmResults?.recommendations">Recommandations IA personnalisées</span>
          <span v-else>Recommandations</span>
        </h3>
        <p class="recommendations-intro">
          <span v-if="llmLoading">Analyse en cours par intelligence artificielle...</span>
          <span v-else-if="llmResults?.recommendations">Générées par IA basées sur votre contexte et diagnostic</span>
          <span v-else>Aucune recommandation disponible sans analyse IA</span>
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
              <div v-if="rec.context" class="rec-context">
                <span class="context-label">Contexte {{ companyName }}:</span>
                {{ rec.context }}
              </div>
              <div v-if="rec.impact" class="rec-impact">
                <span class="impact-label">Impact attendu:</span>
                {{ rec.impact }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prochaines étapes 
      <div class="next-steps">
        <h3>Prochaines étapes - Planning SEC-GROW</h3>
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
              <p>Atelier d'1 journée avec l'équipe dirigeante</p>
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
      -->
      <!-- OKRs Sécuritaires Générés -->
      <div class="okrs-section">
        <h3>
          <span v-if="llmLoading">Génération des OKRs IA...</span>
          <span v-else-if="llmResults?.okrs">OKRs personnalisés (IA)</span>
          <span v-else>OKRs sécuritaires générés</span>
        </h3>
        
        <div v-if="llmResults?.okrs?.okrs" class="okrs-list">
          <div 
            v-for="okr in llmResults.okrs.okrs" 
            :key="okr.objective"
            class="okr-item"
          >
            <div class="okr-header">
              <h4>{{ okr.objective }}</h4>
              <span class="okr-pillar">{{ okr.pillar }}</span>
            </div>
            <p class="okr-rationale">{{ okr.rationale }}</p>
            <div class="key-results">
              <h5>Key Results:</h5>
              <ul>
                <li v-for="kr in okr.key_results" :key="kr.description">
                  <strong>{{ kr.description }}</strong> - 
                  Cible: {{ kr.target }} ({{ kr.metric }})
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div v-else class="no-okrs">
          <p>Aucun OKR généré par l'IA pour le moment.</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button @click="handleExport('csv')" class="action-btn primary">
          Export in CSV
        </button>
        <button @click="planOKRSession" class="action-btn success">
          Planifier session OKRs
        </button>
        <button @click="shareResults" class="action-btn secondary">
          Partager avec l'équipe
        </button>
        <button @click="$emit('restart')" class="action-btn danger">
          Nouvelle évaluation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { MATURITY_LEVELS } from '@/data/questions'
  import { useContextStore } from '@/stores/context'
  import { exportToCSV, exportToExcel } from '@/utils/export'

 
  const props = defineProps({
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
    },
    llmResults: {
      type: Object,
      required: false
    },
    llmLoading: {
      type: Boolean,
      required: false,
      default: false
    }
  })

  const emit = defineEmits(['restart', 'back-to-diagnostic'])

  const contextStore = useContextStore();
  const maturityLevels = MATURITY_LEVELS;
  const TOTAL_POSSIBLE_SCORE = 80;
  const RAYON_CIRCLE = 60;
  const showExportMenu = ref(false);

  
  const companyName = computed(() => contextStore.companyName || 'Votre entreprise')

  const getSectionScore = (sectionIndex) => {
    const section = props.sections[sectionIndex];    
    let score = 0
    section.questions.forEach(question => {
      if (props.responses[question.id] !== undefined) {
        score += props.responses[question.id]
      }
    })
    return score
  }

  /**
   * Get the maturity level of a specific section.
   * The maturity thresholds are: 
   * - 0-4: Ad Hoc
   * - 5-9: Bronze
   * - 10-14: Silver
   * - 15-17: Gold
   * - 18-20: Platinum
   * @param sectionIndex - Index of the section
   */
  const getSectionMaturity = (sectionIndex) => {
    const score = getSectionScore(sectionIndex)
    if (score <= 4) return maturityLevels[0]
    if (score <= 9) return maturityLevels[1]
    if (score <= 14) return maturityLevels[2]
    if (score <= 17) return maturityLevels[3]
    return maturityLevels[4]
  }

  const globalScore = computed(() => {
    return props.sections.reduce((total, section, index) => {
      return total + getSectionScore(index)
    }, 0)
  })


  /**
   * Get the global maturity level based on the total score.
   * The global maturity thresholds are:
   * - 0-16: Ad Hoc
   * - 17-35: Bronze
   * - 36-55: Silver
   * - 56-70: Gold
   * - 71-80: Platinum
   * @return {number} Maturity level index (0-4)
   */
  const globalMaturityLevel = computed(() => {
    const score = globalScore.value
    if (score <= 16) return 0
    if (score <= 35) return 1
    if (score <= 55) return 2
    if (score <= 70) return 3
    return 4
  })

  const globalMaturity = computed(() => maturityLevels[globalMaturityLevel.value]);

  const circumference = computed(() => 2 * Math.PI * RAYON_CIRCLE);

  const strokeDashoffset = computed(() => {
    const progress = globalScore.value / TOTAL_POSSIBLE_SCORE
    return circumference.value - (progress * circumference.value)
  })

  const koalooRecommendations = computed(() => props.llmResults?.recommendations?.recommendations || []);

  const getScoreInterpretation = () => {
    if (props.llmResults?.analysis) return "Analyse détaillée disponible ci-dessous.";
    return "Complétez l'évaluation pour obtenir une interprétation personnalisée."
  }

  const getStrengths = () => props.llmResults?.analysis?.strengths || []

  const getWeaknesses = () => props.llmResults?.analysis?.weaknesses || []  

  const handleExport = (format) => {
    const exportData = {
      companyName: companyName.value,
      evaluatorName: props.selectedEvaluator.name,
      globalScore: globalScore.value,
      globalMaturity: globalMaturity.value.name,
      sections: props.sections.map((section, index) => ({
        title: section.title,
        score: getSectionScore(index),
        maturity: getSectionMaturity(index).name,
        questions: section.questions.map(q => ({
          text: q.text,
          response: props.responses[q.id] || 0,
          responseText: q.options[props.responses[q.id]] || 'Non répondu'
        }))
      })),
      strengths: getStrengths(),
      weaknesses: getWeaknesses(),
      recommendations: koalooRecommendations.value,
      okrs: props.llmResults?.okrs?.okrs || []
    }
    
    const exportDictFormat = {
      'csv': (data) => exportToCSV(data),
      'excel': (data) => exportToExcel(data)
    }

    if (format in exportDictFormat) exportDictFormat[format](exportData);    
  }

  const planOKRSession = () => {
      alert(`🎯 Session OKRs planifiée !
      
      📅 Semaine 4 du planning SEC-GROW
      👥 Participants : Équipe dirigeante
      ⏱️ Durée : 1 journée complète
      🎯 Objectif : Définir les objectifs sécuritaires alignés business

      Prochaines étapes :
      1. Programmer la session avec tous les participants
      2. Préparer les OKRs basés sur ce diagnostic
      3. Définir la roadmap d'implémentation
    `)
  }

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: `Résultats SEC-GROW ${companyName.value}`,
        text: `Diagnostic de maturité cybersécurité ${companyName.value} - Score: ${globalScore.value}/80 (${globalMaturity.value.name})`,
        url: window.location.href
      })
    } else {
      const text = `Résultats SEC-GROW ${companyName.value}
        Évaluateur: ${props.selectedEvaluator.name}
        Score global: ${globalScore.value}/80
        Niveau: ${globalMaturity.value.name}
        Date: ${new Date().toLocaleDateString('fr-FR')}`
      
      navigator.clipboard.writeText(text).then(() => {
        alert('Résultats copiés dans le presse-papier !')
      })
    }
  }
</script>

<style src="@/assets/components/results-display.css" scoped></style>