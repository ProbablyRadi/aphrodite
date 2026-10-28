// Championship analytics use class positions, never overall positions or live results.
const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const CHART_TEAM_COLOURS = {
    'Team Project 1': '#2ba6b4', 'Alpine Elf Team': '#5266ee',
    'Glickenhaus Racing': '#b79e46', 'Jota': '#35baa8', 'JOTA': '#35baa8',
    'WRT': '#399bea', 'Realteam by WRT': '#9e77d9', 'United Autosports USA': '#889bb4',
    'Porsche GT Team': '#d4943b', 'Corvette Racing': '#b6a02c',
    'Dempsey-Proton Racing': '#c668b8', 'NorthWest AMR': '#32a083',
    'Toyota Gazoo Racing': '#e43847', 'Ferrari AF Corse': '#fa5b59',
    'AF Corse': '#e9a330', 'Porsche Penske Motorsport': '#c3a13a',
    'Proton Competition': '#b16bdc', 'BMW M Team WRT': '#358fe5',
    'Hertz Team Jota': '#35baa8', 'Peugeot TotalEnergies': '#789fcb',
    'Alpine Endurance Team': '#5266ee', 'Cadillac Racing': '#9f80db',
    'Lamborghini Iron Lynx': '#83ac29', 'Isotta Fraschini': '#b86f9f',
    'Vista AF Corse': '#ee5050', 'Team WRT': '#399bea',
    'Heart of Racing Team': '#32a083', 'Iron Dames': '#ee68ad',
    'TF Sport': '#b6a02c', 'Manthey Ema': '#8ab52d',
    'Akkodis ASP Team': '#23a6bf', 'Manthey PureRxing': '#eb8c3b',
    'Iron Lynx': '#b99557', "D'Station Racing": '#9e77d9',
    'United Autosports': '#889bb4', 'Proton Racing': '#c668b8'
};

function teamChartColour(team) {
    if (CHART_TEAM_COLOURS[team]) return CHART_TEAM_COLOURS[team];
    let hash = 0;
    for (const char of team) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) | 0;
    return `hsl(${(hash >>> 0) % 360} 65% 48%)`;
}

function awardedRacePoints(result, race) {
    // Historical imports include verified pole bonuses and eligibility adjustments.
    if (Number.isFinite(result.awardedPoints)) return result.awardedPoints;
    if (result.status || !Number.isInteger(result.classPosition)) return 0;
    return ((race.pointsScale || RACE_POINTS)[result.classPosition - 1] || 0) * (race.pointsScale ? 1 : (race.pointsMultiplier ?? 1));
}

function pointsProgression(championship, category) {
    const races = championship.calendar.filter(race => race.completed === true && !race.inProgress);
    const entrantIds = [...new Set([
        ...championship.standings[category].map(row => row.entrant),
        ...races.flatMap(race => race.results.filter(row => championship.entrants[row.entrant]?.category === category && championship.entrants[row.entrant]?.championshipEligible !== false && (!championship.historical || championship.standings[category].some(entry => entry.entrant === row.entrant))).map(row => row.entrant))
    ])];
    const teamCounts = new Map();
    const series = entrantIds.map(id => {
        const entrant = championship.entrants[id];
        const teammateIndex = teamCounts.get(entrant.team) || 0;
        teamCounts.set(entrant.team, teammateIndex + 1);
        let cumulative = 0;
        const points = races.map(race => {
            const result = race.results.find(row => row.entrant === id);
            // Missing classifications are unknown, not zero-point finishes.
            cumulative = result && cumulative != null ? cumulative + awardedRacePoints(result, race)
                : championship.historical && !result && cumulative != null ? cumulative : null;
            return cumulative;
        });
        const results = races.map(race => race.results.find(row => row.entrant === id));
        return { id, ...entrant, colour: teamChartColour(entrant.team),
            dash: ['', '8 4', '2 4'][teammateIndex % 3], points,
            total: points.at(-1) ?? null,
            wins: results.filter(row => row && !row.status && row.classPosition === 1).length,
            podiums: results.filter(row => row && !row.status && row.classPosition >= 1 && row.classPosition <= 3).length,
            dnfs: results.filter(row => row?.status === 'DNF').length,
            finishes: results.map(row => row && !row.status ? row.classPosition : null) };
    });
    series.sort((a, b) => compareChampionshipRecords(
        { points: a.total, finishes: a.finishes }, { points: b.total, finishes: b.finishes }
    ));
    return { category, races, series };
}

function seasonOverview(championship) {
    const models = (championship.categories || ['hypercar', 'gt3']).map(category => pointsProgression(championship, category));
    const complete = models[0].races.length;
    return `<section id="season-overview" class="wec-season-overview">
        <h2>Season overview</h2>
        <p>Cumulative entrant points after each completed race. ${championship.scoringNote ? esc(championship.scoringNote) : 'Scoring: 25–18–15–12–10–8–6–4–2–1; Le Mans awards double points.'} Live and future rounds are excluded.</p>
        ${!complete ? '<p class="muted">Graphs will appear when completed race classifications are supplied.</p>' : `
        <div class="wec-completion"><span>${complete} / ${championship.calendar.length} races completed</span><progress max="${championship.calendar.length}" value="${complete}" aria-label="Completed races"></progress></div>
        ${models.map(model => pointsPanel(championship, model)).join('')}`}
    </section>`;
}

function pointsPanel(championship, model) {
    const leader = model.series[0];
    if (!leader) return '';
    const selected = model.series.slice(0, 5).map(row => row.id);
    const gap = model.series[1]?.total != null && leader.total != null ? leader.total - model.series[1].total : null;
    const fieldResults = model.races.flatMap(race => race.results.filter(row => championship.entrants[row.entrant]?.category === model.category));
    return `<article class="season-card wec-points-panel" data-points-category="${model.category}">
        <h3>${esc(WEC_CLASSES[model.category])} points progression</h3>
        <div class="wec-analytics-kpis">
            ${analyticsKpi('Points leader', displayValue(leader.total), `#${leader.number} ${leader.team}`)}
            ${analyticsKpi('Lead over second', displayValue(gap), 'points')}
            ${analyticsKpi('Leader’s wins', leader.wins, `${leader.podiums} podiums`)}
            ${analyticsKpi('Retirements', fieldResults.filter(row => row.status === 'DNF').length, `${fieldResults.length} recorded starts`)}
        </div>
        <p class="wec-chart-note">One line per car. Team-mates share a colour and use different dash patterns. Hover or focus a point for its total.</p>
        <div class="wec-chart-toolbar"><button type="button" data-points-action="leaders">Top 5</button><button type="button" data-points-action="all">All entrants</button><button type="button" data-points-action="none">Clear</button></div>
        <details class="wec-chart-options"><summary>Choose entrants · <span data-selection-count>${selected.length}</span> selected</summary><fieldset><legend class="sr-only">${esc(WEC_CLASSES[model.category])} chart entrants</legend>
            ${model.series.map(row => `<label><input type="checkbox" value="${esc(row.id)}"${selected.includes(row.id) ? ' checked' : ''}>${chartSwatch(row)}<span>#${esc(row.number)} ${esc(row.team)}</span><b>${displayValue(row.total)}</b></label>`).join('')}
        </fieldset></details>
        <div data-chart-canvas class="wec-chart-scroll" tabindex="0" role="region" aria-label="${esc(WEC_CLASSES[model.category])} points progression chart">${pointsSvg(championship, model, selected)}</div>
        <div data-chart-legend class="wec-chart-legend">${pointsLegend(model, selected)}</div>
        <details class="wec-chart-data"><summary>View cumulative points table</summary>${wecTable(['Entrant', ...model.races.map(race => esc(race.code))], model.series.map(row => `<tr><th scope="row">#${esc(row.number)} ${esc(row.team)}</th>${row.points.map(value => `<td class="num">${displayValue(value)}</td>`).join('')}</tr>`), `${WEC_CLASSES[model.category]} cumulative points`, 'wec-points-data', false)}</details>
    </article>`;
}

function analyticsKpi(label, value, detail) {
    return `<div><span>${esc(label)}</span><strong>${value}</strong><small>${esc(detail)}</small></div>`;
}

function chartSwatch(row) {
    return `<svg class="wec-line-swatch" viewBox="0 0 32 12" aria-hidden="true"><path d="M0 6H32" stroke="${row.colour}" stroke-width="3" stroke-dasharray="${row.dash}"/></svg>`;
}

function pointsLegend(model, selected) {
    return model.series.filter(row => selected.includes(row.id)).map(row => `<span>${chartSwatch(row)}<span>#${esc(row.number)} ${esc(row.team)} <b>${displayValue(row.total)} pts</b></span></span>`).join('');
}

function pointsSvg(championship, model, selected) {
    const visible = model.series.filter(row => selected.includes(row.id));
    if (!visible.length) return '<p class="empty-state">Choose at least one entrant to display the graph.</p>';
    const width = 1000, height = 390, left = 55, right = 28, top = 28, bottom = 66;
    const maxPoints = Math.max(10, ...visible.flatMap(row => row.points.filter(value => value != null)));
    const step = maxPoints <= 50 ? 10 : Math.ceil(maxPoints / 5 / 10) * 10;
    const ceiling = Math.ceil(maxPoints / step) * step;
    const x = index => left + index / Math.max(1, championship.calendar.length) * (width - left - right);
    const y = value => height - bottom - value / ceiling * (height - top - bottom);
    const completed = new Set(model.races.map(race => race.id));
    const ticks = Array.from({ length: ceiling / step + 1 }, (_, i) => i * step).map(value => `<g><line class="wec-chart-grid" x1="${left}" x2="${width - right}" y1="${y(value)}" y2="${y(value)}"/><text x="${left - 10}" y="${y(value) + 4}" text-anchor="end">${value}</text></g>`).join('');
    const labels = [{ code: 'Start' }, ...championship.calendar].map((race, index) => `<g class="${index && !completed.has(race.id) ? 'wec-chart-future' : ''}"><text x="${x(index)}" y="${height - bottom + 24}" text-anchor="middle">${esc(race.code)}</text>${race.inProgress ? `<text x="${x(index)}" y="${height - bottom + 42}" text-anchor="middle" class="wec-chart-live">Live${race.pointsMultiplier > 1 ? ` · ${race.pointsMultiplier}×` : ''}</text>` : ''}</g>`).join('');
    const lines = visible.slice().reverse().map(row => {
        const samples = [{ index: 0, points: 0, race: 'Start' }, ...model.races.map((race, i) => ({ index: championship.calendar.indexOf(race) + 1, points: row.points[i], race: race.circuit }))];
        let penDown = false;
        const path = samples.map(sample => {
            if (sample.points == null) { penDown = false; return ''; }
            const command = penDown ? 'L' : 'M'; penDown = true;
            return `${command}${x(sample.index)},${y(sample.points)}`;
        }).join(' ');
        return `<g><path d="${path}" fill="none" stroke="${row.colour}" stroke-width="3" stroke-dasharray="${row.dash}" stroke-linecap="round" stroke-linejoin="round"/>${samples.filter(sample => sample.points != null).map(sample => {
            const label = `#${row.number} ${row.team} · ${sample.race}: ${sample.points} points`;
            return `<circle cx="${x(sample.index)}" cy="${y(sample.points)}" r="4" fill="${row.colour}" class="wec-chart-point" tabindex="0" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title></circle>`;
        }).join('')}</g>`;
    }).join('');
    return `<svg class="wec-points-svg" viewBox="0 0 ${width} ${height}" role="group" aria-label="${esc(WEC_CLASSES[model.category])} cumulative points after each race"><text x="${left}" y="16">Points</text>${ticks}${labels}${lines}</svg>`;
}

function bindSeasonCharts(root, championship) {
    root.querySelectorAll('[data-points-category]').forEach(panel => {
        const model = pointsProgression(championship, panel.dataset.pointsCategory);
        const inputs = [...panel.querySelectorAll('input[type="checkbox"]')];
        const update = () => {
            const selected = inputs.filter(input => input.checked).map(input => input.value);
            panel.querySelector('[data-chart-canvas]').innerHTML = pointsSvg(championship, model, selected);
            panel.querySelector('[data-chart-legend]').innerHTML = pointsLegend(model, selected);
            panel.querySelector('[data-selection-count]').textContent = String(selected.length);
        };
        panel.addEventListener('change', event => { if (event.target.matches('input[type="checkbox"]')) update(); });
        panel.addEventListener('click', event => {
            const button = event.target.closest('[data-points-action]');
            if (!button) return;
            const action = button.dataset.pointsAction;
            inputs.forEach(input => { input.checked = action === 'all' || (action === 'leaders' && model.series.slice(0, 5).some(row => row.id === input.value)); });
            update();
        });
    });
}
