// Reproducible snapshot of the browser data stores. No external dependencies.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { DatabaseSync } = require('node:sqlite');
const root = path.resolve(__dirname, '..');

function exportDatabase(output) {
    const destination = path.resolve(output);
    if (fs.existsSync(destination)) throw new Error(`File already exists: ${destination}. Choose a new filename to preserve your experiments.`);
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const sources = [...html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"/g)]
        .map(match => match[1]).filter(file => file.startsWith('data/') || ['js/shared.js', 'js/season-overview.js'].includes(file));
    const context = vm.createContext({});
    for (const file of sources) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
    const data = JSON.parse(vm.runInContext('JSON.stringify({ characters: DATA, championships: WEC_SEASONS, drivers: WEC_DRIVERS, classes: WEC_CLASSES, flags: COUNTRY_FLAGS, badges: MANUFACTURER_BADGES })', context));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const db = new DatabaseSync(destination);
    try {
        db.exec(fs.readFileSync(path.join(root, 'database/schema.sql'), 'utf8'));
        db.exec('BEGIN');
        const insert = (table, values) => db.prepare(`INSERT INTO ${table} VALUES (${values.map(() => '?').join(',')})`).run(...values.map(value => value ?? null));
        insert('export_metadata', ['created_at_utc', new Date().toISOString()]);
        insert('export_metadata', ['source_files', JSON.stringify(sources)]);
        insert('export_metadata', ['scoring', '25,18,15,12,10,8,6,4,2,1; Le Mans x2; completed races only']);
        insert('export_metadata', ['notes', 'Read/write snapshot; edits do not change the website. NULL means unreported. Display positions use completed-race countback.']);
        const countries = new Set(Object.keys(data.flags));
        for (const driver of Object.values(data.drivers)) if (driver.country) countries.add(driver.country);
        for (const years of Object.values(data.championships)) for (const championship of Object.values(years)) {
            for (const entity of [...Object.values(championship.entrants), ...championship.calendar]) if (entity.country) countries.add(entity.country);
        }
        for (const country of countries) insert('countries', [country, data.flags[country]]);
        for (const [id, name] of Object.entries(data.classes)) insert('classes', [id, name]);
        for (const [id, driver] of Object.entries(data.drivers)) insert('drivers', [id, driver.name, driver.country]);
        const teams = new Set(), manufacturers = new Set();
        for (const [characterId, character] of Object.entries(data.characters)) {
            insert('characters', [characterId, character.name]);
            for (const [year, personal] of Object.entries(character.seasons)) {
                const seasonId = `${characterId}:${year}`;
                insert('seasons', [seasonId, characterId, Number(year), ...['team', 'car', 'category', 'position', 'starts', 'wins', 'podiums', 'poles', 'points'].map(key => personal[key])]);
                const championship = data.championships[characterId][year];
                if (!championship) continue; // Overview-only seasons have no race page.
                for (const [entrantId, entrant] of Object.entries(championship.entrants)) {
                    if (!teams.has(entrant.team)) { insert('teams', [entrant.team]); teams.add(entrant.team); }
                    if (entrant.car && !manufacturers.has(entrant.car)) {
                        insert('manufacturers', [entrant.car, data.badges[entrant.car]]); manufacturers.add(entrant.car);
                    }
                    insert('entrants', [seasonId, entrantId, entrant.number, entrant.team, entrant.car, entrant.category, entrant.country]);
                }
                for (const race of championship.calendar) {
                    insert('races', [seasonId, race.id, race.round, race.code, race.circuit, race.name, race.country, Number(!!race.completed), Number(!!race.inProgress), race.pointsMultiplier ?? 1]);
                    race.results.forEach((result, index) => {
                        const points = race.completed && !race.inProgress
                            ? vm.runInContext(`awardedRacePoints(${JSON.stringify(result)}, ${JSON.stringify(race)})`, context) : null;
                        insert('race_results', [seasonId, race.id, result.entrant, index + 1, result.position, result.classPosition, result.status, result.laps, result.gap, points]);
                        (result.drivers || []).forEach((driver, crewIndex) => insert('result_drivers', [seasonId, race.id, result.entrant, driver, crewIndex + 1]));
                    });
                    for (const [classId, winner] of Object.entries(race.winners || {})) {
                        insert('winner_reports', [seasonId, race.id, classId, winner.entrant, Number(!!race.inProgress)]);
                        (winner.drivers || []).forEach((driver, index) => insert('winner_report_drivers', [seasonId, race.id, classId, driver, index + 1]));
                    }
                }
                for (const entry of championship.lmp2Calendar) insert('supplementary_class_rounds', [seasonId, entry.race, 'lmp2', entry.round]);
                for (const [classId, rows] of Object.entries(championship.standings)) {
                    const ranked = JSON.parse(vm.runInContext(`JSON.stringify(rankedStandings(WEC_SEASONS[${JSON.stringify(characterId)}][${JSON.stringify(year)}], ${JSON.stringify(classId)}))`, context));
                    for (const row of rows) {
                        insert('standings', [seasonId, row.entrant, row.position, ranked.find(item => item.entrant === row.entrant).position, row.points]);
                        for (const [race, finish] of Object.entries(row.finishes)) insert('standing_finishes', [seasonId, row.entrant, race, typeof finish === 'number' ? finish : null, typeof finish === 'string' ? finish : null]);
                    }
                }
            }
        }
        if (db.prepare('PRAGMA foreign_key_check').all().length) throw new Error('Foreign-key validation failed');
        if (db.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Integrity check failed');
        db.exec('COMMIT');
        return destination;
    } catch (error) {
        try { db.exec('ROLLBACK'); } catch {}
        throw error;
    } finally { db.close(); }
}

if (require.main === module) {
    try { console.log(exportDatabase(process.argv[2] || path.join(root, 'database/wec-careers.sqlite'))); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { exportDatabase };
