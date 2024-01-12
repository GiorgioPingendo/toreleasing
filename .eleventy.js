module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("media");
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("admin");
};