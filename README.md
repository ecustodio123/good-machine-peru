# Good Machines Perú

Demo comercial de Kafka Tech. La aplicación es estática y funciona en la ruta `/`.

## Desarrollo local

```sh
npm ci
npm run dev
npm run lint
npm run build
```

Para revisar la compilación localmente, ejecuta `npm run preview`.

## Cloudflare Pages

Usa `npm run build` como comando y `dist` como directorio de salida. La demo incluye `noindex` en el HTML y en las cabeceras de Pages. El PDF original se sirve desde el mismo sitio.

## Catálogo y cotizaciones

- Las 36 fichas tipadas de `src/catalog.ts` registran la página de referencia, las especificaciones legibles, los recursos de imagen y el estado documentado. Las fotos, el logotipo y la portada se extrajeron del PDF original.
- Las dos peletizadoras S-150 tienen identificadores independientes. Los estados de disponibilidad son referencias del catálogo.
- `src/config.ts` centraliza el archivo descargable y los datos de contacto. Completa WhatsApp con el número internacional confirmado, incluidos los dígitos del prefijo de país. Mientras ese campo esté vacío, la cotización se puede copiar. La selección y cantidades se guardan en el navegador.
- Confirma los canales de contacto, las medidas de la extrusora DGP-40 (p. 5) y el intervalo de calor de la selladora PFS-400 (p. 34) antes de publicar. La p. 34 también repite el encabezado de la PFS-400 sobre una fotografía y ficha de escalera. Para la selladora se usó el bloque que muestra el equipo.
