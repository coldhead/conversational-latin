<template>
    <article v-if="phrase">
        <dl>
            <dt>{{ phrase.phrase }}</dt>
            <dd>{{ phrase.translation }}</dd>
        </dl>

        <RouterLink to="/random" id="random">
            <!-- <span v-html="'&#' + (9856 + ~~ (Math.random() * 6)) + ';'"></span>
            <span v-html="'&#' + (9856 + ~~ (Math.random() * 6)) + ';'"></span> -->
            <span v-html="die1"></span>
            <span v-html="die2"></span>
        </RouterLink>

        <p class="notes" v-if="phrase.notes">
            {{ phrase.notes  }}
            <a :href="'//en.wikipedia.org/' + phrase.url" v-if="phrase.url">
                More at Wikipedia
            </a>
        </p>
    </article>
    <article v-else>
        <h2>Collating phrases, please wait...</h2>
        <p class="notes">Latin phrases are being fetched from Wikipedia. This is a
        one-time thing, and the phrases will be stored locally for your
        future convenience. Thank you for your patience.</p>
    </article>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { ensurePhrases, getPhrase } from '../services/phrases';

const route = useRoute();
const router = useRouter();

const rollDN = (N) => {
    return () => Math.floor(Math.random() * N) + 1;
};

const rollD6 = rollDN(6);

const dieFace = () => '&#' + (9855 + rollD6()) + ';';

const phrase = ref(null);
const die1 = ref(dieFace())
const die2 = ref(dieFace())

ensurePhrases().then(() => {
    const index = route.params.index;
    phrase.value = getPhrase(index);
});

watch(
  () => route.params.index,
  (newIndex, oldIndex) => {
    const index = route.params.index;
    phrase.value = getPhrase(index);
    die1.value = dieFace();
    die2.value = dieFace();
  }
)
</script>

<style></style>