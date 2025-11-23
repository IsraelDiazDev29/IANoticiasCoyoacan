# NOTICIAS SUR CDMX — Eleventy
Sitio de noticias minimalista con modo claro/oscuro, colecciones por categorías, metadatos SEO/OG/Twitter, y sitemaps (general + Google News).

## Requisitos
- Node.js 18+
- npm

## Desarrollo
```bash
npm install
npm run dev
```
Luego abre http://localhost:8080

## Build
```bash
npm run build
```

## Estructura de contenido
Cada noticia es un archivo Markdown en `src/posts/` con _front matter_ como:
```yaml
---
layout: layouts/article.njk
title: "Título"
date: 2025-10-13
author: "Redacción"
cover: "/assets/img/mi-foto.jpg"
alt: "Texto alternativo"
breaking: false
tags: ["Tendencias","Locales"]
category: "Tendencias"
description: "Resumen para SEO"
ogImage: "/assets/img/mi-foto.jpg"
---

Cuerpo de la noticia en **Markdown**.
```

## SEO & Metadatos
- Canonical, robots (`max-image-preview:large`), Open Graph, Twitter Cards
- JSON-LD: NewsMediaOrganization + WebSite (SearchAction) global; NewsArticle por post
- `/sitemap.xml` y `/news-sitemap.xml`
