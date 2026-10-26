// Rens Adisea - 2024 career championship: supplied tables are authoritative, including their
// partial Le Mans results. Points are not recalculated from unfinished rounds.
// Country flags and car makes follow the supplied reference images.
Object.assign(WEC_DRIVERS, {
    lopez: { name: 'José María López', country: 'Argentina' },
    deVries: { name: 'Nyck de Vries', country: 'Netherlands' },
    conway: { name: 'Mike Conway', country: 'United Kingdom' },
    rens: { name: 'Rens Adisea', country: 'Netherlands' },
    rovera: { name: 'Alessio Rovera', country: 'Italy' },
    mann: { name: 'Simon Mann', country: 'United States' },
    pierGuidi: { name: 'Alessandro Pier Guidi', country: 'Italy' },
    giovinazzi: { name: 'Antonio Giovinazzi', country: 'Italy' },
    calado: { name: 'James Calado', country: 'United Kingdom' },
    bovy: { name: 'Sarah Bovy', country: 'Belgium' },
    gatting: { name: 'Michelle Gatting', country: 'Denmark' },
    pin: { name: 'Doriane Pin', country: 'France' }
});

WEC_SEASONS.rens['2024'] = {
    calendar: [
        { id: 'qatar', round: 1, code: 'QAT', circuit: 'Losail', country: 'Qatar',
            winners: { hypercar: { entrant: 'hy-7', drivers: ['lopez', 'deVries', 'conway'] }, gt3: { entrant: 'gt-55', drivers: ['rens', 'rovera', 'mann'] } }, results: [] },
        { id: 'monza', round: 2, code: 'ITA', circuit: 'Monza', country: 'Italy',
            winners: { hypercar: { entrant: 'hy-7', drivers: ['lopez', 'deVries', 'conway'] }, gt3: { entrant: 'gt-55', drivers: ['rens', 'rovera', 'mann'] } }, results: [] },
        { id: 'spa', round: 3, code: 'BEL', circuit: 'Spa', country: 'Belgium',
            winners: { hypercar: { entrant: 'hy-51', drivers: ['pierGuidi', 'giovinazzi', 'calado'] }, gt3: { entrant: 'gt-85', drivers: ['bovy', 'gatting', 'pin'] } }, results: [] },
        { id: 'le-mans', round: 4, code: 'FRA', circuit: 'Le Mans', country: 'France',
            winners: { gt3: { entrant: 'gt-55', drivers: ['rens', 'rovera', 'mann'] } }, results: [] },
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
    WEC_SEASONS.rens['2024'].entrants[id] = { number, team, country, car, category };
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
    WEC_SEASONS.rens['2024'].standings[category] = rows.map(([entrant, points, ...finishes], index) => ({
        position: index + 1, entrant, points,
        finishes: Object.fromEntries(WEC_SEASONS.rens['2024'].calendar.map((race, i) => [race.id, finishes[i] ?? null]))
    }));
});

// Rens Adisea — round 1. Preserve the supplied elapsed-time strings verbatim.
WEC_SEASONS.rens['2024'].calendar[0].name = 'Qatar 4 Hours';
WEC_SEASONS.rens['2024'].calendar[0].results = [
    [1, 1, 'hy-7', 127, '4:00:33.646'],
    [2, 2, 'hy-20', 127, '+38.2'],
    [3, 3, 'hy-94', 127, '+1:08.8'],
    [4, 4, 'hy-15', 127, '+1:16.2'],
    [5, 5, 'hy-5', 127, '+1:35.3'],
    [6, 6, 'hy-36', 127, '+1:44.1'],
    [7, 7, 'hy-50', 127, '+1:45.6'],
    [8, 8, 'hy-99', 126, '+1 Lap'],
    [9, 9, 'hy-2', 126, '+1 Lap'],
    [10, 10, 'hy-51', 126, '+1 Lap'],
    [11, 11, 'hy-63', 126, '+1 Lap'],
    [12, 12, 'hy-83', 126, '+1 Lap'],
    [13, 13, 'hy-38', 126, '+1 Lap'],
    [14, 14, 'hy-35', 126, '+1 Lap'],
    [15, 15, 'hy-12', 126, '+1 Lap'],
    [16, 16, 'hy-11', 126, '+1 Lap'],
    [17, 17, 'hy-8', 125, '+2 Laps'],
    [18, 18, 'hy-93', 125, '+2 Laps'],
    [19, 19, 'hy-6', 124, '+3 Laps'],
    [20, 1, 'gt-55', 115, '04:01:11.163'],
    [21, 2, 'gt-46', 114, '+1 Lap'],
    [22, 3, 'gt-777', 112, '+3 Laps'],
    [23, 4, 'gt-27', 112, '+3 Laps'],
    [24, 5, 'gt-31', 112, '+3 Laps'],
    [25, 6, 'gt-91', 112, '+3 Laps'],
    [26, 7, 'gt-78', 112, '+3 Laps'],
    [27, 8, 'gt-87', 111, '+4 Laps'],
    [28, 9, 'gt-82', 111, '+4 Laps'],
    [29, 10, 'gt-81', 111, '+4 Laps'],
    [30, 11, 'gt-92', 111, '+4 Laps'],
    [31, 12, 'gt-85', 111, '+4 Laps'],
    [32, 13, 'gt-59', 110, '+5 Laps'],
    [33, 14, 'gt-95', 110, '+5 Laps'],
    [34, 15, 'gt-77', 110, '+5 Laps'],
    [35, 16, 'gt-54', 110, '+5 Laps'],
    [36, 17, 'gt-88', 109, '+5 Laps'],
    ['DNF', null, 'gt-60', 74, '+41 Laps']
].map(([overall, classPosition, entrant, laps, gap]) => ({
    entrant, position: typeof overall === 'number' ? overall : null,
    classPosition, laps, gap,
    ...(typeof overall === 'string' ? { status: overall } : {})
}));

// Rens Adisea — round 2. DNF entries retain their supplied order and blank P.
WEC_SEASONS.rens['2024'].calendar[1].name = 'Monza 4 Hours';
WEC_SEASONS.rens['2024'].calendar[1].results = [
    [1, 1, 'hy-7', 141, '4:00:14.788'],
    [2, 2, 'hy-50', 141, '+44.0'],
    [3, 3, 'hy-83', 141, '+44.5'],
    [4, 4, 'hy-12', 141, '+59.2'],
    [5, 5, 'hy-51', 141, '+1:02.0'],
    [6, 6, 'hy-99', 141, '+1:32.1'],
    [7, 7, 'hy-15', 140, '+1 Lap'],
    [8, 8, 'hy-2', 140, '+1 Lap'],
    [9, 9, 'hy-8', 140, '+1 Lap'],
    [10, 10, 'hy-11', 140, '+1 Lap'],
    [11, 11, 'hy-20', 140, '+1 Lap'],
    [12, 12, 'hy-35', 140, '+1 Lap'],
    [13, 13, 'hy-63', 140, '+1 Lap'],
    [14, 14, 'hy-6', 139, '+2 Laps'],
    [15, 15, 'hy-36', 139, '+2 Laps'],
    [16, 16, 'hy-94', 138, '+ 3 Laps'],
    [17, 17, 'hy-93', 137, '+4 Laps'],
    [18, 1, 'gt-55', 123, '4:00:58.300'],
    [19, 2, 'gt-46', 123, '+41.0'],
    [20, 3, 'gt-27', 122, '+1 Lap'],
    [21, 4, 'gt-91', 122, '+1 Lap'],
    [22, 5, 'gt-92', 122, '+1 Lap'],
    [23, 6, 'gt-31', 122, '+1 Lap'],
    [24, 7, 'gt-82', 122, '+1 Lap'],
    [25, 8, 'gt-60', 122, '+1 Lap'],
    [26, 9, 'gt-85', 121, '+2 Laps'],
    [27, 10, 'gt-54', 121, '+2 Laps'],
    [28, 11, 'gt-81', 121, '+2 Laps'],
    [29, 12, 'gt-78', 121, '+2 Laps'],
    [30, 13, 'gt-87', 121, '+2 Laps'],
    [31, 14, 'gt-59', 121, '+2 Laps'],
    [32, 15, 'gt-77', 121, '+2 Laps'],
    [33, 16, 'gt-95', 121, '+2 Laps'],
    [34, 17, 'gt-88', 120, '+3 Laps'],
    ['DNF', null, 'hy-38', 80, '+61 Laps'],
    ['DNF', null, 'gt-777', 38, '+85 Laps'],
    ['DNF', null, 'hy-5', 30, '+111 Laps']
].map(([overall, classPosition, entrant, laps, gap]) => ({
    entrant, position: typeof overall === 'number' ? overall : null,
    classPosition, laps, gap,
    ...(typeof overall === 'string' ? { status: overall } : {})
}));

// Rens Adisea — round 3. Class gaps and retirement order follow the source.
WEC_SEASONS.rens['2024'].calendar[2].name = 'Spa 4 Hours';
WEC_SEASONS.rens['2024'].calendar[2].results = [
    [1, 1, 'hy-51', 97, '4:00:07.440'],
    [2, 2, 'hy-50', 97, '+9.9'],
    [3, 3, 'hy-5', 97, '+13.9'],
    [4, 4, 'hy-99', 97, '+15.6'],
    [5, 5, 'hy-83', 97, '+25.4'],
    [6, 6, 'hy-38', 97, '+28.6'],
    [7, 7, 'hy-12', 97, '+28.9'],
    [8, 8, 'hy-63', 97, '+34.0'],
    [9, 9, 'hy-8', 97, '+43.5'],
    [10, 10, 'hy-2', 97, '+44.6'],
    [11, 11, 'hy-15', 97, '+51.4'],
    [12, 12, 'hy-7', 97, '+1:07.3'],
    [13, 13, 'hy-20', 96, '+1 Lap'],
    [14, 14, 'hy-6', 96, '+1 Lap'],
    [15, 15, 'hy-94', 96, '+1 Lap'],
    [16, 16, 'hy-93', 96, '+1 Lap'],
    [17, 1, 'gt-85', 87, '4:01:22.270'],
    [18, 2, 'gt-82', 87, '+4.4'],
    [19, 3, 'gt-81', 87, '+5.7'],
    [20, 4, 'gt-87', 87, '+13.0'],
    [21, 5, 'gt-78', 87, '+22.7'],
    [22, 6, 'gt-31', 87, '+1:17.5'],
    [23, 7, 'gt-60', 86, '+1 Lap'],
    [24, 8, 'gt-55', 86, '+1 Lap'],
    [25, 9, 'gt-54', 86, '+1 Lap'],
    [26, 10, 'gt-95', 85, '+2 Laps'],
    [27, 11, 'gt-59', 85, '+2 Laps'],
    [28, 12, 'gt-88', 84, '+3 Laps'],
    [29, 13, 'gt-46', 76, '+11 Laps'],
    ['DNF', null, 'hy-35', 25, '+72 Laps'],
    ['DNF', null, 'gt-91', 25, '+62 Laps'],
    ['DNF', null, 'gt-77', 24, '+63 Laps'],
    ['DNF', null, 'gt-92', 22, '+65 Laps'],
    ['DNF', null, 'gt-27', 21, '+66 Laps'],
    ['DNF', null, 'gt-777', 15, '+72 Laps'],
    ['DNF', null, 'hy-11', 13, '+84 Laps'],
    ['DNF', null, 'hy-36', 1, '+96 Laps']
].map(([overall, classPosition, entrant, laps, gap]) => ({
    entrant, position: typeof overall === 'number' ? overall : null,
    classPosition, laps, gap,
    ...(typeof overall === 'string' ? { status: overall } : {})
}));


// Rens Adisea - round 4 is still running. Blank template places are not results.
WEC_SEASONS.rens['2024'].entrants['gt-86'] = {
    number: '86', team: 'GR Racing', country: null, car: 'Ferrari', category: 'gt3'
};
Object.assign(WEC_SEASONS.rens['2024'].calendar[3], {
    name: 'Le Mans 8 Hours',
    inProgress: true,
    results: [
        ['hy-99', 66],
        ['gt-86', 33],
        ['gt-54', 23],
        ['gt-91', 16],
        ['gt-82', 9],
        ['hy-11', 5],
        ['gt-777', 5],
        ['gt-60', 4],
        ['gt-27', 2]
    ].map(([entrant, laps]) => ({
        entrant, position: null, classPosition: null, status: 'DNF', laps, gap: null
    }))
});

// Completed classifications drive analytics; the live Le Mans race stays excluded.
WEC_SEASONS.rens['2024'].calendar.slice(0, 3).forEach(race => { race.completed = true; });
WEC_SEASONS.rens['2024'].calendar[3].pointsMultiplier = 2;
