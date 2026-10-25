const test = require('node:test');
const assert = require('node:assert/strict');
const { createSite, plain } = require('./helpers/site');

test('Jordan Le Mans stays in progress with only the nine supplied retirements and no invented finishers', () => {
    const site = createSite();
    const race = plain(site.evaluate('WEC_SEASONS.jordan["2024"].calendar[3]'));
    assert.equal(race.name, 'Le Mans 8 Hours');
    assert.equal(race.inProgress, true);
    assert.deepEqual(race.results.map(row => [row.entrant, row.laps]), [
        ['hy-99', 66], ['gt-86', 33], ['gt-54', 23], ['gt-91', 16],
        ['gt-82', 9], ['hy-11', 5], ['gt-777', 5], ['gt-60', 4], ['gt-27', 2]
    ]);
    for (const row of race.results) {
        assert.equal(row.status, 'DNF');
        assert.equal(row.position, null);
        assert.equal(row.classPosition, null);
        assert.equal(row.gap, null);
    }
    assert.deepEqual(plain(site.evaluate('WEC_SEASONS.jordan["2024"].entrants["gt-86"]')), {
        number: '86', team: 'GR Racing', country: null, car: 'Ferrari', category: 'gt3'
    });
    assert.equal(site.evaluate('raceWinner(WEC_SEASONS.jordan["2024"], WEC_SEASONS.jordan["2024"].calendar[3], "hypercar")'), null);
    assert.equal(site.evaluate('raceWinner(WEC_SEASONS.jordan["2024"], WEC_SEASONS.jordan["2024"].calendar[3], "lmp2")'), null);
    // No entrant standings were invented for a Le Mans-only entry.
    assert.equal(site.evaluate('WEC_SEASONS.jordan["2024"].standings.gt3.length'), 18);
    const markup = site.evaluate('individualRaceTable(WEC_SEASONS.jordan["2024"], WEC_SEASONS.jordan["2024"].calendar[3])');
    assert(markup.includes('alt="France"'));
    assert(markup.includes('In progress'));
    assert(markup.includes('Hypercar, LMP2 and GT3 classifications are still in progress'));
    assert.equal((markup.match(/>DNF<\/td>/g) || []).length, 9);
    assert.equal((markup.match(/<td class="wec-gap"><\/td>/g) || []).length, 9);
    assert(!markup.includes('finish-gold'));
    site.navigate('#jordan/2024/race-le-mans');
    assert(site.app.innerHTML.includes('Le Mans 8 Hours'));
    assert(site.app.innerHTML.includes('Provisional'));
    for (const id of ['rens', 'vasi']) {
        site.navigate(`#${id}/2024`);
        assert(!site.app.innerHTML.includes('Le Mans 8 Hours'));
        assert(!site.app.innerHTML.includes('GR Racing'));
    }
});
