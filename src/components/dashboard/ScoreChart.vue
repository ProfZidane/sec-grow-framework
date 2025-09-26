<template>
  <div class="score-chart">
    <div class="chart-header">
      <h3>Score Global de Maturité</h3>
      <div class="score-display">
        <span class="score-value">{{ globalScore }}/80</span>
        <span class="score-percentage">({{ scorePercentage }}%)</span>
      </div>
    </div>
    
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    
    <div class="maturity-level">
      <div 
        class="level-badge"
        :style="{ backgroundColor: maturityLevel.color }"
      >
        {{ maturityLevel.name }}
      </div>
      <p class="level-description">{{ maturityLevel.description }}</p>
    </div>
  </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'ScoreChart',
  
  props: {
    globalScore: {
      type: Number,
      required: true
    },
    maturityLevel: {
      type: Object,
      required: true
    }
  },
  
  computed: {
    scorePercentage() {
      return Math.round((this.globalScore / 80) * 100)
    },
    
    chartData() {
      return {
        labels: ['Score obtenu', 'Points restants'],
        datasets: [{
          data: [this.globalScore, 80 - this.globalScore],
          backgroundColor: [
            this.maturityLevel.color,
            '#E5E7EB'
          ],
          borderWidth: 0,
          cutout: '70%'
        }]
      }
    },
    
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label
                const value = context.parsed
                const percentage = Math.round((value / 80) * 100)
                return `${label}: ${value}/80 (${percentage}%)`
              }
            }
          }
        }
      }
    }
  },
  
  mounted() {
    this.createChart()
  },
  
  watch: {
    globalScore() {
      this.updateChart()
    }
  },
  
  methods: {
    createChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      this.chart = new ChartJS(ctx, {
        type: 'doughnut',
        data: this.chartData,
        options: this.chartOptions
      })
    },
    
    updateChart() {
      if (this.chart) {
        this.chart.data = this.chartData
        this.chart.update()
      }
    }
  },
  
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  }
}
</script>

<style scoped>
.score-chart {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.score-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
}

.score-percentage {
  font-size: 1rem;
  color: var(--gray-600);
}

.chart-container {
  position: relative;
  height: 200px;
  margin-bottom: 1.5rem;
}

.maturity-level {
  text-align: center;
}

.level-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.level-description {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin: 0;
}
</style>