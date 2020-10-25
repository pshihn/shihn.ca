const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  // syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlightPlugin, {
    templateFormats: 'md'
  });

  // CSS
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  // filters
  eleventyConfig.addFilter('dateIso', date => {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });
  eleventyConfig.addFilter('dateReadable', date => {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat("LLL d, yyyy");
  });

  // Folders to copy to output folder
  eleventyConfig.addPassthroughCopy('stuff');
  eleventyConfig.addPassthroughCopy('scripts');
};