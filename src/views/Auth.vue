<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="logo">
          <h1>SEC-GROW</h1>
          <p>Framework de Maturité Sécuritaire</p>
        </div>
      </div>

      <div class="auth-content">
        <LoginForm 
          v-if="mode === 'login'"
          @login-success="handleLoginSuccess"
          @switch-mode="mode = 'register'"
        />
        
        <RegisterForm 
          v-else
          @register-success="handleRegisterSuccess"
          @switch-mode="mode = 'login'"
        />
      </div>

      <div class="auth-footer">
        <p>&copy; 2024 SEC-GROW. Développé pour KOALOO.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { authStore } from '@/stores/auth'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

export default {
  name: 'Auth',
  
  components: {
    LoginForm,
    RegisterForm
  },
  
  data() {
    return {
      mode: 'login' // 'login' or 'register'
    }
  },
  
  mounted() {
    // Redirect if already authenticated
    if (authStore.isAuthenticated) {
      this.$router.push('/dashboard')
    }
  },
  
  methods: {
    handleLoginSuccess(user) {
      console.log('Login successful:', user)
      this.$router.push('/dashboard')
    },
    
    handleRegisterSuccess() {
      this.mode = 'login'
      // Show success message
      this.$nextTick(() => {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      })
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 500px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.logo p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
}

.auth-content {
  margin-bottom: 2rem;
}

.auth-footer {
  text-align: center;
}

.auth-footer p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 640px) {
  .auth-page {
    padding: 0.5rem;
  }
  
  .logo h1 {
    font-size: 2rem;
  }
}
</style>