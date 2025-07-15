// .eleventy.js
module.exports = function(eleventyConfig) {
  // Copiar assets estáticos
  eleventyConfig.addPassthroughCopy("src/assets");

  // Define colección "posts"
  eleventyConfig.addCollection("posts", collectionApi => {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  // Define URL base como variable global
  eleventyConfig.addGlobalData("site", {
    url: "https://noticiascdmxsur.online"
  });

  return {
    dir: {
      input:    "src",
      includes: "_includes",
      data:     "data",
      output:   "dist"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine:     "njk",
    frontMatter: {
      defaults: [
        {
          scope: { path: "posts", type: "md" },
          values: { layout: "layouts/post.njk" }
        }
      ]
    }
  };
};
