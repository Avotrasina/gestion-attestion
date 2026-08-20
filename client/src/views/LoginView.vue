<template>
  <div class="w-full max-w-md">
    <!-- Carte -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <!-- En-tête -->
      <div class="px-8 pt-8 pb-6 text-center border-b border-gray-100">
        <img :src="logo" alt="Caisse d'Epargne Madagascar"
             class="h-14 mx-auto mb-4 object-contain"
             onerror="this.onerror=null;this.src='https://sc04.alicdn.com/kf/Sd4033d7e084746d289d4d1e9ddc77d7ar.jpg'">
        <h1 class="text-xl font-bold text-cem-dark">Connexion</h1>
        <p class="text-sm text-gray-500 mt-1">Gestion des demandes de stage et d'attestations</p>
      </div>

      <!-- Formulaire -->
      <form id="form-login" class="p-8 space-y-5" novalidate>
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-1.5">Adresse e-mail</label>
          <input type="email" id="email" name="email" required autocomplete="email" placeholder="prenom.nom@cem.mg"
                 class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cem-red/30 focus:border-cem-red outline-none transition-colors text-sm">
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label for="password" class="block text-sm font-semibold text-gray-700">Mot de passe</label>
          </div>
          <input type="password" id="password" name="password" required autocomplete="current-password"
                 placeholder="••••••••"
                 class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cem-red/30 focus:border-cem-red outline-none transition-colors text-sm">
        </div>

        <p id="msg-erreur" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"></p>

        <button type="submit"
                class="w-full bg-cem-red hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm">
          Se connecter
        </button>

        <p class="text-center text-sm text-gray-600">
          Pas encore de compte ?
          <a href="register.html" class="font-semibold text-cem-red hover:underline">Créer un compte</a>
        </p>
      </form>

      <!-- Compte de démonstration -->
      <div class="px-8 pb-8">
        <div class="bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-xs text-gray-600">
          <p class="font-semibold text-gray-700 mb-1">Compte de démonstration</p>
          <p>E-mail : <code class="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">admin@cem.mg</code></p>
          <p>Mot de passe : <code class="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">admin123</code></p>
        </div>
      </div>
    </div>

    <p class="text-center text-xs text-gray-400 mt-6">© <span id="annee"></span> Caisse d'Epargne de Madagascar — Gestion des attestations</p>
  </div>
</template>

<script lang="ts" setup>
import logo from '@/assets/logo.jpg';
</script>