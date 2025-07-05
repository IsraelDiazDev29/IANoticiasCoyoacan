# Guía de Usuario

## Navegación

- **Home**: Lista todas las noticias.
- **Local**: Noticias categorizadas como `local`.
- **National**: Noticias categorizadas como `national`.
- **Contact**: Información de contacto.

## Publicar nueva noticia

1. Crea un archivo en `src/posts/` con extensión `.md`.
2. Frontmatter obligatorio:
   - `title`
   - `date`
   - `summary`
   - `category` (local/national)
   - `image` (ruta dentro de `/assets`)
3. Guarda y ejecuta `npm run build` o `npm run start`.

## Despliegue

Sube la carpeta `dist/` resultante a tu hosting estático.
