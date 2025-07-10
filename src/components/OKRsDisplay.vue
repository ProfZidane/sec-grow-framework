<template>
  <div class="okrs-section">
    <div class="okrs-header">
      <h3>🎯 OKRs Sécuritaires Générés pour KOALOO</h3>
      <p class="okrs-subtitle">
        Basés sur votre niveau {{ okrs.metadata.maturityName }} et l'objectif business :
        "{{ okrs.metadata.businessObjective }}"
      </p>
    </div>

    <!-- Analyse de risque business -->
    <div class="risk-analysis">
      <h4>⚠️ Analyse des Risques Business</h4>
      <div class="risks-grid">
        <div 
          v-for="risk in okrs.metadata.riskAnalysis" 
          :key="risk.risk"
          class="risk-card"
        >
          <div class="risk-header">
            <span class="risk-probability" :class="risk.probability.toLowerCase()">
              {{ risk.probability }}
            </span>
          </div>
          <h5>{{ risk.risk }}</h5>
          <p>{{ risk.impact }}</p>
        </div>
      </div>
    </div>

    <!-- Cascade OKRs -->
    <div class="okrs-cascade">
      <h4>📊 Cascade OKRs selon John Doerr</h4>
      
      <!-- Top Management -->
      <div class="okr-level top-level">
        <div class="level-header">
          <span class="level-icon">👔</span>
          <h5>{{ okrs.cascade.topManagement.role }}</h5>
        </div>
        <div class="okr-content">
          <div class="objective">
            <strong>Objectif :</strong> {{ okrs.cascade.topManagement.objective }}
          </div>
          <div class="details">
            {{ okrs.cascade.topManagement.details }}
          </div>
          <div class="key-results">
            <div class="kr-title">Key Results :</div>
            <ul>
              <li v-for="kr in okrs.cascade.topManagement.keyResults" :key="kr">
                {{ kr }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="cascade-arrow">⬇️ Déclinaison</div>

      <!-- CTO -->
      <div class="okr-level cto-level">
        <div class="level-header">
          <span class="level-icon">💻</span>
          <h5>{{ okrs.cascade.cto.role }}</h5>
        </div>
        <div class="okr-content">
          <div class="objective">
            <strong>Objectif :</strong> {{ okrs.cascade.cto.objective }}
          </div>
          <div class="details">
            {{ okrs.cascade.cto.details }}
          </div>
          <div class="key-results">
            <div class="kr-title">Key Results :</div>
            <ul>
              <li v-for="kr in okrs.cascade.cto.keyResults" :key="kr">
                {{ kr }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="cascade-arrow">⬇️ Déclinaison</div>

      <!-- Autres niveaux (collapsible) -->
      <div class="other-levels">
        <button @click="showAllLevels = !showAllLevels" class="toggle-levels">
          {{ showAllLevels ? 'Masquer' : 'Voir tous les niveaux' }} 
          {{ showAllLevels ? '▲' : '▼' }}
        </button>
        
        <div v-show="showAllLevels" class="levels-expanded">
          <!-- Lead Dev -->
          <div class="okr-level dev-level">
            <div class="level-header">
              <span class="level-icon">👨‍💻</span>
              <h5>{{ okrs.cascade.leadDev.role }}</h5>
            </div>
            <div class="okr-content">
              <div class="objective">
                <strong>Objectif :</strong> {{ okrs.cascade.leadDev.objective }}
              </div>
              <div class="key-results">
                <ul>
                  <li v-for="kr in okrs.cascade.leadDev.keyResults" :key="kr">
                    {{ kr }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Security Manager -->
          <div class="okr-level security-level">
            <div class="level-header">
              <span class="level-icon">🛡️</span>
              <h5>{{ okrs.cascade.securityManager.role }}</h5>
            </div>
            <div class="okr-content">
              <div class="objective">
                <strong>Objectif :</strong> {{ okrs.cascade.securityManager.objective }}
              </div>
              <div class="key-results">
                <ul>
                  <li v-for="kr in okrs.cascade.securityManager.keyResults" :key="kr">
                    {{ kr }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- DevOps -->
          <div class="okr-level devops-level">
            <div class="level-header">
              <span class="level-icon">💻</span>
              <h5>{{ okrs.cascade.devOps.role }}</h5>
            </div>
            <div class="okr-content">
              <div class="objective">
                <strong>Objectif :</strong> {{ okrs.cascade.devOps.objective }}
              </div>
              <div class="key-results">
                <ul>
                  <li v-for="kr in okrs.cascade.devOps.keyResults" :key="kr">
                    {{ kr }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mesures techniques dérivées -->
    <div class="technical-measures" v-if="technicalMeasures.length > 0">
      <h4>🔧 Mesures Techniques Dérivées</h4>
      <p class="measures-subtitle">
        Comment les Key Results du CTO se transforment en actions concrètes
      </p>
      
      <div class="measures-list">
        <div 
          v-for="(measure, index) in technicalMeasures.slice(0, 2)" 
          :key="index"
          class="measure-card"
        >
          <div class="measure-kr">
            <strong>KR :</strong> {{ measure.kr }}
          </div>
          <div class="measure-transformation">
            <div class="measure-step">
              <span class="step-label">Que mesurer ?</span>
              {{ measure.technicalMeasures.whatToMeasure }}
            </div>
            <div class="measure-step">
              <span class="step-label">Comment collecter ?</span>
              {{ measure.technicalMeasures.howToCollect }}
            </div>
            <div class="measure-step">
              <span class="step-label">Quoi implémenter ?</span>
              {{ measure.technicalMeasures.whatToImplement }}
            </div>
            <div class="measure-step">
              <span class="step-label">Comment valider ?</span>
              {{ measure.technicalMeasures.howToValidate }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions OKRs -->
    <div class="okrs-actions">
      <button @click="exportOKRs" class="action-btn primary">
        📄 Exporter OKRs
      </button>
      <button @click="scheduleOKRWorkshop" class="action-btn success">
        🎯 Programmer atelier OKRs
      </button>
      <button @click="setupCFR" class="action-btn secondary">
        📊 Configurer CFR
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  okrs: {
    type: Object,
    required: true
  },
  technicalMeasures: {
    type: Array,
    default: () => []
  }
})

// Reactive data
const showAllLevels = ref(false)

// Methods
const exportOKRs = () => {
  const okrsData = {
    ...props.okrs,
    technicalMeasures: props.technicalMeasures,
    exportDate: new Date().toISOString(),
    nextSteps: [
      "Programmer atelier d'1 journée avec CEO, CTO, Data Scientist",
      "Valider et ajuster les OKRs selon les priorités KOALOO", 
      "Mettre en place le système CFR de suivi",
      "Planifier les mesures techniques prioritaires"
    ]
  }
  
  const blob = new Blob([JSON.stringify(okrsData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `SEC-GROW-OKRs-KOALOO-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const scheduleOKRWorkshop = () => {
  alert(`🎯 Atelier OKRs planifié !

📅 Semaine 4 du planning SEC-GROW
👥 Participants : CEO, CTO, Data Scientist
⏱️ Durée : 1 journée complète
🎯 Objectif : Valider et personnaliser les OKRs générés

Programme :
• 9h-10h : Présentation diagnostic et OKRs générés
• 10h-12h : Ajustement objectifs selon priorités KOALOO
• 14h-16h : Définition mesures techniques détaillées  
• 16h-17h : Planification CFR et timeline`)
}

const setupCFR = () => {
  alert(`📊 Configuration CFR pour KOALOO

🗣️ CONVERSATIONS :
• Weekly OKR check-ins (30min/semaine)
• Monthly security reviews (1h/mois)
• Quarterly business alignment (2h/trimestre)

📈 FEEDBACK :
• Dashboard temps réel des KRs
• Canal Slack #sec-grow-updates
• Alertes automatiques sur dérives

🏆 RECOGNITION :
• Security Champion mensuel
• Célébration des KRs atteints
• Intégration dans évaluations perf`)
}
</script>

<style scoped>
.okrs-section {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid #E2E8F0;
}

.okrs-header {
  text-align: center;
  margin-bottom: 2rem;
}

.okrs-header h3 {
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
}

.okrs-subtitle {
  color: var(--gray-600);
  font-style: italic;
  max-width: 600px;
  margin: 0 auto;
}

.risk-analysis {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid var(--warning);
}

.risk-analysis h4 {
  margin-bottom: 1rem;
  color: var(--gray-900);
}

.risks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.risk-card {
  background: #FFF7ED;
  border: 1px solid #FED7AA;
  border-radius: 8px;
  padding: 1rem;
}

.risk-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.risk-probability {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.risk-probability.élevée {
  background: #FEE2E2;
  color: #DC2626;
}

.risk-probability.moyenne {
  background: #FEF3C7;
  color: #D97706;
}

.risk-probability.faible {
  background: #D1FAE5;
  color: #065F46;
}

.risk-card h5 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gray-900);
}

.risk-card p {
  font-size: 0.9rem;
  color: var(--gray-700);
}

.okrs-cascade {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.okrs-cascade h4 {
  margin-bottom: 1.5rem;
  color: var(--gray-900);
  text-align: center;
}

.okr-level {
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.top-level {
  border-color: var(--primary);
  background: #EBF8FF;
}

.cto-level {
  border-color: var(--success);
  background: #F0FDF4;
}

.dev-level {
  border-color: var(--purple);
  background: #FAF5FF;
}

.security-level {
  border-color: var(--warning);
  background: #FFFBEB;
}

.devops-level {
  border-color: var(--gray-500);
  background: var(--gray-50);
}

.level-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.level-icon {
  font-size: 1.5rem;
}

.level-header h5 {
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.okr-content {
  margin-left: 2.5rem;
}

.objective {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: var(--gray-900);
}

.details {
  font-size: 0.95rem;
  color: var(--gray-700);
  margin-bottom: 1rem;
  font-style: italic;
}

.key-results {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  padding: 1rem;
}

.kr-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--gray-800);
}

.key-results ul {
  margin: 0;
  padding-left: 1.5rem;
}

.key-results li {
  margin-bottom: 0.5rem;
  color: var(--gray-700);
  line-height: 1.4;
}

.cascade-arrow {
  text-align: center;
  font-size: 1.2rem;
  color: var(--gray-500);
  margin: 1rem 0;
  font-weight: 600;
}

.other-levels {
  margin-top: 2rem;
}

.toggle-levels {
  background: var(--gray-100);
  border: 1px solid var(--gray-300);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: var(--gray-700);
  transition: all 0.2s ease;
  width: 100%;
  margin-bottom: 1rem;
}

.toggle-levels:hover {
  background: var(--gray-200);
}

.levels-expanded {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.technical-measures {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid var(--primary);
}

.technical-measures h4 {
  margin-bottom: 0.5rem;
  color: var(--gray-900);
}

.measures-subtitle {
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  font-style: italic;
}

.measures-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.measure-card {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 1.5rem;
  background: #FAFAFA;
}

.measure-kr {
  background: var(--primary);
  color: white;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.measure-transformation {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.measure-step {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border-left: 3px solid var(--success);
}

.step-label {
  display: block;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.measure-step {
  font-size: 0.9rem;
  color: var(--gray-700);
  line-height: 1.4;
}

.okrs-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
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

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .okrs-section {
    padding: 1rem;
  }
  
  .risks-grid {
    grid-template-columns: 1fr;
  }
  
  .okr-content {
    margin-left: 0;
  }
  
  .measure-transformation {
    grid-template-columns: 1fr;
  }
  
  .okrs-actions {
    flex-direction: column;
  }
  
  .action-btn {
    min-width: unset;
  }
  
  .level-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .objective {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .okrs-header h3 {
    font-size: 1.2rem;
  }
  
  .measure-card {
    padding: 1rem;
  }
  
  .risk-card {
    padding: 0.75rem;
  }
  
  .okr-level {
    padding: 1rem;
  }
}
</style>