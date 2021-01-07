import { createApp } from 'vue';
import { createWebHashHistory, createRouter } from 'vue-router';

import './style.css';
import App from './App.vue';
import LandingWelcome from './components/LandingWelcome.vue';
import LoadingPhrases from './components/LoadingPhrases.vue';
import LatinPhrase from './components/LatinPhrase.vue';
import { getRandomPhraseIndex, nukePhrases } from './services/phrases';

const routes = [
    { path: '/', component: LandingWelcome },
    { path: '/loading', component: LoadingPhrases },
    { path: '/random', redirect: () => "/" + getRandomPhraseIndex() },
    { path: '/nuke', redirect: () => {
        nukePhrases();
        return "/loading";
    } }, 
    { path: '/:index', component: LatinPhrase }, 
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

createApp(App).use(router).mount('#app');
