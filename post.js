const fs = require('fs');
const path = require('path');
const js2xmlparser = require("js2xmlparser");

// Percorso assoluto alla directory dei post
const postsDirectory = path.join(__dirname, '/posts/');

// URL di base del sito
const baseUrl = 'https://prestitoin.it/';

// Inizializza la sitemap con le pagine index.html e news.html
let sitemap = {
    "@": {
        "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"
    },
    "url": [
        { "loc": `${baseUrl}index.html` },
        { "loc": `${baseUrl}news.html` }
    ]
};

// Leggi tutti i file nella directory dei post
fs.readdirSync(postsDirectory).forEach(file => {
    // Controlla se il file è un file .md
    if (path.extname(file) === '.md') {
        // Aggiungi il post alla sitemap
        const postUrl = `${baseUrl}posts/${path.basename(file, '.md')}/`;
        sitemap.url.push({ "loc": postUrl });
    }
});

// Converte l'oggetto JavaScript in una stringa XML
const xmlSitemap = js2xmlparser.parse("urlset", sitemap);

// Scrivi la sitemap in un file sitemap.xml, sovrascrivendo il file se esiste già
fs.writeFileSync('_site/sitemap.xml', xmlSitemap);