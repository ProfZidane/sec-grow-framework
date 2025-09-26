<template>
  <div class="maturity-radar">
    <div class="chart-header">
      <h3>Radar de Maturité par Pilier</h3>
      <p>Visualisation des forces et faiblesses par domaine</p>
    </div>
    
    <div class="chart-container">
      <canvas ref="radarCanvas"></canvas>
    </div>
    
    <div class="pillar-scores">
      <div 
        v-for="(score, pillar) in pillarScores" 
        :key="pillar"
        class="pillar-item"
      >
        <div class="pillar-info">
          <span class="pillar-name">{{ getPillarName(pillar) }}</span>
          <span class="pillar-score">{{ score }}/20</span>
        </div>
        <div class="pillar-bar">
          <div 
            class="pillar-progress"
            :style="{ 
              width: `${(score / 20) * 100}%`,
              backgroundColor: getPillarColor(pillar)
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default {
  name: 'MaturityRadar',
  
  props: {
    pillarScores: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      pillarNames: {
        governance: 'Gouvernance',
        technical: 'Technique',
        processes: 'Processus',
        culture: 'Culture'
      },
      pillarColors: {
        governance: '#3B82F6',
        technical: '#10B981',
        processes: '#8B5CF6',
        culture: '#F59E0B'
      }
    }
  },
  
  computed: {
    chartData() {
      const labels = Object.keys(this.pillarScores).map(key => this.pillarNames[key])
      const data = Object.values(this.pillarScores)
      
      return {
        labels,
        datasets: [{
          label: 'Score de maturité',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3B82F6',
          borderWidth: 2,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      }
    },
    
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 20,
            ticks: {
              stepSize: 5,
              font: {
                size: 12
              }
            },
            grid: {
              color: '#E5E7EB'
            },
            angleLines: {
              color: '#E5E7EB'
            },
            pointLabels: {
              font: {
                size: 14,
                weight: '500'
              },
              color: '#374151'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.parsed.r}/20 (${Math.round((context.parsed.r / 20) * 100)}%)`
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
    pillarScores: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  
  methods: {
    createChart() {
      const ctx = this.$refs.radarCanvas.getContext('2d')
      this.chart = new ChartJS(ctx, {
        type: 'radar',
        data: this.chartData,
        options: this.chartOptions
      })
    },
    
    updateChart() {
      if (this.chart) {
        this.chart.data = this.chartData
        this.chart.update()
      }
    },
    
    getPillarName(pillar) {
      return this.pillarNames[pillar] || pillar
    },
    
    getPillarColor(pillar) {
      return this.pillarColors[pillar] || '#6B7280'
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
.maturity-radar {
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
  margin-bottom: 0.25rem;
}

.chart-header p {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin: 0;
}

.chart-container {
  position: relative;
  height: 300px;
  margin-bottom: 1.5rem;
}

.pillar-scores {
  display: grid;
  gap: 1rem;
}

.pillar-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pillar-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pillar-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
}

.pillar-score {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-900);
}

.pillar-bar {
  height: 6px;
  background-color: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
}

.pillar-progress {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
}
</style>