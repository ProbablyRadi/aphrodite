// Personal career records. Unknown values stay null until source data is supplied.
const SEASON_YEARS = ['2022', '2023', '2024', '2025', '2026'];
const DATA = Object.fromEntries([
    ['rens', 'Rens Adisea'],
    ['jordan', 'Jordan Vale'],
    ['vasi', 'Vasiliki Dimitriou']
].map(([id, name]) => [id, {
    name,
    seasons: Object.fromEntries(SEASON_YEARS.filter(year => (year !== '2022' || id === 'rens') && (id !== 'vasi' || year !== '2023')).map(year => [year, {
        team: null, car: null, category: null, number: null, position: null,
        starts: null, wins: null, podiums: null, poles: null, points: null,
        // Personal career totals are separate from this character's race tables.
    }]))
}]));

// Career equipment supplied independently of championship entrant records.
Object.entries({
    '2022': { overviewOnly: true, number: '56', team: 'Team Project 1', car: 'Porsche 911 RSR', category: 'GTE', position: 7, starts: 6, wins: 0, podiums: 2, poles: 0, points: 55 },
    '2023': { number: '56', team: 'Project 1 – AO Racing', car: 'Porsche 911 RSR', category: 'GTE' },
    '2024': { number: '55', team: 'AF Corse', car: 'Ferrari 296 GTB', category: 'GT3' },
    '2025': { number: '21', team: 'AF Corse', car: 'Ferrari 296 GTB', category: 'GT3' },
    '2026': { number: '91', team: 'Manthey DK Engineering', car: 'Porsche 911 GT3', category: 'GT3' }
}).forEach(([year, equipment]) => Object.assign(DATA.rens.seasons[year], equipment));

Object.entries({
    '2023': { number: '4', team: 'Floyd Vanwall Racing Team', car: 'Vanwall Vandervell 680', category: 'Hypercar' },
    '2024': { number: '2', team: 'Cadillac Racing', car: 'Cadillac', category: 'Hypercar' },
    '2025': { number: '38', team: 'Hertz Team Jota Cadillac', car: 'Cadillac', category: 'Hypercar' },
    '2026': { number: '38', team: 'Hertz Team Jota Cadillac', car: 'Cadillac', category: 'Hypercar' }
}).forEach(([year, equipment]) => Object.assign(DATA.jordan.seasons[year], equipment));

Object.entries({
    '2024': { number: '23', team: 'United Autosports', car: 'McLaren 720S GT3', category: 'GT3' },
    '2025': { number: '4', team: 'DKR Engineering', car: 'Ginetta G61-LT-P3 Evo', category: 'LMP3' },
    '2026': { number: '3', team: 'DKR Engineering', car: 'Oreca 07', category: 'LMP2' }
}).forEach(([year, equipment]) => Object.assign(DATA.vasi.seasons[year], equipment));

const WEC_CLASSES = { hypercar: 'Hypercar', gt3: 'LMGT3', gte: 'LMGTE', lmp2: 'LMP2', gtepro: 'GTE Pro', gteam: 'GTE Am' };
const WEC_DRIVERS = {};
// Every character owns independent seasons, including empty records.
const WEC_SEASONS = Object.fromEntries(Object.keys(DATA).map(id => [id,
    Object.fromEntries(Object.keys(DATA[id].seasons).filter(year => !DATA[id].seasons[year].overviewOnly).map(year => [year, {
    calendar: [], lmp2Calendar: [], entrants: {},
    standings: { hypercar: [], gt3: [] }
}]))]));
