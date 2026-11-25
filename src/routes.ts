import { categories, products, type CategoryId, type Product } from './catalog'

type Collection = {
  path: string
  name: string
  description: string
  image: string
  category: CategoryId
  products: Product[]
  guide?: string
}

export function categoryPath(category: CategoryId) {
  return `/categorias/${category}/`
}

export function productPath(product: Product) {
  return `/productos/${product.slug}/`
}

export const topicalCollections: Collection[] = [
  {
    path: '/pisos-para-cerdos/', name: 'Pisos SLAT para cerdos', category: 'porcicultura', image: 'slat-60x60',
    description: 'Compara pisos SLAT de polipropileno y BMC para lechones y marranas. Revisa las medidas y cotiza para tu granja.',
    guide: 'Para lechones hay rejillas de 40 × 60, 50 × 60 y 60 × 60 cm. Para marranas, el catálogo incluye un piso modular de polipropileno y rejillas de BMC para anclar. Comprueba las medidas, el tipo de instalación y la carga indicada en cada ficha.',
    products: products.filter(product => product.category === 'porcicultura' && product.subcategory === 'Pisos para cerdo'),
  },
  {
    path: '/peladoras-de-ajo/', name: 'Peladoras de ajo', category: 'alimentos', image: 'peladora-ajo-200',
    description: 'Compara peladoras de ajo tipo olla y tipo cadena. Consulta capacidades, requisitos de aire comprimido y cotiza por WhatsApp.',
    guide: 'La peladora tipo olla compacta figura con 20–30 kg/h y las peladoras tipo cadena con 200 o 400 kg/h. La capacidad de la olla industrial está por confirmar. Antes de cotizar, revisa la presión y el caudal de aire que requiere tu modelo.',
    products: products.filter(product => product.category === 'alimentos' && product.id.startsWith('peladora-ajo-')),
  },
  {
    path: '/peletizadoras/', name: 'Peletizadoras para alimento balanceado', category: 'balanceados', image: 's-210',
    description: 'Compara peletizadoras eléctricas y gasolineras para granjas. Consulta producción por hora, potencia y voltaje de cada modelo.',
    guide: 'Revisa la producción por hora que necesitas y la alimentación disponible en tu granja. La S-150 tiene variantes eléctrica y gasolinera. Las fichas de los modelos trifásicos detallan la potencia, la matriz y el número de rodillos.',
    products: products.filter(product => product.category === 'balanceados' && product.subcategory === 'Peletizadoras'),
  },
]

export type Route = { type: 'home'; path: '/' } | { type: 'collection'; path: string; collection: Collection }
  | { type: 'product'; path: string; product: Product } | { type: 'not-found'; path: '/404.html' }

const collections: Collection[] = [
  ...categories.map(category => ({
    path: categoryPath(category.id),
    name: category.name,
    description: category.description,
    image: category.image,
    category: category.id,
    products: products.filter(product => product.category === category.id),
  })),
  ...topicalCollections,
]

export const routes: Route[] = [
  { type: 'home', path: '/' },
  ...collections.map((collection): Route => ({ type: 'collection', path: collection.path, collection })),
  ...products.map((product): Route => ({ type: 'product', path: productPath(product), product })),
  { type: 'not-found', path: '/404.html' },
]

export function routeFor(pathname: string): Route {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`
  return routes.find(route => route.path === path) ?? { type: 'not-found', path: '/404.html' }
}
