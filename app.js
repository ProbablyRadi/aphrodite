// Application entry point: routing, appearance and responsive navigation.
function route() {
    let path = 'home';
    try { path = decodeURIComponent(location.hash.slice(1) || 'home'); }
    catch (error) { /* Invalid URLs open the character selection. */ }
    let [id, year, section, ...extra] = path.split('/');
    const character = Object.hasOwn(DATA, id) ? DATA[id] : null;
    const targets = { results: 'race-results', standings: 'championship-standings',
        hypercar: 'hypercar-standings', gt3: 'gt3-standings', gte: 'gte-standings', lmp2: 'lmp2-standings',
        gtepro: 'gtepro-standings', gteam: 'gteam-standings', races: 'individual-races', overview: 'season-overview' };
    const raceSection = character && year && Object.hasOwn(WEC_SEASONS[id], year)
        && WEC_SEASONS[id][year].calendar.some(race => section === `race-${race.id}`);
    const valid = !extra.length && (!year || (character && Object.hasOwn(WEC_SEASONS[id], year)))
        && (!section || (year && (Object.hasOwn(targets, section) || raceSection)))
        && !path.endsWith('/');
    if (!valid || (!character && id !== 'home') || (id === 'home' && year))
        id = 'home';
    document.body.classList.toggle('is-home', id === 'home');
    characterSelect.value = id === 'home' ? '' : id;
    if (id === 'home') home();
    else if (year) season(id, year, section);
    else player(id);
    document.title = id === 'home' ? 'Le Mans Ultimate Career Wiki'
        : DATA[id].name + (year ? ' · ' + year : ' · Overview') + ' | Le Mans Ultimate';
    window.scrollTo(0, 0);
    if (id !== 'home' && section) {
        document.querySelector('#' + (Object.hasOwn(targets, section) ? targets[section] : section))?.scrollIntoView();
    }
}
addEventListener('hashchange', route);
function updateTopPlayerShortcuts() {
    const hash = (location.hash || '#home').toLowerCase();
    const isMain = hash === '' || hash === '#main' || hash === '#home';
    document.querySelectorAll('.site-navigation a[data-page]').forEach(link => {
        link.style.display = isMain ? '' : 'none';
    });
}

// Browser controls.
const app = document.querySelector('#app'), nav = document.querySelector('#seasonNav');
const characterSelect = document.querySelector('#characterSelect');
const themeSelect = document.querySelector('#themeSelect');
const THEMES = [
    'light', 'dracula', 'glass'
];
// Native disclosure keeps the complete career archive available on phones.
const careerMenu = document.querySelector('#careerMenu');
if (careerMenu) {
    const mobileLayout = window.matchMedia('(max-width: 760px)');
    const syncCareerMenu = () => { careerMenu.open = !mobileLayout.matches; };
    syncCareerMenu();
    mobileLayout.addEventListener('change', syncCareerMenu);
    careerMenu.addEventListener('click', event => {
        if (mobileLayout.matches && event.target.closest('a')) {
            careerMenu.open = false;
            app.focus({ preventScroll: true });
        }
    });
    window.addEventListener('hashchange', () => {
        if (mobileLayout.matches)
            careerMenu.open = false;
    });
}
function setTheme(mode) {
    if (!THEMES.includes(mode))
        mode = 'light';
    document.body.classList.toggle('theme-terminal', mode === 'dracula');
    document.body.classList.toggle('theme-dracula', mode === 'dracula');
    document.body.classList.toggle('theme-glass', mode === 'glass');
    document.body.classList.toggle('font-proggy', mode === 'dracula');
    if (themeSelect) {
        themeSelect.value = mode;
    }
    try {
        localStorage.setItem('lmu-wec-theme', mode);
    }
    catch (error) {
    }
}
let initialTheme = 'light';
try {
    initialTheme = localStorage.getItem('lmu-wec-theme') || 'light';
}
catch (error) {
}
setTheme(initialTheme);
if (themeSelect)
    themeSelect.addEventListener('change', () => setTheme(themeSelect.value));
if (characterSelect)
    characterSelect.addEventListener('change', () => {
        const selectedCharacter = characterSelect.value;
        // The placeholder option is also a shortcut back to the home page.
        if (!selectedCharacter) {
            location.hash = '#home';
            return;
        }
        if (DATA[selectedCharacter])
            location.hash = `#${selectedCharacter}`;
    });

// Rendering enhancements.
const renderObserver = new MutationObserver(() => {
    enhanceTables(app);
});

renderObserver.observe(app, {
    childList: true,
    subtree: true
});

renderObserver.observe(nav, {
    childList: true,
    subtree: true
});

route();
updateTopPlayerShortcuts();
window.addEventListener('hashchange', updateTopPlayerShortcuts);

