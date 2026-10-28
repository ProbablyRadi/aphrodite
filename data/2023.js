// Custom 2023 calendars and rosters supplied for Rens and Jordan.
// Results are independent and remain unreported. Team flags and car identities
// are cross-checked against the 2023 WEC entry list; source notes below.
const ENTRANTS_2023 = {
    hypercar: [
        ['2', 'Cadillac Racing', 'United States', 'Cadillac', 'Cadillac V-Series.R'],
        ['4', 'Floyd Vanwall Racing Team', 'Austria', 'Vanwall', 'Vanwall Vandervell 680'],
        ['5', 'Porsche Penske Motorsport', 'Germany', 'Porsche', 'Porsche 963'],
        ['6', 'Porsche Penske Motorsport', 'Germany', 'Porsche', 'Porsche 963'],
        ['7', 'Toyota Gazoo Racing', 'Japan', 'Toyota', 'Toyota GR010 Hybrid'],
        ['8', 'Toyota Gazoo Racing', 'Japan', 'Toyota', 'Toyota GR010 Hybrid'],
        ['38', 'Hertz Team Jota', 'United Kingdom', 'Porsche', 'Porsche 963'],
        ['50', 'Ferrari AF Corse', 'Italy', 'Ferrari', 'Ferrari 499P'],
        ['51', 'Ferrari AF Corse', 'Italy', 'Ferrari', 'Ferrari 499P'],
        ['93', 'Peugeot TotalEnergies', 'France', 'Peugeot', 'Peugeot 9X8'],
        ['94', 'Peugeot TotalEnergies', 'France', 'Peugeot', 'Peugeot 9X8'],
        ['99', 'Proton Competition', 'Germany', 'Porsche', 'Porsche 963'],
        ['708', 'Glickenhaus Racing', 'United States', 'Glickenhaus', 'Glickenhaus SCG 007 LMH']
    ],
    gte: [
        ['21', 'AF Corse', 'Italy', 'Ferrari', 'Ferrari 488 GTE Evo'],
        ['54', 'AF Corse', 'Italy', 'Ferrari', 'Ferrari 488 GTE Evo'],
        ['83', 'Richard Mille AF Corse', 'Italy', 'Ferrari', 'Ferrari 488 GTE Evo'],
        ['777', "D'Station Racing", 'Japan', 'Aston Martin', 'Aston Martin Vantage AMR'],
        ['25', 'ORT by TF', 'Oman', 'Aston Martin', 'Aston Martin Vantage AMR'],
        ['33', 'Corvette Racing', 'United States', 'Corvette', 'Chevrolet Corvette C8.R'],
        ['56', 'Project 1 - AO Racing', 'Germany', 'Porsche', 'Porsche 911 RSR-19'],
        ['57', 'Kessel Racing', 'Switzerland', 'Ferrari', 'Ferrari 488 GTE Evo'],
        ['60', 'Iron Lynx', 'Italy', 'Porsche', 'Porsche 911 RSR-19'],
        ['85', 'Iron Dames', 'Italy', 'Porsche', 'Porsche 911 RSR-19'],
        ['77', 'Dempsey-Proton Racing', 'Germany', 'Porsche', 'Porsche 911 RSR-19'],
        ['88', 'Proton Competition', 'Germany', 'Porsche', 'Porsche 911 RSR-19'],
        ['86', 'GR Racing', 'United Kingdom', 'Porsche', 'Porsche 911 RSR-19'],
        ['98', 'NorthWest AMR', 'Canada', 'Aston Martin', 'Aston Martin Vantage AMR']
    ],
    lmp2: [
        ['9', 'Prema Racing', 'Italy', 'Oreca', 'Oreca 07'],
        ['63', 'Prema Racing', 'Italy', 'Oreca', 'Oreca 07'],
        ['10', 'Vector Sport', 'United Kingdom', 'Oreca', 'Oreca 07'],
        ['22', 'United Autosports', 'United Kingdom', 'Oreca', 'Oreca 07'],
        ['23', 'United Autosports', 'United Kingdom', 'Oreca', 'Oreca 07'],
        ['28', 'Jota', 'United Kingdom', 'Oreca', 'Oreca 07'],
        ['31', 'Team WRT', 'Belgium', 'Oreca', 'Oreca 07'],
        ['41', 'Team WRT', 'Belgium', 'Oreca', 'Oreca 07'],
        ['34', 'Inter Europol Competition', 'Poland', 'Oreca', 'Oreca 07'],
        ['35', 'Alpine Elf Team', 'France', 'Oreca', 'Oreca 07'],
        ['36', 'Alpine Elf Team', 'France', 'Oreca', 'Oreca 07']
    ]
};

function create2023Season(roster = ENTRANTS_2023, schedule = [
        ['daytona', 'DAY', 'Daytona', 'United States'],
        ['portimao', 'POR', 'Portimão', 'Portugal'],
        ['spa', 'BEL', 'Spa', 'Belgium'],
        ['le-mans', 'FRA', 'Le Mans', 'France'],
        ['monza', 'ITA', 'Monza', 'Italy'],
        ['fuji', 'JPN', 'Fuji', 'Japan'],
        ['road-atlanta', 'ATL', 'Road Atlanta', 'United States']
    ]) {
    const calendar = schedule.map(([id, code, circuit, country], index) => ({
        id, code, circuit, country, round: index + 1,
        winners: {}, results: [], pointsMultiplier: id === 'le-mans' ? 2 : 1
    }));
    const entrants = {}, standings = {};
    for (const [category, rows] of Object.entries(roster)) {
        standings[category] = rows.map(([number, team, country, manufacturer, car], index) => {
            const id = category + '-' + number;
            entrants[id] = { number, team, country, manufacturer, car, category };
            return {
                position: index + 1, entrant: id, points: 0,
                finishes: Object.fromEntries(calendar.map(race => [race.id, null]))
            };
        });
    }
    return {
        calendar, entrants, standings, categories: ['hypercar', 'gte', 'lmp2'],
        overviewGroups: [['hypercar', 'gte']],
        lmp2Calendar: calendar.map(race => ({ round: race.round, race: race.id }))
    };
}
WEC_SEASONS.rens['2023'] = create2023Season();
WEC_SEASONS.jordan['2023'] = create2023Season({
    ...ENTRANTS_2023,
    hypercar: [
        ENTRANTS_2023.hypercar[0],
        ['3', 'Cadillac Racing', 'United States', 'Cadillac', 'Cadillac V-Series.R'],
        ...ENTRANTS_2023.hypercar.slice(1)
    ]
}, [
    ['sebring', 'SEB', 'Sebring', 'United States'],
    ['portimao', 'POR', 'Portimão', 'Portugal'],
    ['spa', 'BEL', 'Spa', 'Belgium'],
    ['le-mans', 'FRA', 'Le Mans', 'France'],
    ['monza', 'ITA', 'Monza', 'Italy'],
    ['fuji', 'JPN', 'Fuji', 'Japan'],
    ['daytona', 'DAY', 'Daytona', 'United States'],
    ['road-atlanta', 'ATL', 'Road Atlanta', 'United States']
]);
