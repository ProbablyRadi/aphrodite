// Empty career records. Unknown values stay null until source data is supplied.
const SEASON_YEARS = ['2023', '2024', '2025', '2026'];
const DATA = Object.fromEntries([
    ['rens', 'Rens Adisea'],
    ['jordan', 'Jordan Vale'],
    ['vasi', 'Vasiliki']
].map(([id, name]) => [id, {
    name,
    seasons: Object.fromEntries(SEASON_YEARS.map(year => [year, {
        team: null, car: null, category: null, position: null,
        starts: null, wins: null, podiums: null, poles: null, points: null,
        // Personal career totals are separate from this character's race tables.
    }]))
}]));

const WEC_CLASSES = { hypercar: 'Hypercar', gt3: 'LMGT3', lmp2: 'LMP2' };
const WEC_DRIVERS = {};
// Every character owns independent seasons, including empty records.
const WEC_SEASONS = Object.fromEntries(Object.keys(DATA).map(id => [id,
    Object.fromEntries(SEASON_YEARS.map(year => [year, {
    calendar: [], lmp2Calendar: [], entrants: {},
    standings: { hypercar: [], gt3: [] }
}]))]));
