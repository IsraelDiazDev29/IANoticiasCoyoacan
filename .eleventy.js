import { DateTime } from "luxon";
export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addFilter("dateIso", (dateObj) => {
    const d = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    return d.toISOString();
  });
  eleventyConfig.addFilter("dateReadable", (dateObj) => {
    const d = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    return DateTime.fromJSDate(d).setLocale("es").toFormat("d LLL yyyy");
  });
  eleventyConfig.addFilter("json", (obj) => JSON.stringify(obj));
  eleventyConfig.addCollection("posts", (collection) => {
    return collection.getFilteredByGlob("src/posts/**/*.md").sort((a,b)=>b.date - a.date);
  });
  // Category collections
  const cats = ["Tendencias","Deportes","Locales","Nacionales"];
  cats.forEach(cat => {
    eleventyConfig.addCollection(cat.toLowerCase(), (collection) => {
      return collection.getFilteredByGlob("src/posts/**/*.md").filter(p=> (p.data.tags||[]).includes(cat));
    });
  });
  return {
    dir: { input: "src", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
