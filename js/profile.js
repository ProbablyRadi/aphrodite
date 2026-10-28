// Character overview and shared race-season navigation.
function careerNavigator(id, activeSeason = '', activeSection = '') {
    return `<div class="career-nav">
        <div class="career-nav-player"><div><b>${esc(DATA[id].name)}</b><small>Career navigator</small></div></div>
        <a class="career-nav-main ${activeSeason ? '' : 'active'}" href="#${id}" ${activeSeason ? '' : 'aria-current="page"'}>Overview</a>
        <div class="career-nav-club"><div class="career-nav-clubname">Race seasons</div>
        ${Object.keys(WEC_SEASONS[id]).map(year => {
            const races = year === activeSeason ? WEC_SEASONS[id][year].calendar : [];
            return `<a href="#${id}/${year}" class="${year === activeSeason ? 'active' : ''}" ${year === activeSeason ? 'aria-current="page"' : ''}>${year}</a>
                ${races.length ? `<ul class="career-nav-races" aria-label="${year} race results">${races.map(race => `<li><a href="#${id}/${year}/race-${race.id}" class="${activeSection === `race-${race.id}` ? 'active' : ''}"${activeSection === `race-${race.id}` ? ' aria-current="location"' : ''}><span>${race.round}. ${esc(race.circuit)}</span></a></li>`).join('')}</ul>` : ''}`;
        }).join('')}</div>
        <a class="career-nav-main" href="#home">← All characters</a>
    </div>`;
}
function driverCareerTotals(id) {
    const totals = { starts: 0, wins: 0, podiums: 0, poles: 0 };
    for (const [year, record] of Object.entries(DATA[id].seasons)) {
        const championship = WEC_SEASONS[id][year];
        const entrant = championship && Object.keys(championship.entrants).find(key => championship.entrants[key].number === record.number);
        const results = entrant ? championship.calendar.filter(race => race.completed === true && !race.inProgress)
            .map(race => race.results.find(row => row.entrant === entrant)).filter(Boolean) : [];
        const derived = {
            starts: results.length,
            wins: results.filter(row => !row.status && row.classPosition === 1).length,
            podiums: results.filter(row => !row.status && row.classPosition >= 1 && row.classPosition <= 3).length,
            poles: results.every(row => typeof row.pole === 'boolean') ? results.filter(row => row.pole).length : null
        };
        for (const key of Object.keys(totals)) {
            const value = record[key] ?? (results.length ? derived[key] : 0);
            totals[key] = totals[key] == null || value == null ? null : totals[key] + value;
        }
    }
    return totals;
}
function driverInfobox(character, id) {
    const profile = character.profile || {};
    const totals = profile.calculateTotals ? driverCareerTotals(id) : {};
    const fields = rows => rows.map(([label, value]) => `<tr><th scope="row">${esc(label)}</th>${value == null ? '<td aria-label="Not yet confirmed"></td>' : `<td>${esc(value)}</td>`}</tr>`).join('');
    return `<table class="infobox driver-infobox" data-sortable="false" aria-label="${esc(character.name)} driver profile">
        <thead><tr><th colspan="2">${esc(character.name)}</th></tr></thead>
        <tbody><tr><th scope="row">Nationality</th><td>${profile.nationality ? `${countryFlag(profile.country)} ${esc(profile.nationality)}` : ''}</td></tr>${fields([['Born', profile.born]])}
            <tr class="driver-infobox-section"><th colspan="2" scope="colgroup">Racing career</th></tr>
            ${fields([['Debut season', profile.debut], ['Current championship', profile.championship], ['Current team', profile.team], ['Categorisation', profile.categorisation], ['Car number', profile.number], ['Starts', totals.starts], ['Wins', totals.wins], ['Podiums', totals.podiums], ['Poles', totals.poles]])}
        </tbody>
    </table>`;
}
function player(id) {
    const character = DATA[id];
    app.className = 'profile-page';
    nav.innerHTML = careerNavigator(id);
    app.innerHTML = `<h1>${esc(character.name)}</h1>
        <p class="season-subtitle">Le Mans Ultimate · World Endurance Championship</p>
        <p>Explore this character’s career and race seasons.</p>
        <div class="driver-overview-layout"><div class="driver-overview-main">
        <h2>Career overview</h2>
        <p class="muted">A dash means the detail or result has not been recorded.</p>
        <table class="wikitable career-overview-table">
            <caption>Career overview by race season</caption>
            <thead><tr>${[['Year', 'Year'], ['No.', 'Car number'], ['Champ.', 'Championship'], ['Team', 'Team'], ['Car', 'Car'], ['Class', 'Class'], ['Pos', 'Championship position'], ['Starts', 'Race starts'], ['Wins', 'Race wins'], ['Podiums', 'Podiums'], ['Poles', 'Pole positions'], ['PTS', 'Points']].map(([label, fullLabel]) => `<th scope="col" title="${fullLabel}">${label}</th>`).join('')}</tr></thead>
            <tbody>${Object.keys(character.seasons).map(year => {
                const record = character.seasons[year];
                return `<tr><th scope="row">${Object.hasOwn(WEC_SEASONS[id], year) ? `<a href="#${id}/${year}">${year}</a>` : esc(year)}</th><td>${record.number == null ? '—' : `#${esc(record.number)}`}</td>${['championship', 'team', 'car', 'category', 'position', 'starts', 'wins', 'podiums', 'poles', 'points'].map(key => `<td>${displayValue(record[key])}</td>`).join('')}</tr>`;
            }).join('')}</tbody>
        </table></div><div class="driver-overview-sidebar">${driverInfobox(character, id)}</div></div>`;
}
