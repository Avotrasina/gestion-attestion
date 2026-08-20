<template>
	Welcome, {{ nom }} {{ prenom }}
</template>

<script setup lang="ts">
import {ref} from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const nom = authStore.user?.nom;
const prenom = authStore.user?.prenom;
</script>
