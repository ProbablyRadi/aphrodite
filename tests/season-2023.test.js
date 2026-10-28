const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createSite, plain, root } = require('./helpers/site');

test('Both 2023 careers have the exact supplied rosters, zero points and unreported results', () => {
    const site = createSite();
    const expected = { hypercar: ['2','4','5','6','7','8','38','50','51','93','94','99','708'],
        gte: ['21','54','83','777','25','33','56','57','60','85','77','88','86','98'],
        lmp2: ['9','63','10','22','23','28','31','41','34','35','36'] };
    const flags = plain(site.evaluate('COUNTRY_FLAGS'));
    for (const id of ['rens','jordan']) {
        const season = plain(site.evaluate(`WEC_SEASONS.${id}['2023']`));
        assert.deepEqual(season.categories, ['hypercar','gte','lmp2']);
        assert.equal(Object.keys(season.entrants).length, id === 'jordan' ? 39 : 38);
        assert.deepEqual(season.calendar.map(race => race.code), id === 'jordan' ? ['SEB','POR','BEL','FRA','ITA','JPN','DAY','ATL'] : ['DAY','POR','BEL','FRA','ITA','JPN','ATL']);
        assert.deepEqual(season.calendar.map(race => race.circuit), id === 'jordan' ? ['Sebring','Portimão','Spa','Le Mans','Monza','Fuji','Daytona','Road Atlanta'] : ['Daytona','Portimão','Spa','Le Mans','Monza','Fuji','Road Atlanta']);
        for (const [category, numbers] of Object.entries(expected)) {
            const expectedNumbers = id === 'jordan' && category === 'hypercar' ? ['2', '3', ...numbers.slice(1)] : numbers;
            assert.deepEqual(season.standings[category].map(row => season.entrants[row.entrant].number), expectedNumbers);
            season.standings[category].forEach((row, index) => {
                assert.equal(row.position, index + 1);
                assert.equal(row.points, 0);
                assert.equal(Object.keys(row.finishes).length, season.calendar.length);
                assert(Object.values(row.finishes).every(value => value === null));
                const country = season.entrants[row.entrant].country;
                assert(fs.existsSync(path.join(root, flags[country])), country);
            });
        }
        assert.equal(season.entrants['gte-57'].team, 'Kessel Racing');
        assert(season.calendar.every(race => race.results.length === 0 && Object.keys(race.winners).length === 0));
        site.navigate(`#${id}/2023/gte`);
        assert(!site.activeClasses.has('is-home'));
        assert(site.app.innerHTML.includes('LMGTE Entrant Standings'));
        assert(site.app.innerHTML.includes('LMP2 Entrant Standings'));
        assert(site.app.innerHTML.includes('Portimão'));
        assert(!site.app.innerHTML.includes('Portimao'));
        assert.equal((site.nav.innerHTML.match(/<li>/g) || []).length, season.calendar.length);
    }
    assert.equal(site.evaluate('Object.hasOwn(WEC_SEASONS.vasi, "2023")'), false);
});

test('Future 2023 results and entrant edits stay isolated between careers', () => {
    const site = createSite();
    site.evaluate(`WEC_SEASONS.rens['2023'].calendar[0].results.push({ entrant: 'gte-56', classPosition: 1 });
        WEC_SEASONS.rens['2023'].standings.gte[6].finishes.daytona = 1;
        WEC_SEASONS.rens['2023'].entrants['gte-56'].team = 'Rens test team';`);
    assert.equal(site.evaluate(`WEC_SEASONS.jordan['2023'].calendar[0].results.length`), 0);
    assert.equal(site.evaluate(`WEC_SEASONS.jordan['2023'].standings.gte[6].finishes.daytona`), null);
    assert.equal(site.evaluate(`WEC_SEASONS.jordan['2023'].entrants['gte-56'].team`), 'Project 1 - AO Racing');
    assert.equal(site.evaluate(`WEC_SEASONS.rens['2024'].standings.gt3[0].points`), 54);
});
