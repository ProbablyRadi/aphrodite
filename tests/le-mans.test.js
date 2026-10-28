const test = require('node:test');
const assert = require('node:assert/strict');
const { createSite, plain } = require('./helpers/site');

test('Final Le Mans records all 62 cars, 11 retirements and three class winners', () => {
    const site = createSite();
    const season = plain(site.evaluate('WEC_SEASONS.rens["2024"]'));
    const race = season.calendar[3];
    assert.equal(race.completed, true);
    assert.equal(race.inProgress, false);
    assert.equal(race.results.length, 62);
    assert.equal(new Set(race.results.map(row => row.entrant)).size, 62);
    assert.deepEqual(race.results.filter(row => !row.status).map(row => row.position), Array.from({length: 51}, (_, i) => i + 1));
    assert.deepEqual(race.results.filter(row => row.status).map(row => [row.entrant, row.laps, row.gap]), [
        ['hy-36',110,'+11 Laps'], ['p2-28',107,'+9 Laps'], ['hy-99',66,'+56 Laps'],
        ['gt-86',33,'+73 Laps'], ['gt-54',23,'+83 Laps'], ['gt-91',16,'+90 Laps'],
        ['gt-82',9,'+97 Laps'], ['hy-11',5,'+117 Laps'], ['gt-777',5,'+101 Laps'],
        ['gt-60',4,'+102 Laps'], ['gt-27',2,'+104 Laps']
    ]);
    assert.deepEqual(Object.values(race.winners).map(row => row.entrant), ['hy-83','gt-55','p2-22']);
    const markup = site.evaluate('individualRaceTable(WEC_SEASONS.rens["2024"], WEC_SEASONS.rens["2024"].calendar[3])');
    assert(markup.includes('alt="France"'));
    assert(!markup.includes('In progress'));
    assert.equal((markup.match(/>DNF<\/td>/g) || []).length, 11);
    for (const time of ['8:02:43.615','8:05:02.068','8:02:48.322']) assert(markup.includes(time));
    for (const id of ['jordan','vasi']) {
        site.navigate('#' + id + '/2024');
        assert(!site.app.innerHTML.includes('Le Mans 8 Hours'));
    }
});

test('Guest eligibility reproduces all supplied championship totals and automatic countback', () => {
    const site = createSite();
    const expected = {
        hypercar: {'7':80,'83':75,'51':72,'50':66,'5':45,'12':26,'99':24,'15':22,'20':18,'8':16,'6':16,'94':15,'2':9,'36':8,'38':8,'63':4,'11':1,'35':0,'93':0},
        gt3: {'55':104,'46':66,'78':52,'85':47,'31':42,'87':40,'27':27,'82':26,'91':20,'81':16,'777':15,'59':12,'92':10,'60':10,'77':8,'95':5,'54':3,'88':2}
    };
    const season = plain(site.evaluate('WEC_SEASONS.rens["2024"]'));
    for (const [category, totals] of Object.entries(expected)) {
        const chart = plain(site.evaluate('pointsProgression(WEC_SEASONS.rens["2024"], "' + category + '")'));
        assert.equal(chart.series.length, Object.keys(totals).length);
        for (const row of season.standings[category]) {
            const number = season.entrants[row.entrant].number;
            assert.equal(row.points, totals[number], number);
            assert.equal(chart.series.find(entry => entry.id === row.entrant).total, totals[number], number);
            const result = season.calendar[3].results.find(result => result.entrant === row.entrant);
            assert.equal(row.finishes['le-mans'], result.status || result.classPosition);
        }
    }
    const order = plain(site.evaluate('rankedStandings(WEC_SEASONS.rens["2024"], "hypercar").map(row => row.entrant)'));
    assert(order.indexOf('hy-6') < order.indexOf('hy-8'));
});
