import { Beef, Boxes, CookingPot, Droplets, Fan, PackageCheck, Settings, Sprout, Wheat } from 'lucide-react'

export const categories = [
  { id: 'balanceados', name: 'Alimentos balanceados', description: 'Peletización, extrusión y mezcla para producir alimento animal.', image: 's-210', icon: Settings },
  { id: 'granos', name: 'Molinos y procesamiento de granos', description: 'Molienda, trillado y pilado de granos y cereales.', image: '9fc-40', icon: Wheat },
  { id: 'alimentos', name: 'Procesamiento de alimentos', description: 'Transformación de vegetales, snacks y otras materias primas.', image: 'snacks-maiz', icon: CookingPot },
  { id: 'avicultura', name: 'Avicultura', description: 'Equipos para la alimentación y el procesamiento en granjas avícolas.', image: 'desplumadora-sy', icon: Sprout },
  { id: 'porcicultura', name: 'Porcicultura', description: 'Comederos, bebederos y pisos para el manejo porcino.', image: 'comedero-12-bocas', icon: Beef },
  { id: 'aceites', name: 'Extracción de aceites', description: 'Prensas hidráulicas y de tornillo para la extracción de aceite.', image: 'zx-85', icon: Droplets },
  { id: 'empaque', name: 'Empaque y sellado', description: 'Empacadoras al vacío y selladoras para el acabado de tus productos.', image: 'dr-770', icon: PackageCheck },
  { id: 'deshidratadores', name: 'Deshidratadores', description: 'Equipos de secado de alimentos de distintas capacidades.', image: 'ss-32h', icon: Fan },
  { id: 'complementarios', name: 'Equipos complementarios', description: 'Aire comprimido, transporte y trituración para distintas operaciones.', image: 'compresor-10hp', icon: Boxes },
] as const

export type CategoryId = typeof categories[number]['id']
export type PowerSource = 'Eléctrica' | 'Gasolinera' | 'Diésel'
type Availability = 'consultar' | 'agotado'
type Specification = readonly [label: string, value: string]

export type Product = {
  id: string
  slug: string
  name: string
  model?: string
  category: CategoryId
  subcategory: string
  description: string
  images: readonly string[]
  specifications: readonly Specification[]
  applications: readonly string[]
  power?: PowerSource
  availability: Availability
  featured: boolean
  sourcePage: number
  validationNotes?: string
}

type ProductDetails = Partial<Pick<Product, 'model' | 'power' | 'availability' | 'featured' | 'applications' | 'validationNotes'>>
  & { extraImages?: readonly string[] }

export const media = (name: string) => `/media/${name}.webp`
export const getCategory = (id: CategoryId) => categories.find(category => category.id === id)!
export const productName = (product: Product) => product.model ? `${product.name} · ${product.model}` : product.name
export const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es').replace(/[^a-z0-9]+/g, ' ').trim()

function equipment(
  id: string, name: string, category: CategoryId, subcategory: string, sourcePage: number,
  description: string, specifications: readonly Specification[], details: ProductDetails = {},
): Product {
  const { extraImages = [], ...attributes } = details
  return {
    id, slug: id, name, category, subcategory, sourcePage, description, specifications,
    images: [id, ...extraImages].map(media), applications: [], availability: 'consultar', featured: false,
    ...attributes,
  }
}

export const products: Product[] = [
  equipment('s-150-electrica', 'Peletizadora eléctrica', 'balanceados', 'Peletizadoras', 3,
    'Peletizadora de dos rodillos con motor monofásico.', [
      ['Producción', '80–120 kg/h'], ['Motor', '3 kW / 4 HP'], ['Voltaje', '220 V / 60 Hz'],
      ['Matriz', '4 mm'], ['Rodillos', '2'], ['Peso', '100 kg'],
    ], { model: 'S-150', power: 'Eléctrica', featured: true, applications: ['Peletización de alimentos balanceados'] }),
  equipment('s-210', 'Peletizadora', 'balanceados', 'Peletizadoras', 3,
    'Equipo eléctrico trifásico con matriz de 4 mm y tres rodillos.', [
      ['Producción', '350 kg/h'], ['Motor', '7,5 kW / 10 HP'], ['Voltaje', '380 V / 60 Hz'],
      ['Matriz', '4 mm'], ['Rodillos', '3'], ['Peso', '205 kg'],
    ], { model: 'S-210', power: 'Eléctrica', featured: true, applications: ['Peletización de alimentos balanceados'] }),
  equipment('dgp-40', 'Extrusora para peces', 'balanceados', 'Extrusoras', 5,
    'Extrusora trifásica con cinco moldes y tablero de control de temperatura y velocidad.', [
      ['Producción', '50–60 kg/h'], ['Motor principal', '7,5 kW / 10 HP'], ['Voltaje', '380 V / 60 Hz'],
      ['Motor de alimentación', '0,4 kW'], ['Motor de corte', '0,4 kW'],
      ['Calentamiento', '1 kW'], ['Moldes', '5'], ['Peso', '350 kg'],
    ], { model: 'DGP-40', power: 'Eléctrica', featured: true,
      extraImages: ['dgp-40-lateral', 'dgp-40-frontal'], applications: ['Extrusión de alimentos balanceados para peces'],
      validationNotes: 'La página 5 indica dimensiones con unidades inconsistentes. Medidas pendientes de confirmación.' }),
  equipment('9fc-40', 'Molino de martillos', 'granos', 'Molinos', 10,
    'Molino de martillos de alta resistencia para molienda de granos secos.', [
      ['Producción', '300–600 kg/h'], ['Motor', '10 HP'], ['Voltaje', '380 V trifásico'],
    ], { model: '9FC-40', power: 'Eléctrica', featured: true, applications: ['Molienda de maíz, trigo, cebada, sorgo y soya'] }),
  equipment('zx-85', 'Prensa de aceite', 'aceites', 'Prensas de tornillo', 27,
    'Expeller industrial con engranaje cónico y motor trifásico.', [
      ['Producción', '100–150 kg/h'], ['Motor', '7,5 kW'], ['Voltaje', '380 V / 60 Hz'],
      ['Dimensiones de embalaje', '1,65 × 0,56 × 0,75 m'],
    ], { model: 'ZX-85', power: 'Eléctrica', featured: true, applications: ['Extracción industrial de aceites'] }),
  equipment('dr-770', 'Selladora continua', 'empaque', 'Selladoras', 33,
    'Selladora de banda continua con anchura ajustable y configuración vertical.', [
      ['Temperatura', '0–300 °C'], ['Velocidad de sellado', '0–24 m/min'], ['Potencia', '700 W'],
      ['Ancho de sellado', '6–12 mm'], ['Voltaje', '220 V / 60 Hz'],
      ['Dimensiones', '85 × 36 × 45 cm'], ['Peso', '25 kg'],
    ], { model: 'DR-770', power: 'Eléctrica', featured: true }),
  equipment('ss-06a', 'Deshidratador', 'deshidratadores', 'Equipos de sobremesa', 36,
    'Equipo compacto con panel digital y un ventilador.', [
      ['Bandejas', '6'], ['Potencia', '700 W'], ['Temperatura', '35–85 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '30 × 28 cm'], ['Dimensiones', '34 × 45 × 31,8 cm'], ['Peso', '9,5 kg'],
    ], { model: 'SS-06A', power: 'Eléctrica', featured: true }),
  equipment('ss-32h', 'Deshidratador industrial', 'deshidratadores', 'Equipos de piso', 37,
    'Equipo de dos puertas con panel digital y cuatro ventiladores.', [
      ['Bandejas', '32'], ['Potencia', '3.000 W'], ['Temperatura', '30–90 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '40 × 38 cm'], ['Dimensiones', '46,5 × 57 × 132 cm'], ['Peso', '46 kg'],
    ], { model: 'SS-32H', power: 'Eléctrica', featured: true }),
  equipment('s-150-gasolinera', 'Peletizadora gasolinera', 'balanceados', 'Peletizadoras', 3,
    'Variante con motor a gasolina y matriz de 4 mm.', [
      ['Producción', '80–120 kg/h'], ['Motor', '7,5 HP'], ['Matriz', '4 mm'], ['Rodillos', '2'], ['Peso', '100 kg'],
    ], { model: 'S-150', power: 'Gasolinera', applications: ['Peletización de alimentos balanceados'] }),
  equipment('s-160', 'Peletizadora eléctrica', 'balanceados', 'Peletizadoras', 3,
    'Peletizadora monofásica de tres rodillos.', [
      ['Producción', '120–150 kg/h'], ['Motor', '4 kW / 5,5 HP'], ['Voltaje', '220 V / 60 Hz'],
      ['Matriz', '4 mm'], ['Rodillos', '3'], ['Peso', '106 kg'],
    ], { model: 'S-160', power: 'Eléctrica' }),
  equipment('mezcladora-50', 'Mezcladora de alimentos balanceados', 'balanceados', 'Mezcladoras', 12,
    'Mezcladora por lotes para pequeñas y medianas granjas.', [
      ['Capacidad', '50 kg por lote'], ['Mezclado', '10 min por lote'], ['Motor', '2 HP'],
      ['Dimensiones', '100 × 60 × 60 cm'], ['Peso', '60 kg'],
    ], { applications: ['Preparación de alimento balanceado para aves, cerdos y ganado'] }),
  equipment('ms-25', 'Amasadora y mezcladora', 'balanceados', 'Mezcladoras', 13,
    'Equipo de doble función para mezclar y amasar.', [
      ['Capacidad', '25 kg por lote'], ['Mezclado', '10 min por lote'], ['Motor', '3 HP'], ['Voltaje', '220 V'],
    ], { model: 'MS-25', power: 'Eléctrica', applications: ['Alimentos balanceados y masas'] }),
  equipment('yl-100', 'Molino para granos secos', 'granos', 'Molinos', 10,
    'Molino semiindustrial con seis zarandas intercambiables.', [
      ['Producción', '250 kg/h'], ['Motor', '3 HP'], ['Voltaje', '220 V monofásico'], ['Peso', '50 kg'],
    ], { model: 'YL-100', power: 'Eléctrica', applications: ['Maíz, trigo, cebada, maca, anís y hojas secas'] }),
  equipment('trilladora', 'Trilladora de arroz y trigo', 'granos', 'Trilladoras', 10,
    'Separa el grano de la paja con cribas y ventilador incorporado.', [
      ['Producción', '500 kg/h'], ['Motor', '7 HP'],
    ], { power: 'Gasolinera', applications: ['Trillado de arroz y trigo'] }),
  equipment('piladora-6n-40', 'Piladora de arroz, trigo y cebada', 'granos', 'Piladoras', 9,
    'Equipo monofásico para convertir arroz con cáscara en arroz semipulido.', [
      ['Producción', '70–100 kg/h'], ['Motor', '3 HP monofásico'],
    ], { model: '6N-40', power: 'Eléctrica' }),
  equipment('pulverizador-1500', 'Molino pulverizador de 1500 g', 'granos', 'Pulverizadores', 8,
    'Pulverizador de alta velocidad para materias primas secas.', [
      ['Capacidad de tolva', '1.500 g'], ['Velocidad', '35.000 rpm'], ['Motor', '3.500 W'], ['Voltaje', '220 V / 60 Hz'],
    ], { power: 'Eléctrica', availability: 'agotado', applications: ['Granos, semillas y especias'] }),
  equipment('6nf-150', 'Molino de granos secos', 'granos', 'Molinos', 8,
    'Molino compacto con discos de tungsteno para molienda seca.', [
      ['Producción', '30–40 kg/h'], ['Motor', '2 HP'], ['Voltaje', '220 V monofásico'], ['Peso', '25 kg'],
    ], { model: '6NF-150', power: 'Eléctrica', availability: 'agotado' }),
  equipment('procesador-8l', 'Procesador de vegetales', 'alimentos', 'Procesadores', 12,
    'Procesa ingredientes hasta obtener partículas o una pasta fina, según el tiempo de trabajo.', [
      ['Capacidad', '8 L por lote'], ['Motor', '1,5 HP'],
    ], { applications: ['Picado y triturado de carnes, frutas, vegetales, granos y salsas'] }),
  equipment('snacks-maiz', 'Extrusora de snacks de maíz', 'alimentos', 'Extrusoras', 13,
    'Extrusora para snacks inflados con siete moldes para variar la forma del producto.', [
      ['Producción', '20 kg/h'], ['Motor', '5,5 kW'], ['Tolva', '1,5 kg'], ['Velocidad', '500–600 rpm'],
      ['Voltaje', '220 V o 380 V'], ['Peso', '20 kg'],
    ], { power: 'Eléctrica' }),
  equipment('peladora-ajo-30', 'Peladora de ajo tipo olla', 'alimentos', 'Peladoras', 28,
    'Peladora cilíndrica para procesar dientes de ajo con suministro de aire comprimido.', [
      ['Producción', '20–30 kg/h'], ['Motor', '200 W'], ['Voltaje', '220 V o 380 V'], ['Aire comprimido', '0,8 MPa'],
      ['Dimensiones', '48 × 48 × 76 cm'], ['Peso', '25 kg'],
    ], { power: 'Eléctrica' }),
  equipment('despicadora', 'Despicadora automática de aves', 'avicultura', 'Despicadoras', 20,
    'Equipo de cuchilla caliente con transformador y ventilador.', [
      ['Rendimiento', '750–900 aves/h'], ['Potencia', '200–250 W'], ['Voltaje', '220 V'], ['Dimensiones', '27 × 16 × 14 cm'],
    ], { power: 'Eléctrica' }),
  equipment('bebedero-aves', 'Bebedero manual para aves', 'avicultura', 'Bebederos', 20,
    'Bebedero de plástico con sistema de vacío y tapa superior removible.', [
      ['Capacidades', '6, 11 y 14 L'], ['Material', 'Plástico'],
    ], { applications: ['Suministro de agua para pollos'] }),
  equipment('desplumadora-sy', 'Desplumadora de pollos y cuyes', 'avicultura', 'Desplumadoras', 31,
    'Familia de equipos para procesamiento avícola en dos capacidades documentadas.', [
      ['Capacidad SY-55', '4–5 pollos por ciclo'], ['Capacidad SY-80', '10–12 pollos por ciclo'],
      ['Potencia SY-55', '1,5 HP'], ['Potencia SY-80', '2 HP'],
    ], { model: 'Serie SY' }),
  equipment('niple-porcino', 'Bebedero automático tipo niple', 'porcicultura', 'Bebederos', 22,
    'Bebedero roscado con ajuste de caudal para lechones y marranas.', [
      ['Material', 'Acero cromado'], ['Tamaño', '8,5 × 2,7 cm'], ['Peso', '145 g'],
    ]),
  equipment('slat-40x60', 'Piso SLAT PP para lechones', 'porcicultura', 'Pisos SLAT', 23,
    'Rejilla modular con encajes laterales para el manejo en granjas porcinas.', [
      ['Dimensiones', '60 × 40 cm'], ['Ranuras', '10 mm'], ['Material', 'Plástico de alta resistencia'],
    ]),
  equipment('comedero-12-bocas', 'Comedero doble de acero inoxidable', 'porcicultura', 'Comederos', 22,
    'Comedero de dos caras para alimentación simultánea en granjas porcinas.', [
      ['Bocas', '12'], ['Capacidad', '100 kg'], ['Material', 'Acero inoxidable'], ['Dimensiones', '120 × 50 × 55 cm'],
    ]),
  equipment('ot-180', 'Prensa hidráulica de aceite', 'aceites', 'Prensas hidráulicas', 27,
    'Prensa de aceite hidráulica de uso industrial con barril de 4 kg.', [
      ['Producción', '20 kg/h'], ['Capacidad del barril', '4 kg'], ['Motor', '1,5 kW'],
      ['Voltaje', '220 V / 60 Hz'], ['Presión de trabajo', '55–60 MPa'],
    ], { model: 'OT-180', power: 'Eléctrica', availability: 'agotado' }),
  equipment('ot-230', 'Prensa hidráulica de aceite', 'aceites', 'Prensas hidráulicas', 27,
    'Prensa hidráulica con barril de 8 kg.', [
      ['Producción', '40 kg/h'], ['Capacidad del barril', '8 kg'], ['Motor', '1,5 kW'],
      ['Voltaje', '220 V / 60 Hz'], ['Presión de trabajo', '55–60 MPa'],
    ], { model: 'OT-230', power: 'Eléctrica', availability: 'agotado' }),
  equipment('expeller-s9s', 'Expeller de aceites', 'aceites', 'Prensas de tornillo', 26,
    'Extractor de aceite con motor de 400 W según ficha de catálogo.', [
      ['Producción', '7–12 kg/h'], ['Potencia nominal', '1.200 W'], ['Motor', '400 W'], ['Voltaje', '220 V'], ['Peso neto', '22 kg'],
    ], { model: 'S9S', power: 'Eléctrica', availability: 'agotado' }),
  equipment('expeller-t3', 'Expeller de aceites', 'aceites', 'Prensas de tornillo', 26,
    'Extractor de aceite con motor de 300 W según ficha de catálogo.', [
      ['Producción', '5–8 kg/h'], ['Potencia nominal', '1.100 W'], ['Motor', '300 W'], ['Voltaje', '220 V'], ['Peso neto', '13,5 kg'],
    ], { model: 'T3', power: 'Eléctrica' }),
  equipment('dz-260c', 'Empacadora al vacío de campana', 'empaque', 'Empacadoras al vacío', 33,
    'Empacadora de un sello con tapa acrílica y cuerpo de acero inoxidable.', [
      ['Velocidad', '1–3 piezas/min'], ['Ancho de boca', 'Hasta 255 mm'], ['Potencia', '120 W'],
      ['Voltaje', '220 V monofásico'], ['Cámara', '330 × 275 × 50 mm'], ['Peso', '21 kg'],
    ], { model: 'DZ-260C', power: 'Eléctrica' }),
  equipment('pfs-400', 'Selladora manual de bolsas', 'empaque', 'Selladoras', 34,
    'Selladora con carcasa de aluminio y tiempo de calor ajustable.', [
      ['Longitud de sellado', 'Hasta 400 mm'], ['Ancho de sello', '5 mm'], ['Potencia', '600 W'],
      ['Voltaje', '220 V / 60 Hz'],
    ], { model: 'PFS-400', power: 'Eléctrica',
      validationNotes: 'El catálogo indica el intervalo de tiempo de calor como «2 – 1.5 seg». Rango pendiente de confirmación.' }),
  equipment('ss-10h', 'Deshidratador', 'deshidratadores', 'Equipos de sobremesa', 36,
    'Equipo con panel digital, diez bandejas y un ventilador.', [
      ['Bandejas', '10'], ['Potencia', '800 W'], ['Temperatura', '30–90 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '30 × 28 cm'], ['Peso', '10,4 kg'],
    ], { model: 'SS-10H', power: 'Eléctrica' }),
  equipment('pc-200-300', 'Trituradora de minerales', 'complementarios', 'Trituradoras', 17,
    'Trituradora de martillos con estructura de acero al carbono y motor diésel.', [
      ['Producción', '3–5 t/h'], ['Motor', '12 HP'], ['Tamaño de entrada', 'Hasta 10 cm'],
      ['Tamaño de salida', 'Menor a 1 cm'], ['Peso', '580 kg'],
    ], { model: 'PC 200 × 300', power: 'Diésel', applications: ['Trituración de rocas y minerales'] }),
  equipment('compresor-10hp', 'Compresor de aire de pistón', 'complementarios', 'Compresores', 28,
    'Compresor trifásico con ruedas para trasladarlo dentro del área de trabajo.', [
      ['Potencia', '7,5 kW / 10 HP'], ['Presión de trabajo', '0,8 MPa'], ['Caudal', '0,9 m³/min'],
      ['Peso', '180 kg'], ['Dimensiones', '145 × 50 × 110 cm'],
    ], { power: 'Eléctrica' }),
  equipment('cinta-selectiva', 'Cinta transportadora selectiva', 'complementarios', 'Transportadoras', 30,
    'Mesa de transporte y selección manual o visual con velocidad regulable.', [
      ['Ancho de cinta', '50 cm'], ['Motor', '750 W'], ['Voltaje', '220 V o 380 V'],
      ['Material de banda', 'PVC'], ['Peso', '150 kg'],
    ], { power: 'Eléctrica' }),
]
