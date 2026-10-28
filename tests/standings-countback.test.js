const test = require('node:test');
const assert = require('node:assert/strict');
const { createSite, plain } = require('./helpers/site');

test('Zero-point Hypercars rank Alpine #35, Porsche #6, Peugeot #93 by completed results', () => {
    const site = createSite();
    site.evaluate(`WEC_SEASONS.rens['2024'].calendar[3].inProgress = true; for (const row of WEC_SEASONS.rens['2024'].standings.hypercar) row.points -= WEC_SEASONS.rens['2024'].calendar[3].results.find(result => result.entrant === row.entrant).awardedPoints;`);
    const original = plain(site.evaluate('WEC_SEASONS.rens["2024"].standings.hypercar'));
    const ranked = plain(site.evaluate('rankedStandings(WEC_SEASONS.rens["2024"], "hypercar")'));
    assert.deepEqual(ranked.slice(-3).map(row => [row.position, row.entrant]), [[17, 'hy-35'], [18, 'hy-6'], [19, 'hy-93']]);
    assert.deepEqual(plain(site.evaluate('WEC_SEASONS.rens["2024"].standings.hypercar')), original);
    site.navigate('#rens/2024');
    const table = site.evaluate('standingsTable(WEC_SEASONS.rens["2024"], "hypercar", "rens", "2024")');
    assert(table.indexOf('>#35</td>') < table.indexOf('>#6</td>'));
    assert(table.indexOf('>#6</td>') < table.indexOf('>#93</td>'));
});

test('Points and full place countback resolve ties including second-best and non-scoring results', () => {
    const site = createSite();
    const compare = (a, b) => site.evaluate(`compareChampionshipRecords(${JSON.stringify(a)}, ${JSON.stringify(b)})`);
    assert(compare({ points: 1, finishes: [10] }, { points: 0, finishes: [1] }) < 0);
    assert(compare({ points: 25, finishes: [1, 'DNF'] }, { points: 25, finishes: [2, 3] }) < 0);
    assert(compare({ points: 10, finishes: [4, 4, 10] }, { points: 10, finishes: [4, 5, 6] }) < 0);
    assert(compare({ points: 0, finishes: [14, 14, 19] }, { points: 0, finishes: [14, 18, 18] }) < 0);
    assert(compare({ points: 0, finishes: [12] }, { points: 0, finishes: ['DNF', null, 0] }) < 0);
    assert.equal(compare({ points: 0, finishes: ['DNF', null] }, { points: 0, finishes: [] }), 0);
    assert.equal(compare({ points: 20, finishes: [2, 5] }, { points: 20, finishes: [5, 2] }), 0);
});

test('Live results cannot change countback, and analytics use the same tie ordering', () => {
    const site = createSite();
    site.evaluate(`WEC_SEASONS.rens['2024'].standings.hypercar.find(row => row.entrant === 'hy-93').finishes['long-beach'] = 1;`);
    const ranked = plain(site.evaluate('rankedStandings(WEC_SEASONS.rens["2024"], "hypercar")'));
    assert.equal(ranked.at(-1).entrant, 'hy-93');
    for (const category of ['hypercar', 'gt3']) {
        const standingsOrder = plain(site.evaluate(`rankedStandings(WEC_SEASONS.rens['2024'], '${category}').map(row => row.entrant)`));
        const analyticsOrder = plain(site.evaluate(`pointsProgression(WEC_SEASONS.rens['2024'], '${category}').series.map(row => row.id)`));
        assert.deepEqual(analyticsOrder, standingsOrder);
    }
    const gt3 = plain(site.evaluate('rankedStandings(WEC_SEASONS.rens["2024"], "gt3")'));
    assert(gt3.findIndex(row => row.entrant === 'gt-85') < gt3.findIndex(row => row.entrant === 'gt-27'));
});
