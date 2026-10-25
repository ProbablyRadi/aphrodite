// Escape source data before including it in page markup.
const esc = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const displayValue = value => value == null || value === '' ? '—' : esc(value);

// File keys are country names, so flags do not depend on platform emoji fonts.
const COUNTRY_FLAGS = Object.fromEntries([
    'Argentina', 'Belgium', 'Denmark', 'France', 'Germany', 'Italy', 'Japan',
    'Netherlands', 'Qatar', 'Spain', 'United Kingdom', 'United States'
].map(country => [country, `assets/flags/${country.replace(/ /g, '-')}.png`]));

function countryFlag(country) {
    if (!country) return '';
    if (!Object.hasOwn(COUNTRY_FLAGS, country)) return esc(country);
    return `<img class="country-flag" src="${esc(COUNTRY_FLAGS[country])}" alt="${esc(country)}" title="${esc(country)}" loading="lazy" width="36" height="24">`;
}

const MANUFACTURER_BADGES = Object.fromEntries([
    ['Toyota', 'toyota'], ['BMW', 'bmw'], ['Peugeot', 'peugeot'], ['Alpine', 'alpine'],
    ['Ferrari', 'ferrari'], ['Porsche', 'porsche'], ['Cadillac', 'cadillac'],
    ['Lamborghini', 'lamborghini'], ['Isotta Fraschini', 'isotta-fraschini'],
    ['Aston Martin', 'aston-martin'], ['Corvette', 'chevrolet-corvette'],
    ['Lexus', 'lexus'], ['McLaren', 'mclaren'], ['Ford', 'ford']
].map(([make, file]) => [make, `assets/manufacturers/${file}.png`]));

function manufacturerBadge(make) {
    if (!make || !Object.hasOwn(MANUFACTURER_BADGES, make)) return '';
    return `<img class="manufacturer-badge" src="${esc(MANUFACTURER_BADGES[make])}" alt="" title="${esc(make)}" loading="lazy" width="40" height="32">`;
}

// Countback: points, then number of firsts, seconds, thirds, etc. Comparing
// sorted finish lists gives the same order, including non-scoring places.
// Unclassified results and unknown positions never count as numeric finishes.
function compareChampionshipRecords(a, b) {
    if (a.points == null || b.points == null) {
        if (a.points != null) return -1;
        if (b.points != null) return 1;
    } else if (a.points !== b.points) return b.points - a.points;
    const valid = value => Number.isInteger(value) && value > 0;
    const finishesA = a.finishes.filter(valid).slice().sort((x, y) => x - y);
    const finishesB = b.finishes.filter(valid).slice().sort((x, y) => x - y);
    for (let i = 0; i < Math.max(finishesA.length, finishesB.length); i++) {
        const difference = (finishesA[i] ?? Infinity) - (finishesB[i] ?? Infinity);
        if (difference) return difference;
    }
    // Exact ties keep the supplied order through stable sorting.
    return 0;
}

function rankedStandings(championship, category) {
    const completed = championship.calendar.filter(race => race.completed === true && !race.inProgress);
    return championship.standings[category].slice().sort((a, b) => compareChampionshipRecords(
        { points: a.points, finishes: completed.map(race => a.finishes[race.id]) },
        { points: b.points, finishes: completed.map(race => b.finishes[race.id]) }
    )).map((row, index) => ({ ...row, position: index + 1 }));
}
