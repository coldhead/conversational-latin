<template>
    <article>
        <h1>Conversational Latin</h1>
        <p class="notes">Conversational Latin lets you browse Latin phrases and their English translations from Wikipedia. Phrases are stored on your device for your continued enjoyment whilst offline.</p>
        <RouterLink to="/loading" custom v-slot="{ navigate }">
            <button @click="navigate" @keypress.enter="navigate" role="link">
                Click here to load the phrases
            </button>
        </RouterLink>
    </article>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router';
import { getPhrasesCount } from '../services/phrases';

const router = useRouter();

if (getPhrasesCount() > 0) {
    router.push('/random');
}
</script>

<style></style>
