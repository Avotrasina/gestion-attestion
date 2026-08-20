import { defineStore } from 'pinia';


interface User {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
}

export const userAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null
  }),
  
  getters: {
    isAuthenticated:  (state) => state.token != null
  },

  actions: {
    login(user: User, token: string) {
      this.user = user
      this.token = token
    },

    logout() {
      this.user = null
      this.token = null
    }
  }

})


