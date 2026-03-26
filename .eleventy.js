import { DateTime } from "luxon";

export default function(eleventyConfig) {
  // Copia de assets (imágenes, CSS, etc.)
eleventyConfig.addPassthroughCopy("src/assets");

  // Filtro de fecha ISO
  eleventyConfig.addFilter("dateIso", (dateObj) => {
    const d = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    return d.toISOString();
  });

  // Filtro de fecha legible en español
  eleventyConfig.addFilter("dateReadable", (dateObj) => {
    const d = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    return DateTime.fromJSDate(d).setLocale("es").toFormat("d LLL yyyy");
  });

  // Filtro JSON
  eleventyConfig.addFilter("json", (obj) => JSON.stringify(obj));

  // Colección principal de POSTS con ordenamiento cronológico exacto de milisegundos
  eleventyConfig.addCollection("posts", (collection) => {
    return collection.getFilteredByGlob("src/posts/**/*.{md,MD}").sort((a,b) => {
      // Orden cronológico exacto (del más reciente al más antiguo)
      return b.date.getTime() - a.date.getTime();
    });
  });

  // Colección dinámica de categorías (extrae la categoría principal de cada post)
  eleventyConfig.addCollection("categoriesList", (collection) => {
    let catSet = new Set();
    collection.getAll().forEach(item => {
      if (item.data && item.data.category) {
        catSet.add(item.data.category);
      }
    });
    return [...catSet].sort();
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}