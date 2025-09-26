<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Tableau de Bord SEC-GROW</h1>
      <p>Analyse de votre maturité sécuritaire</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des données...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Erreur de chargement</h3>
      <p>{{ error }}</p>
      <button @click="loadDashboard" class="btn-retry">Réessayer</button>
    </div>

    <div v-else-if="!hasData" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>Aucune évaluation trouvée</h3>
      <p>Commencez votre première évaluation SEC-GROW pour voir vos résultats ici.</p>
      <button @click="$router.push('/')" class="btn-primary">Commencer une évaluation</button>
    </div>

    <div v-else class="dashboard-content">
      <!-- Métriques principales -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">🎯</div>
          <div class="metric-content">
            <h3>{{ analytics.totalEvaluations }}</h3>
            <p>Évaluations complétées</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">📈</div>
          <div class="metric-content">
            <h3>{{ analytics.averageScore }}/80</h3>
            <p>Score moyen</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">🏆</div>
          <div class="metric-content">
            <h3>{{ topMaturityLevel }}</h3>
            <p>Meilleur niveau atteint</p>
          </div>
        </div>
      </div>

      <!-- Graphiques principaux -->
      <div class="charts-grid">
        <div class="chart-section">
          <ScoreChart 
            v-if="latestEvaluation"
            :global-score="latestEvaluation.globalScore"
            :maturity-level="latestEvaluation.maturityLevel"
          />
        </div>
        
        <div class="chart-section">
          <MaturityRadar 
            v-if="latestEvaluation"
            :pillar-scores="latestEvaluation.pillarScores"
          />
        </div>
      </div>

      <!-- Tendances -->
      <div v-if="analytics.pillarTrends.length > 1" class="trends-section">
        <h2>Évolution des Scores</h2>
        <div class="trends-chart">
          <canvas ref="trendsCanvas"></canvas>
        </div>
      </div>

      <!-- Évaluations récentes -->
      <div class="recent-evaluations">
        <div class="section-header">
          <h2>Évaluations Récentes</h2>
          <button @click="$router.push('/evaluations')" class="btn-secondary">
            Voir tout
          </button>
        </div>
        
        <div class="evaluations-list">
          <div 
            v-for="evaluation in analytics.recentEvaluations" 
            :key="evaluation.id"
            class="evaluation-card"
            @click="viewEvaluation(evaluation.id)"
          >
            <div class="evaluation-info">
              <h4>{{ evaluation.company }}</h4>
              <p>{{ evaluation.evaluator_role }} • {{ formatDate(evaluation.completed_at) }}</p>
            </div>
            <div class="evaluation-score">
              <div 
                class="score-badge"
                :style="{ backgroundColor: evaluation.maturityLevel.color }"
              >
                {{ evaluation.globalScore }}/80
              </div>
              <span class="level-name">{{ evaluation.maturityLevel.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommandations IA -->
      <div v-if="aiRecommendations.length > 0" class="recommendations-section">
        <h2>Recommandations IA</h2>
        <div class="recommendations-grid">
          <div 
            v-for="(rec, index) in aiRecommendations.slice(0, 3)" 
            :key="index"
            class="recommendation-card"
          >
            <div class="rec-header">
              <span class="rec-priority" :class="`priority-${rec.priority}`">
                Priorité {{ rec.priority }}
              </span>
              <span class="rec-pillar">{{ rec.pillar }}</span>
            </div>
            <h4>{{ rec.title }}</h4>
            <p>{{ rec.description.substring(0, 120) }}...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '@/utils/api'
import { authStore } from '@/stores/auth'
import ScoreChart from '@/components/dashboard/ScoreChart.vue'
import MaturityRadar from '@/components/dashboard/MaturityRadar.vue'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
  name: 'Dashboard',
  
  components: {
    ScoreChart,
    MaturityRadar
  },
  
  data() {
    return {
      loading: true,
      error: null,
      analytics: {
        totalEvaluations: 0,
        averageScore: 0,
        maturityDistribution: {},
        pillarTrends: [],
        recentEvaluations: []
      },
      aiRecommendations: [],
      trendsChart: null
    }
  },
  
  computed: {
    hasData() {
      return this.analytics.totalEvaluations > 0
    },
    
    latestEvaluation() {
      if (this.analytics.recentEvaluations.length === 0) return null
      
      const latest = this.analytics.recentEvaluations[0]
      return {
        globalScore: latest.globalScore,
        maturityLevel: latest.maturityLevel,
        pillarScores: latest.scores?.pillarScores || {}
      }
    },
    
    topMaturityLevel() {
      const levels = this.analytics.recentEvaluations.map(e => e.maturityLevel.name)
      const levelOrder = ['Ad Hoc', 'Bronze', 'Silver', 'Gold', 'Platinum']
      return levels.reduce((top, current) => {
        return levelOrder.indexOf(current) > levelOrder.indexOf(top) ? current : top
      }, 'Ad Hoc')
    }
  },
  
  async mounted() {
    if (!authStore.isAuthenticated) {
      this.$router.push('/auth')
      return
    }
    
    await this.loadDashboard()
  },
  
  methods: {
    async loadDashboard() {
      this.loading = true
      this.error = null
      
      try {
        const data = await apiService.getDashboardAnalytics()
        this.analytics = data.analytics
        
        // Load AI recommendations for latest evaluation
        if (this.analytics.recentEvaluations.length > 0) {
          await this.loadRecommendations(this.analytics.recentEvaluations[0].id)
        }
        
        // Create trends chart if we have data
        if (this.analytics.pillarTrends.length > 1) {
          this.$nextTick(() => {
            this.createTrendsChart()
          })
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async loadRecommendations(evaluationId) {
      try {
        const data = await apiService.getRecommendations(evaluationId)
        this.aiRecommendations = data.recommendations || []
      } catch (error) {
        console.warn('Could not load recommendations:', error)
      }
    },
    
    createTrendsChart() {
      if (!this.$refs.trendsCanvas) return
      
      const ctx = this.$refs.trendsCanvas.getContext('2d')
      const trends = this.analytics.pillarTrends
      
      this.trendsChart = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: trends.map(t => new Date(t.date).toLocaleDateString()),
          datasets: [
            {
              label: 'Score Global',
              data: trends.map(t => t.globalScore),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4
            },
            {
              label: 'Gouvernance',
              data: trends.map(t => t.governance),
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4
            },
            {
              label: 'Technique',
              data: trends.map(t => t.technical),
              borderColor: '#8B5CF6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 80
            }
          }
        }
      })
    },
    
    viewEvaluation(evaluationId) {
      this.$router.push(`/evaluation/${evaluationId}`)
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  },
  
  beforeUnmount() {
    if (this.trendsChart) {
      this.trendsChart.destroy()
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.dashboard-header p {
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.metric-icon {
  font-size: 2rem;
}

.metric-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
}

.metric-content p {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin: 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.trends-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.trends-chart {
  height: 300px;
  margin-top: 1rem;
}

.recent-evaluations {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.evaluations-list {
  display: grid;
  gap: 1rem;
}

.evaluation-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.evaluation-card:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.evaluation-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 0.25rem 0;
}

.evaluation-info p {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin: 0;
}

.evaluation-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.score-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

.level-name {
  font-size: 0.75rem;
  color: var(--gray-600);
}

.recommendations-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.recommendation-card {
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  padding: 1rem;
}

.rec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.rec-priority {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
}

.priority-1 { background: #FEE2E2; color: #DC2626; }
.priority-2 { background: #FEF3C7; color: #D97706; }
.priority-3 { background: #DBEAFE; color: #2563EB; }

.rec-pillar {
  font-size: 0.75rem;
  color: var(--gray-600);
  text-transform: capitalize;
}

.btn-primary, .btn-secondary, .btn-retry {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
}

.btn-retry {
  background: var(--danger);
  color: white;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .evaluation-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .evaluation-score {
    align-items: flex-start;
  }
}
</style>