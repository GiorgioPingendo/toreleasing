module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("media");
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy(".env");
    eleventyConfig.addPassthroughCopy("functions");

    eleventyConfig.addCollection("post", function(collectionApi) {
        // Restituisci tutti i file nella cartella posts
        return collectionApi.getFilteredByGlob("./posts/*.md");
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