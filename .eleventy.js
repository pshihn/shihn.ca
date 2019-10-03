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

  // filters
  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });
  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).format('LL'); // E.g. May 31, 2019
  });
  eleventyConfig.addFilter('transparentize', color => {
    const tp = color.replace(',1)', ',0)');
    return `--card-bg:${color}; --card-bg-t:${tp};`;
  });

  // Folders to copy to output folder
  eleventyConfig.addPassthroughCopy('stuff');
  eleventyConfig.addPassthroughCopy('css');
};