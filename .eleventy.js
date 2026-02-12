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

  // Colección principal de POSTS (Corrección aquí: {md,MD})
  eleventyConfig.addCollection("posts", (collection) => {
    return collection.getFilteredByGlob("src/posts/**/*.{md,MD}").sort((a,b)=>b.date - a.date);
  });

  // Colecciones por Categoría (Corrección aquí también: {md,MD})
  const cats = ["Tendencias","Deportes","Locales","Nacionales"];
  cats.forEach(cat => {
    eleventyConfig.addCollection(cat.toLowerCase(), (collection) => {
      // Busca en ambos tipos de extensión y filtra por tag
      return collection.getFilteredByGlob("src/posts/**/*.{md,MD}").filter(p=> (p.data.tags||[]).includes(cat));
    });
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}