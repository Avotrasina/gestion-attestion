<template>
	<div class="w-full max-w-md">
		<!-- Carte -->
		<div
			class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
		>
			<!-- En-tête -->
			<div class="px-8 pt-8 pb-6 text-center border-b border-gray-100">
				<img
					:src="logo"
					alt="Caisse d'Epargne Madagascar"
					class="h-14 mx-auto mb-4 object-contain"
					onerror="
						this.onerror = null;
						this.src =
							'https://sc04.alicdn.com/kf/Sd4033d7e084746d289d4d1e9ddc77d7ar.jpg';
					"
				/>
				<h1 class="text-xl font-bold text-cem-dark">Connexion</h1>
				<p class="text-sm text-gray-500 mt-1">
					Gestion des demandes de stage et d'attestations
				</p>
			</div>

			<!-- Formulaire -->
			<form
				@submit.prevent="seConnecter"
				id="form-login"
				class="p-8 space-y-5"
				novalidate
			>
				<div>
					<label
						for="email"
						class="block text-sm font-semibold text-gray-700 mb-1.5"
						>Adresse e-mail</label
					>
					<input
						v-model="userForm.email"
						:aria-invalid="hasError"
						:class="{ 'border-red-500': hasError }"
						type="email"
						id="email"
						name="email"
						required
						autocomplete="email"
						placeholder="prenom.nom@cem.mg"
						class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cem-red/30 focus:border-cem-red outline-none transition-colors text-sm"
					/>
				</div>

				<div>
					<div class="flex items-center justify-between mb-1.5">
						<label
							for="password"
							class="block text-sm font-semibold text-gray-700"
							>Mot de passe</label
						>
					</div>
					<input
						v-model="userForm.mdp"
						:aria-invalid="hasError"
						:class="{ 'border-red-500': hasError }"
						type="password"
						id="password"
						name="password"
						required
						autocomplete="current-password"
						placeholder="••••••••"
						class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cem-red/30 focus:border-cem-red outline-none transition-colors text-sm"
					/>
				</div>

				<p
					v-if="hasError"
					id="msg-erreur"
					role="alert"
					class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
				>
					{{ error_msg }}
				</p>

				<button
					type="submit"
					:disabled="isSubmitting"
					class="w-full bg-cem-red hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
				>
					{{ isSubmitting ? "Connexion..." : "Se connecter" }}
				</button>

				<p class="text-center text-sm text-gray-600">
					Pas encore de compte ?
					<RouterLink
						:to="{ name: 'register' }"
						href="register.html"
						class="font-semibold text-cem-red hover:underline"
					>
						Créer un compte
					</RouterLink>
				</p>
			</form>

			<!-- Compte de démonstration -->
			<div class="px-8 pb-8">
				<div
					class="bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-3 text-xs text-gray-600"
				>
					<p class="font-semibold text-gray-700 mb-1">
						Compte de démonstration
					</p>
					<p>
						E-mail :
						<code
							class="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200"
							>admin@cem.mg</code
						>
					</p>
					<p>
						Mot de passe :
						<code
							class="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200"
							>admin123</code
						>
					</p>
				</div>
			</div>
		</div>

		<p class="text-center text-xs text-gray-400 mt-6">
			© <span id="annee">{{ new Date().getFullYear() }}</span> Caisse d'Epargne
			de Madagascar - Gestion des attestations
		</p>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios, { isAxiosError } from "axios";
import logo from "@/assets/logo.jpg";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const API_URL_BASE = import.meta.env.VITE_API_URL_BASE?.replace(/\/$/, "");
const hasError = ref<boolean>(false);
const error_msg = ref<string>("");
const isSubmitting = ref<boolean>(false);

const userForm = ref({ email: "", mdp: "" });

function validateForm() {
	const email = userForm.value.email.trim();
	if (!email) {
		error_msg.value = "Veuillez renseigner votre adresse e-mail.";
		return false;
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		error_msg.value = "Veuillez renseigner une adresse e-mail valide.";
		return false;
	}

	if (!userForm.value.mdp) {
		error_msg.value = "Veuillez renseigner votre mot de passe.";
		return false;
	}

	if (userForm.value.mdp.length < 8) {
		error_msg.value = "Le mot de passe doit contenir au moins 8 caractères.";
		return false;
	}

	return true;
}

async function seConnecter() {
	hasError.value = false;
	error_msg.value = "";

	if (!validateForm()) {
		hasError.value = true;
		return;
	}

	if (!API_URL_BASE) {
		hasError.value = true;
		error_msg.value = "Le service de connexion n'est pas configuré.";
		return;
	}

	isSubmitting.value = true;
	try {
		const res = await axios.post(`${API_URL_BASE}/auth/login`, {
			email: userForm.value.email.trim().toLowerCase(),
			mdp: userForm.value.mdp,
		});
		const { user, token } = res.data.data ?? {};

		if (!user || !token) {
			throw new Error("Réponse de connexion invalide");
		}

		authStore.login(user, token);
		await router.push({ name: "home" });
	} catch (error: unknown) {
		hasError.value = true;
		error_msg.value = isAxiosError(error)
			? (error.response?.data?.message ??
				"Impossible de contacter le service de connexion.")
			: "Une erreur est survenue pendant la connexion. Veuillez réessayer.";
	} finally {
		isSubmitting.value = false;
	}
}
</script>
