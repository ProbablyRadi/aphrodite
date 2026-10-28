const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createSite, plain, root, read, scriptFiles } = require('./helpers/site');

test('Character selection, all overview routes and each character’s season routes work', () => {
    const site = createSite();
    site.startApp();
    assert.equal((site.app.innerHTML.match(/class="home-player-tile"/g) || []).length, 3);
    assert.doesNotMatch(site.app.innerHTML, /<img|url\(/);
    const names = { jordan: 'Jordan Vale', rens: 'Rens Adisea', vasi: 'Vasiliki Dimitriou' };
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
            if (id === 'vasi' && year === '2023') {
                assert(!site.app.innerHTML.includes('href="#vasi/2023"'));
                assert(!site.nav.innerHTML.includes('href="#vasi/2023"'));
                continue;
            }
            assert(site.nav.innerHTML.includes(`href="#${id}/${year}"`));
            site.navigate(`#${id}/${year}`);
            assert.match(site.app.innerHTML, new RegExp(`${year} race season`));
            if (id !== 'rens' || year !== '2024') assert.match(site.app.innerHTML, /No race data has been added/);
            assert.match(site.app.innerHTML, /Championship standings/);
            assert(site.nav.innerHTML.includes(`href="#${id}/${year}" class="active" aria-current="page"`));
            assert.equal(site.document.title, `${name} · ${year} | Le Mans Ultimate`);
        }
    }
});

test('Personal career totals remain unreported; equipment does not invent results', () => {
    const site = createSite();
    const records = plain(site.evaluate('DATA'));
    for (const character of Object.values(records)) {
        assert.deepEqual(Object.keys(character.seasons), ['2022', '2023', '2024', '2025', '2026']);
        for (const [year, record] of Object.entries(character.seasons)) {
            if (year === '2022') continue; // Historical #56 totals are now supplied.
            for (const key of ['position', 'starts', 'wins', 'podiums', 'poles', 'points']) assert.equal(record[key], null);
        }
    }
    assert.equal(site.evaluate('displayValue(null)'), '—');
    assert.equal(site.evaluate('displayValue(0)'), '0');
    assert.equal(site.evaluate('displayValue("<source>")'), '&lt;source&gt;');
});

test('Rens owns the GT career and transferred 2024 results; Jordan owns the Hypercar history', () => {
    const site = createSite();
    const histories = plain(site.evaluate(`Object.fromEntries(['rens', 'jordan'].map(id => [id, Object.values(DATA[id].seasons).map(row => [row.number, row.car, row.category])]))`));
    assert.deepEqual(histories.rens, [
        ['56', 'Porsche 911 RSR', 'GTE'],
        ['56', 'Porsche 911 RSR', 'GTE'], ['55', 'Ferrari 296 GTB', 'GT3'],
        ['21', 'Ferrari 296 GTB', 'GT3'], ['91', 'Porsche 911 GT3', 'GT3']
    ]);
    assert.deepEqual(histories.jordan, [
        ['22', 'Oreca 07', 'LMP2'],
        ['3', 'Cadillac V-Series.R', 'Hypercar'], ['3', 'Cadillac V-Series.R', 'Hypercar'],
        ['38', 'Cadillac V-Series.R', 'Hypercar'], ['8', 'Toyota TR010', 'Hypercar']
    ]);
    site.navigate('#rens/2024');
    assert(!site.app.innerHTML.includes('Jordan Vale'));
    assert.match(site.app.innerHTML, /alt="Netherlands"[^>]*><\/td><td class="wec-overview-winner">Rens Adisea<\/td>/);
    assert.equal(site.evaluate(`WEC_SEASONS.rens['2024'].calendar.reduce((n, race) => n + race.results.length, 0)`), 120);
    assert.equal(site.evaluate(`WEC_SEASONS.jordan['2024'].calendar.length`), 0);
});

test('Rens profile totals combine season summaries with completed results without counting live races', () => {
    const site = createSite();
    assert.deepEqual(plain(site.evaluate('driverCareerTotals("rens")')), { starts: 9, wins: 2, podiums: 4, poles: null });
    site.evaluate('DATA.rens.seasons["2024"].starts = 3; DATA.rens.seasons["2024"].wins = 2; DATA.rens.seasons["2024"].podiums = 2; DATA.rens.seasons["2024"].poles = 1');
    assert.deepEqual(plain(site.evaluate('driverCareerTotals("rens")')), { starts: 9, wins: 2, podiums: 4, poles: 1 });
    for (const id of ['rens', 'jordan', 'vasi']) {
        site.navigate('#' + id);
        assert(!site.app.innerHTML.includes('Fastest laps'));
    }
    site.navigate('#rens');
    assert(site.app.innerHTML.includes('Vista AF Corse'));
    assert(site.app.innerHTML.includes('Dutch'));
});

test('The selected career season expands its race links and marks the target race', () => {
    const site = createSite();
    site.navigate('#rens/2024');
    assert.equal((site.nav.innerHTML.match(/<li>/g) || []).length, 8);
    assert(site.nav.innerHTML.includes('1. Losail'));
    assert(site.nav.innerHTML.includes('8. Fuji'));
    assert(site.nav.innerHTML.includes('href="#rens/2024/race-spa"'));
    site.navigate('#rens/2024/race-spa');
    assert(site.nav.innerHTML.includes('href="#rens/2024/race-spa" class="active" aria-current="location"'));
    assert(site.app.innerHTML.includes('id="race-spa"'));
    for (const hash of ['#rens', '#rens/2025', '#jordan/2024', '#vasi/2024']) {
        site.navigate(hash);
        assert(!site.nav.innerHTML.includes('career-nav-races'), hash);
    }
});

test('Invalid and retired URLs fall back to home; season section URLs remain usable', () => {
    const site = createSite();
    for (const hash of ['#unknown', '#vasi/2023', '#vasi/2023/results', '#jordan/2027', '#jordan/stats', '#jordan/analysis', '#gallery', '#jordan/2023/nope', '#jordan/2023/results/extra', '#%', '#__proto__', '#jordan/__proto__']) {
        site.navigate(hash);
        assert(site.activeClasses.has('is-home'), hash);
        assert.equal(site.characterSelect.value, '');
    }
    for (const section of ['results', 'standings']) {
        site.navigate(`#jordan/2023/${section}`);
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
    assert.deepEqual(scriptFiles(), ['data/base.js', 'data/2023.js', 'data/2024.js', 'js/shared.js', 'js/profile.js', 'js/season-overview.js', 'js/season.js', 'js/tables.js', 'js/home.js', 'app.js']);
    for (const file of ['data/jordan.js', 'data/rens.js', 'data/vasi.js', 'data/gallery.js', 'assets/portraits', 'assets/character-select', 'assets/gallery', 'assets/stadium-glass-bg.jpg', 'js/matches.js']) {
        assert(!fs.existsSync(path.join(root, file)), file);
    }
});
