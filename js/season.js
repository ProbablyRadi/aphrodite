// Reusable table renderers; each character has independent championship records.
function season(id, year) {
    const character = DATA[id];
    const record = character.seasons[year];
    const championship = WEC_SEASONS[id][year];
    app.className = 'season-page';
    nav.innerHTML = careerNavigator(id, year);
    const sectionLinks = [
        ['results', 'Race results overview'], ['hypercar', 'Hypercar standings'],
        ['gt3', 'GT3 standings'], ['races', 'Individual race results']
    ];
    app.innerHTML = `<section class="season-hero">
        <div class="season-breadcrumb"><a href="#home">Characters</a> / <a href="#${id}">${esc(character.name)}</a> / ${year}</div>
        <div class="season-eyebrow">World Endurance Championship</div>
        <h1>${year} race season</h1>
        <p class="season-subtitle">${esc(character.name)} · Le Mans Ultimate</p>
        <div class="season-kpis">${[['Position', 'position'], ['Race starts', 'starts'], ['Race wins', 'wins'], ['Podiums', 'podiums'], ['Points', 'points']].map(([label, key]) => `<div><span>${label}</span><b>${displayValue(record[key])}</b></div>`).join('')}</div>
    </section>
    <nav class="season-jump" aria-label="Season sections"><b>On this page</b><div>${sectionLinks.map(([key, label]) => `<a href="#${id}/${year}/${key}">${label}</a>`).join('')}</div></nav>
    <section id="race-results" class="season-card">
        <h2>Race results overview</h2>
        ${!championship.calendar.length ? `<p class="muted">No race data has been added for ${year} yet.</p>` : ''}
        ${raceOverviewTable(championship, id, year)}
        ${championship.lmp2Calendar.length ? `<h3>LMP2 race results</h3>${lmp2OverviewTable(championship, id, year)}` : ''}
    </section>
    <div id="championship-standings">
        <p class="wec-data-note">Championship standings use the supplied points and order. Blank results are unreported; DNF is recorded separately. Partial race updates may precede the next standings update.</p>
        <section id="hypercar-standings" class="season-card"><h2>Hypercar Entrant Standings</h2>${standingsTable(championship, 'hypercar', id, year)}</section>
        <section id="gt3-standings" class="season-card"><h2>GT3 Entrant Standings</h2>${standingsTable(championship, 'gt3', id, year)}</section>
        <p class="wec-legend"><span class="finish-gold">1st</span><span class="finish-silver">2nd</span><span class="finish-bronze">3rd</span><span class="finish-points">4–10</span><span class="finish-classified">11+</span><span class="finish-dnf">DNF</span></p>
    </div>
    <section id="individual-races" class="wec-races">
        <h2>Individual race results</h2>
        ${championship.calendar.length ? `<nav class="wec-race-links" aria-label="Jump to race">${championship.calendar.map(race => `<a href="#${id}/${year}/race-${race.id}">${race.round}. ${esc(race.circuit)}</a>`).join('')}</nav>${championship.calendar.map(race => individualRaceTable(championship, race)).join('')}` : '<p class="muted">Individual race result tables will appear when a race calendar is supplied.</p>'}
    </section>`;
}

function wecTable(headers, rows, caption, className = '', sortable = true) {
    return `<table class="wikitable wec-table ${className}"${sortable ? '' : ' data-sortable="false"'}>
        <caption>${esc(caption)}</caption>
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
    const winner = race.results.find(result => result.classPosition === 1
        && !result.status && championship.entrants[result.entrant]?.category === category);
    return winner ? { entrant: winner.entrant, drivers: winner.drivers || [] } : null;
}

function winnerCell(championship, race, category) {
    const winner = raceWinner(championship, race, category);
    return winner ? `<div class="wec-winner"><strong>${entrantLabel(championship, winner.entrant)}</strong>${driverList(winner.drivers)}</div>` : '<span class="muted" aria-label="Winner not reported">—</span>';
}

function raceOverviewTable(championship, id, year) {
    return wecTable(['Round', 'Circuit', 'Hypercar winners', 'LMGT3 winners'],
        championship.calendar.map(race => `<tr>
            <th scope="row" class="num">${race.round}</th>
            <td><a class="wec-circuit" href="#${id}/${year}/race-${race.id}">${countryFlag(race.country)}<span>${esc(race.circuit)}</span></a></td>
            <td>${winnerCell(championship, race, 'hypercar')}</td>
            <td>${winnerCell(championship, race, 'gt3')}</td>
        </tr>`), 'Race results', 'wec-overview', false);
}

function lmp2OverviewTable(championship, id, year) {
    return wecTable(['Round', 'Circuit', 'LMP2 winners'],
        championship.lmp2Calendar.map(entry => {
            const race = championship.calendar.find(race => race.id === entry.race);
            if (!race) return '';
            return `<tr><th scope="row" class="num">${entry.round}</th><td><a class="wec-circuit" href="#${id}/${year}/race-${race.id}">${countryFlag(race.country)}<span>${esc(race.circuit)}</span></a></td><td>${winnerCell(championship, race, 'lmp2')}</td></tr>`;
        }), 'LMP2 race results', 'wec-overview', false);
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
    const rows = championship.standings[category].map(row => {
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
    const headers = ['OP', 'P', 'Class', 'Car', 'No.', 'Entrant', ...(hasDrivers ? ['Drivers'] : []), 'Laps', 'Time / gap'];
    const rows = race.results.map(result => {
        const entrant = championship.entrants[result.entrant];
        const category = entrant.category;
        return `<tr class="wec-result-row wec-result-${esc(category)}">
            <td class="num ${finishClass(result.position <= 3 ? result.position : null)}">${displayValue(result.status || result.position)}</td>
            <td class="num ${finishClass(result.status || result.classPosition)}">${displayValue(result.status || result.classPosition)}</td>
            <td><span class="wec-class wec-class-${esc(category)}">${esc(WEC_CLASSES[category])}</span></td>
            <td class="wec-car">${displayValue(entrant.car)}</td>
            <td class="wec-number">#${esc(entrant.number)}</td>
            <td>${entrantLabel(championship, result.entrant, false)}</td>
            ${hasDrivers ? `<td>${driverList(result.drivers)}</td>` : ''}
            <td class="num">${displayValue(result.laps)}</td>
            <td class="wec-gap">${displayValue(result.gap)}</td>
        </tr>`;
    });
    return `<article id="race-${esc(race.id)}" class="season-card">
        <h3>${countryFlag(race.country)} Round ${race.round} · ${esc(race.name || race.circuit)}</h3>
        ${rows.length ? '' : '<p class="muted">Full race classification has not been supplied yet.</p>'}
        ${wecTable(headers, rows, race.name || `${race.circuit} — race classification`, 'wec-classification', false)}
    </article>`;
}
