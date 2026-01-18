import slugify from "slugify";

export default {
  eleventyComputed: {
    permalink: (data) => {
      // 1. Si ya pusiste un permalink manual, úsalo.
      if (data.permalink) {
        return data.permalink;
      }
      
      // 2. Si tiene título, generamos el slug bonito
      if (data.title) {
        const slug = slugify(data.title, {
          lower: true,      // Todo a minúsculas
          strict: true,     // Elimina caracteres raros
          remove: /[*+~.()'"!:@]/g // Limpieza extra
        });
        return `/posts/${slug}/`;
      }

      // 3. Fallback: Si no hay título, usa el nombre del archivo
      return `/posts/${data.page.fileSlug}/`;
    }
  }
};