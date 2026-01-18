const slugify = require("slugify");

module.exports = {
  eleventyComputed: {
    // 1. FORZAR LA URL (Permalink)
    permalink: (data) => {
      // Si el archivo ya tiene un permalink manual, lo respetamos
      if (data.permalink) {
        return data.permalink;
      }

      // Si tiene título, generamos el slug bonito
      if (data.title) {
        const slug = slugify(data.title, {
          lower: true,      // Convierte a minúsculas
          strict: true,     // Elimina caracteres especiales (:, ?, ¿, !)
          remove: /[*+~.()'"!:@]/g // Limpieza extra por seguridad
        });
        
        // RESULTADO FINAL: /posts/mi-titulo-bonito/
        return `/posts/${slug}/`;
      }

      // Fallback: Si no hay título, usa el nombre del archivo original
      // para que no rompa el build.
      return `/posts/${data.page.fileSlug}/`;
    },

    // 2. EXTRA (Opcional): Limpiar el Layout
    // Si todos tus posts usan el mismo layout, puedes forzarlo aquí
    // y quitártelo de encima en el RPA.
    layout: "layouts/post.njk" 
  }
};