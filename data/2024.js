// Jordan Vale - 2024 career championship: supplied tables are authoritative, including their
// partial Le Mans results. Points are not recalculated from unfinished rounds.
// Country flags and car makes follow the supplied reference images.
Object.assign(WEC_DRIVERS, {
    lopez: { name: 'José María López', country: 'Argentina' },
    deVries: { name: 'Nyck de Vries', country: 'Netherlands' },
    conway: { name: 'Mike Conway', country: 'United Kingdom' },
    jordan: { name: 'Jordan Vale', country: 'United Kingdom' },
    rovera: { name: 'Alessio Rovera', country: 'Italy' },
    mann: { name: 'Simon Mann', country: 'United States' },
    pierGuidi: { name: 'Alessandro Pier Guidi', country: 'Italy' },
    giovinazzi: { name: 'Antonio Giovinazzi', country: 'Italy' },
    calado: { name: 'James Calado', country: 'United Kingdom' },
    bovy: { name: 'Sarah Bovy', country: 'Belgium' },
    gatting: { name: 'Michelle Gatting', country: 'Denmark' },
    pin: { name: 'Doriane Pin', country: 'France' }
});

WEC_SEASONS.jordan['2024'] = {
    calendar: [
        { id: 'qatar', round: 1, code: 'QAT', circuit: 'Losail', country: 'Qatar',
            winners: { hypercar: { entrant: 'hy-7', drivers: ['lopez', 'deVries', 'conway'] }, gt3: { entrant: 'gt-55', drivers: ['jordan', 'rovera', 'mann'] } }, results: [] },
        { id: 'monza', round: 2, code: 'ITA', circuit: 'Monza', country: 'Italy',
            winners: { hypercar: { entrant: 'hy-7', drivers: ['lopez', 'deVries', 'conway'] }, gt3: { entrant: 'gt-55', drivers: ['jordan', 'rovera', 'mann'] } }, results: [] },
        { id: 'spa', round: 3, code: 'BEL', circuit: 'Spa', country: 'Belgium',
            winners: { hypercar: { entrant: 'hy-51', drivers: ['pierGuidi', 'giovinazzi', 'calado'] }, gt3: { entrant: 'gt-85', drivers: ['bovy', 'gatting', 'pin'] } }, results: [] },
        { id: 'le-mans', round: 4, code: 'FRA', circuit: 'Le Mans', country: 'France',
            winners: { gt3: { entrant: 'gt-55', drivers: ['jordan', 'rovera', 'mann'] } }, results: [] },
        { id: 'long-beach', round: 5, code: 'LGB', circuit: 'Long Beach', country: 'United States', winners: {}, results: [] },
        { id: 'cota', round: 6, code: 'COT', circuit: 'COTA', country: 'United States', winners: {}, results: [] },
        { id: 'barcelona', round: 7, code: 'ESP', circuit: 'Barcelona', country: 'Spain', winners: {}, results: [] },
        { id: 'fuji', round: 8, code: 'JPN', circuit: 'Fuji', country: 'Japan', winners: {}, results: [] }
    ],
    lmp2Calendar: [{ round: 1, race: 'le-mans' }],
    entrants: {},
    standings: { hypercar: [], gt3: [] }
};

// One entrant record supplies the name, number, make and flag in every table.
[
    ['hy-7', '7', 'Toyota Gazoo Racing', 'Japan', 'Toyota', 'hypercar'],
    ['hy-50', '50', 'Ferrari AF Corse', 'Italy', 'Ferrari', 'hypercar'],
    ['hy-51', '51', 'Ferrari AF Corse', 'Italy', 'Ferrari', 'hypercar'],
    ['hy-83', '83', 'AF Corse', 'Italy', 'Ferrari', 'hypercar'],
    ['hy-5', '5', 'Porsche Penske Motorsport', 'Germany', 'Porsche', 'hypercar'],
    ['hy-99', '99', 'Proton Competition', 'Germany', 'Porsche', 'hypercar'],
    ['hy-20', '20', 'BMW M Team WRT', 'Belgium', 'BMW', 'hypercar'],
    ['hy-15', '15', 'BMW M Team WRT', 'Belgium', 'BMW', 'hypercar'],
    ['hy-12', '12', 'Hertz Team Jota', 'United Kingdom', 'Porsche', 'hypercar'],
    ['hy-94', '94', 'Peugeot TotalEnergies', 'France', 'Peugeot', 'hypercar'],
    ['hy-36', '36', 'Alpine Endurance Team', 'France', 'Alpine', 'hypercar'],
    ['hy-38', '38', 'Hertz Team Jota', 'United Kingdom', 'Porsche', 'hypercar'],
    ['hy-2', '2', 'Cadillac Racing', 'United States', 'Cadillac', 'hypercar'],
    ['hy-8', '8', 'Toyota Gazoo Racing', 'Japan', 'Toyota', 'hypercar'],
    ['hy-63', '63', 'Lamborghini Iron Lynx', 'Italy', 'Lamborghini', 'hypercar'],
    ['hy-11', '11', 'Isotta Fraschini', 'Italy', 'Isotta Fraschini', 'hypercar'],
    ['hy-35', '35', 'Alpine Endurance Team', 'France', 'Alpine', 'hypercar'],
    ['hy-93', '93', 'Peugeot TotalEnergies', 'France', 'Peugeot', 'hypercar'],
    ['hy-6', '6', 'Porsche Penske Motorsport', 'Germany', 'Porsche', 'hypercar'],
    ['gt-55', '55', 'Vista AF Corse', 'Italy', 'Ferrari', 'gt3'],
    ['gt-46', '46', 'Team WRT', 'Belgium', 'BMW', 'gt3'],
    ['gt-27', '27', 'Heart of Racing Team', 'United States', 'Aston Martin', 'gt3'],
    ['gt-85', '85', 'Iron Dames', 'Italy', 'Lamborghini', 'gt3'],
    ['gt-31', '31', 'Team WRT', 'Belgium', 'BMW', 'gt3'],
    ['gt-82', '82', 'TF Sport', 'United Kingdom', 'Corvette', 'gt3'],
    ['gt-91', '91', 'Manthey Ema', 'Germany', 'Porsche', 'gt3'],
    ['gt-78', '78', 'Akkodis ASP Team', 'France', 'Lexus', 'gt3'],
    ['gt-87', '87', 'Akkodis ASP Team', 'France', 'Lexus', 'gt3'],
    ['gt-81', '81', 'TF Sport', 'United Kingdom', 'Corvette', 'gt3'],
    ['gt-777', '777', "D'Station Racing", 'Japan', 'Aston Martin', 'gt3'],
    ['gt-92', '92', 'Manthey PureRxing', 'Germany', 'Porsche', 'gt3'],
    ['gt-60', '60', 'Iron Lynx', 'Italy', 'Lamborghini', 'gt3'],
    ['gt-54', '54', 'Vista AF Corse', 'Italy', 'Ferrari', 'gt3'],
    ['gt-95', '95', 'United Autosports', 'United Kingdom', 'McLaren', 'gt3'],
    ['gt-59', '59', 'United Autosports', 'United Kingdom', 'McLaren', 'gt3'],
    ['gt-77', '77', 'Proton Racing', 'Germany', 'Ford', 'gt3'],
    ['gt-88', '88', 'Proton Racing', 'Germany', 'Ford', 'gt3']
].forEach(([id, number, team, country, car, category]) => {
    WEC_SEASONS.jordan['2024'].entrants[id] = { number, team, country, car, category };
});

// Rows: entrant ID, points, then class finishes in calendar order.
// Missing columns remain null; DNF and confirmed zero points remain explicit.
const STANDINGS_2024 = {
    hypercar: [
        ['hy-7', 50, 1, 1, 12], ['hy-50', 42, 7, 2, 2],
        ['hy-51', 36, 10, 5, 1], ['hy-83', 25, 12, 3, 5],
        ['hy-5', 25, 5, 'DNF', 3], ['hy-99', 24, 8, 6, 4, 'DNF'],
        ['hy-20', 18, 2, 11, 13], ['hy-15', 18, 4, 7, 11],
        ['hy-12', 18, 15, 4, 7], ['hy-94', 15, 3, 16, 15],
        ['hy-36', 8, 6, 15, 'DNF'], ['hy-38', 8, 13, 'DNF', 6],
        ['hy-2', 7, 9, 8, 10], ['hy-8', 4, 17, 9, 9],
        ['hy-63', 4, 11, 13, 8], ['hy-11', 1, 16, 10, 'DNF', 'DNF'],
        ['hy-35', 0, 14, 12, 'DNF'], ['hy-93', 0, 18, 17, 16],
        ['hy-6', 0, 19, 14, 14]
    ],
    gt3: [
        ['gt-55', 54, 1, 1, 8], ['gt-46', 36, 2, 2, 13],
        ['gt-27', 27, 4, 3, 'DNF', 'DNF'], ['gt-85', 27, 12, 9, 1],
        ['gt-31', 26, 5, 6, 6], ['gt-82', 26, 9, 7, 2, 'DNF'],
        ['gt-91', 20, 6, 4, 'DNF', 'DNF'], ['gt-78', 16, 7, 12, 5],
        ['gt-87', 16, 8, 13, 4], ['gt-81', 16, 10, 11, 3],
        ['gt-777', 15, 3, 'DNF', 'DNF', 'DNF'], ['gt-92', 10, 11, 5, 'DNF'],
        ['gt-60', 10, 'DNF', 8, 7, 'DNF'], ['gt-54', 3, 16, 10, 9, 'DNF'],
        ['gt-95', 1, 14, 16, 10], ['gt-59', 0, 13, 14, 11],
        ['gt-77', 0, 15, 15, 'DNF'], ['gt-88', 0, 17, 17, 12]
    ]
};
Object.entries(STANDINGS_2024).forEach(([category, rows]) => {
    WEC_SEASONS.jordan['2024'].standings[category] = rows.map(([entrant, points, ...finishes], index) => ({
        position: index + 1, entrant, points,
        finishes: Object.fromEntries(WEC_SEASONS.jordan['2024'].calendar.map((race, i) => [race.id, finishes[i] ?? null]))
    }));
});

