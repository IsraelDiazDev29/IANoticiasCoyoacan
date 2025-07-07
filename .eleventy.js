// .eleventy.js

module.exports = function(eleventyConfig) {
  // Copia los assets estáticos
  eleventyConfig.addPassthroughCopy("src/assets");

  // Define la colección "posts", ordenada por fecha descendente (más reciente primero)
  eleventyConfig.addCollection("posts", collectionApi => {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  // Configuración de directorios y motores de plantillas
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
