# Documentación Técnica

## Configuración Eleventy

- Usa Eleventy 2.x
- Configuración en `.eleventy.js`

## Estructura

```
noticias/
├── src/
│   ├── _includes/
│   │   └── layouts/
│   │       ├── base.njk
│   │       └── post.njk
│   ├── assets/
│   ├── posts/          # Markdown de noticias
│   ├── data/           # Data global (categorías)
│   ├── index.njk       # Home dinámico
│   ├── local.njk       # Página Local dinámico
│   └── national.njk    # Página National dinámico
├── docs/
│   ├── TECHNICAL.md
│   └── USER.md
├── .eleventy.js
└── package.json
```

## Uso

```bash
npm install
npm run start    # desarrollo
npm run build    # producción
```

## Desarrollo de contenidos

- Añade MD en `src/posts/` con frontmatter (`title`, `date`, `summary`, `category`, `image`).
- Las categorías se filtran en las páginas `local` y `national`.
