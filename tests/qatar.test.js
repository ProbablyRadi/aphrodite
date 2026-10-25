const test = require('node:test');
const assert = require('node:assert/strict');
const { createSite, plain, read } = require('./helpers/site');

for (const [round, key, name, country] of [
    [0, 'qatar', 'Qatar 4 Hours', 'Qatar'],
    [1, 'monza', 'Monza 4 Hours', 'Italy'],
    [2, 'spa', 'Spa 4 Hours', 'Belgium']
]) test(`Jordan 2024 ${name}: all 37 source rows, exact gaps, classifications and class winners`, () => {
    const site = createSite();
    const championship = plain(site.evaluate('WEC_SEASONS.jordan["2024"]'));
    const race = championship.calendar[round];
    const source = read(`tests/fixtures/jordan-2024-${key}.tsv`).trim().split(/\r?\n/).slice(1);
    assert.equal(race.name, name);
    assert.equal(race.country, country);
    assert.equal(race.results.length, source.length);
    assert.equal(race.results.length, 37);
    source.forEach((line, index) => {
        const [op, p, category, number, laps, gap] = line.split('\t');
        const row = race.results[index];
        const entrant = championship.entrants[row.entrant];
        assert.equal(row.position, op === 'DNF' ? null : Number(op));
        assert.equal(row.status, op === 'DNF' ? 'DNF' : undefined);
        assert.equal(row.classPosition, p === '' ? null : Number(p));
        assert.equal(entrant.category, category === 'HY' ? 'hypercar' : 'gt3');
        assert.equal(entrant.number, number);
        assert.equal(row.laps, Number(laps));
        assert.equal(row.gap, gap);
        const standing = championship.standings[entrant.category].find(item => item.entrant === row.entrant);
        assert.equal(standing.finishes[race.id], row.status || row.classPosition);
    });
    for (const category of ['hypercar', 'gt3']) {
        const winner = race.results.find(row => row.classPosition === 1 && championship.entrants[row.entrant].category === category);
        assert.equal(winner.entrant, race.winners[category].entrant);
    }
    for (const id of ['rens', 'vasi']) {
        site.navigate(`#${id}/2024`);
        assert(!site.app.innerHTML.includes(name));
    }
    const markup = site.evaluate(`individualRaceTable(WEC_SEASONS.jordan['2024'], WEC_SEASONS.jordan['2024'].calendar[${round}])`);
    assert(markup.includes(`alt="${country}"`));
    assert(markup.includes(name));
    assert.equal((markup.match(/>DNF<\/td>/g) || []).length, race.results.filter(row => row.status === 'DNF').length);
});

test('Qatar table has its top-left flag, podium cells, class colours and merged DNF position cells', () => {
    const site = createSite();
    const markup = site.evaluate('individualRaceTable(WEC_SEASONS.jordan["2024"], WEC_SEASONS.jordan["2024"].calendar[0])');
    assert.match(markup, /<caption><span class="wec-race-caption"><span><img[^>]+alt="Qatar"/);
    assert(markup.includes('Qatar 4 Hours'));
    assert(markup.includes('04:01:11.163'));
    assert.equal((markup.match(/class="wec-result-row/g) || []).length, 37);
    assert.equal((markup.match(/class="num finish-gold"/g) || []).length, 3);
    assert.equal((markup.match(/class="num finish-silver"/g) || []).length, 3);
    assert.equal((markup.match(/class="num finish-bronze"/g) || []).length, 3);
    assert(!markup.includes('finish-classified'));
    assert(markup.includes('wec-class-cell wec-class-hypercar'));
    assert(markup.includes('wec-class-cell wec-class-gt3'));
    assert.equal((markup.match(/wec-winning-time/g) || []).length, 2);
    assert.match(markup, /<td colspan="2" class="num wec-retirement">DNF<\/td>\s*<td class="wec-class-cell/);
});
