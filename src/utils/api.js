import { authStore } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    try {
      const response = await authStore.makeAuthenticatedRequest(url, options)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Diagnostic endpoints
  async saveEvaluation(evaluationData) {
    return this.request('/diagnostic/save', {
      method: 'POST',
      body: JSON.stringify(evaluationData)
    })
  }

  async completeEvaluation(evaluationId) {
    return this.request(`/diagnostic/${evaluationId}/complete`, {
      method: 'PUT'
    })
  }

  async getEvaluation(evaluationId) {
    return this.request(`/diagnostic/${evaluationId}`)
  }

  async getUserEvaluations(page = 1, limit = 10) {
    return this.request(`/diagnostic/user/evaluations?page=${page}&limit=${limit}`)
  }

  // AI endpoints
  async generateRecommendations(evaluationId) {
    return this.request('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ evaluationId })
    })
  }

  async getRecommendations(evaluationId) {
    return this.request(`/ai/recommendations/${evaluationId}`)
  }

  async checkAIHealth() {
    return this.request('/ai/health')
  }

  // Analytics endpoints
  async getDashboardAnalytics() {
    return this.request('/analytics/dashboard')
  }

  async getComparisonData(evaluationIds) {
    const ids = Array.isArray(evaluationIds) ? evaluationIds.join(',') : evaluationIds
    return this.request(`/analytics/comparison?evaluationIds=${ids}`)
  }

  async getTrends(evaluationId) {
    return this.request(`/analytics/trends/${evaluationId}`)
  }
}

export const apiService = new ApiService()

// Helper functions for common operations
export const diagnosticApi = {
  async saveResponses(companyId, evaluatorRole, responses) {
    return apiService.saveEvaluation({
      company_id: companyId,
      evaluator_role: evaluatorRole,
      responses
    })
  },

  async loadEvaluation(evaluationId) {
    try {
      const data = await apiService.getEvaluation(evaluationId)
      return {
        success: true,
        evaluation: data.evaluation
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export const aiApi = {
  async getRecommendations(evaluationId) {
    try {
      // Try to get existing recommendations first
      const existing = await apiService.getRecommendations(evaluationId)
      return {
        success: true,
        recommendations: existing.recommendations,
        cached: true
      }
    } catch (error) {
      // If no recommendations exist, generate new ones
      try {
        const generated = await apiService.generateRecommendations(evaluationId)
        return {
          success: true,
          recommendations: generated.recommendations,
          cached: false
        }
      } catch (genError) {
        return {
          success: false,
          error: genError.message
        }
      }
    }
  }
}