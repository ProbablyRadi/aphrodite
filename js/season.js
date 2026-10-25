// Reusable table renderers; each character has independent championship records.
function season(id, year) {
    const character = DATA[id];
    const record = character.seasons[year];
    const championship = WEC_SEASONS[id][year];
    app.className = 'season-page';
    nav.innerHTML = careerNavigator(id, year);
    const sectionLinks = [
        ['results', 'Race results overview'], ['hypercar', 'Hypercar standings'],
        ['gt3', 'GT3 standings'], ['races', 'Individual race results'], ['overview', 'Season overview']
    ];
    app.innerHTML = `<section class="season-hero">
        <div class="season-breadcrumb"><a href="#home">Characters</a> / <a href="#${id}">${esc(character.name)}</a> / ${year}</div>
        <div class="season-eyebrow">World Endurance Championship</div>
        <h1>${year} race season</h1>
        <p class="season-subtitle">${esc(character.name)} · Le Mans Ultimate</p>
        <div class="season-kpis">${[['Position', 'position'], ['Race starts', 'starts'], ['Race wins', 'wins'], ['Podiums', 'podiums'], ['Points', 'points']].map(([label, key]) => `<div><span>${label}</span><b>${displayValue(record[key])}</b></div>`).join('')}</div>
    </section>
    <nav class="season-jump" aria-label="Season sections"><b>On this page</b><div>${sectionLinks.map(([key, label]) => `<a href="#${id}/${year}/${key}">${label}</a>`).join('')}</div></nav>
    <section class="season-card wec-season-summary" aria-label="Race results and entrant standings">
    <div class="wec-summary-grid">
    <section id="race-results" class="wec-summary-results">
        <h2>Race results overview</h2>
        ${!championship.calendar.length ? `<p class="muted">No race data has been added for ${year} yet.</p>` : ''}
        ${raceOverviewTable(championship, id, year)}
        ${championship.lmp2Calendar.length ? lmp2OverviewTable(championship, id, year) : ''}
    </section>
    <div id="championship-standings" class="wec-summary-standings">
        <section id="hypercar-standings"><h2>Hypercar Entrant Standings</h2>${standingsTable(championship, 'hypercar', id, year)}</section>
        <section id="gt3-standings"><h2>GT3 Entrant Standings</h2>${standingsTable(championship, 'gt3', id, year)}</section>
    </div>
    </div>
    <p class="wec-data-note">Championship standings use supplied points, then countback of completed-race finishes: most wins, second places, third places and so on. Identical records retain the supplied order. Blank results are unreported; live results do not break ties.</p>
    <p class="wec-legend"><span class="finish-gold">1st</span><span class="finish-silver">2nd</span><span class="finish-bronze">3rd</span><span class="finish-points">4–10</span><span class="finish-classified">11+</span><span class="finish-dnf">DNF</span></p>
    </section>
    <section id="individual-races" class="wec-races">
        <h2>Individual race results</h2>
        ${championship.calendar.length ? `<nav class="wec-race-links" aria-label="Jump to race">${championship.calendar.map(race => `<a href="#${id}/${year}/race-${race.id}">${race.round}. ${esc(race.circuit)}</a>`).join('')}</nav>${championship.calendar.map(race => individualRaceTable(championship, race)).join('')}` : '<p class="muted">Individual race result tables will appear when a race calendar is supplied.</p>'}
    </section>
    ${seasonOverview(championship)}`;
    bindSeasonCharts(app, championship);
}

function wecTable(headers, rows, caption, className = '', sortable = true, flagCountry = '', columns = []) {
    return `<table class="wikitable wec-table ${className}" style="--wec-column-count: ${headers.length}"${sortable ? '' : ' data-sortable="false"'}>
        <caption>${flagCountry ? `<span class="wec-race-caption"><span>${countryFlag(flagCountry)}</span><span>${esc(caption)}</span><span aria-hidden="true"></span></span>` : esc(caption)}</caption>
        ${columns.length ? `<colgroup>${columns.map(column => `<col class="${column}">`).join('')}</colgroup>` : ''}
        <thead><tr>${headers.map(header => `<th scope="col">${header}</th>`).join('')}</tr></thead>
        <tbody>${rows.length ? rows.join('') : `<tr><td colspan="${headers.length}" class="empty-state">No data supplied yet.</td></tr>`}</tbody>
    </table>`;
}

function entrantLabel(championship, entrantId, includeNumber = true) {
    const entrant = championship.entrants[entrantId];
    if (!entrant) return '—';
    return `<span class="wec-entrant">${countryFlag(entrant.country)}<span>${includeNumber ? `<b class="wec-car-number">#${esc(entrant.number)}</b> ` : ''}${esc(entrant.team)}</span></span>`;
}

function driverList(driverIds = []) {
    return driverIds.length ? `<ul class="wec-crew">${driverIds.map(id => {
        const driver = WEC_DRIVERS[id];
        return `<li>${driver ? `${countryFlag(driver.country)}<span>${esc(driver.name)}</span>` : '—'}</li>`;
    }).join('')}</ul>` : '';
}

// Explicit overview records can arrive before the full result sheet. Once a
// complete class result is supplied, its winner is available as a fallback.
function raceWinner(championship, race, category) {
    if (race.winners?.[category]) return race.winners[category];
    if (race.inProgress) return null;
    const winner = race.results.find(result => result.classPosition === 1
        && !result.status && championship.entrants[result.entrant]?.category === category);
    return winner ? { entrant: winner.entrant, drivers: winner.drivers || [] } : null;
}

function raceOverviewTable(championship, id, year) {
    return spreadsheetOverview(championship, championship.calendar.map(race => ({ race, round: race.round })),
        ['hypercar', 'gt3'], 'Race results', id, year);
}

function lmp2OverviewTable(championship, id, year) {
    const entries = championship.lmp2Calendar.map(entry => ({
        race: championship.calendar.find(race => race.id === entry.race), round: entry.round
    })).filter(entry => entry.race);
    return spreadsheetOverview(championship, entries, ['lmp2'], 'LMP2 race results', id, year);
}

// Each round is a row group: round, circuit flag and circuit name span the team
// and driver rows. Empty rounds retain the same four-row spreadsheet layout.
function spreadsheetOverview(championship, entries, categories, title, id, year) {
    const colCount = 3 + categories.length * 2;
    const groups = entries.map(({ race, round }) => {
        const winners = categories.map(category => raceWinner(championship, race, category));
        const rowCount = Math.max(4, ...winners.map(winner => 1 + (winner?.drivers?.length || 0)));
        return `<tbody class="wec-round-group">${Array.from({ length: rowCount }, (_, line) => `<tr>
            ${line === 0 ? `<th scope="rowgroup" rowspan="${rowCount}" class="wec-overview-round">${round}</th>
            <td rowspan="${rowCount}" class="wec-overview-circuit-flag">${countryFlag(race.country)}</td>
            <td rowspan="${rowCount}" class="wec-overview-circuit"><a href="#${id}/${year}/race-${race.id}">${esc(race.circuit)}</a>${race.inProgress ? '<small class="wec-progress">In progress</small>' : ''}</td>` : ''}
            ${winners.map(winner => overviewWinnerCells(championship, winner, line, race.inProgress)).join('')}
        </tr>`).join('')}</tbody>`;
    }).join('');
    return `<table class="wikitable wec-table wec-overview${categories.length === 1 ? ' wec-overview-single' : ''}" data-sortable="false">
        <caption>${esc(title)}</caption>
        <colgroup><col class="wec-overview-round-col"><col class="wec-overview-flag-col"><col class="wec-overview-circuit-col">${categories.map(() => '<col class="wec-overview-flag-col"><col class="wec-overview-winner-col">').join('')}</colgroup>
        <thead><tr><th scope="col">Round</th><th scope="colgroup" colspan="2">Circuit</th>${categories.map(category => `<th scope="colgroup" colspan="2">${esc(WEC_CLASSES[category])} winners</th>`).join('')}</tr></thead>
        ${groups || `<tbody><tr><td colspan="${colCount}" class="empty-state">No data supplied yet.</td></tr></tbody>`}
    </table>`;
}

function overviewWinnerCells(championship, winner, line, inProgress) {
    const entrant = winner && championship.entrants[winner.entrant];
    const driver = line > 0 && winner && WEC_DRIVERS[winner.drivers?.[line - 1]];
    const country = line === 0 ? entrant?.country : driver?.country;
    const label = line === 0 && entrant
        ? `<strong>#${esc(entrant.number)} ${esc(entrant.team)}</strong>${inProgress ? '<small class="wec-progress">Provisional</small>' : ''}`
        : driver ? esc(driver.name) : '';
    return `<td class="wec-overview-winner-flag">${countryFlag(country)}</td><td class="wec-overview-winner">${label}</td>`;
}

function finishClass(value) {
    if (value === 'DNF') return 'finish-dnf';
    if (typeof value !== 'number' || value < 1) return '';
    return ({ 1: 'finish-gold', 2: 'finish-silver', 3: 'finish-bronze' })[value]
        || (value <= 10 ? 'finish-points' : 'finish-classified');
}

function standingsTable(championship, category, id, year) {
    const title = category === 'gt3' ? 'GT3 Entrant Standings' : 'Hypercar Entrant Standings';
    const headers = ['Pos', 'Flag', 'No.', 'Entrant', 'Points',
        ...championship.calendar.map(race => `<a href="#${id}/${year}/race-${race.id}" title="${esc(race.circuit)}">${esc(race.code)}</a>`)];
    const rows = rankedStandings(championship, category).map(row => {
        const entrant = championship.entrants[row.entrant];
        return `<tr>
            <th scope="row" class="num ${finishClass(row.position <= 3 ? row.position : null)}">${row.position}</th>
            <td class="flag" data-sort-value="${esc(entrant.country || '')}">${countryFlag(entrant.country)}</td>
            <td class="wec-number">#${esc(entrant.number)}</td>
            <td>${esc(entrant.team)}</td><td class="num wec-points">${displayValue(row.points)}</td>
            ${championship.calendar.map(race => {
                const value = row.finishes[race.id];
                return `<td class="wec-finish ${finishClass(value)}"${value == null ? ' aria-label="Not reported"' : ''}>${value == null ? '' : esc(value)}</td>`;
            }).join('')}
        </tr>`;
    });
    return wecTable(headers, rows, title, 'wec-standings');
}

// Result row schema: entrant, position (overall), classPosition, laps, gap,
// optional status (e.g. DNF) and driver IDs. Preserve the source row order.
function individualRaceTable(championship, race) {
    const hasDrivers = race.results.some(result => result.drivers?.length);
    const headers = ['<abbr title="Overall position">OP</abbr>', '<abbr title="Class position">P</abbr>', 'Class', 'Car', 'No.', 'Flag', 'Entrant', ...(hasDrivers ? ['Drivers'] : []), 'Laps', 'Gap'];
    const columns = ['wec-col-compact', 'wec-col-compact', 'wec-col-compact', 'wec-col-car',
        'wec-col-compact', 'wec-col-compact', 'wec-col-entrant', ...(hasDrivers ? ['wec-col-drivers'] : []),
        'wec-col-compact', 'wec-col-gap'];
    const rows = race.results.map(result => {
        const entrant = championship.entrants[result.entrant];
        const category = entrant.category;
        return `<tr class="wec-result-row wec-result-${esc(category)}">
            ${result.status === 'DNF'
                ? '<td colspan="2" class="num wec-retirement">DNF</td>'
                : `<td class="num ${finishClass(result.position <= 3 ? result.position : null)}">${displayValue(result.status || result.position)}</td>
            <td class="num ${finishClass(result.classPosition <= 3 ? result.classPosition : null)}">${result.classPosition == null ? '' : esc(result.classPosition)}</td>`}
            <td class="wec-class-cell wec-class-${esc(category)}"><abbr title="${esc(WEC_CLASSES[category])}">${esc({ hypercar: 'HY', gt3: 'GT3', lmp2: 'LMP2' }[category])}</abbr></td>
            <td class="wec-car"><span class="wec-manufacturer">${manufacturerBadge(entrant.car)}<span>${displayValue(entrant.car)}</span></span></td>
            <td class="wec-number">#${esc(entrant.number)}</td>
            <td class="flag">${countryFlag(entrant.country)}</td>
            <td>${esc(entrant.team)}</td>
            ${hasDrivers ? `<td>${driverList(result.drivers)}</td>` : ''}
            <td class="num">${displayValue(result.laps)}</td>
            <td class="wec-gap${result.classPosition === 1 ? ' wec-winning-time' : ''}">${result.gap == null ? '' : esc(result.gap)}</td>
        </tr>`;
    });
    if (race.inProgress) rows.unshift(`<tr><td colspan="${headers.length}" class="empty-state">Hypercar, LMP2 and GT3 classifications are still in progress. Remaining results have not been reported.</td></tr>`);
    return `<article id="race-${esc(race.id)}" class="season-card">
        ${race.inProgress ? '<p class="wec-progress-note"><strong class="wec-progress">In progress</strong> Reported retirements are listed below; final positions, laps and gaps remain unreported.</p>' : ''}
        ${rows.length ? '' : '<p class="muted">Full race classification has not been supplied yet.</p>'}
        ${wecTable(headers, rows, race.name || `${race.circuit} — race classification`, `wec-classification${hasDrivers ? ' has-drivers' : ''}`, false, race.country, columns)}
    </article>`;
}

