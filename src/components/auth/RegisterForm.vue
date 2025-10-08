<template>
  <div class="auth-form">
    <div class="form-header">
      <h2>Inscription SEC-GROW</h2>
      <p>Créez votre compte pour commencer l'évaluation</p>
    </div>

    <form @submit.prevent="handleRegister" class="form">
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
          minlength="8"
        />
        <div class="password-help">
          Minimum 8 caractères avec majuscule, minuscule et chiffre
        </div>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          :disabled="loading"
          class="form-input"
          placeholder="••••••••"
        />
      </div>

      <div class="form-group">
        <label for="role">Rôle</label>
        <select
          id="role"
          v-model="form.role"
          :disabled="loading"
          class="form-input"
        >
          <option value="evaluator">Évaluateur</option>
          <option value="admin">Administrateur</option>
          <option value="viewer">Observateur</option>
        </select>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="btn-primary"
      >
        <span v-if="loading">Inscription...</span>
        <span v-else>S'inscrire</span>
      </button>
    </form>

    <div class="form-footer">
      <p>
        Déjà un compte ?
        <button @click="$emit('switch-mode', 'login')" class="link-button">
          Se connecter
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import { authStore } from '@/stores/auth'

export default {
  name: 'RegisterForm',
  
  emits: ['register-success', 'switch-mode'],
  
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        role: 'evaluator'
      },
      loading: false,
      error: null,
      success: null
    }
  },
  
  computed: {
    isFormValid() {
      return (
        this.form.email &&
        this.form.password &&
        this.form.confirmPassword &&
        this.form.password === this.form.confirmPassword &&
        this.isPasswordValid
      )
    },
    
    isPasswordValid() {
      const password = this.form.password
      return (
        password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /\d/.test(password)
      )
    }
  },
  
  methods: {
    async handleRegister() {
      this.loading = true
      this.error = null
      this.success = null
      
      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Les mots de passe ne correspondent pas'
        this.loading = false
        return
      }
      
      if (!this.isPasswordValid) {
        this.error = 'Le mot de passe doit contenir au moins 8 caractères avec une majuscule, une minuscule et un chiffre'
        this.loading = false
        return
      }
      
      try {
        const result = await authStore.register(
          this.form.email,
          this.form.password,
          this.form.role
        )
        
        if (result.success) {
          this.success = 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
          setTimeout(() => {
            this.$emit('register-success')
          }, 2000)
        } else {
          this.error = result.error
        }
      } catch (error) {
        this.error = 'Erreur d\'inscription. Veuillez réessayer.'
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

.password-help {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-top: 0.25rem;
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

.success-message {
  padding: 0.75rem;
  background-color: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 6px;
  color: #166534;
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