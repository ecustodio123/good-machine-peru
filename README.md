# Good Machines Perú

Catálogo comercial de Good Machines Perú. La aplicación genera HTML estático para el inicio, las categorías, las colecciones y las fichas de productos.

## Desarrollo local

```sh
npm ci
npm run dev
npm run lint
npm run build
```

Para revisar la compilación localmente, ejecuta `npm run preview`.

## Cloudflare Pages

Usa `npm run build` como comando y `dist` como directorio de salida. La compilación genera el HTML de cada página, `404.html`, `robots.txt` y `sitemap.xml`. El PDF original sigue disponible para descargar y lleva `noindex` para que los buscadores puedan mostrar las fichas web.

Las URLs canónicas y el sitemap usan `company.siteUrl` en `src/config.ts`. Ajusta ese valor si se cambia el dominio de producción. Tras publicar, el sitemap se puede enviar desde la propiedad verificada del sitio en Google Search Console.

## Catálogo y cotizaciones

- Las 127 fichas de `src/catalog.ts` cubren las referencias identificadas en las 38 páginas del catálogo. Cada ficha registra la página, las especificaciones legibles, los recursos de imagen y el estado documentado. Las referencias presentadas por familias incluyen sus variantes en la ficha. Las fotos, el logotipo y la portada se extrajeron del PDF original.
- Las dos peletizadoras S-150 tienen identificadores independientes. Los estados de disponibilidad son referencias del catálogo.
- `src/config.ts` centraliza el archivo descargable, los datos de contacto y el número internacional de WhatsApp que usan las consultas y cotizaciones. La selección y cantidades se guardan en el navegador.
- Las fichas indican qué datos necesitan confirmación cuando el PDF contiene cifras contradictorias o repite especificaciones de otro equipo. Por ejemplo, el rango de producción de la peladora industrial de ajo tipo olla difiere entre el encabezado y la descripción de la p. 28.
