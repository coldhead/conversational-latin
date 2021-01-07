<template>
    <h2>Collating phrases, please wait...</h2>
    <p class="notes">Latin phrases are being fetched from Wikipedia. This is a
    one-time thing, and the phrases will be stored locally for your
    future convenience. Thank you for your patience.</p>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ensurePhrases } from '../services/phrases';

const router = useRouter();

ensurePhrases().then((results) => {
    router.push('/random');
});
</script>

<style></style>