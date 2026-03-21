/**
 * Archivo de scripts para funcionalidades de la barra de administración.
 * Realiza un fetch asíncrono a la URL del post para escanear sus imágenes, 
 * siendo así compatible tanto si se invoca desde el mismo post como desde el dashboard general (/admin).
 */

async function obtenerDatosInyectados(rutaMD, urlPost, titulo, autor, cover, ogImage, image) {
  const imagenes = new Set();

  if (cover && cover.trim() !== "") imagenes.add(cover);
  if (ogImage && ogImage.trim() !== "") imagenes.add(ogImage);
  if (image && image.trim() !== "") imagenes.add(image);

  try {
      if (urlPost && urlPost.trim() !== "") {
          const response = await fetch(urlPost);
          const htmlText = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, "text/html");
          
          const nodosDeImagen = doc.querySelectorAll('article img, .prose img');
          nodosDeImagen.forEach(img => {
              const src = img.getAttribute('src');
              if (src && src.trim() !== "") {
                  imagenes.add(src);
              }
          });
      }
  } catch (err) {
      console.error("Error extrayendo imágenes del post:", err);
  }

  // Quitar el punto inicial de la ruta si existe (de "./src/..." a "/src/...")
  const cleanRutaMD = rutaMD.startsWith('.') ? rutaMD.substring(1) : rutaMD;

  // Combinar MD limpio y las imágenes
  const todasLasRutas = [cleanRutaMD, ...Array.from(imagenes)];
  
  // Objeto con la estructura solicitada
  return {
      nombre_commit: `${titulo} - ${autor}`,
      rutas: todasLasRutas
  };
}

window.manejarPublicacion = async function(rutaMD, urlPost, titulo, autor, cover, ogImage, image) {
  const boton = event.currentTarget || event.target;
  const textoOriginal = boton.innerText;
  boton.innerText = "...";
  boton.disabled = true;

  const datos = await obtenerDatosInyectados(rutaMD, urlPost, titulo, autor, cover, ogImage, image);
  
  console.log("=== DATOS PARA PUBLICAR ===");
  console.log(datos);
  
  boton.innerText = textoOriginal;
  boton.disabled = false;
  return datos;
};

window.manejarPublicacionProd = async function(rutaMD, urlPost, titulo, autor, cover, ogImage, image) {
  const boton = event.currentTarget || event.target;
  const textoOriginal = boton.innerText;
  boton.innerText = "...";
  boton.disabled = true;

  const datos = await obtenerDatosInyectados(rutaMD, urlPost, titulo, autor, cover, ogImage, image);
  
  console.log("=== DATOS PARA PUBLICAR A PROD ===");
  console.log(datos);
  
  boton.innerText = textoOriginal;
  boton.disabled = false;
  return datos;
};
