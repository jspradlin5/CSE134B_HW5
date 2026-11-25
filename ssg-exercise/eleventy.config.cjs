module.exports = function (eleventyConfig) {

    // Copy supporting files into the generated website.
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/*.css");
    eleventyConfig.addPassthroughCopy("src/*.js");
    eleventyConfig.addPassthroughCopy("src/*.html");

    return {
        templateFormats: ["njk"],

        dir: {
            input: "src",
            includes: "_includes",
            output: "_site"
        }
    };
};
