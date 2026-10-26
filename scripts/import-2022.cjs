// Offline importer for the downloaded Wikipedia 2022 season/race pages.
// Source URLs and historical/fictitious distinctions are documented with the data.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const cache = path.join(root, 'tmp/2022-import');
const tag = /<(?:[^"'<>]|"[^"]*"|'[^']*')*>/g;
function decode(value) {
    return value.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)))
        .replace(/&(?:amp|nbsp|lt|gt|quot|apos|ndash|mdash|minus);/g, entity => ({ '&amp;':'&', '&nbsp;':' ', '&lt;':'<', '&gt;':'>', '&quot;':'"', '&apos;':"'", '&ndash;':'–', '&mdash;':'—', '&minus;':'−' })[entity]);
}
function text(html) {
    return decode(html.replace(/<sup\b[\s\S]*?<\/sup>/g, '').replace(/<style\b[\s\S]*?<\/style>/g, '').replace(/<br\b[^>]*>/g, ' | ').replace(tag, '')).replace(/\s+/g, ' ').trim();
}
function cell(html) {
    return { html, text: text(html), country: html.match(/<img\b[^>]*\balt="([^"]+)"/)?.[1] || null };
}
function parseTable(table) {
    const rows = [], spans = [];
    for (const match of table.matchAll(/<tr\b(?:[^"'<>]|"[^"]*"|'[^']*')*>([\s\S]*?)<\/tr>/g)) {
        const row = [];
        for (let i = 0; i < spans.length; i++) if (spans[i]) { row[i] = spans[i].cell; if (!--spans[i].remaining) spans[i] = null; }
        let i = 0;
        for (const m of match[1].matchAll(/<(th|td)\b((?:[^"'<>]|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/\1>/g)) {
            while (row[i]) i++;
            const value = cell(m[3]);
            const colspan = Number(m[2].match(/colspan="(\d+)"/)?.[1] || 1);
            const rowspan = Number(m[2].match(/rowspan="(\d+)"/)?.[1] || 1);
            for (let n = 0; n < colspan; n++, i++) {
                row[i] = value;
                if (rowspan > 1) spans[i] = { cell: value, remaining: rowspan - 1 };
            }
        }
        rows.push(row);
    }
    return rows;
}
function tables(file) {
    const html = fs.readFileSync(path.join(cache, file + '.html'), 'utf8');
    return [...html.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/g)].map(match => parseTable(match[0]));
}

if (require.main === module) {
    for (const key of ['season','sebring','spa','le-mans','monza','fuji','bahrain']) {
        const parsed = tables(key);
        fs.writeFileSync(path.join(cache, key + '-tables.json'), JSON.stringify(parsed, null, 2));
        console.log(key, parsed.map((rows, i) => `${i}: ${rows[0].map(c => c.text).join(' / ')} (${rows.length} rows)`).join('\n'));
    }
}
module.exports = { tables, text, cell };

function buildSeason() {
    const seasonTables = tables('season');
    const categoryOf = value => /hypercar/i.test(value) ? 'hypercar' : /lmp2/i.test(value) ? 'lmp2' : /pro/i.test(value) ? 'gtepro' : /am/i.test(value) ? 'gteam' : null;
    const slug = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const entrants = {}, drivers = {}, countries = new Set();
    const schedule = [
        ['sebring', 'SEB', 'Sebring', '1000 Miles of Sebring', 'United States', '2022-03-18', 8],
        ['spa', 'SPA', 'Spa', '6 Hours of Spa-Francorchamps', 'Belgium', '2022-05-07', 6],
        ['le-mans', 'LMS', 'Le Mans', '24 Hours of Le Mans', 'France', '2022-06-11', 24],
        ['monza', 'MNZ', 'Monza', '6 Hours of Monza', 'Italy', '2022-07-10', 6],
        ['fuji', 'FUJ', 'Fuji', '6 Hours of Fuji', 'Japan', '2022-09-11', 6],
        ['bahrain', 'BHR', 'Bahrain', '8 Hours of Bahrain', 'Bahrain', '2022-11-12', 8]
    ];
    const weights = { 6: [25,18,15,12,10,8,6,4,2,1], 8: [38,27,23,18,15,12,9,6,3,2], 24: [50,36,30,24,20,16,12,8,4,2] };
    const raceRows = {};
    const calendar = schedule.map(([id, code, circuit, name, country, date, hours], index) => {
        const ts = tables(id);
        const raw = ts.find(t => t[0].some(c => c.text === 'Drivers') && t[0].some(c => c.text === 'Laps'));
        const results = [], seen = new Set(), classCounts = {};
        raceRows[id] = [];
        countries.add(country);
        for (const row of raw.slice(2)) {
            const category = categoryOf(row[1]?.text || '');
            const number = row[2]?.text;
            if (!category || !/^\d+$/.test(number || '') || seen.has(number)) continue;
            seen.add(number);
            const entrantId = `${category}-${number}`;
            const car = row[5].text;
            const manufacturer = car.startsWith('Aston') ? 'Aston Martin' : car.startsWith('Chevrolet') ? 'Corvette' : car.split(' ')[0];
            entrants[entrantId] ||= { number, team: row[3].text, country: row[3].country, car, manufacturer, category };
            if (row[3].country) countries.add(row[3].country);
            const crew = row[4].html.split(/<br\b[^>]*>/g).map(part => {
                const c = cell(part), name = c.text;
                if (!name) return null;
                const link = [...part.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].at(-1)?.[1];
                const driverId = 'historic-' + slug(link ? decodeURIComponent(link.split('/').at(-1)).replace(/_/g, ' ') : name);
                drivers[driverId] ||= { name, country: c.country };
                if (c.country) countries.add(c.country);
                return driverId;
            }).filter(Boolean);
            const position = /^\d+$/.test(row[0].text) ? Number(row[0].text) : null;
            let status = position ? null : /^(Ret|DNF)$/i.test(row[0].text) ? 'DNF' : row[0].text;
            const classPosition = position ? (classCounts[category] = (classCounts[category] || 0) + 1) : null;
            const timing = row[8].text.replace(/[‡†*]/g, '').trim();
            const result = { entrant: entrantId, position, classPosition, laps: Number(row[7].text), gap: status ? null : timing, drivers: category === 'gteam' && number === '56' ? ['rens', 'historic-ben-barnicoat', 'historic-brendan-iribe'] : crew };
            if (status) { result.status = status; result.retirementReason = timing; }
            results.push(result);
            raceRows[id].push({ number, category, crew });
        }
        return { id, code, round: index + 1, circuit, name, country, date, hours, completed: true, pointsMultiplier: hours === 24 ? 2 : 1,
            pointsScale: weights[hours], winners: {}, results,
            source: `https://en.wikipedia.org/wiki/2022_${id === 'sebring' ? '1000_Miles_of_Sebring' : id === 'spa' ? '6_Hours_of_Spa-Francorchamps' : id === 'le-mans' ? '24_Hours_of_Le_Mans' : id === 'monza' ? '6_Hours_of_Monza' : id === 'fuji' ? '6_Hours_of_Fuji' : '8_Hours_of_Bahrain'}` };
    });
    const standings = { hypercar: [], lmp2: [], gtepro: [], gteam: [] };
    const standingSources = {};
    for (const [category, tableIndex] of [['lmp2',17], ['gteam',19]]) {
        for (const row of seasonTables[tableIndex].slice(1)) {
            if (!/^\d+$/.test(row[1]?.text || '')) continue;
            const entrant = `${category}-${row[1].text}`;
            if (entrants[entrant]) standingSources[entrant] = row;
        }
    }
    // Hypercar/GTE Pro are published as driver championships. Match an all-season
    // driver's record to its car; these become explicitly labelled entrant totals.
    for (const category of ['hypercar','gtepro']) {
        const source = seasonTables[category === 'hypercar' ? 9 : 11];
        for (const [entrantId, entrant] of Object.entries(entrants).filter(([,e]) => e.category === category)) {
            const crewIds = new Set(calendar.flatMap(race => raceRows[race.id].filter(row => `${row.category}-${row.number}` === entrantId).flatMap(row => row.crew)));
            const names = [...crewIds].map(id => slug(drivers[id].name));
            const candidates = source.slice(1).filter(row => names.includes(slug(row[1]?.text || ''))
                && calendar.some((race, i) => raceRows[race.id].some(entry => `${entry.category}-${entry.number}` === entrantId
                    && entry.crew.some(driverId => slug(drivers[driverId].name) === slug(row[1]?.text || '')))
                    && row[i + 3]?.text.trim()));
            candidates.sort((a,b) => Number(b[9].text) - Number(a[9].text));
            if (candidates.length) standingSources[entrantId] = candidates[0];
        }
    }
    for (const [entrantId, row] of Object.entries(standingSources)) {
        const entrant = entrants[entrantId];
        const finishes = {}, roundPoints = {};
        calendar.forEach((race, i) => {
            const source = row[i + 3], value = source.text.replace(/[‡†*]/g, '').trim();
            const finish = /^\d+$/.test(value) ? Number(value) : /ret/i.test(value) ? 'DNF' : value || null;
            finishes[race.id] = finish;
            const pole = /<b(?:\s|>)/.test(source.html);
            const points = (typeof finish === 'number' ? (race.pointsScale[finish - 1] || 0) : 0) + Number(pole);
            roundPoints[race.id] = points;
            const result = race.results.find(result => result.entrant === entrantId);
            if (result) { result.awardedPoints = points; result.pole = pole; }
        });
        const points = Number(row[9].text);
        const calculated = Object.values(roundPoints).reduce((a,b) => a+b,0);
        console.log('points', entrantId, points, calculated, calculated === points ? 'OK' : JSON.stringify(roundPoints));
        if (calculated !== points) throw new Error(`Historical points mismatch for ${entrantId}: ${calculated} versus ${points}`);
        standings[entrant.category].push({ position: Number(row[0].text), entrant: entrantId, points, finishes });
    }
    // Invitational Le Mans entries retain their classification but cannot score
    // championship points; official sources, not raw field position, define points.
    calendar.forEach(race => {
        race.results.forEach(result => { if (result.awardedPoints == null) result.awardedPoints = 0; });
        for (const category of Object.keys(standings)) {
            const winner = race.results.find(result => !result.status && entrants[result.entrant].category === category);
            if (winner) race.winners[category] = { entrant: winner.entrant, drivers: winner.drivers };
        }
    });
    for (const category of Object.keys(standings)) standings[category].sort((a,b) => b.points-a.points).forEach((row,i) => { row.position = i+1; });
    const output = { calendar, lmp2Calendar: [], entrants, standings, categories: Object.keys(standings),
        overviewGroups: [['hypercar','lmp2'],['gtepro','gteam']], historical: true,
        scoringNote: 'Historical 2022 scoring: six-hour, eight-hour and Le Mans points scales, plus one point for class pole. Invitational entries do not score championship points.',
        adaptationNote: 'Fictional backstory: Rens Adisea, Ben Barnicoat and Brendan Iribe form the #56 crew for all six rounds. All car classifications and championship points follow the historical season.' };
    fs.writeFileSync(path.join(cache, 'normalized.json'), JSON.stringify({ championship: output, drivers, countries: [...countries].sort() }, null, 2));
    const countriesToAssets = Object.fromEntries([...countries].map(country => [country, 'assets/flags/' + (country === 'Republic of Ireland' ? 'Ireland' : country.replace(/ /g, '-')) + '.png']));
    for (const [country, file] of Object.entries(countriesToAssets)) if (!fs.existsSync(path.join(root, file))) throw new Error('Missing flag: ' + country);
    drivers.rens = { name: 'Rens Adisea', country: 'Netherlands' };
    const final = '// Historical 2022 results with the requested fictional #56 crew.\n// Sources and adaptation notes: data/sources/2022.md\n'
        + `Object.assign(WEC_DRIVERS, ${JSON.stringify(drivers, null, 2)});\n`
        + `const HISTORICAL_FLAG_ASSETS = ${JSON.stringify(countriesToAssets, null, 2)};\n`
        + `WEC_SEASONS.rens['2022'] = ${JSON.stringify(output, null, 2)};\n`;
    fs.writeFileSync(path.join(root, 'data/2022.js'), final);
    console.log('rows', calendar.map(race => [race.id, race.results.length]));
    console.log('countries', [...countries].sort().join(', '));
}
module.exports.buildSeason = buildSeason;
if (require.main === module) buildSeason();
