# Le Mans Ultimate Career Wiki

A static WEC career archive for Rens Adisea, Jordan Vale and Vasiliki.
Open index.html directly in a browser or serve this folder as a static website.
There is no build step, database or package installation.

The original Wiki, Dracula and Glass appearances, character selector,
responsive career navigation and table controls are preserved. Glass uses a
neutral gradient background. Character cards have no portraits.

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
Individual classifications have not yet been imported; each race currently has
an empty results array and a visible table awaiting its full result sheet.

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

