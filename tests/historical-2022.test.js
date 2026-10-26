const test = require('node:test');
const assert = require('node:assert/strict');
const { createSite, plain, scriptFiles } = require('./helpers/site');

test('Rens keeps his 2022 overview entry and stats without any season link or page', () => {
    const site = createSite();
    const record = plain(site.evaluate('DATA.rens.seasons["2022"]'));
    assert.deepEqual([record.number, record.team, record.car, record.category], ['56', 'Team Project 1', 'Porsche 911 RSR', 'GTE']);
    assert.deepEqual([record.position, record.starts, record.wins, record.podiums, record.poles, record.points], [7, 6, 0, 2, 0, 55]);
    assert.equal(site.evaluate('Object.hasOwn(WEC_SEASONS.rens, "2022")'), false);
    assert(!scriptFiles().includes('data/2022.js'));
    site.navigate('#rens');
    assert.match(site.app.innerHTML, /<th scope="row">2022<\/th>/);
    assert(site.app.innerHTML.includes('Team Project 1'));
    assert(!site.app.innerHTML.includes('href="#rens/2022'));
    assert(!site.nav.innerHTML.includes('2022'));
    for (const hash of ['#rens/2022', '#rens/2022/results', '#rens/2022/overview', '#rens/2022/race-sebring']) {
        site.navigate(hash);
        assert(site.activeClasses.has('is-home'), hash);
    }
    site.navigate('#rens/2024');
    assert(site.app.innerHTML.includes('Qatar 4 Hours'));
    assert(!site.nav.innerHTML.includes('2022'));
});
