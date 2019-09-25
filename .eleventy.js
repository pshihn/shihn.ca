const moment = require('moment');

moment.locale('en');

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });
  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).format('LL'); // E.g. May 31, 2019
  });

  // Folders to copy to output folder
  eleventyConfig.addPassthroughCopy("stuff");
  eleventyConfig.addPassthroughCopy("css");
};