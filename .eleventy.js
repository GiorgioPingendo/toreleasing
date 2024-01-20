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

};