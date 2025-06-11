module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("media");
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("assets/css");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy(".env");
    eleventyConfig.addPassthroughCopy("functions");

    // Collezione posts esistente
    eleventyConfig.addCollection("post", function(collectionApi) {
        // Restituisci tutti i file nella cartella posts
        return collectionApi.getFilteredByGlob("./posts/*.md");
    });

    // Nuova collezione FAQ
    eleventyConfig.addCollection("faq", function(collectionApi) {
        // Restituisci tutti i file nella cartella faq ordinati per campo 'order'
        return collectionApi.getFilteredByGlob("./faq/*.md").sort(function(a, b) {
            // Ordina per il campo 'order', se non presente usa 999 come default
            let orderA = a.data.order || 999;
            let orderB = b.data.order || 999;
            return orderA - orderB;
        });
    });

    eleventyConfig.on('afterBuild', () => {
        // Il tuo codice va qui
        const { exec } = require('child_process');
        exec('node post.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing post.js: ${error}`);
                return;
            }
            console.log(`post.js executed successfully`);
        });
    });
};