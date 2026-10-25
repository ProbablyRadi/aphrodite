const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createSite, plain, root, read, scriptFiles } = require('./helpers/site');

test('Character selection, all overview routes and all twelve season routes work', () => {
    const site = createSite();
    site.startApp();
    assert.equal((site.app.innerHTML.match(/class="home-player-tile"/g) || []).length, 3);
    assert.doesNotMatch(site.app.innerHTML, /<img|url\(/);
    const names = { rens: 'Rens Adisea', jordan: 'Jordan Vale', vasi: 'Vasiliki' };
    for (const [id, name] of Object.entries(names)) {
        site.characterSelect.value = id;
        site.characterSelect.emit('change');
        assert.equal(site.context.location.hash, '#' + id);
        site.navigate('#' + id);
        assert.match(site.app.innerHTML, new RegExp(name));
        assert.match(site.app.innerHTML, /Career overview/);
        assert.equal(site.characterSelect.value, id);
        assert(!site.activeClasses.has('is-home'));
        for (const year of ['2023', '2024', '2025', '2026']) {
            assert(site.nav.innerHTML.includes(`href="#${id}/${year}"`));
            site.navigate(`#${id}/${year}`);
            assert.match(site.app.innerHTML, new RegExp(`${year} race season`));
            if (id !== 'jordan' || year !== '2024') assert.match(site.app.innerHTML, /No race data has been added/);
            assert.match(site.app.innerHTML, /Championship standings/);
            assert(site.nav.innerHTML.includes(`href="#${id}/${year}" class="active" aria-current="page"`));
            assert.equal(site.document.title, `${name} · ${year} | Le Mans Ultimate`);
        }
    }
});

test('Empty careers contain no invented results; unknown values differ from zero', () => {
    const site = createSite();
    const records = plain(site.evaluate('DATA'));
    for (const character of Object.values(records)) {
        assert.deepEqual(Object.keys(character.seasons), ['2023', '2024', '2025', '2026']);
        for (const record of Object.values(character.seasons)) {
            for (const [key, value] of Object.entries(record)) {
                assert.equal(value, null);
            }
        }
    }
    assert.equal(site.evaluate('displayValue(null)'), '—');
    assert.equal(site.evaluate('displayValue(0)'), '0');
    assert.equal(site.evaluate('displayValue("<source>")'), '&lt;source&gt;');
});

test('Invalid and retired URLs fall back to home; season section URLs remain usable', () => {
    const site = createSite();
    for (const hash of ['#unknown', '#rens/2027', '#rens/stats', '#rens/analysis', '#gallery', '#rens/2023/nope', '#rens/2023/results/extra', '#%', '#__proto__', '#rens/__proto__']) {
        site.navigate(hash);
        assert(site.activeClasses.has('is-home'), hash);
        assert.equal(site.characterSelect.value, '');
    }
    for (const section of ['results', 'standings']) {
        site.navigate(`#rens/2023/${section}`);
        assert.match(site.app.innerHTML, /2023 race season/);
    }
});

test('Appearance switching retains all three themes and is persisted', () => {
    const site = createSite();
    site.startApp();
    for (const theme of ['light', 'dracula', 'glass']) {
        site.themeSelect.value = theme;
        site.themeSelect.emit('change');
        assert.equal(site.evaluate('localStorage.getItem("lmu-wec-theme")'), theme);
        assert.equal(site.activeClasses.has('theme-glass'), theme === 'glass');
        assert.equal(site.activeClasses.has('theme-dracula'), theme === 'dracula');
        site.navigate('#vasi/2026');
        assert.equal(site.themeSelect.value, theme);
    }
});

test('All declared assets exist and the old records and portraits are removed', () => {
    for (const match of read('index.html').matchAll(/(?:src|href)="([^"#]+)"/g)) {
        const file = match[1].split('?')[0];
        assert(fs.existsSync(path.join(root, file)), file);
    }
    assert.deepEqual(scriptFiles(), ['data/base.js', 'data/2024.js', 'js/shared.js', 'js/profile.js', 'js/season.js', 'js/tables.js', 'js/home.js', 'app.js']);
    for (const file of ['data/rens.js', 'data/jordan.js', 'data/vasi.js', 'data/gallery.js', 'assets/portraits', 'assets/character-select', 'assets/gallery', 'assets/stadium-glass-bg.jpg', 'js/matches.js']) {
        assert(!fs.existsSync(path.join(root, file)), file);
    }
});
