const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createSite, plain, read, root } = require('./helpers/site');

test('Jordan’s imported seasons cannot appear on Rens or Vasiliki’s pages or race routes', () => {
    const site = createSite();
    for (const id of ['rens', 'vasi']) {
        site.navigate(`#${id}/2024`);
        assert(site.app.innerHTML.includes('No race data has been added for 2024 yet.'));
        assert(!site.app.innerHTML.includes('Toyota Gazoo Racing'));
        assert(!site.app.innerHTML.includes('Vista AF Corse'));
        assert(!site.app.innerHTML.includes('José María López'));
        assert(!site.app.innerHTML.includes('race-qatar'));
        assert.deepEqual(plain(site.evaluate(`WEC_SEASONS.${id}['2024'].calendar`)), []);
        assert.deepEqual(plain(site.evaluate(`WEC_SEASONS.${id}['2024'].standings`)), { hypercar: [], gt3: [] });
        site.navigate(`#${id}/2024/race-qatar`);
        assert(site.activeClasses.has('is-home'));
    }
    site.evaluate("WEC_SEASONS.rens['2024'].calendar.push({ id: 'rens-only' });");
    assert.equal(site.evaluate("WEC_SEASONS.vasi['2024'].calendar.length"), 0);
    assert.equal(site.evaluate("WEC_SEASONS.jordan['2024'].calendar.length"), 8);
});

test('Every entrant, standing, supplied finish and points value matches the pasted 2024 tables', () => {
    const site = createSite();
    const championship = plain(site.evaluate('WEC_SEASONS.jordan["2024"]'));
    const source = read('tests/fixtures/2024-standings.tsv').trim().split(/\r?\n/).slice(1);
    assert.equal(championship.standings.hypercar.length, 19);
    assert.equal(championship.standings.gt3.length, 18);
    assert.equal(Object.keys(championship.entrants).length, 37);
    for (const line of source) {
        const [category, pos, number, team, points, ...finishes] = line.split('\t');
        const actual = championship.standings[category][Number(pos) - 1];
        const entrant = championship.entrants[actual.entrant];
        assert.equal(actual.position, Number(pos));
        assert.equal(entrant.category, category);
        assert.equal(entrant.number, number);
        assert.equal(entrant.team, team);
        assert.equal(actual.points, Number(points));
        assert.deepEqual(Object.values(actual.finishes), championship.calendar.map((race, i) =>
            finishes[i] == null ? null : finishes[i] === 'DNF' ? 'DNF' : Number(finishes[i])), `${team} #${number}`);
    }
});

test('Calendar and winners preserve the supplied custom season and partial Le Mans data', () => {
    const site = createSite();
    const championship = plain(site.evaluate('WEC_SEASONS.jordan["2024"]'));
    assert.deepEqual(championship.calendar.map(race => [race.round, race.code, race.circuit]), [
        [1, 'QAT', 'Losail'], [2, 'ITA', 'Monza'], [3, 'BEL', 'Spa'], [4, 'FRA', 'Le Mans'],
        [5, 'LGB', 'Long Beach'], [6, 'COT', 'COTA'], [7, 'ESP', 'Barcelona'], [8, 'JPN', 'Fuji']
    ]);
    assert.deepEqual(championship.calendar.map(race => [race.winners.hypercar?.entrant || null, race.winners.gt3?.entrant || null]), [
        ['hy-7', 'gt-55'], ['hy-7', 'gt-55'], ['hy-51', 'gt-85'], [null, 'gt-55'],
        [null, null], [null, null], [null, null], [null, null]
    ]);
    assert.deepEqual(championship.lmp2Calendar, [{ round: 1, race: 'le-mans' }]);
    assert.equal(championship.calendar[3].winners.lmp2, undefined);
    assert.equal(championship.standings.gt3[0].finishes['le-mans'], null);
    assert.equal(championship.standings.gt3[0].points, 54);
    assert(championship.calendar.every(race => race.results.length === 0));
    assert.deepEqual(championship.calendar[0].winners.gt3.drivers, ['jordan', 'rovera', 'mann']);
    assert.deepEqual(championship.calendar[2].winners.hypercar.drivers, ['pierGuidi', 'giovinazzi', 'calado']);
    assert.deepEqual(championship.calendar[2].winners.gt3.drivers, ['bovy', 'gatting', 'pin']);
});

test('Driver, entrant and circuit flags resolve locally; all supplied references exist', () => {
    const site = createSite();
    const championship = plain(site.evaluate('WEC_SEASONS.jordan["2024"]'));
    const drivers = plain(site.evaluate('WEC_DRIVERS'));
    const flags = plain(site.evaluate('COUNTRY_FLAGS'));
    for (const entity of [...Object.values(championship.entrants), ...Object.values(drivers), ...championship.calendar]) {
        assert(flags[entity.country], entity.country);
        assert(fs.existsSync(path.join(root, flags[entity.country])), entity.country);
    }
    for (const race of championship.calendar) {
        for (const winner of Object.values(race.winners)) {
            assert(championship.entrants[winner.entrant]);
            for (const driver of winner.drivers) assert(drivers[driver], driver);
        }
    }
    assert.equal(drivers.jordan.country, 'United Kingdom');
    assert.equal(drivers.mann.country, 'United States');
    assert.equal(drivers.lopez.country, 'Argentina');
});

test('Jordan alone shows his championship tables, race sections and working route targets', () => {
    const site = createSite();
    for (const id of ['jordan']) {
        site.navigate(`#${id}/2024`);
        const markup = site.app.innerHTML;
        assert(markup.includes('Hypercar Entrant Standings'));
        assert(markup.includes('GT3 Entrant Standings'));
        assert(markup.includes('LMP2 race results'));
        assert.equal((markup.match(/<article id="race-/g) || []).length, 8);
        assert(markup.includes('alt="United Kingdom"'));
        assert(markup.includes('José María López'));
        assert(markup.includes('Jordan Vale'));
        assert(markup.includes('finish-dnf'));
        const targets = { results: 'race-results', standings: 'championship-standings', hypercar: 'hypercar-standings', gt3: 'gt3-standings', races: 'individual-races' };
        for (const race of plain(site.evaluate('WEC_SEASONS.jordan["2024"].calendar'))) targets[`race-${race.id}`] = `race-${race.id}`;
        for (const [section, target] of Object.entries(targets)) {
            let scrolled = false;
            const query = site.document.querySelector;
            site.document.querySelector = selector => selector === '#' + target ? { scrollIntoView() { scrolled = true; } } : query(selector);
            site.navigate(`#${id}/2024/${section}`);
            assert(!site.activeClasses.has('is-home'), section);
            assert(scrolled, section);
            assert(site.app.innerHTML.includes(`id="${target}"`), target);
            site.document.querySelector = query;
        }
    }
    site.navigate('#jordan/2024/race-nonexistent');
    assert(site.activeClasses.has('is-home'));
    site.navigate('#jordan/2023/race-qatar');
    assert(site.activeClasses.has('is-home'));
});

test('Individual classifications render multiclass positions, gaps, DNFs and driver flags without inventing winners', () => {
    const site = createSite();
    // Synthetic data only: do not import a sample classification as a career result.
    site.evaluate(`WEC_SEASONS.jordan['2024'].calendar[4].results = [
        { entrant: 'hy-7', position: 1, classPosition: 1, laps: 127, gap: '4:00:33.646', drivers: ['conway'] },
        { entrant: 'gt-55', position: 20, classPosition: 1, laps: 115, gap: '4:01:11.163', drivers: ['jordan', 'rovera', 'mann'] },
        { entrant: 'gt-60', position: null, classPosition: null, laps: 74, gap: '+41 Laps', status: 'DNF' }
    ];`);
    const markup = site.evaluate('individualRaceTable(WEC_SEASONS.jordan["2024"], WEC_SEASONS.jordan["2024"].calendar[4])');
    assert(markup.includes('4:00:33.646'));
    assert(markup.includes('4:01:11.163'));
    assert(markup.includes('+41 Laps'));
    assert(markup.includes('DNF'));
    assert(markup.includes('wec-class-hypercar'));
    assert(markup.includes('wec-class-gt3'));
    assert(markup.includes('Jordan Vale'));
    assert(markup.includes('data-sortable="false"'));
    assert.equal(site.evaluate('raceWinner(WEC_SEASONS.jordan["2024"], WEC_SEASONS.jordan["2024"].calendar[4], "gt3").entrant'), 'gt-55');
    assert.equal(site.evaluate('raceWinner(WEC_SEASONS.jordan["2024"], WEC_SEASONS.jordan["2024"].calendar[4], "lmp2")'), null);
});

test('Table controls preserve classifications and do not sort when a race link is clicked', () => {
    const site = createSite();
    site.context.table = { dataset: { sortable: 'false' } };
    site.evaluate('enhanceTable(table)');
    assert.equal(site.context.table.dataset.tableTools, undefined);
    const callbacks = [];
    const header = {
        colSpan: 1, dataset: {}, textContent: 'QAT', classList: { add() {} },
        appendChild() {}, addEventListener(type, callback) { callbacks.push(callback); }
    };
    site.document.createElement = () => ({ setAttribute() {} });
    site.context.table = {
        dataset: {}, querySelector() { return null; }, classList: { contains() { return false; }, add() {} },
        tHead: { rows: [{ cells: [header] }] }, tBodies: [{}]
    };
    site.evaluate('enhanceTable(table)');
    assert.equal(callbacks.length, 1);
    callbacks[0]({ target: { closest: selector => selector.includes('a,') ? {} : null } });
    assert.equal(header.dataset.sortDir, undefined);
});

