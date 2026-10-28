// Personal career records. Unknown values stay null until source data is supplied.
const SEASON_YEARS = ['2022', '2023', '2024', '2025', '2026'];
const DATA = Object.fromEntries([
    ['rens', 'Rens Adisea'],
    ['jordan', 'Jordan Vale'],
    ['vasi', 'Vasiliki Dimitriou']
].map(([id, name]) => [id, {
    name,
    seasons: Object.fromEntries(SEASON_YEARS.map(year => [year, {
        team: null, car: null, category: null, number: null, position: null,
        starts: null, wins: null, podiums: null, poles: null, points: null,
        championship: 'WEC',
        // Personal career totals are separate from this character's race tables.
    }]))
}]));

// Career equipment supplied independently of championship entrant records.
DATA.rens.profile = {
    nationality: 'Dutch', country: 'Netherlands', debut: 2022,
    championship: 'World Endurance Championship', team: 'Vista AF Corse',
    categorisation: 'Gold', number: '55', calculateTotals: true
};
Object.entries({
    '2022': { overviewOnly: true, number: '56', team: 'Team Project 1', car: 'Porsche 911 RSR', category: 'GTE', position: 7, starts: 6, wins: 0, podiums: 2, poles: 0, points: 55 },
    '2023': { number: '56', team: 'Project 1 – AO Racing', car: 'Porsche 911 RSR', category: 'GTE' },
    '2024': { number: '55', team: 'AF Corse', car: 'Ferrari 296 GTB', category: 'GT3' },
    '2025': { number: '21', team: 'AF Corse', car: 'Ferrari 296 GTB', category: 'GT3' },
    '2026': { number: '91', team: 'Manthey DK Engineering', car: 'Porsche 911 GT3', category: 'GT3' }
}).forEach(([year, equipment]) => Object.assign(DATA.rens.seasons[year], equipment));

Object.entries({
    '2022': { overviewOnly: true, number: '22', team: 'United Autosports', car: 'Oreca 07', category: 'LMP2', championship: 'WEC', position: 7, starts: 6, wins: 0, podiums: 0, poles: 1, points: 50 },
    '2023': { number: '3', team: 'Cadillac Racing', car: 'Cadillac V-Series.R', category: 'Hypercar' },
    '2024': { number: '3', team: 'Cadillac Racing', car: 'Cadillac V-Series.R', category: 'Hypercar' },
    '2025': { number: '38', team: 'Hertz Team Jota', car: 'Cadillac V-Series.R', category: 'Hypercar' },
    '2026': { number: '8', team: 'Toyota Racing', car: 'Toyota TR010', category: 'Hypercar' }
}).forEach(([year, equipment]) => Object.assign(DATA.jordan.seasons[year], equipment));

Object.entries({
    '2022': { overviewOnly: true, number: '23', team: 'Hitech GP', car: 'Tatuus F4-T421', category: 'F4', championship: 'British F4' },
    '2023': { overviewOnly: true, number: '23', team: 'Hitech GP', car: 'Tatuus MSV-022', category: 'GB3', championship: 'GB3 Championship' },
    '2024': { number: '23', team: 'United Autosports', car: 'McLaren 720S GT3', category: 'GT3', championship: 'ELMS' },
    '2025': { number: '4', team: 'DKR Engineering', car: 'Ginetta G61-LT-P3 Evo', category: 'LMP3', championship: 'ELMS' },
    '2026': { number: '3', team: 'DKR Engineering', car: 'Oreca 07', category: 'LMP2', championship: 'ELMS' }
}).forEach(([year, equipment]) => Object.assign(DATA.vasi.seasons[year], equipment));

const WEC_CLASSES = { hypercar: 'Hypercar', gt3: 'LMGT3', gte: 'LMGTE', lmp2: 'LMP2', gtepro: 'GTE Pro', gteam: 'GTE Am' };
const WEC_DRIVERS = {};
// Every character owns independent seasons, including empty records.
const WEC_SEASONS = Object.fromEntries(Object.keys(DATA).map(id => [id,
    Object.fromEntries(Object.keys(DATA[id].seasons).filter(year => !DATA[id].seasons[year].overviewOnly).map(year => [year, {
    calendar: [], lmp2Calendar: [], entrants: {},
    standings: { hypercar: [], gt3: [] }
}]))]));
