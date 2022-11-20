const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // get all categories from portfolio
  eleventyConfig.addCollection("categories", (collectionApi) => {
    let catSet = new Set();

    collectionApi.getFilteredByTag("portfolio").forEach((item) => typeof item.data.category === "string" && catSet.add(item.data.category));

    return [...catSet].sort();
  });

  // limit amount of portfolio
  eleventyConfig.addFilter("limit", (array, num) => {
    if (num === undefined) {
      return array;
    }

    const maxNum = array.length - num;
    const start = Math.floor(Math.random() * (maxNum - 0 + 1)) + 0;
    const end = start + num;

    return array.slice(start, end);
  });

  // shuffle portfolio
  eleventyConfig.addFilter("shuffle", (array) => {
    let m = array.length,
      t,
      i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  });

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy(".htaccess");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("robots.txt");

  return {
    dir: {
      output: "www",
    },
    templateFormats: ["html", "njk", "pug"],
  };
};
