const test = require('node:test');
const assert = require('node:assert/strict');
const { createSite, plain } = require('./helpers/site');

test('All 37 cumulative entrant totals reproduce the supplied points after Le Mans', () => {
    const site = createSite();
    for (const category of ['hypercar', 'gt3']) {
        const model = plain(site.evaluate(`pointsProgression(WEC_SEASONS.rens['2024'], '${category}')`));
        const standings = plain(site.evaluate(`WEC_SEASONS.rens['2024'].standings.${category}`));
        assert.deepEqual(model.races.map(race => race.id), ['qatar', 'monza', 'spa', 'le-mans']);
        assert.equal(model.series.length, standings.length);
        for (const standing of standings) {
            const row = model.series.find(row => row.id === standing.entrant);
            assert.equal(row.total, standing.points, standing.entrant);
            assert(row.points.every((points, i) => !i || points >= row.points[i - 1]));
        }
    }
    assert.deepEqual(plain(site.evaluate(`pointsProgression(WEC_SEASONS.rens['2024'], 'gt3').series.find(row => row.id === 'gt-55').points`)), [25, 50, 54, 104]);
    assert.deepEqual(plain(site.evaluate(`pointsProgression(WEC_SEASONS.rens['2024'], 'hypercar').series.find(row => row.id === 'hy-50').points`)), [6, 24, 42, 66]);
});

test('Le Mans doubles class-position points only when complete and excludes live DNFs', () => {
    const site = createSite();
    for (const [place, expected] of [[1, 50], [2, 36], [3, 30], [10, 2], [11, 0]]) {
        assert.equal(site.evaluate(`awardedRacePoints({classPosition: ${place}}, {pointsMultiplier: 2})`), expected);
    }
    assert.equal(site.evaluate(`awardedRacePoints({classPosition: 1, status: 'DNF'}, {pointsMultiplier: 2})`), 0);
    assert.equal(site.evaluate(`WEC_SEASONS.rens['2024'].calendar[3].pointsMultiplier`), 2);
    site.evaluate(`WEC_SEASONS.rens['2024'].calendar[3].inProgress = true;`);
    assert.equal(site.evaluate(`pointsProgression(WEC_SEASONS.rens['2024'], 'gt3').races.length`), 3);
    site.evaluate(`Object.assign(WEC_SEASONS.rens['2024'].calendar[3], { inProgress: false, results: [{ entrant: 'gt-55', position: 39, classPosition: 1, laps: 200 }] });`);
    assert.equal(site.evaluate(`pointsProgression(WEC_SEASONS.rens['2024'], 'gt3').series.find(row => row.id === 'gt-55').total`), 104);
    // Unreported classifications never turn into zero-point results.
    assert.equal(site.evaluate(`pointsProgression(WEC_SEASONS.rens['2024'], 'gt3').series.find(row => row.id === 'gt-46').total`), null);
});

test('Charts share team colours, distinguish team-mates and handle empty selections', () => {
    const site = createSite();
    const rows = plain(site.evaluate(`pointsProgression(WEC_SEASONS.rens['2024'], 'hypercar').series`));
    const a = rows.find(row => row.id === 'hy-50');
    const b = rows.find(row => row.id === 'hy-51');
    assert.equal(a.colour, b.colour);
    assert.notEqual(a.dash, b.dash);
    const markup = site.evaluate(`pointsSvg(WEC_SEASONS.rens['2024'], pointsProgression(WEC_SEASONS.rens['2024'], 'gt3'), ['gt-55'])`);
    assert(markup.includes('Spa: 54 points'));
    assert(markup.includes('Le Mans: 104 points'));
    assert.equal((markup.match(/<circle /g) || []).length, 5);
    assert(!markup.includes('Live · 2×'));
    assert(site.evaluate(`pointsSvg(WEC_SEASONS.rens['2024'], pointsProgression(WEC_SEASONS.rens['2024'], 'gt3'), [])`).includes('Choose at least one entrant'));
});

test('Season overview appears after race results and respects career isolation', () => {
    const site = createSite();
    site.navigate('#rens/2024/overview');
    assert(!site.activeClasses.has('is-home'));
    const markup = site.app.innerHTML;
    assert(markup.indexOf('id="season-overview"') > markup.indexOf('id="race-fuji"'));
    assert(markup.includes('Hypercar points progression'));
    assert(markup.includes('LMGT3 points progression'));
    assert(markup.includes('View cumulative points table'));
    assert(markup.includes('Top 5'));
    for (const id of ['jordan', 'vasi']) {
        site.navigate(`#${id}/2024/overview`);
        assert(site.app.innerHTML.includes('Graphs will appear'));
        assert(!site.app.innerHTML.includes('data-points-category='));
    }
});
