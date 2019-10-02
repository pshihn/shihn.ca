const moment = require('moment');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlightPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");

moment.locale('en');

module.exports = function (eleventyConfig) {
  // syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlightPlugin, {
    templateFormats: 'md'
  });

  // RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });
  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).format('LL'); // E.g. May 31, 2019
  });

  // Folders to copy to output folder
  eleventyConfig.addPassthroughCopy('stuff');
};