# Flujo de Trabajo Git: main, qa y prod

Este documento explica cómo gestionar el flujo de actualizaciones desde la rama de código base (`main`) hacia producción (`prod`) sin perder el contenido editorial y los archivos generados en esa misma rama.

## Situación Actual de las Ramas

*   **`main`**: Contiene todo el código base de desarrollo (HTML, plantillas de Eleventy, CSS, scripts JS, configuración). Aquí es donde se desarrolla el diseño y las funcionalidades.
*   **`prod`**: Contiene exactamente el mismo código base, **pero también almacena las notas de post (Markdown) y las imágenes de las noticias** que se han ido creando y subiendo (ya sea manualmente o a través de la API/Sistema Automatizado de noticias).
*   **`qa`**: Rama destinada para pruebas o que almacena la compilación completa generada por Eleventy (entorno de pruebas).

## El Reto

El temor natural es que al pasar los cambios de `main` (donde no creamos noticias) a `prod` (donde sí se generan y suben noticias), las noticias e imágenes de `prod` sean reemplazadas o eliminadas para quedar "igual que en main".

## La Solución: Git Merge

La principal ventaja de usar un sistema de control de versiones es que, por diseño, **Git no va a sobrescribir ni eliminar los archivos**.

Si en `prod` se crea una noticia (ej. `src/posts/noticia-1.md`) y su imagen, Git lo registra como contenido nuevo que pertenece a la historia de `prod`. Si posteriormente tú modificas un archivo `.js` o `.css` en la rama `main` y haces una fusión (merge) hacia la rama de producción, Git es lo suficientemente inteligente para simplemente **incorporar** los cambios de tu código sin afectar los archivos Markdown o de imágenes que no se tocaron o borraron explícitamente en la línea temporal original.

### Paso a paso para actualizar `prod` con el nuevo código de `main`

Cada vez que termines de programar un cambio en el diseño y lo quieras desplegar en el sitio de producción, debes seguir estos comandos:

**1. Asegúrate de tener tu trabajo guardado en `main`:**
```bash
git checkout main
git status
# (Asegúrate de haber hecho git commit y git push de todo tu desarrollo)
```

**2. Cambia a la rama de producción y actualiza:**
```bash
git checkout prod
git pull origin prod
# Esto descarga a tu computadora el estado actual de producción, incluyendo 
# cualquier nota o foto que se haya publicado recientemente automáticmente.
```

**3. Trae (fusiona) los cambios de código desde main:**
```bash
git merge main
```
*En este punto, Git combinará los cambios. Si tocaste diseño, se actualizará. Los posts de noticias y las fotos de `prod` quedarán intactos porque main "no sabe" que esos archivos deben ser removidos; simplemente agregará las novedades del sitio al repositorio.*

**4. Sube la actualización final al servidor:**
```bash
git push origin prod
```

### Reglas de Oro para este flujo:
1. **Nunca modifiques artículos o fotos directamente en `main`**. El contenido editorial debe vivir y ser subido siempre a `prod` (o la base de datos).
2. **El flujo de código es siempre desde `main` a `prod`** (Hacer `git merge main` estando dentro de la rama `prod`).
3. **El flujo de contenido se queda en `prod` y no es necesario retroceder a `main`** (A menos que desees bajar toda la base de imágenes a `main` para probar contenido localmente, lo cual puedes hacer con `git pull origin prod` estando en `main`).

### Solución Alternativa de Arquitectura a Largo Plazo
Si el contenido genera demasiados conflictos en el futuro, una excelente práctica de Eleventy es **separar el contenido del código**. Podrías decirle a Eleventy en `eleventy.config.js` que el directorio de Markdown (`posts`) e imágenes viva en una carpeta no controlada por las ramas (ej. ignorada por el archivo `.gitignore` y que el servidor se encargue de no sobreescribirla). Sin embargo, con el `git merge` actual el problema queda resuelto si se hace de manera disciplinada.
