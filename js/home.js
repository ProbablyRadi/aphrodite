function home() {
    app.className = 'home-page';
    nav.innerHTML = '';
    app.innerHTML = `<h1>Le Mans Ultimate Career Wiki</h1>
        <p class="home-intro">World Endurance Championship · Choose a character</p>
        <div class="home-tiles">${Object.entries(DATA).map(([id, character]) => `<a class="home-player-tile" href="#${id}"><span>${esc(character.name)}</span></a>`).join('')}</div>`;
}
