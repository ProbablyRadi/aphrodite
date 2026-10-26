# Le Mans Ultimate Career Wiki

A static WEC career archive for Rens Adisea, Jordan Vale and Vasiliki Dimitriou.
Open index.html directly in a browser or serve this folder as a static website.
There is no build step, database or package installation.

The original Wiki, Dracula and Glass appearances, character selector,
responsive career navigation and table controls are preserved. Glass uses a
generated, softly blurred Le Mans pit-straight background. Character cards have no portraits.

## Pages

- #home — choose a character.
- #rens, #jordan, #vasi — character overview and career overview table.
- #rens/2023 through #rens/2026 — race-season pages. Substitute either other
  character ID to browse independent career records for that character.
- #jordan/2024/results — race winners overview, including a separate LMP2 table.
- #jordan/2024/hypercar and #jordan/2024/gt3 — entrant standings.
- #jordan/2024/races — individual classifications.
- #jordan/2024/race-qatar — a particular race.

The career overview has rows for 2023–2026 and space for team, car, class,
championship position, starts, wins, podiums, poles and points. Personal totals
remain unreported until the relevant career records are supplied.

## Data stores

Scripts share ordinary JavaScript objects and support opening via file://.

- data/base.js defines DATA (personal career records), WEC_CLASSES,
  WEC_DRIVERS and WEC_SEASONS.
- data/2024.js populates the Jordan Vale 2024 calendar, entrants, drivers, reported
  winners and both class standings. This championship is reused on all three
  character pages, rather than storing three copies of the same results.
- js/shared.js maps country names to local flag PNGs and escapes source text.
  Driver, entrant and circuit nationalities are distinct records.

The 2024 import follows the user's custom career calendar and source order.
It does not substitute the real-world WEC calendar or recalculate points.
There are 19 Hypercar entrants, 18 GT3 entrants and eight scheduled rounds.
Flags, car makes and winning crews follow the reference images and pasted data.

Standings rows hold position, entrant ID, points, and finishes keyed by race ID.
Unknown values use null. Confirmed zero points remain 0, and DNF is an explicit
result. Blank Le Mans standings cells remain blank even where the separate
winner overview has already reported a winner. Other years remain empty.

Each race in WEC_SEASONS[characterId][year].calendar holds:

- id, round, code, circuit, country, and optionally a supplied race name.
- winners, keyed by hypercar, gt3 or lmp2; each has an entrant ID and driver IDs.
- results, an array of individual classification rows.

A classification row contains entrant (ID), position (overall), classPosition,
laps and gap. Optional status records DNF/DNS/etc.; optional drivers holds driver
IDs. No overall place, elapsed time or laps are inferred from class standings.
Jordan Vale 2024 rounds 1 to 3, Qatar 4 Hours, Monza 4 Hours and Spa 4 Hours, each contain all 37 supplied result rows. Other races still have empty result arrays awaiting their full result sheets.

Explicit winner-overview records can arrive before full classifications.
When no explicit winner is recorded, the overview can use a reported first
place in the relevant class from the classification. Check both sources for
consistency when importing a full race sheet. Crew lineups belong to race
records, allowing substitutions between rounds.

lmp2Calendar references existing race IDs with its own round numbering.
The supplied LMP2 section has round 1 at Le Mans and no winner reported.

## Interface files

- index.html: header, selectors, sidebar and ordered script loading.
- app.js: routes, section scrolling, persistent appearance and mobile menu.
- js/home.js: character cards.
- js/profile.js: personal career overview and season navigation.
- js/season.js: data-driven winner, standings and classification table builders.
- js/tables.js: sorting and horizontally scrollable table regions.
- styles.css and styles/: original theme cascade and responsive layouts, plus
  table styling, class badges, podium colours and DNF highlights.
- favicon.svg: racing flag icon.
- assets/flags/: local country flags.

Standings are sortable; race calendars and multiclass classifications retain
their source order. Header links open the corresponding race without sorting.

## Supplying the remaining data

Paste one race per message, starting with its season and race title, followed
by the full table including column headers. Direct Excel/tab-separated pastes
are preferred; Markdown tables also work. Include overall position, class
position, class, car, number, entrant, laps and time/gap as available.
Preserve DNF/DNS/DSQ and blank cells. Supply crew names and nationalities if
they are not already in the records. A combined message is also supported if
each race has a clear heading.

## Verification

Run with Node.js 22 or later:

    node --test

Tests check every imported standing against tests/fixtures/2024-standings.tsv,
calendar order, partial results, winners, flags, references, every character
and season route, section links, multiclass rendering, theme controls and
removed legacy assets. These checks verify data and generated markup; they
do not perform browser layout rendering.





Le Mans 8 Hours is in progress, with nine supplied retirements and blank gaps.
Unfilled template positions are not recorded as classified finishers.
GR Racing #86 is a Le Mans entrant, with nationality still unreported.
The previously supplied GT3 winner is retained as provisional while the race
is in progress. The supplied championship standings are unchanged.


## Season overview analytics

Every season page has a Season overview section beneath all individual races.
Jordan Vale 2024 has separate interactive Hypercar and LMGT3 cumulative points
charts and class KPI cards for points leader, lead over second, leader wins and
podiums, and retirements. Charts show the top five entrants initially; controls
allow any combination, all entrants, or a reset to the leaders.

js/season-overview.js derives points from completed class classifications using
25-18-15-12-10-8-6-4-2-1. Le Mans has pointsMultiplier: 2. No fastest-lap,
qualifying or bonus points are added. Set completed: true only when the race
classification is final; inProgress always excludes a race from analytics.
An unreported result leaves cumulative points unknown rather than assigning
zero. The supplied standings remain their own authoritative data store.

Team-mates share a chart colour and use different line dash patterns. Series
are per numbered entrant, not combined team scores. Native point tooltips and
an expandable cumulative points table provide exact values. No external chart
library or network request is required. Other characters' charts remain empty
until their own completed race data is supplied.

Standings display order is calculated automatically from supplied points,
then countback across completed races: most firsts, seconds, thirds, and so on,
including non-scoring finishes. DNFs, unknown places and live races are excluded
from countback. Exact ties retain the supplied order. The raw imported rows
stay unchanged, while displayed positions and chart leader ordering use the
same comparator.

## Historical 2022 backstory

Rens now has a 2022 Team Project 1 #56 Porsche 911 RSR GTE entry and a full
historical results page, using separate Hypercar, LMP2, GTE Pro and GTE Am
classes and historical scoring. The fictional fixed #56 crew is Rens Adisea,
Ben Barnicoat and Brendan Iribe. His 2023 team is Project 1 - AO Racing.
See data/sources/2022.md for sources, scoring and adaptation details.
