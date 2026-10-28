const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createSite, plain, root } = require('./helpers/site');

test('Every current manufacturer has a valid local PNG badge', () => {
    const site = createSite();
    const badges = plain(site.evaluate('MANUFACTURER_BADGES'));
    const entrants = plain(site.evaluate('WEC_SEASONS.rens["2024"].entrants'));
    for (const make of new Set(Object.values(entrants).map(entrant => entrant.manufacturer || entrant.car).filter(make => make !== 'Oreca'))) {
        assert(badges[make], make);
        const contents = fs.readFileSync(path.join(root, badges[make]));
        assert.equal(contents.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', make);
        assert(contents.readUInt32BE(16) > 0, make);
        assert(contents.readUInt32BE(20) > 0, make);
    }
});

test('All manufacturers across the populated seasons resolve, including visible Oreca and Glickenhaus badges', () => {
    const site = createSite();
    const badges = plain(site.evaluate('MANUFACTURER_BADGES'));
    const seasons = plain(site.evaluate('WEC_SEASONS.rens'));
    for (const season of Object.values(seasons)) {
        for (const entrant of Object.values(season.entrants)) {
            const make = entrant.manufacturer || entrant.car;
            assert(badges[make], make);
            assert(fs.existsSync(path.join(root, badges[make])), make);
            assert(fs.statSync(path.join(root, badges[make])).size > 100, make);
        }
    }
    const oreca = fs.readFileSync(path.join(root, badges.Oreca), 'utf8');
    assert(oreca.includes('viewBox="0 0 23 20"'));
    assert(!oreca.includes('fill="white"'));
    assert(oreca.includes('fill="#202122"'));
    assert.equal(fs.readFileSync(path.join(root, badges.Glickenhaus)).subarray(0,8).toString('hex'), '89504e470d0a1a0a');
});

test('Race classifications keep nine columns after merging DNF positions', () => {
    const site = createSite();
    const races = plain(site.evaluate('WEC_SEASONS.rens["2024"].calendar'));
    races.forEach((race, index) => {
        const markup = site.evaluate(`individualRaceTable(WEC_SEASONS.rens['2024'], WEC_SEASONS.rens['2024'].calendar[${index}])`);
        assert.equal((markup.match(/<col class=/g) || []).length, 9);
        const rows = [...markup.matchAll(/<tr class="wec-result-row[^>]*>([\s\S]*?)<\/tr>/g)];
        assert.equal(rows.length, race.results.length);
        rows.forEach(([_, row], rowIndex) => {
            const cells = [...row.matchAll(/<td([^>]*)>/g)];
            const columns = cells.reduce((sum, [, attrs]) => sum + Number(attrs.match(/colspan="(\d+)"/)?.[1] || 1), 0);
            assert.equal(columns, 9);
            assert(row.includes('class="manufacturer-badge"'));
            if (race.results[rowIndex].status === 'DNF') {
                assert.equal(cells.length, 8);
                assert.match(row, /<td colspan="2" class="num wec-retirement">DNF<\/td>\s*<td class="wec-class-cell/);
            } else assert.equal(cells.length, 9);
        });
    });
});

test('Spreadsheet overviews group each circuit across four crew rows and preserve empty future rounds', () => {
    const site = createSite();
    const markup = site.evaluate('raceOverviewTable(WEC_SEASONS.rens["2024"], "rens", "2024")');
    const groups = [...markup.matchAll(/<tbody class="wec-round-group">([\s\S]*?)<\/tbody>/g)];
    assert.equal(groups.length, 8);
    assert.equal((markup.match(/<col class=/g) || []).length, 7);
    groups.forEach(([, group], index) => {
        const rows = [...group.matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
        assert.equal(rows.length, 4);
        assert.equal((rows[0][1].match(/rowspan="4"/g) || []).length, 3);
        assert(rows[0][1].includes(`>${index + 1}</th>`));
        assert.equal((rows[0][1].match(/<(?:th|td)(?:\s|>)/g) || []).length, 7);
        for (const [, row] of rows.slice(1)) assert.equal((row.match(/<td(?:\s|>)/g) || []).length, 4);
    });
    assert(groups[0][1].includes('Toyota Gazoo Racing'));
    assert(groups[0][1].includes('José María López'));
    assert(groups[0][1].includes('Rens Adisea'));
    assert(groups[3][1].includes('Robert Kubica'));
    assert(!groups[3][1].includes('Provisional'));
    assert(!groups[4][1].includes('<strong>'));
    const lmp2 = site.evaluate('lmp2OverviewTable(WEC_SEASONS.rens["2024"], "rens", "2024")');
    assert(lmp2.includes('wec-overview-single'));
    assert.equal((lmp2.match(/<col class=/g) || []).length, 5);
    assert.equal((lmp2.match(/<tbody class="wec-round-group">/g) || []).length, 1);
    assert(lmp2.includes('alt="France"'));
    assert(lmp2.includes('United Autosports'));
});
