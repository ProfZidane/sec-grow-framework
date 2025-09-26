<template>
  <div class="auth-form">
    <div class="form-header">
      <h2>Connexion SEC-GROW</h2>
      <p>Accédez à votre évaluation de maturité sécuritaire</p>
    </div>

    <form @submit.prevent="handleLogin" class="form">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          :disabled="loading"
          class="form-input"
          placeholder="votre@email.com"
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          :disabled="loading"
          class="form-input"
          placeholder="••••••••"
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="btn-primary"
      >
        <span v-if="loading">Connexion...</span>
        <span v-else>Se connecter</span>
      </button>
    </form>

    <div class="form-footer">
      <p>
        Pas encore de compte ?
        <button @click="$emit('switch-mode', 'register')" class="link-button">
          S'inscrire
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import { authStore } from '@/stores/auth'

export default {
  name: 'LoginForm',
  
  emits: ['login-success', 'switch-mode'],
  
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: null
    }
  },
  
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = null
      
      try {
        const result = await authStore.login(this.form.email, this.form.password)
        
        if (result.success) {
          this.$emit('login-success', result.user)
        } else {
          this.error = result.error
        }
      } catch (error) {
        this.error = 'Erreur de connexion. Veuillez réessayer.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  color: var(--gray-900);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--gray-600);
  font-size: 0.875rem;
}

.form {
  space-y: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background-color: var(--gray-50);
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 6px;
  color: #DC2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563EB;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
}

.form-footer p {
  color: var(--gray-600);
  font-size: 0.875rem;
}

.link-button {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
}

.link-button:hover {
  color: #2563EB;
}
</style>