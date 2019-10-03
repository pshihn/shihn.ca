const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  // syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlightPlugin, {
    templateFormats: 'md'
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
  eleventyConfig.addFilter('transparentize', color => {
    const tp = color.replace(',1)', ',0)');
    return `--card-bg:${color}; --card-bg-t:${tp};`;
  });

  // Folders to copy to output folder
  eleventyConfig.addPassthroughCopy('stuff');
  eleventyConfig.addPassthroughCopy('css');
};