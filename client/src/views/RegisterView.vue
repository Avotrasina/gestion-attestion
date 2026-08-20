<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <!-- En-tête -->
      <div class="px-8 pt-8 pb-6 text-center border-b border-gray-100">
        <img :src="logo" alt="Caisse d'Epargne Madagascar"
             class="h-14 mx-auto mb-4 object-contain"
             onerror="this.onerror=null;this.src='https://sc04.alicdn.com/kf/Sd4033d7e084746d289d4d1e9ddc77d7ar.jpg'">
        <h1 class="text-xl font-bold text-cem-dark">Créer un compte</h1>
        <p class="text-sm text-gray-500 mt-1">Accédez à la gestion des demandes de stage et d'attestations</p>
      </div>

      <!-- Formulaire -->
      <form id="form-register" class="p-8 space-y-4" novalidate>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="nom" class="block text-sm font-semibold text-gray-700 mb-1.5">Nom</label>
            <input type="text" id="nom" required placeholder="Rakoto"
                   class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cem-red/30 focus:border-cem-red outline-none transition-colors text-sm">
          </div>
          <div>
            <label for="prenom" class="block text-sm font-semibold text-gray-700 mb-1.5">Prénom</label>
            <input type="text" id="prenom" required placeholder="Hery"
                   class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cem-red/30 focus:border-cem-red outline-none transition-colors text-sm">
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-1.5">Adresse e-mail</label>
          <input type="email" id="email" required autocomplete="email" placeholder="prenom.nom@cem.mg"
                 class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cem-red/30 focus:border-cem-red outline-none transition-colors text-sm">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
            <input type="password" id="password" required minlength="6" placeholder="••••••••"
                   class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cem-red/30 focus:border-cem-red outline-none transition-colors text-sm">
            <p class="text-[11px] text-gray-400 mt-1">6 caractères minimum</p>
          </div>
          <div>
            <label for="password2" class="block text-sm font-semibold text-gray-700 mb-1.5">Confirmation</label>
            <input type="password" id="password2" required placeholder="••••••••"
                   class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cem-red/30 focus:border-cem-red outline-none transition-colors text-sm">
          </div>
        </div>

        <div>
          <label for="role" class="block text-sm font-semibold text-gray-700 mb-1.5">Rôle</label>
          <select id="role"
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-cem-red/30 focus:border-cem-red outline-none transition-colors text-sm">
            <option value="Agent">Agent</option>
            <option value="Administrateur">Administrateur</option>
          </select>
        </div>

        <p id="msg-erreur" class="hidden text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"></p>

        <button type="submit"
                class="w-full bg-cem-red hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm">
          Créer le compte
        </button>

        <p class="text-center text-sm text-gray-600">
          Déjà un compte ?
          <RouterLink :to="{name: 'login'}"  class="font-semibold text-cem-red hover:underline">Se connecter</RouterLink>
        </p>
      </form>
    </div>

    <p class="text-center text-xs text-gray-400 mt-6">© <span id="annee"></span> Caisse d'Epargne de Madagascar — Gestion des attestations</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import logo from "@/assets/logo.jpg";

const hasError = ref<boolean>(false);
</script>
