module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addCollection("posts", c => c.getFilteredByGlob("src/posts/*.md"));

  return {
    dir: { input: "src", includes: "_includes", data: "data", output: "dist" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
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
