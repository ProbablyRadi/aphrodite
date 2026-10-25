// Load real data and renderer files in the same order as index.html.
// Each call creates a fresh VM: synthetic records cannot leak between tests.
// The small browser doubles support routing, not visual/layout verification.
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function scriptFiles() {
    return [...read('index.html').matchAll(/<script src="([^"]+)"/g)]
        .map(match => match[1].split('?')[0]);
}

function eventTarget(properties = {}) {
    const listeners = new Map();
    return {
        ...properties,
        addEventListener(type, callback) {
            if (!listeners.has(type)) listeners.set(type, []);
            listeners.get(type).push(callback);
        },
        emit(type, event = {}) {
            for (const callback of listeners.get(type) || []) callback(event);
        }
    };
}

function createSite() {
    const app = { className: '', innerHTML: '', querySelectorAll: () => [], querySelector: () => null, focus() {} };
    const nav = { innerHTML: '' };
    const characterSelect = eventTarget({ value: '' });
    const themeSelect = eventTarget({ value: '' });
    const careerMenu = eventTarget({ open: true });
    const activeClasses = new Set();
    const elements = { '#app': app, '#seasonNav': nav, '#characterSelect': characterSelect, '#themeSelect': themeSelect, '#careerMenu': careerMenu };
    const document = {
        baseURI: 'https://example.test/career/index.html',
        body: {
            classList: {
                toggle(name, enabled) {
                    if (enabled) activeClasses.add(name);
                    else activeClasses.delete(name);
                }
            }
        },
        querySelector: selector => elements[selector] || null,
        querySelectorAll: () => []
    };
    const storage = new Map();
    const window = eventTarget({ scrollTo() {}, matchMedia: () => ({ matches: false, addEventListener() {} }) });
    const context = vm.createContext({
        console, URL, document, window, location: { hash: '#home' }, app, nav,
        characterSelect, themeSelect,
        localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
        addEventListener: window.addEventListener.bind(window),
        MutationObserver: class { observe() {} }
    });
    const evaluate = code => vm.runInContext(code, context);
    for (const file of scriptFiles().filter(file => file !== 'app.js')) {
        vm.runInContext(read(file), context, { filename: file });
    }

    let started = false;
    function startApp() {
        if (started) return;
        vm.runInContext(read('app.js'), context, { filename: 'app.js' });
        started = true;
    }
    function navigate(hash) {
        startApp();
        context.location.hash = hash;
        window.emit('hashchange');
    }
    return { context, evaluate, app, nav, document, characterSelect, themeSelect, activeClasses, startApp, navigate };
}

// VM arrays/objects have different prototypes. Convert data-only results before
// comparing them with ordinary Node literals; Maps/Sets are kept inside the VM.
const plain = value => JSON.parse(JSON.stringify(value));

module.exports = { createSite, plain, root, read, scriptFiles };
