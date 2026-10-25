// Table sorting, nationality labels and scroll regions.
// Loaded before app.js; shared functions remain available to the other scripts.

function flagSortName(assetPath) {
    // Local flag filenames give the country name even when the cell
    // contains only an image (and therefore has no visible text).
    const fileName = String(assetPath || '').split('/').pop().split('?')[0];
    return fileName.replace(/\.[^.]+$/, '').replace(/-/g, ' ');
}
function tableCellValue(row, index) {
    const cell = row.cells[index];
    if (!cell)
        return '';
    if (cell.dataset.sortValue)
        return cell.dataset.sortValue.trim();

    // Flag images deliberately have empty alt text, so textContent is blank.
    // Sort nationality/flag columns by country name instead of image markup.
    if (cell.classList.contains('flag') || cell.classList.contains('player-nation')) {
        const image = cell.querySelector('img.country-flag');
        if (image)
            return flagSortName(image.getAttribute('src'));

        // The same order applies if the visitor sorts before emoji -> image
        // replacement has finished (or if the images fail to load).
        const emoji = (cell.textContent || '').trim();
        if (typeof FLAG_ASSETS !== 'undefined' && FLAG_ASSETS[emoji])
            return flagSortName(FLAG_ASSETS[emoji]);
    }

    return (cell.textContent || '').trim();
}
function sortableValue(value) {
    const raw = String(value || '').trim().replace(/,/g, '');
    const pct = raw.endsWith('%') ? raw.slice(0, -1) : raw;
    const signed = pct.replace(/^\+/, '');
    if (/^[-+]?\d+(?:\.\d+)?$/.test(signed))
        return {
            type: 'number', value: Number(signed)
        };
    const pos = raw.match(/^(\d+)(?:st|nd|rd|th)$/i);
    if (pos)
        return {
            type: 'number', value: Number(pos[1])
        };
    return {
        type: 'text', value: raw.toLocaleLowerCase()
    };
}
function enhanceTable(table) {
    // Keep calendars and multiclass classifications in their source order.
    if (table.dataset.sortable === 'false')
        return;
    // Empty-state rows span every column and should not become sortable data.
    if (table.querySelector('tbody td[colspan]'))
        return;
    // Keep career history in chronological order in the profile infobox.
    // Sorting the large Career Statistics table would also separate subtotals
    // from the season rows they belong to.
    if (
        table.classList.contains('infobox-career-table')
        || table.classList.contains('career-stats-table')
    )
        return;
    if (table.dataset.tableTools === '1' || !table.tHead || !table.tHead.rows.length)
        return;
    const header = table.tHead.rows[0];
    const heads = [
        ...header.cells
    ];
    if (!heads.length || heads.some(th => th.colSpan > 1))
        return;
    table.dataset.tableTools = '1';
    table.classList.add('interactive-table');
    const tbody = table.tBodies[0];
    if (!tbody)
        return;
    heads.forEach((th, index) => {
        th.classList.add('sortable-head');
        th.dataset.column = String(index);
        th.dataset.label = (th.textContent || '').trim();
        const indicator = document.createElement('span');
        indicator.className = 'sort-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        indicator.textContent = '↕';
        th.appendChild(indicator);
        th.title = (th.dataset.label ? `Sort by ${th.dataset.label}` : 'Sort this column');
        th.addEventListener('click', ev => {
            if (ev.target.closest('a,input,select,button'))
                return;
            const current = th.dataset.sortDir || '';
            const dir = current === 'asc' ? 'desc' : 'asc';
            heads.forEach(heading => {
                heading.dataset.sortDir = '';
                const sortIndicator = heading.querySelector('.sort-indicator');
                if (sortIndicator)
                    sortIndicator.textContent = '↕';
            });
            th.dataset.sortDir = dir;
            indicator.textContent = dir === 'asc' ? '↑' : '↓';
            const rows = [
                ...tbody.rows
            ].filter(row => !row.classList.contains('round-separator'));
            rows.sort((firstRow, secondRow) => {
                const av = sortableValue(tableCellValue(firstRow, index)), bv = sortableValue(tableCellValue(secondRow, index));
                let cmp;
                if (av.type === 'number' && bv.type === 'number')
                    cmp = av.value - bv.value;
                else
                    cmp = String(av.value).localeCompare(String(bv.value), undefined, {
                        numeric: true, sensitivity: 'base'
                    });
                return dir === 'asc' ? cmp : -cmp;
            });
            rows.forEach(row => tbody.appendChild(row));
            // Refresh rank numbers on ranking tables after a user sort.
            if (table.classList.contains('analysis-table'))
                rows.forEach((row, rowIndex) => {
                    const rankCell = row.querySelector('.rank');
                    if (rankCell)
                        rankCell.textContent = String(rowIndex + 1);
                });
        });
    });
}
function enhanceTables(root = document) {
    root.querySelectorAll('table').forEach(table => {
        enhanceTable(table);
        if (table.matches('.infobox, .infobox table'))
            return;
        let scroll = table.parentElement;
        if (!scroll.matches('.table-scroll, .career-stats-scroll')) {
            scroll = document.createElement('div');
            scroll.className = 'table-scroll';
            table.before(scroll);
            scroll.append(table);
        }
        scroll.tabIndex = 0;
        scroll.setAttribute('role', 'region');
        scroll.setAttribute('aria-label', 'Data table; scroll horizontally to see all columns');
    });
}
