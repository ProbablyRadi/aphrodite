// Character overview and shared race-season navigation.
function careerNavigator(id, activeSeason = '') {
    return `<div class="career-nav">
        <div class="career-nav-player"><div><b>${esc(DATA[id].name)}</b><small>Career navigator</small></div></div>
        <a class="career-nav-main ${activeSeason ? '' : 'active'}" href="#${id}" ${activeSeason ? '' : 'aria-current="page"'}>Overview</a>
        <div class="career-nav-club"><div class="career-nav-clubname">Race seasons</div>
        ${Object.keys(DATA[id].seasons).map(year => `<a href="#${id}/${year}" class="${year === activeSeason ? 'active' : ''}" ${year === activeSeason ? 'aria-current="page"' : ''}>${year}</a>`).join('')}</div>
        <a class="career-nav-main" href="#home">← All characters</a>
    </div>`;
}
function player(id) {
    const character = DATA[id];
    app.className = 'profile-page';
    nav.innerHTML = careerNavigator(id);
    app.innerHTML = `<h1>${esc(character.name)}</h1>
        <p class="season-subtitle">Le Mans Ultimate · World Endurance Championship</p>
        <p>Explore this character’s career and race seasons.</p>
        <h2>Career overview</h2>
        <p class="muted">A dash means the detail or result has not been recorded.</p>
        <table class="wikitable career-overview-table">
            <caption>Career overview by race season</caption>
            <thead><tr>${['Year', 'No.', 'Team', 'Car', 'Class', 'Position', 'Race starts', 'Race wins', 'Podiums', 'Pole positions', 'Points'].map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead>
            <tbody>${Object.keys(character.seasons).map(year => {
                const record = character.seasons[year];
                return `<tr><th scope="row"><a href="#${id}/${year}">${year}</a></th><td>${record.number == null ? '—' : `#${esc(record.number)}`}</td>${['team', 'car', 'category', 'position', 'starts', 'wins', 'podiums', 'poles', 'points'].map(key => `<td>${displayValue(record[key])}</td>`).join('')}</tr>`;
            }).join('')}</tbody>
        </table>`;
}
