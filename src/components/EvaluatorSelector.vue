<template>
  <div class="evaluator-selection">
    <div class="selection-header">
      <h2>Qui effectue cette évaluation ?</h2>
      <p>Diagnostic SEC-GROW - Semaine 3 du planning</p>
      <div class="koaloo-context">
        <span class="context-badge">🏢 KOALOO</span>
        <span class="context-badge">💰 Fintech ESG</span>
        <span class="context-badge">👥 4 ops + 5 board</span>
      </div>
    </div>
    
    <div class="evaluator-grid">
      <button 
        v-for="role in evaluatorRoles" 
        :key="role.id"
        @click="selectEvaluator(role)"
        class="evaluator-card"
      >
        <div class="evaluator-emoji">{{ role.emoji }}</div>
        <h3>{{ role.name }}</h3>
        <p>{{ role.description }}</p>
        <div class="card-footer">
          <span class="select-text">Sélectionner →</span>
        </div>
      </button>
    </div>
    
    <div class="selection-info">
      <div class="info-box">
        <h4>ℹ️ Information importante</h4>
        <p>L'évaluation prend environ <strong>30 minutes</strong>. Vous pouvez la mettre en pause et reprendre plus tard.</p>
        <p>Pour un diagnostic optimal, nous recommandons que le <strong>CEO et le CTO</strong> fassent chacun leur évaluation.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { EVALUATOR_ROLES } from '@/data/questions'

export default {
  name: 'EvaluatorSelector',
  
  data() {
    return {
      evaluatorRoles: EVALUATOR_ROLES
    }
  },
  
  emits: ['evaluator-selected'],
  
  methods: {
    selectEvaluator(role) {
      this.$emit('evaluator-selected', role)
    }
  }
}
</script>

<style scoped>
.evaluator-selection {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.selection-header {
  margin-bottom: 3rem;
}

.selection-header h2 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  color: var(--gray-900);
  font-weight: 700;
}

.selection-header p {
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.koaloo-context {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.context-badge {
  background: var(--gray-100);
  color: var(--gray-700);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.evaluator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.evaluator-card {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.evaluator-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s ease;
}

.evaluator-card:hover::before {
  left: 100%;
}

.evaluator-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.2);
}

.evaluator-emoji {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.evaluator-card:hover .evaluator-emoji {
  transform: scale(1.1);
}

.evaluator-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  color: var(--gray-900);
  font-weight: 600;
}

.evaluator-card p {
  color: var(--gray-600);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.card-footer {
  margin-top: auto;
}

.select-text {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.evaluator-card:hover .select-text {
  opacity: 1;
}

.selection-info {
  max-width: 600px;
  margin: 0 auto;
}

.info-box {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 2rem;
  text-align: left;
}

.info-box h4 {
  color: var(--gray-900);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.info-box p {
  color: var(--gray-700);
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.info-box p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .selection-header h2 {
    font-size: 1.8rem;
  }
  
  .evaluator-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .evaluator-card {
    padding: 2rem 1.5rem;
  }
  
  .koaloo-context {
    flex-direction: column;
    align-items: center;
  }
  
  .info-box {
    padding: 1.5rem;
  }
}
</style>