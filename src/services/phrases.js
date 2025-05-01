import fetchJsonp from "fetch-jsonp";
import Phrase from "../models/Phrase";

const loadLocalStoragePhrases = () => {
    const json = localStorage.getItem('latin-phrases');
    let data;
    if (json) {
        try {
            data = JSON.parse(json);
        } catch (e) {
            localStorage.removeItem('latin-phrases');
            data = undefined;
        }
    }

    return data || [];
};

const PHRASES = loadLocalStoragePhrases();

console.table(PHRASES);

const fetchPhraseData = async () => {
    const params = {
        action: 'parse',
        page: 'List_of_Latin_phrases_(full)',
        format: 'json',
        prop: 'text'
    };
    const urlSearchParams = new URLSearchParams(params);
    const phrasesURL = '//en.wikipedia.org/w/api.php?' + urlSearchParams.toString();
    const response = await fetchJsonp(phrasesURL);
    return response.json();
};

const importPhrases = async () => {
    const data = await fetchPhraseData();
    const page = data.parse.text['*'];
    const node = document.createElement('div');
    node.innerHTML = page;
    const rows = node.querySelectorAll('.wikitable tr');
    const tidy = (str) => {
        if (!str) return;
        const p = document.createElement('p');
        p.innerText = str; // Magic to remove \n from strings
        return p.innerText;
    }
    rows.forEach((row, i) => {
        const cells = row.querySelectorAll('td');
        // Skip empty cells or cells without translations
        if (cells.length === 0) return;
        if (cells[1] === undefined) return;
        // Wikipedia has inline <style> that appears in the innerText of elements.
        // We have to remove any such style -- it's not Latin.
        const inlineStyles = cells[0].querySelectorAll('style');
        inlineStyles.forEach((style) => style.parentNode.removeChild(style)); // oh boy
        const phrase = new Phrase(
            cells[0].innerText, // phrase
            cells[1].innerText, // translation
            cells[0].querySelector('a')?.getAttribute('href'), // link to a full article
            tidy(cells[2]?.innerText), // notes
        );
        PHRASES.push(phrase);
    });
};

const ensurePhrases = async () => {
    if (PHRASES && PHRASES.length > 0) {
        return;
    }
    await importPhrases();
    localStorage.setItem('latin-phrases', JSON.stringify(PHRASES));
}

const getPhrase = (n) => {
    return PHRASES[n];
};

const getRandomPhraseIndex = () => {
    return Math.floor(Math.random() * PHRASES.length);
}

const getPhrasesCount = () => {
    return PHRASES.length;
}

const nukePhrases = () => {
    localStorage.removeItem('latin-phrases');
};

export {
    importPhrases,
    ensurePhrases,
    getPhrase,
    getRandomPhraseIndex,
    getPhrasesCount,
    nukePhrases,
};
