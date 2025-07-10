<template>
  <div class="diagnostic-interface">
    
    <!-- Navigation des sections -->
    <div class="sections-nav">
      <div class="nav-header">
        <h3>📋 Sections</h3>
        <button @click="$emit('reset-evaluator')" class="change-evaluator-btn">
          🔄 Changer d'évaluateur
        </button>
      </div>
      
      <div class="sections-list">
        <button
          v-for="(section, index) in sections"
          :key="section.id"
          @click="$emit('section-changed', index)"
          :class="['section-btn', { active: currentSection === index }]"
        >
          <span class="section-icon">{{ section.icon }}</span>
          <div class="section-info">
            <div class="section-title">{{ section.title }}</div>
            <div class="section-score">{{ getSectionScore(index) }}/20</div>
            <div class="section-maturity" :style="{ color: getSectionMaturity(index).color }">
              {{ getSectionMaturity(index).name }}
            </div>
          </div>
          <div class="section-progress">
            <div class="progress-circle">
              <div 
                class="progress-fill" 
                :style="{ 
                  strokeDasharray: `${getSectionProgress(index)}, 100`,
                  stroke: getSectionMaturity(index).color 
                }"
              ></div>
            </div>
          </div>
        </button>
      </div>

      <!-- Contexte KOALOO -->
      <div class="koaloo-context">
        <h4>🏢 Contexte KOALOO</h4>
        <div class="context-details">
          <div><strong>Secteur:</strong> Fintech ESG</div>
          <div><strong>Mission:</strong> Améliorer score ESG des corporates</div>
          <div><strong>Équipe:</strong> 4 ops + 5 board</div>
          <div><strong>SaaS:</strong> Tracking KPIs ESG</div>
        </div>
      </div>
    </div>

    <!-- Questions de la section courante -->
    <div class="questions-container">
      <div class="section-header">
        <h2>
          {{ sections[currentSection].icon }} 
          {{ sections[currentSection].title }}
        </h2>
        <div class="section-meta">
          <span class="section-number">Section {{ currentSection + 1 }}/4</span>
          <span class="questions-count">
            {{ getSectionAnswered(currentSection) }}/5 répondues
          </span>
        </div>
      </div>
      
      <div class="questions">
        <div 
          v-for="(question, qIndex) in sections[currentSection].questions" 
          :key="question.id"
          class="question-card"
        >
          <div class="question-number">{{ qIndex + 1 }}</div>
          <div class="question-content">
            <h3>{{ question.text }}</h3>
            <div class="question-help">
              💡 {{ question.help }}
            </div>
            
            <div class="options">
              <label 
                v-for="(option, optionIndex) in question.options" 
                :key="optionIndex"
                class="option"
                :class="{ selected: responses[question.id] === optionIndex }"
              >
                <input 
                  type="radio" 
                  :name="question.id"
                  :value="optionIndex"
                  :checked="responses[question.id] === optionIndex"
                  @change="handleResponseChange(question.id, optionIndex)"
                >
                <div class="option-content">
                  <span class="option-text">{{ option }}</span>
                  <div class="option-meta">
                    <span class="option-points">{{ optionIndex }} pts</span>
                    <span class="maturity-level">{{ getMaturityLabel(optionIndex) }}</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation sections -->
      <div class="section-navigation">
        <button 
          @click="previousSection" 
          :disabled="currentSection === 0"
          class="nav-btn secondary"
        >
          ← Section précédente
        </button>
        
        <div class="nav-center">
          <span class="completion-status">
            {{ getTotalAnswered() }}/20 questions répondues
          </span>
        </div>
        
        <button 
          v-if="currentSection < sections.length - 1"
          @click="nextSection"
          class="nav-btn primary"
        >
          Section suivante →
        </button>
        
        <button 
          v-else
          @click="$emit('show-results')"
          :disabled="!isComplete"
          class="nav-btn success"
          :class="{ pulse: isComplete }"
        >
          Voir les résultats 📊
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { MATURITY_LEVELS } from '@/data/questions'

export default {
  name: 'DiagnosticInterface',
  
  props: {
    selectedEvaluator: {
      type: Object,
      required: true
    },
    currentSection: {
      type: Number,
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
  
  emits: ['section-changed', 'response-changed', 'show-results', 'reset-evaluator'],
  
  data() {
    return {
      maturityLevels: MATURITY_LEVELS
    }
  },
  
  computed: {
    isComplete() {
      return this.getTotalAnswered() === 20
    }
  },
  
  methods: {
    handleResponseChange(questionId, value) {
      this.$emit('response-changed', questionId, value)
    },
    
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
    
    getSectionProgress(sectionIndex) {
      const section = this.sections[sectionIndex]
      const answered = section.questions.filter(q => this.responses[q.id] !== undefined).length
      return Math.round((answered / section.questions.length) * 100)
    },
    
    getSectionAnswered(sectionIndex) {
      const section = this.sections[sectionIndex]
      return section.questions.filter(q => this.responses[q.id] !== undefined).length
    },
    
    getTotalAnswered() {
      return Object.keys(this.responses).length
    },
    
    getMaturityLabel(optionIndex) {
      const labels = ['Ad Hoc', 'Bronze', 'Silver', 'Gold', 'Platinum']
      return labels[optionIndex] || 'N/A'
    },
    
    nextSection() {
      if (this.currentSection < this.sections.length - 1) {
        this.$emit('section-changed', this.currentSection + 1)
      }
    },
    
    previousSection() {
      if (this.currentSection > 0) {
        this.$emit('section-changed', this.currentSection - 1)
      }
    }
  }
}
</script>

<style scoped>
.diagnostic-interface {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  align-items: start;
}

/* Navigation des sections */
.sections-nav {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 1rem;
  overflow: hidden;
}

.nav-header {
  background: var(--gray-50);
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
}

.nav-header h3 {
  margin-bottom: 1rem;
  color: var(--gray-900);
  font-size: 1.1rem;
}

.change-evaluator-btn {
  background: var(--gray-200);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.change-evaluator-btn:hover {
  background: var(--gray-300);
}

.sections-list {
  padding: 1rem;
}

.section-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  background: var(--gray-50);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.section-btn:hover {
  background: var(--gray-100);
}

.section-btn.active {
  background: var(--primary);
  color: white;
}

.section-icon {
  font-size: 1.5rem;
}

.section-info {
  flex: 1;
}

.section-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.section-score {
  font-size: 0.8rem;
  opacity: 0.8;
}

.section-maturity {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.section-progress {
  position: relative;
  width: 24px;
  height: 24px;
}

.progress-circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-fill {
  fill: none;
  stroke-width: 2;
  stroke-dasharray: 0, 100;
  transition: stroke-dasharray 0.3s ease;
  cx: 12;
  cy: 12;
  r: 10;
}

.koaloo-context {
  background: var(--gray-50);
  padding: 1.5rem;
  border-top: 1px solid var(--gray-200);
}

.koaloo-context h4 {
  color: var(--gray-900);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.context-details {
  font-size: 0.8rem;
  color: var(--gray-600);
  line-height: 1.5;
}

.context-details div {
  margin-bottom: 0.25rem;
}

/* Questions */
.questions-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
}

.section-header {
  background: var(--gray-50);
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  font-size: 1.3rem;
  color: var(--gray-900);
}

.section-meta {
  text-align: right;
  font-size: 0.9rem;
  color: var(--gray-600);
}

.section-number {
  display: block;
  margin-bottom: 0.25rem;
}

.questions-count {
  font-weight: 600;
  color: var(--primary);
}

.questions {
  padding: 1.5rem;
}

.question-card {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--gray-100);
}

.question-card:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.question-number {
  background: var(--primary);
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.question-content {
  flex: 1;
}

.question-content h3 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: var(--gray-900);
  font-weight: 600;
}

.question-help {
  background: #FFF7ED;
  border-left: 3px solid var(--warning);
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--gray-700);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option {
  border: 2px solid var(--gray-200);
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: block;
  background: white;
}

.option:hover {
  border-color: var(--gray-300);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.option.selected {
  border-color: var(--primary);
  background: #EBF8FF;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.option input {
  display: none;
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.option-text {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--gray-800);
}

.option-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.option-points {
  background: var(--gray-100);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--gray-600);
  font-weight: 600;
}

.maturity-level {
  font-size: 0.7rem;
  color: var(--gray-500);
  text-transform: uppercase;
  font-weight: 600;
}

.option.selected .option-points {
  background: var(--primary);
  color: white;
}

.option.selected .maturity-level {
  color: var(--primary);
}

/* Navigation */
.section-navigation {
  padding: 1.5rem;
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-center {
  text-align: center;
}

.completion-status {
  font-size: 0.9rem;
  color: var(--gray-600);
  font-weight: 500;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn.primary {
  background: var(--primary);
  color: white;
}

.nav-btn.secondary {
  background: var(--gray-200);
  color: var(--gray-700);
}

.nav-btn.success {
  background: var(--success);
  color: white;
}

.nav-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.nav-btn.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .diagnostic-interface {
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .diagnostic-interface {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .sections-nav {
    position: static;
    order: 2;
  }
  
  .questions-container {
    order: 1;
  }
  
  .section-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-center {
    order: -1;
  }
  
  .question-card {
    flex-direction: column;
    gap: 1rem;
  }
  
  .option-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .option-meta {
    align-items: flex-start;
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style>