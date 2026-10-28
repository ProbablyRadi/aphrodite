// Rens Adisea - 2024 career championship: supplied tables are authoritative, including their
// final Le Mans results. Guest cars do not take season championship points.
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


// Rens Adisea — final round 4 classification, supplied on 28 October 2026.
WEC_SEASONS.rens['2024'].entrants['gt-86'] = {
    number: '86', team: 'GR Racing', country: 'United Kingdom', car: 'Ferrari', category: 'gt3', championshipEligible: false
};
const LE_MANS_GUESTS_2024 = [
    ['hy-4','4','Porsche Penske Motorsport','Porsche','hypercar'],
    ['hy-3','3','Cadillac Racing','Cadillac','hypercar'],
    ['hy-311','311','Whelen Cadillac Racing','Cadillac','hypercar'],
    ['hy-19','19','Lamborghini Iron Lynx','Lamborghini','hypercar'],
    ['p2-22','22','United Autosports','Oreca','lmp2'],
    ['p2-24','24','Nielsen Racing','Oreca','lmp2'],
    ['p2-37','37','Cool Racing','Oreca','lmp2'],
    ['p2-25','25','Algarve Pro Racing','Oreca','lmp2'],
    ['p2-183','183','AF Corse','Oreca','lmp2'],
    ['p2-30','30','Duqueine Team','Oreca','lmp2'],
    ['p2-34','34','Inter Europol Competition','Oreca','lmp2'],
    ['p2-10','10','Vector Sport','Oreca','lmp2'],
    ['p2-9','9','Proton Competition','Oreca','lmp2'],
    ['p2-45','45','Crowdstrike Racing by APR','Oreca','lmp2'],
    ['p2-23','23','United Autosports USA','Oreca','lmp2'],
    ['p2-65','65','Panis Racing','Oreca','lmp2'],
    ['p2-47','47','Cool Racing','Oreca','lmp2'],
    ['p2-33','33','DKR Engineering','Oreca','lmp2'],
    ['p2-14','14','AO by TF','Oreca','lmp2'],
    ['p2-28','28','IDEC Sport','Oreca','lmp2'],
    ['gt-66','66','JMW Motorsport','Ferrari','gt3'],
    ['gt-70','70','Inception Racing','McLaren','gt3'],
    ['gt-155','155','Spirit of Race','Ferrari','gt3'],
    ['gt-44','44','Proton Racing','Ford','gt3']
];
LE_MANS_GUESTS_2024.forEach(([id, number, team, car, category]) => {
    const guestCountries = { 'hy-311': 'United States', 'p2-22': 'United Kingdom', 'p2-24': 'United Kingdom',
        'p2-37': 'Switzerland', 'p2-25': 'Portugal', 'p2-30': 'France', 'p2-34': 'Poland',
        'p2-10': 'United Kingdom', 'p2-45': 'Portugal', 'p2-23': 'United States', 'p2-65': 'France',
        'p2-47': 'Switzerland', 'p2-33': 'Luxembourg', 'p2-14': 'United States', 'p2-28': 'France',
        'gt-66': 'United Kingdom', 'gt-70': 'United Kingdom', 'gt-155': 'Switzerland' };
    const knownTeam = Object.values(WEC_SEASONS.rens['2024'].entrants).find(entry => entry.team === team && entry.country);
    WEC_SEASONS.rens['2024'].entrants[id] = { number, team, car: category === 'lmp2' ? 'Oreca 07' : car,
        manufacturer: car, category, country: guestCountries[id] ?? knownTeam?.country ?? null, championshipEligible: false };
});
Object.assign(WEC_DRIVERS, {
    jarvis: { name: 'Oliver Jarvis', country: 'United Kingdom' },
    garg: { name: 'Bijoy Garg', country: 'United States' },
    siegel: { name: 'Nolan Siegel', country: 'United States' },
    kubica: { name: 'Robert Kubica', country: 'Poland' },
    schwartzman: { name: 'Robert Schwartzman', country: 'Israel' },
    ye: { name: 'Yifei Ye', country: 'China' }
});
Object.assign(WEC_SEASONS.rens['2024'].calendar[3], {
    name: 'Le Mans 8 Hours',
    inProgress: false, completed: true, pointsMultiplier: 2,
    winners: {
        hypercar: { entrant: 'hy-83', drivers: ['kubica', 'schwartzman', 'ye'] },
        gt3: { entrant: 'gt-55', drivers: ['rens', 'rovera', 'mann'] },
        lmp2: { entrant: 'p2-22', drivers: ['jarvis', 'garg', 'siegel'] }
    },
    results: [
        [1,1,'hy-83',122,'8:02:43.615'], [2,2,'hy-51',122,'+18.3'],
        [3,3,'hy-7',122,'+37.6'], [4,4,'hy-50',122,'+38.4'],
        [5,5,'hy-4',122,'+46.7'], [6,6,'hy-5',122,'+1:03.0'],
        [7,7,'hy-6',122,'+104.2'], [8,8,'hy-8',122,'+1:12.8'],
        [9,9,'hy-12',122,'+1:39.8'], [10,10,'hy-15',122,'+3:00.9'],
        [11,11,'hy-2',122,'+3:14.1'], [12,12,'hy-3',122,'+3:30.7'],
        [13,13,'hy-20',121,'+1 Lap'], [14,14,'hy-311',121,'+1 Lap'],
        [15,15,'hy-38',121,'+1 Lap'], [16,16,'hy-19',121,'+1 Lap'],
        [17,17,'hy-35',120,'+2 Laps'], [18,18,'hy-63',120,'+2 Laps'],
        [19,19,'hy-94',120,'+2 Laps'], [20,20,'hy-93',120,'+2 Laps'],
        [21,1,'p2-22',117,'8:05:02.068'], [22,2,'p2-24',117,'+54.4'],
        [23,3,'p2-37',116,'+1 Lap'], [24,4,'p2-25',116,'+1 Lap'],
        [25,5,'p2-183',116,'+1 Lap'], [26,6,'p2-30',116,'+1 Lap'],
        [27,7,'p2-34',116,'+1 Lap'], [28,8,'p2-10',116,'+1 Lap'],
        [29,9,'p2-9',116,'+1 Lap'], [30,10,'p2-45',116,'+1 Lap'],
        [31,11,'p2-23',116,'+1 Lap'], [32,12,'p2-65',116,'+1 Lap'],
        [33,13,'p2-47',116,'+1 Lap'], [34,14,'p2-33',116,'+1 Lap'],
        [35,15,'p2-14',116,'+1 Lap'], [36,1,'gt-55',106,'8:02:48.322'],
        [37,2,'gt-78',106,'+2:55.3'], [38,3,'gt-46',106,'+3:07.6'],
        [39,4,'gt-87',106,'+3:09.5'], [40,5,'gt-85',105,'+1 Lap'],
        [41,6,'gt-31',105,'+1 Lap'], [42,7,'gt-66',105,'+1 Lap'],
        [43,8,'gt-70',105,'+1 Lap'], [44,9,'gt-155',105,'+1 Lap'],
        [45,10,'gt-59',105,'+1 Lap'], [46,11,'gt-77',105,'+1 Lap'],
        [47,12,'gt-95',104,'+2 Laps'], [48,13,'gt-44',104,'+2 Laps'],
        [49,14,'gt-88',104,'+2 Laps'], [50,15,'gt-81',104,'+2 Laps'],
        [51,16,'gt-92',93,'+13 Laps'],
        ['DNF',null,'hy-36',110,'+11 Laps'], ['DNF',null,'p2-28',107,'+9 Laps'],
        ['DNF',null,'hy-99',66,'+56 Laps'], ['DNF',null,'gt-86',33,'+73 Laps'],
        ['DNF',null,'gt-54',23,'+83 Laps'], ['DNF',null,'gt-91',16,'+90 Laps'],
        ['DNF',null,'gt-82',9,'+97 Laps'], ['DNF',null,'hy-11',5,'+117 Laps'],
        ['DNF',null,'gt-777',5,'+101 Laps'], ['DNF',null,'gt-60',4,'+102 Laps'],
        ['DNF',null,'gt-27',2,'+104 Laps']
    ].map(([overall, classPosition, entrant, laps, gap]) => ({
        entrant, position: typeof overall === 'number' ? overall : null,
        classPosition, status: overall === 'DNF' ? 'DNF' : null, laps, gap
    }))
});

// Completed classifications drive analytics.
WEC_SEASONS.rens['2024'].calendar.slice(0, 3).forEach(race => { race.completed = true; });
WEC_SEASONS.rens['2024'].calendar[3].pointsMultiplier = 2;
WEC_SEASONS.rens['2024'].scoringNote = 'Scoring: 25–18–15–12–10–8–6–4–2–1; Le Mans awards double points. Le Mans-only guest cars keep their race positions but are excluded when awarding championship points.';
// Guest cars retain their race places but do not take championship points.
for (const category of ['hypercar', 'gt3']) {
    const championship = WEC_SEASONS.rens['2024'];
    const race = championship.calendar[3];
    const eligible = new Set(championship.standings[category].map(row => row.entrant));
    let scoringPosition = 0;
    for (const result of race.results.filter(row => championship.entrants[row.entrant].category === category)) {
        result.awardedPoints = eligible.has(result.entrant) && !result.status
            ? ([25,18,15,12,10,8,6,4,2,1][scoringPosition++] || 0) * 2 : 0;
    }
    for (const standing of championship.standings[category]) {
        const result = race.results.find(row => row.entrant === standing.entrant);
        standing.points += result.awardedPoints;
        standing.finishes['le-mans'] = result.status || result.classPosition;
    }
}
