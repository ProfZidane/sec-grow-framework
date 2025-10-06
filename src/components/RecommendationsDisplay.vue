<template>
  <div class="recommendations-display">
    <div class="recommendations-header">
      <h2>🤖 Recommandations IA Personnalisées</h2>
      <p>Suggestions d'amélioration basées sur votre niveau de maturité</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Génération des recommandations en cours...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Erreur de génération</h3>
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="btn-retry">Réessayer</button>
    </div>

    <div v-else-if="recommendations.length === 0" class="empty-state">
      <div class="empty-icon">💡</div>
      <h3>Aucune recommandation disponible</h3>
      <p>Complétez votre évaluation pour recevoir des suggestions personnalisées.</p>
    </div>

    <div v-else class="recommendations-content">
      <div class="recommendations-summary">
        <div class="summary-card">
          <div class="summary-icon">🎯</div>
          <div class="summary-info">
            <h4>{{ recommendations.length }} Recommandations</h4>
            <p>Basées sur votre niveau {{ maturityLevel?.name || 'actuel' }}</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">⚡</div>
          <div class="summary-info">
            <h4>{{ highPriorityCount }} Actions Prioritaires</h4>
            <p>À implémenter en premier</p>
          </div>
        </div>
      </div>

      <div class="recommendations-list">
        <div 
          v-for="(recommendation, index) in sortedRecommendations" 
          :key="index"
          class="recommendation-card"
          :class="`priority-${recommendation.priority}`"
        >
          <div class="recommendation-header">
            <div class="priority-badge" :class="`priority-${recommendation.priority}`">
              <span class="priority-icon">{{ getPriorityIcon(recommendation.priority) }}</span>
              <span class="priority-text">Priorité {{ recommendation.priority }}</span>
            </div>
            
            <div class="pillar-badge" :style="{ backgroundColor: getPillarColor(recommendation.pillar) }">
              {{ getPillarName(recommendation.pillar) }}
            </div>
          </div>

          <div class="recommendation-content">
            <h3>{{ recommendation.title }}</h3>
            <p>{{ recommendation.description }}</p>
            
            <div v-if="recommendation.impact" class="impact-indicator">
              <span class="impact-label">Impact attendu:</span>
              <span class="impact-value" :class="`impact-${recommendation.impact}`">
                {{ getImpactLabel(recommendation.impact) }}
              </span>
            </div>
          </div>

          <div class="recommendation-actions">
            <button 
              @click="markAsImplemented(index)" 
              class="btn-action"
              :disabled="recommendation.implemented"
            >
              {{ recommendation.implemented ? '✅ Implémenté' : '📋 Marquer comme fait' }}
            </button>
            
            <button @click="getMoreDetails(recommendation)" class="btn-details">
              📖 Plus de détails
            </button>
          </div>
        </div>
      </div>

      <div class="recommendations-footer">
        <div class="footer-info">
          <p>
            <strong>💡 Conseil:</strong> 
            Commencez par les recommandations de priorité 1 pour un impact maximal sur votre score de maturité.
          </p>
        </div>
        
        <div class="footer-actions">
          <button @click="exportRecommendations" class="btn-export">
            📄 Exporter en PDF
          </button>
          
          <button @click="$emit('refresh')" class="btn-refresh">
            🔄 Actualiser
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  recommendations: {
    type: Array,
    default: () => []
  },
  maturityLevel: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['retry', 'refresh', 'mark-implemented', 'export'])

const implementedItems = ref(new Set())

const pillarNames = {
  governance: 'Gouvernance',
  technical: 'Technique',
  processes: 'Processus',
  culture: 'Culture'
}

const pillarColors = {
  governance: '#3B82F6',
  technical: '#10B981',
  processes: '#8B5CF6',
  culture: '#F59E0B'
}

const sortedRecommendations = computed(() => {
  return [...props.recommendations]
    .map((rec, index) => ({
      ...rec,
      implemented: implementedItems.value.has(index)
    }))
    .sort((a, b) => a.priority - b.priority)
})

const highPriorityCount = computed(() => {
  return props.recommendations.filter(rec => rec.priority === 1).length
})

const getPriorityIcon = (priority) => {
  const icons = { 1: '🔥', 2: '⚡', 3: '💡' }
  return icons[priority] || '📌'
}

const getPillarName = (pillar) => {
  return pillarNames[pillar] || pillar
}

const getPillarColor = (pillar) => {
  return pillarColors[pillar] || '#6B7280'
}

const getImpactLabel = (impact) => {
  const labels = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé'
  }
  return labels[impact] || impact
}

const markAsImplemented = (index) => {
  implementedItems.value.add(index)
  emit('mark-implemented', index)
}

const getMoreDetails = (recommendation) => {
  alert(`Détails pour: ${recommendation.title}\n\n${recommendation.description}`)
}

const exportRecommendations = () => {
  emit('export', props.recommendations)
}
</script>

<style scoped>
.recommendations-display {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.recommendations-header {
  text-align: center;
  margin-bottom: 2rem;
}

.recommendations-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.recommendations-header p {
  color: var(--gray-600);
  font-size: 1.125rem;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.recommendations-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.summary-icon {
  font-size: 2rem;
}

.summary-info h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 0.25rem 0;
}

.summary-info p {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin: 0;
}

.recommendations-list {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.recommendation-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--gray-300);
  transition: all 0.2s;
}

.recommendation-card.priority-1 {
  border-left-color: #EF4444;
}

.recommendation-card.priority-2 {
  border-left-color: #F59E0B;
}

.recommendation-card.priority-3 {
  border-left-color: #3B82F6;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.priority-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.priority-badge.priority-1 {
  background: #FEE2E2;
  color: #DC2626;
}

.priority-badge.priority-2 {
  background: #FEF3C7;
  color: #D97706;
}

.priority-badge.priority-3 {
  background: #DBEAFE;
  color: #2563EB;
}

.pillar-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.recommendation-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.75rem;
}

.recommendation-content p {
  color: var(--gray-700);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.impact-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.impact-label {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.impact-value {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.impact-value.impact-low {
  background: #F3F4F6;
  color: #6B7280;
}

.impact-value.impact-medium {
  background: #FEF3C7;
  color: #D97706;
}

.impact-value.impact-high {
  background: #DCFCE7;
  color: #16A34A;
}

.recommendation-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-action, .btn-details, .btn-export, .btn-refresh, .btn-retry {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-action {
  background: var(--success);
  color: white;
}

.btn-action:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
}

.btn-details {
  background: var(--gray-100);
  color: var(--gray-700);
}

.btn-export, .btn-refresh {
  background: var(--primary);
  color: white;
}

.btn-retry {
  background: var(--danger);
  color: white;
}

.recommendations-footer {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-info p {
  color: var(--gray-700);
  font-size: 0.875rem;
  margin: 0;
}

.footer-actions {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .recommendation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .recommendations-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .footer-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>