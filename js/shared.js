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
    return `<img class="country-flag" src="${esc(COUNTRY_FLAGS[country])}" alt="${esc(country)}" title="${esc(country)}" loading="lazy" width="24" height="16">`;
}
