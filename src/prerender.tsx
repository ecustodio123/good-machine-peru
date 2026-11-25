import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import App from './App'
import { getCategory, media, productName } from './catalog'
import { company } from './config'
import { categoryPath, routes, type Route } from './routes'

const homeDescription = 'Catálogo de maquinaria agroindustrial y equipos para granjas en Perú. Compara peletizadoras, pisos para cerdos y peladoras de ajo. Cotiza por WhatsApp.'
const shareImage = '/media/vista-previa-good-machines.jpg'
const absolute = (path: string) => new URL(path, company.siteUrl).href

function structuredData(route: Exclude<Route, { type: 'not-found' }>) {
  if (route.type === 'home') return [
    {
      '@type': 'Organization', '@id': absolute('/#organizacion'), name: company.name,
      url: absolute('/'), logo: absolute(company.logo), telephone: `+${company.contact.whatsapp.number}`,
      address: { '@type': 'PostalAddress', ...company.contact.address },
      sameAs: company.contact.social.map(profile => profile.url),
    },
    {
      '@type': 'WebSite', name: company.name, url: absolute('/'), inLanguage: 'es-PE',
      publisher: { '@id': absolute('/#organizacion') },
    },
  ]

  const category = getCategory(route.type === 'product' ? route.product.category : route.collection.category)
  const pageName = route.type === 'product' ? productName(route.product) : route.collection.name
  const trail = [{ name: 'Inicio', path: '/' }]
  if (route.path !== categoryPath(category.id)) trail.push({ name: category.name, path: categoryPath(category.id) })
  trail.push({ name: pageName, path: route.path })
  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(({ name, path }, index) => ({
      '@type': 'ListItem', position: index + 1, name, item: absolute(path),
    })),
  }
  if (route.type === 'collection') return [breadcrumbs]

  const { product } = route
  return [breadcrumbs, {
    '@type': 'Product', '@id': absolute(`${route.path}#producto`), url: absolute(route.path),
    name: pageName, description: product.description, image: product.images.map(absolute),
    category: category.name, model: product.model,
    additionalProperty: product.specifications.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
  }]
}

function PageMetadata({ route }: { route: Route }) {
  if (route.type === 'not-found') return <>
    <title>{`Página no encontrada | ${company.name}`}</title>
    <meta name="robots" content="noindex" />
  </>

  const isHome = route.type === 'home'
  const title = isHome ? `Maquinaria agroindustrial y para granjas | ${company.name}` : route.type === 'collection'
    ? `${route.collection.name} en Perú | ${company.name}` : `${productName(route.product)} | ${company.name}`
  const description = route.type === 'collection' ? route.collection.description : route.type === 'product'
    ? `${route.product.description} Consulta la ficha técnica y cotiza por WhatsApp con Good Machines Perú.` : homeDescription
  const image = route.type === 'collection' ? media(route.collection.image) : route.type === 'product'
    ? route.product.images[0] : shareImage
  const alt = isHome ? 'Good Machines Perú, Todo para tu granja. Una extrusora, una peletizadora y un piso SLAT.'
    : route.type === 'product' ? productName(route.product) : route.collection.name
  const data = JSON.stringify({ '@context': 'https://schema.org', '@graph': structuredData(route) }).replace(/</g, '\\u003c')

  return <>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={absolute(route.path)} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="es_PE" />
    <meta property="og:site_name" content={company.name} />
    <meta property="og:url" content={absolute(route.path)} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={absolute(image)} />
    <meta property="og:image:type" content={isHome ? 'image/jpeg' : 'image/webp'} />
    <meta property="og:image:alt" content={alt} />
    {isHome && <><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /></>}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={absolute(image)} />
    <meta name="twitter:image:alt" content={alt} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />
  </>
}

export function renderSite(template: string) {
  const metadataSlot = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
  const appSlot = '<div id="root"></div>'
  if (!metadataSlot.test(template) || !template.includes(appSlot)) throw new Error('Faltan los marcadores del HTML del sitio.')

  const pages = routes.map(route => ({
    path: route.path,
    html: template.replace(metadataSlot, () => renderToStaticMarkup(<PageMetadata route={route} />))
      .replace(appSlot, () => `<div id="root">${renderToString(<App route={route} />)}</div>`),
  }))
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + routes.filter(route => route.type !== 'not-found').map(route => `  <url><loc>${absolute(route.path)}</loc></url>`).join('\n')
    + '\n</urlset>\n'
  return { pages, sitemap, robots: `User-agent: *\nAllow: /\nSitemap: ${absolute('/sitemap.xml')}\n` }
}
