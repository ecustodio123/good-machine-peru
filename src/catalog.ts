import { Beef, Boxes, CookingPot, Droplets, Fan, PackageCheck, Settings, Sprout, Wheat } from 'lucide-react'

export const categories = [
  { id: 'balanceados', name: 'Alimentos balanceados', description: 'Peletización, extrusión y mezcla para producir alimento animal.', image: 's-210', icon: Settings },
  { id: 'granos', name: 'Molinos y procesamiento de granos', description: 'Molienda, trillado y pilado de granos y cereales.', image: '9fc-40', icon: Wheat },
  { id: 'alimentos', name: 'Procesamiento de alimentos', description: 'Peladoras de ajo y equipos para procesar vegetales, snacks y otras materias primas.', image: 'snacks-maiz', icon: CookingPot },
  { id: 'avicultura', name: 'Avicultura', description: 'Equipos para la alimentación y el procesamiento en granjas avícolas.', image: 'desplumadora-sy', icon: Sprout },
  { id: 'porcicultura', name: 'Porcicultura', description: 'Pisos para cerdo, comederos, bebederos y jaulas para granjas porcinas.', image: 'comedero-12-bocas', icon: Beef },
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
  powerSources: readonly PowerSource[]
  availability: Availability
  featured: boolean
  sourcePage: number
  validationNotes?: string
}

type ProductDetails = Partial<Pick<Product, 'model' | 'availability' | 'featured' | 'applications' | 'validationNotes'>>
  & { power?: PowerSource | readonly PowerSource[]; extraImages?: readonly string[] }

export const media = (name: string) => `/media/${name}.webp`
export const getCategory = (id: CategoryId) => categories.find(category => category.id === id)!
export const productName = (product: Product) => product.model ? `${product.name} · ${product.model}` : product.name
export const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es')
  .replace(/(?<=\d)\s*[×x]\s*(?=\d)/g, 'x').replace(/[^a-z0-9]+/g, ' ').trim()

function equipment(
  id: string, name: string, category: CategoryId, subcategory: string, sourcePage: number,
  description: string, specifications: readonly Specification[], details: ProductDetails = {},
): Product {
  const { power, extraImages = [], ...attributes } = details
  return {
    id, slug: id, name, category, subcategory, sourcePage, description, specifications,
    powerSources: typeof power === 'string' ? [power] : power ?? [],
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
  equipment('slat-50x60', 'Piso SLAT PP para lechones de 50 × 60 cm', 'porcicultura', 'Pisos para cerdo', 23,
    'Rejilla modular para corrales de lechones con encajes laterales.', [
      ['Medidas', '50 × 60 cm'], ['Ranuras', '10 mm'], ['Separación', '55 mm'], ['Material', 'Polipropileno'],
    ]),
  equipment('slat-60x60', 'Piso SLAT PP para lechones de 60 × 60 cm', 'porcicultura', 'Pisos para cerdo', 23,
    'Rejilla cuadrada con encajes laterales para el drenaje en corrales de lechones.', [
      ['Medidas', '60 × 60 cm'], ['Ranuras', '10 mm'], ['Separación', '55 mm'], ['Material', 'Polipropileno'],
    ]),
  equipment('slat-pp-marranas-60x40', 'Piso SLAT PP para marranas de 60 × 40 cm', 'porcicultura', 'Pisos para cerdo', 24,
    'Rejilla modular para marranas con sistema de encaje lateral.', [
      ['Medidas', '60 × 40 cm'], ['Carga indicada', 'Hasta 300 kg'], ['Peso', '2,3 kg'],
      ['Material', 'Polipropileno'],
    ]),
  equipment('slat-bmc-60x110', 'Piso SLAT BMC para marranas de 60 × 110 cm', 'porcicultura', 'Pisos para cerdo', 24,
    'Rejilla para anclar a estructuras metálicas o de cemento.', [
      ['Medidas', '60 × 110 cm'], ['Carga indicada', 'Hasta 1.000 kg de peso vivo'], ['Peso', '24,5 kg'],
      ['Material', 'BMC de fibra de vidrio, resina y cuarzo'],
    ]),
  equipment('slat-bmc-70x110', 'Piso SLAT BMC para marranas de 70 × 110 cm', 'porcicultura', 'Pisos para cerdo', 24,
    'Rejilla para anclar a estructuras metálicas o de cemento.', [
      ['Medidas', '70 × 110 cm'], ['Carga indicada', 'Hasta 1.000 kg de peso vivo'], ['Peso', '26 kg'],
      ['Material', 'BMC de fibra de vidrio, resina y cuarzo'],
    ]),
  equipment('slat-bmc-70x220', 'Piso SLAT BMC para marranas de 70 × 220 cm', 'porcicultura', 'Pisos para cerdo', 24,
    'Rejilla para anclar a estructuras metálicas o de cemento.', [
      ['Medidas', '70 × 220 cm'], ['Carga indicada', 'Hasta 1.000 kg de peso vivo'], ['Peso', '52 kg'],
      ['Material', 'BMC de fibra de vidrio, resina y cuarzo'],
    ]),
  equipment('peladora-ajo-120', 'Peladora industrial de ajo tipo olla', 'alimentos', 'Peladoras', 28,
    'Peladora cilíndrica de ajo para producción industrial con aire comprimido.', [
      ['Producción', 'Consultar capacidad'], ['Motor', '200 W'], ['Voltaje', '220 V o 380 V'],
      ['Aire comprimido', '0,8 MPa y 0,90 m³/min'], ['Dimensiones', '62 × 63 × 125 cm'], ['Peso', '60 kg'],
    ], { power: 'Eléctrica',
      validationNotes: 'El encabezado indica 100–120 kg/h y la ficha indica 100–150 kg/h. Capacidad pendiente de confirmación.' }),
  equipment('peladora-ajo-200', 'Peladora de ajo tipo cadena de 200 kg/h', 'alimentos', 'Peladoras', 29,
    'Equipo industrial de acero inoxidable para el pelado continuo de ajo.', [
      ['Producción', '200 kg/h'], ['Potencia', '1.150 W'], ['Voltaje', '220 V o 380 V'],
      ['Material', 'Acero inoxidable 304'], ['Aire comprimido', '1,0 MPa y 1,6 m³/min'],
      ['Dimensiones', '132 × 50 × 137 cm'], ['Peso', '200 kg'],
    ], { power: 'Eléctrica' }),
  equipment('peladora-ajo-400', 'Peladora de ajo tipo cadena de 400 kg/h', 'alimentos', 'Peladoras', 29,
    'Equipo industrial de acero inoxidable para el pelado continuo de ajo.', [
      ['Producción', '400 kg/h'], ['Potencia', '1.150 W'], ['Voltaje', '220 V o 380 V'],
      ['Material', 'Acero inoxidable 304'], ['Aire comprimido', '1,0 MPa y 3,2 m³/min'],
      ['Dimensiones', '175 × 58 × 137 cm'], ['Peso', '280 kg'],
    ], { power: 'Eléctrica' }),
  equipment('separador-ajo-500', 'Separadora de dientes de ajo', 'alimentos', 'Separadoras', 28,
    'Separa automáticamente los dientes de ajo antes del pelado.', [
      ['Producción', '500 kg/h'], ['Motor', '1.200 W'], ['Voltaje', '220 V o 380 V'],
      ['Material', 'Acero inoxidable 201'], ['Dimensiones', '97 × 76 × 102 cm'], ['Peso', '110 kg'],
    ], { power: 'Eléctrica' }),
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
      ['Capacidad de tolva', '1.500 g'], ['Velocidad', '36.000 rpm'], ['Motor', '3.500 W'], ['Voltaje', '220 V / 60 Hz'],
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
  equipment('peladora-ajo-30', 'Peladora de ajo tipo olla de 20–30 kg/h', 'alimentos', 'Peladoras', 28,
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
  equipment('slat-40x60', 'Piso SLAT PP para lechones de 40 × 60 cm', 'porcicultura', 'Pisos para cerdo', 23,
    'Rejilla modular con encajes laterales para el manejo en granjas porcinas.', [
      ['Dimensiones', '40 × 60 cm'], ['Ranuras', '10 mm'], ['Separación', '55 mm'], ['Material', 'Polipropileno'],
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
  equipment('seleccionadora-ajo-600', 'Desgranadora y seleccionadora de ajo', 'alimentos', 'Separadoras', 30,
    'Separa los dientes de ajo y los clasifica por tamaño mediante cribado.', [
      ['Producción', '600 kg/h'], ['Motor', '1,5 kW'], ['Voltaje', '220 V o 380 V'],
      ['Dimensiones', '140 × 63 × 108 cm'], ['Peso', '100 kg'],
    ], { power: 'Eléctrica' }),
  equipment('s-230', 'Peletizadora eléctrica', 'balanceados', 'Peletizadoras', 4,
    'Peletizadora trifásica de tres rodillos.', [
      ['Producción', '400 kg/h'], ['Motor', '11 kW / 15 HP'], ['Voltaje', '380 V / 60 Hz'], ['Matriz', '4 mm'],
      ['Rodillos', '3'], ['Peso', '220 kg'],
    ], { model: 'S-230', power: 'Eléctrica' }),
  equipment('s-260', 'Peletizadora eléctrica', 'balanceados', 'Peletizadoras', 4,
    'Peletizadora trifásica de cuatro rodillos.', [
      ['Producción', '500 kg/h'], ['Motor', '15 kW / 20 HP'], ['Voltaje', '380 V / 60 Hz'], ['Matriz', '4 mm'],
      ['Rodillos', '4'], ['Peso', '330 kg'],
    ], { model: 'S-260', power: 'Eléctrica' }),
  equipment('s-300', 'Peletizadora eléctrica', 'balanceados', 'Peletizadoras', 4,
    'Peletizadora trifásica de cuatro rodillos.', [
      ['Producción', '800–1.000 kg/h'], ['Motor', '22 kW / 30 HP'], ['Voltaje', '380 V / 60 Hz'],
      ['Matriz', '4 mm'], ['Rodillos', '4'], ['Peso', '430 kg'],
    ], { model: 'S-300', power: 'Eléctrica' }),
  equipment('s-400', 'Peletizadora eléctrica', 'balanceados', 'Peletizadoras', 4,
    'Peletizadora trifásica de cuatro rodillos.', [
      ['Producción', '1.200–1.500 kg/h'], ['Motor', '37 kW / 50 HP'], ['Matriz', '4 mm'], ['Rodillos', '4'],
      ['Peso', '800 kg'],
    ], { model: 'S-400', power: 'Eléctrica',
      validationNotes: 'La ficha imprime 3.800 V. Voltaje pendiente de confirmación.' }),
  equipment('molino-granos-humedos', 'Molino inoxidable de granos húmedos', 'granos', 'Molinos', 6,
    'Muele maní, nueces y otros granos húmedos para preparar pastas.', [
      ['Producción', '20–40 kg/h'], ['Motor', '3 HP'], ['Voltaje', '220 V'], ['Velocidad', '2.800 rpm'],
      ['Dimensiones', '50 × 27 × 22 cm'], ['Peso', '31 kg'],
    ], { power: 'Eléctrica' }),
  equipment('gr-3000', 'Molino inoxidable de granos secos', 'granos', 'Molinos', 6,
    'Muele granos con discos de aleación y tolva cónica.', [
      ['Producción', '30–70 kg/h'], ['Motor', '4 HP'], ['Voltaje', '220 V / 60 Hz'],
      ['Dimensiones', '60 × 28 × 42 cm'], ['Peso', '48,5 kg'],
    ], { model: 'GR-3000', power: 'Eléctrica' }),
  equipment('pulverizador-rinoceronte', 'Molino pulverizador tipo rinoceronte', 'granos', 'Pulverizadores', 6,
    'Pulveriza granos, semillas, hojas y otras materias primas secas.', [
      ['Producción', '20–50 kg/h'], ['Motor', '3.000 W / 4 HP'], ['Voltaje', '220 V / 60 Hz'],
      ['Peso', '45 kg'],
    ], { power: 'Eléctrica' }),
  equipment('molino-leche-soya', 'Molino inoxidable para leche de soya', 'alimentos', 'Molinos', 6,
    'Molino compacto para soya y granos secos.', [
      ['Producción', '30 kg/h'], ['Motor', '1 HP'], ['Voltaje', '220 V monofásico'],
      ['Dimensiones', '25 × 25 × 60 cm'], ['Peso', '18 kg'],
    ], { power: 'Eléctrica' }),
  equipment('extractor-jugo-electrico', 'Extractor eléctrico de jugo', 'alimentos', 'Extractores', 7,
    'Separa el jugo y la pulpa por dos salidas independientes.', [
      ['Material', 'Acero inoxidable'], ['Accionamiento', 'Eléctrico'],
    ], { power: 'Eléctrica' }),
  equipment('horno-pizzero-doble', 'Horno pizzero doble', 'alimentos', 'Hornos', 7,
    'Horno de dos cámaras con temperatura y tiempo ajustables.', [
      ['Potencia', '3 kW'], ['Temperatura', '50–350 °C'], ['Temporizador', '0–120 min'],
      ['Dimensiones', '56 × 52 × 43,5 cm'],
    ], { power: 'Eléctrica' }),
  equipment('molino-carne-extrusor', 'Molino de carne y extrusor', 'alimentos', 'Molinos', 7,
    'Equipo compacto para moler carne y extruir.', [
      ['Producción', '20–30 kg/h'], ['Motor', '280 W monofásico'], ['Material', 'Acero inoxidable'],
      ['Peso', '7 kg'],
    ], { power: 'Eléctrica' }),
  equipment('molino-carne-200', 'Molino de carne de 150–200 kg/h', 'alimentos', 'Molinos', 7,
    'Equipo de acero inoxidable para carnicerías y comercios.', [
      ['Producción', '150–200 kg/h'], ['Motor', '1,1 kW / 1,5 HP'], ['Voltaje', '220 V monofásico'],
      ['Peso', '25 kg'],
    ], { power: 'Eléctrica' }),
  equipment('molino-cafe-dosificador', 'Molino dosificador de café', 'granos', 'Molinos', 8,
    'Molino de molienda regulable con dos vasos dosificadores.', [
      ['Incluye', 'Dos vasos dosificadores'], ['Ajuste', 'Granulometría regulable'],
    ]),
  equipment('mfs-160', 'Molino de granos húmedos y secos', 'granos', 'Molinos', 8,
    'Molino de discos metálicos para molienda dual.', [
      ['Producción', '30–40 kg/h'], ['Motor', '2 HP'], ['Voltaje', '220 V monofásico'],
      ['Dimensiones', '52 × 33 × 75 cm'], ['Peso', '25 kg'],
    ], { model: 'MFS-160', power: 'Eléctrica' }),
  equipment('molino-granos-50-200', 'Molino de granos secos de 50–200 kg/h', 'granos', 'Molinos', 9,
    'Molino para cereales y otros granos secos.', [
      ['Producción', '50–200 kg/h'],
    ]),
  equipment('piladora-cafe', 'Piladora de café', 'granos', 'Piladoras', 9,
    'Retira la cáscara del café con rodillo de goma.', [
      ['Producción', '100 kg/h'], ['Motor', '3 HP'], ['Voltaje', '110 V o 220 V'], ['Dimensiones', '455 × 320 × 570 mm'],
      ['Peso sin motor', '30 kg'],
    ], { power: 'Eléctrica', availability: 'agotado' }),
  equipment('molino-pilador-arroz', 'Molino de granos y pilador de arroz', 'granos', 'Piladoras', 9,
    'Muele granos y convierte arroz con cáscara en semipulido.', [
      ['Producción', '250 kg/h'], ['Motor', '2,2 kW / 3 HP monofásico'],
    ], { power: 'Eléctrica' }),
  equipment('9fq-36a', 'Molino de succión', 'granos', 'Molinos', 10,
    'Molino de martillos para granos secos, forrajes y alimentos balanceados.', [
      ['Producción', '150–450 kg/h'], ['Motor', '7 HP trifásico'], ['Dimensiones', '59 × 39 × 140 cm'],
      ['Peso', '80 kg'],
    ], { model: '9FQ-36A', power: 'Eléctrica' }),
  equipment('9fc-26', 'Molino de martillos para granos secos', 'granos', 'Molinos', 11,
    'Molino con dos mallas intercambiables.', [
      ['Producción', '200–300 kg/h'], ['Motor', '2,2 kW / 3 HP'], ['Voltaje', '220 V monofásico'],
      ['Peso', '58 kg'],
    ], { model: '9FC-26', power: 'Eléctrica' }),
  equipment('9fq-21', 'Molino de granos secos', 'granos', 'Molinos', 11,
    'Molino de martillos para granos de distintos tamaños.', [
      ['Producción', '60–120 kg/h'], ['Motor', '3 HP'], ['Voltaje', '220 V monofásico'],
      ['Dimensiones', '60 × 63 × 103 cm'], ['Peso', '45 kg'],
    ], { model: '9FQ-21', power: 'Eléctrica' }),
  equipment('picadora-ensacadora-forraje', 'Picadora ensacadora de forraje', 'balanceados', 'Picadoras de forraje', 11,
    'Pica forraje para ganado y facilita el ensacado. Incluye ruedas para su traslado.', [
      ['Accionamiento', 'Gasolina'],
    ], { power: 'Gasolinera' }),
  equipment('molino-picador-forraje', 'Molino de granos y picador de forraje', 'granos', 'Molinos', 11,
    'Equipo combinado de martillos para granos secos y forraje.', [
      ['Molienda', '300–600 kg/h'], ['Picado', '600 kg/h'],
      ['Motorización', '4 HP eléctrica o 7,5 HP a gasolina'],
    ], { power: ['Eléctrica', 'Gasolinera'], availability: 'agotado' }),
  equipment('trituradora-vegetales-200-400', 'Trituradora eléctrica multifunción', 'alimentos', 'Trituradoras', 12,
    'Corta, pica y ralla hortalizas y tubérculos.', [
      ['Capacidades', '200 y 400 kg/h'], ['Motor', '2,2 kW'], ['Voltaje', '220 V / 50 Hz'],
      ['Dimensiones', '40 × 40 × 81 cm'],
    ], { power: 'Eléctrica' }),
  equipment('mezcladora-horizontal-mh', 'Mezcladora horizontal para alimento balanceado', 'balanceados', 'Mezcladoras', 12,
    'Mezcladora de acero al carbono en varias capacidades.', [
      ['Modelos', 'MH200 (200 kg), MH300 (300 kg), MH500 (500 kg)'], ['Potencia', '4–7,5 HP'],
      ['Tiempo por lote', '8–10 min'],
    ], { model: 'Serie MH', power: 'Eléctrica' }),
  equipment('ralladora-extractora-tuberculos', 'Ralladora y extractora de tubérculos', 'alimentos', 'Ralladoras', 13,
    'Equipo con rodillo de púas para rallar tubérculos y extraer su jugo.', [
      ['Producción', '600 kg/h'], ['Motor', '2,2–3 kW'], ['Dimensiones', '870 × 520 × 375 mm'],
    ], { power: 'Eléctrica' }),
  equipment('almidon-yuca', 'Máquina para hacer almidón de yuca', 'alimentos', 'Ralladoras', 13,
    'Ralla yuca, papa y otros tubérculos para la preparación de almidón.', [
      ['Motor', '7,5 HP'],
    ], { power: 'Gasolinera' }),
  equipment('desgranadora-maiz-manual', 'Desgranadora manual de maíz de una mazorca', 'granos', 'Desgranadoras', 14,
    'Desgrana una mazorca por vez con un mecanismo manual de hierro.', [
      ['Capacidad', 'Una mazorca'], ['Material', 'Hierro'],
    ]),
  equipment('desgranadora-maiz-polea', 'Desgranadora manual de maíz con polea', 'granos', 'Desgranadoras', 14,
    'Separa los granos de maíz con accionamiento manual.', [
      ['Producción', '10–70 kg/h'], ['Accionamiento', 'Manual'],
    ], { availability: 'agotado' }),
  equipment('desgranadora-maiz-gasolinera', 'Desgranadora gasolinera de maíz', 'granos', 'Desgranadoras', 14,
    'Despancadora y trilladora de maíz con estructura de acero.', [
      ['Producción', 'Hasta 1,5 t/h'], ['Motor', '7,5 HP'],
    ], { power: 'Gasolinera' }),
  equipment('desgranadora-maiz-electrica', 'Desgranadora eléctrica de maíz', 'granos', 'Desgranadoras', 14,
    'Trilladora de maíz con estructura de acero.', [
      ['Producción', 'Hasta 1,2 t/h'], ['Motor', '3 HP'],
    ], { power: 'Eléctrica' }),
  equipment('desgranadora-maiz-relador', 'Desgranadora de maíz con relador de mazorca', 'granos', 'Desgranadoras', 15,
    'Trilladora eléctrica con tolva amplia, palanca de ajuste y ruedas.', [
      ['Producción', '1.000–1.500 kg/h'], ['Potencia', '0,48 kW'], ['Velocidad', '2.800 rpm'],
    ], { power: 'Eléctrica' }),
  equipment('desgranadora-maiz-1000', 'Desgranadora de maíz de 1.000 kg/h', 'granos', 'Desgranadoras', 15,
    'Equipo para desgranado en granjas con dos opciones de motor.', [
      ['Producción', '1.000 kg/h'], ['Motorización', '2 HP eléctrica monofásica o 7 HP a gasolina'],
    ], { power: ['Eléctrica', 'Gasolinera'] }),
  equipment('partidora-maiz', 'Partidora de granos de maíz', 'granos', 'Molinos', 15,
    'Equipo multifunción para moler y separar el maíz.', [
      ['Producción', '1.000 kg/h'], ['Motor', '3 HP'],
    ], { power: 'Eléctrica' }),
  equipment('clasificadora-granos', 'Clasificadora de granos', 'granos', 'Clasificadoras', 15,
    'Separa impurezas de cereales para preparar el grano limpio.', [
      ['Producción', '1–2 t/h'], ['Motor', '3 HP monofásico'], ['Dimensiones', '200 × 90 × 95 cm'],
      ['Peso', '125 kg'],
    ], { power: 'Eléctrica', availability: 'agotado' }),
  equipment('cortadora-verduras-multifuncional', 'Cortadora multifuncional de verduras', 'alimentos', 'Cortadoras', 16,
    'Cortadora inoxidable para procesar verduras en distintos cortes.', [
      ['Producción', '500 kg/h'], ['Motor', '0,75 kW / 1 HP'], ['Voltaje', '220 V / 60 Hz'],
      ['Dimensiones', '58 × 33 × 75 cm'], ['Peso', '20 kg'],
    ], { power: 'Eléctrica',
      validationNotes: 'La página repite el título de una desgranadora de maíz. La ficha y la imagen describen una cortadora de verduras.' }),
  equipment('ralladora-verduras-500', 'Ralladora de tubérculos y verduras', 'alimentos', 'Ralladoras', 16,
    'Ralladora de acero inoxidable para tubérculos y verduras.', [
      ['Producción', '500 kg/h'], ['Motor', '0,75 kW / 1 HP'], ['Voltaje', '220 V / 60 Hz'],
      ['Dimensiones', '58 × 33 × 75 cm'],
    ], { power: 'Eléctrica' }),
  equipment('cortadora-electrica-papa-olluco', 'Cortadora eléctrica de papa al hilo y olluco', 'alimentos', 'Cortadoras', 16,
    'Cortadora centrífuga de papas en tiras y rebanadas, apta para olluco.', [
      ['Producción', '80 kg/h'], ['Corte al hilo', '5 mm'], ['Cuchillas', 'Acero inoxidable'],
    ], { power: 'Eléctrica' }),
  equipment('cortadora-manual-papa-olluco', 'Cortadora manual de papa al hilo y olluco', 'alimentos', 'Cortadoras', 16,
    'Cortadora manual para tiras y rebanadas, con entrada desmontable.', [
      ['Producción', '30 kg/h'], ['Corte', '4 mm'], ['Diámetro de entrada', '12 cm'],
    ]),
  equipment('mini-extrusora-humedos', 'Extrusora multipropósito para productos húmedos', 'alimentos', 'Extrusoras', 17,
    'Mini extrusora con motor reductor para picado y procesamiento.', [
      ['Motor', '¼ HP'], ['Velocidad', '60 rpm'],
    ], { power: 'Eléctrica' }),
  equipment('extractor-cana-electrico', 'Extractor eléctrico de jugo de caña', 'alimentos', 'Extractores', 17,
    'Prensa de caña de azúcar con rodillos de acero inoxidable y sistema de resortes.', [
      ['Accionamiento', 'Eléctrico'], ['Rodillos', 'Acero inoxidable'],
    ], { power: 'Eléctrica' }),
  equipment('extractor-cana-polea', 'Extractor manual de jugo de caña con polea', 'alimentos', 'Extractores', 17,
    'Prensa de accionamiento manual para extraer jugo de caña.', [
      ['Producción', '50–60 kg/h'], ['Rodillos', '100 mm de ancho × 76 mm de diámetro'],
      ['Accionamiento', 'Manual'],
    ], { availability: 'agotado' }),
  equipment('despulpadora-cafe-gasolinera', 'Despulpadora de café gasolinera', 'granos', 'Despulpadoras', 18,
    'Separa la pulpa del café para facilitar su procesamiento en campo.', [
      ['Producción', '250 kg/h con motor'], ['Motor', '7,5 HP'],
    ], { power: 'Gasolinera', availability: 'agotado' }),
  equipment('despulpadora-cafe-manual', 'Despulpadora manual de café con polea', 'granos', 'Despulpadoras', 18,
    'Separa la pulpa de los granos de café sin electricidad.', [
      ['Producción', '150 kg/h'], ['Accionamiento', 'Manual'],
    ], { availability: 'agotado' }),
  equipment('rebanadora-manual-frutas', 'Rebanadora manual de frutas y verduras', 'alimentos', 'Cortadoras', 18,
    'Rebanadora de acero inoxidable y plástico para frutas y verduras.', [
      ['Accionamiento', 'Manual'], ['Material', 'Acero inoxidable y plástico'],
    ]),
  equipment('rebanadora-electrica-frutas', 'Rebanadora eléctrica de frutas y verduras', 'alimentos', 'Cortadoras', 18,
    'Cortadora para rebanar frutas y verduras de forma continua.', [
      ['Potencia', '200 W'], ['Grosor de corte', '0–10 mm'], ['Accionamiento', 'Eléctrico'],
    ], { power: 'Eléctrica' }),
  equipment('peladora-mani', 'Peladora industrial de maní en seco', 'alimentos', 'Peladoras', 19,
    'Retira la piel del maní sin agua con un sistema de doble motor.', [
      ['Producción', '200–300 kg/h'],
    ], { power: 'Eléctrica' }),
  equipment('picadora-cuadritos', 'Picadora en cuadritos para cebollas y verduras', 'alimentos', 'Cortadoras', 19,
    'Rebana, ralla y corta vegetales en dados.', [
      ['Producción', '200 kg/h'], ['Potencia', '300 W (200 W nominales)'], ['Dimensiones', '36 × 26 × 20 cm'],
      ['Peso', '7 kg'],
    ], { power: 'Eléctrica' }),
  equipment('freidora-6l', 'Freidora multipropósito de 6 L', 'alimentos', 'Freidoras', 19,
    'Freidora de acero inoxidable con control automático de temperatura.', [
      ['Capacidad', '6 L'], ['Potencia', '1.150 W'], ['Voltaje', '220 V'], ['Peso', '6 kg'],
    ], { power: 'Eléctrica' }),
  equipment('foco-infrarrojo', 'Foco infrarrojo para granjas', 'avicultura', 'Calefacción', 20,
    'Lámpara de calor para criadoras, incubadoras y corrales.', [
      ['Potencias', '100, 150 y 250 W'], ['Rosca', 'E27'], ['Voltaje', '220 V'], ['Dimensiones', '14 × 12 cm'],
    ], { model: 'Nexxtra', power: 'Eléctrica' }),
  equipment('comedero-pollitos-bandeja', 'Bandeja comedero circular para pollitos', 'avicultura', 'Comederos', 20,
    'Bandeja de bordes bajos para aves en etapa inicial.', [
      ['Diámetro', '40 cm'], ['Material', 'Plástico'],
    ]),
  equipment('comedero-manual-aves', 'Comedero manual para aves', 'avicultura', 'Comederos', 21,
    'Comedero de gravedad para pollos, gallinas y otras aves de corral.', [
      ['Capacidades', '3, 6, 9, 15 y 20 kg'], ['Material', 'Plástico'],
    ]),
  equipment('bebedero-plasson-pollos', 'Bebedero automático tipo Plasson para pollos', 'avicultura', 'Bebederos', 21,
    'Bebedero de campana con sistema antisalpicaduras.', [
      ['Capacidad', 'Más de 30 aves'], ['Medidas', '36,5 × 35 cm'], ['Material', 'Polietileno'],
    ], { availability: 'agotado' }),
  equipment('bebedero-plasson-acuaticas', 'Bebedero tipo Plasson para gansos y patos', 'avicultura', 'Bebederos', 21,
    'Bebedero de campana para aves acuáticas y de corral.', [
      ['Material', 'Polietileno'], ['Diseño', 'Antisalpicaduras'],
    ]),
  equipment('molino-granos-recipiente', 'Molino de granos con recipiente', 'granos', 'Molinos', 21,
    'Tritura y pulveriza granos secos con zarandas intercambiables.', [
      ['Producción', '100 kg/h'], ['Motor', '1.300 W'], ['Tolva', '13,7 L'], ['Recipiente', '60 L'],
      ['Peso', '10 kg'],
    ], { power: 'Eléctrica' }),
  equipment('comedero-circular-lechones', 'Comedero circular para cerdos y lechones', 'porcicultura', 'Comederos', 22,
    'Comedero circular para alimentar varios lechones a la vez.', [
      ['Bocas', '14 o 16'], ['Material', 'Plástico'],
    ]),
  equipment('comedero-doble-10-bocas', 'Comedero doble para lechones de 10 bocas', 'porcicultura', 'Comederos', 22,
    'Comedero plástico de doble acceso para lechones en crecimiento.', [
      ['Bocas', '10'], ['Material', 'Plástico de alta resistencia'],
    ], { validationNotes: 'El título indica PVC y la descripción indica BMC. Composición pendiente de confirmación.' }),
  equipment('comedero-6-bocas', 'Comedero de acero inoxidable de 6 bocas', 'porcicultura', 'Comederos', 23,
    'Comedero de un lado para cerdos en etapa de engorde.', [
      ['Bocas', '6'], ['Tolva', '75 kg'], ['Material', 'Acero inoxidable'],
    ]),
  equipment('jaula-gestacion-cerda', 'Jaula de gestación para cerda', 'porcicultura', 'Jaulas', 25,
    'Estructura de acero galvanizado para el manejo de cerdas gestantes.', [
      ['Material', 'Acero galvanizado'], ['Espesor del tubo', '2,5 mm'], ['Piso', 'Sin piso'],
    ]),
  equipment('jaula-maternidad-doble', 'Jaula de maternidad doble con piso BMC', 'porcicultura', 'Jaulas', 25,
    'Sistema de maternidad de dos puestos con comederos, bebederos y lámparas.', [
      ['Estructura', 'Acero galvanizado'], ['Piso', '14 piezas BMC'], ['Presentación', 'Desarmada'],
    ]),
  equipment('expeller-k28s', 'Expeller de aceites', 'aceites', 'Prensas de tornillo', 26,
    'Extractor de tornillo para procesar lotes pequeños.', [
      ['Producción', '5–7 kg/h'], ['Potencia nominal', '750 W'], ['Motor', '300 W'], ['Voltaje', '220 V'],
      ['Peso', '12 kg'],
    ], { model: 'K28S', power: 'Eléctrica' }),
  equipment('6yl-68', 'Prensa de aceite de tornillo', 'aceites', 'Prensas de tornillo', 26,
    'Expeller industrial para extracción de aceites.', [
      ['Producción', '1–2 t cada 24 h'], ['Motor', '7,5 kW'], ['Voltaje', '380 V / 60 Hz'],
      ['Velocidad del eje', '90–100 rpm'], ['Peso', '130 kg'],
    ], { model: '6YL-68', power: 'Eléctrica' }),
  equipment('ot-50', 'Prensa de aceite manual', 'aceites', 'Prensas manuales', 27,
    'Prensa de operación manual para procesar aceite por lotes.', [
      ['Capacidad', '2,25 kg por lote'], ['Embalaje', '68 × 36 × 93 cm'],
    ], { model: 'OT-50',
      validationNotes: 'La ficha la describe como manual y también menciona un motor de 0,75 kW. Motorización pendiente de confirmación.' }),
  equipment('compresor-tornillo-20hp', 'Compresor de aire tipo tornillo de 20 HP', 'complementarios', 'Compresores', 29,
    'Compresor para abastecer equipos neumáticos de uso industrial.', [
      ['Motor', '15 kW / 20 HP'], ['Presión de trabajo', '0,8–1,0 MPa'], ['Caudal', '1,6 m³/min'],
      ['Tanque', '0,6 m³'], ['Peso', '210 kg'],
    ], { power: 'Eléctrica' }),
  equipment('compresor-tornillo-30hp', 'Compresor de aire tipo tornillo de 30 HP', 'complementarios', 'Compresores', 29,
    'Compresor para líneas de producción y equipos neumáticos de alta demanda.', [
      ['Motor', '22 kW / 30 HP'], ['Presión de trabajo', '0,8–1,0 MPa'], ['Caudal', '3,2 m³/min'],
      ['Tanque', '0,6 m³'], ['Peso', '280 kg'],
    ], { power: 'Eléctrica' }),
  equipment('alimentadora-cinta-30', 'Alimentadora por cinta transportadora', 'complementarios', 'Transportadoras', 30,
    'Alimenta otras máquinas de forma continua con velocidad ajustable.', [
      ['Ancho de cinta', '30 cm'], ['Motor', '0,75 kW'], ['Voltaje', '220 V o 380 V'], ['Banda', 'PVC'],
      ['Dimensiones', '300 × 55 × 110 cm'], ['Peso', '100 kg'],
    ], { power: 'Eléctrica' }),
  equipment('desplumadora-zh', 'Desplumadora de pollos, cuyes y codornices', 'avicultura', 'Desplumadoras', 31,
    'Familia de equipos para procesamiento avícola. Las especies y la capacidad varían por modelo.', [
      ['Modelos', 'ZH-30 a ZH-80'], ['Capacidad ZH-30', '1 cuy o 2 codornices'],
      ['Capacidad ZH-80', '8–10 pollos/min'], ['Potencia', '¼–4 HP'], ['Peso', '20–75 kg'],
    ], { model: 'Serie ZH', power: 'Eléctrica' }),
  equipment('desplumadora-tm', 'Desplumadora para pollos, cuyes, patos y pavos', 'avicultura', 'Desplumadoras', 31,
    'Familia industrial para trabajo continuo y procesamiento de aves.', [
      ['Modelos', 'TM-S y TM-L'], ['Material', 'Acero inoxidable 304'],
    ], { model: 'Serie TM' }),
  equipment('dz-300b', 'Empacadora al vacío externa', 'empaque', 'Empacadoras al vacío', 33,
    'Empacadora al vacío de formato externo identificada por modelo en el catálogo.', [
      ['Tipo', 'Vacío externo'],
    ], { model: 'DZ-300B',
      validationNotes: 'El catálogo repite las especificaciones de la selladora DR-770 en esta ficha. Datos técnicos pendientes de confirmación.' }),
  equipment('selladora-tipo-impresora', 'Selladora tipo impresora', 'empaque', 'Selladoras', 33,
    'Selladora identificada en el catálogo como tipo impresora.', [
      ['Tipo', 'Selladora tipo impresora'],
    ], { validationNotes: 'El catálogo repite las especificaciones de la selladora DR-770 en esta ficha. Datos técnicos pendientes de confirmación.' }),
  equipment('escalera-aluminio-multiposicion', 'Escalera de aluminio multiposición', 'complementarios', 'Escaleras', 34,
    'Escalera desarmable con bloqueo manual y configuración de hasta siete peldaños.', [
      ['Configuración', '4 a 7 pasos'], ['Capacidad de carga', 'Hasta 150 kg'],
      ['Material', 'Aleación de aluminio 6063'],
    ]),
  equipment('escalera-tijera', 'Escalera plegable tipo tijera', 'complementarios', 'Escaleras', 34,
    'Escalera plegable con bandeja para herramientas, manubrio y patas con tacos de goma.', [
      ['Versiones', '3 y 4 peldaños'], ['Peldaños', 'Antideslizantes'],
    ], { validationNotes: 'La ficha está bajo un encabezado repetido de selladora. La foto y la descripción corresponden a una escalera tipo tijera.' }),
  equipment('lt-107', 'Deshidratador', 'deshidratadores', 'Equipos de sobremesa', 36,
    'Equipo con panel digital y dos ventiladores.', [
      ['Bandejas', '12'], ['Potencia', '1.000 W'], ['Temperatura', '30–90 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '40 × 38 cm'], ['Dimensiones', '46,5 × 57 × 54,8 cm'], ['Peso', '20 kg'],
    ], { model: 'LT-107', power: 'Eléctrica' }),
  equipment('ss-12h', 'Deshidratador', 'deshidratadores', 'Equipos de sobremesa', 36,
    'Equipo con panel digital y dos ventiladores.', [
      ['Bandejas', '12'], ['Potencia', '1.000 W'], ['Temperatura', '30–90 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '40 × 38 cm'], ['Dimensiones', '46,5 × 57 × 54,8 cm'], ['Peso', '20 kg'],
    ], { model: 'SS-12H', power: 'Eléctrica' }),
  equipment('ss-16h', 'Deshidratador', 'deshidratadores', 'Equipos de sobremesa', 37,
    'Equipo con panel digital y dos ventiladores.', [
      ['Bandejas', '16'], ['Potencia', '1.500 W'], ['Temperatura', '30–90 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '40 × 38 cm'], ['Dimensiones', '46,5 × 57 × 67 cm'], ['Peso', '26,5 kg'],
    ], { model: 'SS-16H', power: 'Eléctrica' }),
  equipment('ss-20h', 'Deshidratador', 'deshidratadores', 'Equipos de piso', 37,
    'Equipo con panel digital y tres ventiladores.', [
      ['Bandejas', '20'], ['Potencia', '2.000 W'], ['Temperatura', '30–90 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '40 × 38 cm'], ['Dimensiones', '46,5 × 57 × 82 cm'], ['Peso', '34 kg'],
    ], { model: 'SS-20H', power: 'Eléctrica', availability: 'agotado' }),
  equipment('ss-48h', 'Deshidratador industrial', 'deshidratadores', 'Equipos de piso', 37,
    'Equipo de dos puertas con panel digital y seis ventiladores.', [
      ['Bandejas', '48'], ['Potencia', '4.000 W'], ['Temperatura', '35–85 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '40 × 38 cm'], ['Dimensiones', '46,5 × 57 × 161,6 cm'], ['Peso', '58 kg'],
    ], { model: 'SS-48H', power: 'Eléctrica', availability: 'agotado' }),
  equipment('lt-021', 'Deshidratador industrial', 'deshidratadores', 'Equipos de piso', 38,
    'Equipo de tres puertas con panel digital y seis ventiladores.', [
      ['Bandejas', '60'], ['Potencia', '4.500 W'], ['Temperatura', '30–90 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '40 × 38 cm'], ['Dimensiones', '145 × 61 × 91 cm'], ['Peso', '104 kg'],
    ], { model: 'LT-021', power: 'Eléctrica' }),
  equipment('ss-80h', 'Deshidratador industrial', 'deshidratadores', 'Equipos de piso', 38,
    'Equipo de cuatro puertas con panel digital y ocho ventiladores.', [
      ['Bandejas', '80'], ['Potencia', '6.000 W'], ['Temperatura', '30–90 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '40 × 38 cm'], ['Dimensiones', '94 × 57 × 162,6 cm'], ['Peso', '115 kg'],
    ], { model: 'SS-80H', power: 'Eléctrica' }),
  equipment('ss-96h', 'Deshidratador industrial', 'deshidratadores', 'Equipos de piso', 38,
    'Equipo de cuatro puertas con panel digital y ocho ventiladores.', [
      ['Bandejas', '96'], ['Potencia', '7.600 W'], ['Temperatura', '30–90 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '40 × 38 cm'], ['Dimensiones', '94 × 57 × 162,6 cm'], ['Peso', '115 kg'],
    ], { model: 'SS-96H', power: 'Eléctrica' }),
  equipment('lt-195h', 'Deshidratador industrial', 'deshidratadores', 'Equipos de piso', 38,
    'Equipo de dos puertas con panel digital y doce ventiladores.', [
      ['Bandejas', '28'], ['Potencia', '6.000 W'], ['Temperatura', '30–90 °C'], ['Voltaje', '220 V / 60 Hz'],
      ['Medida de bandeja', '85 × 50 cm'], ['Dimensiones', '88 × 67 × 169 cm'], ['Peso', '130 kg'],
    ], { model: 'LT-195H', power: 'Eléctrica' }),
]
