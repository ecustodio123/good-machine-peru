import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import {
  ArrowDown, ArrowDownToLine, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  ClipboardList, Factory, FileText, Menu, MessageCircle, Minus, Plus,
  Search, SlidersHorizontal, Trash2, X,
} from 'lucide-react'
import { categories, getCategory, media, normalize, productName, products, type CategoryId, type PowerSource, type Product } from './catalog'
import { company, whatsappLink } from './config'
import { categoryPath, productPath, topicalCollections, type Route } from './routes'

const navigation = [
  ['inicio', 'Inicio'], ['catalogo', 'Productos'], ['sectores', 'Sectores'],
  ['nosotros', 'Nosotros'], ['contacto', 'Contacto'],
] as const

const sectors: { title: string; description: string; image: string; categories: CategoryId[] }[] = [
  { title: 'Agroindustria', description: 'Molienda y transformación de granos y materias primas.', image: 'trilladora', categories: ['granos'] },
  { title: 'Producción de alimentos', description: 'Procesamiento, deshidratación, extracción y empaque.', image: 'ss-06a', categories: ['alimentos', 'aceites', 'empaque', 'deshidratadores'] },
  { title: 'Avicultura y porcicultura', description: 'Comederos, bebederos y equipos para el manejo y procesamiento en tu granja.', image: 'desplumadora-sy', categories: ['avicultura', 'porcicultura'] },
  { title: 'Alimentos balanceados', description: 'Equipos para la molienda, mezcla, peletización y extrusión.', image: 'dgp-40', categories: ['balanceados', 'granos'] },
]

const useCases: { label: string; categories: CategoryId[] }[] = [
  { label: 'Alimentos balanceados', categories: ['balanceados', 'granos'] },
  { label: 'Granos y cereales', categories: ['granos'] },
  { label: 'Frutas y verduras', categories: ['alimentos', 'deshidratadores'] },
  { label: 'Aceites', categories: ['aceites'] },
  { label: 'Alimentos deshidratados', categories: ['deshidratadores'] },
  { label: 'Productos avícolas o porcinos', categories: ['avicultura', 'porcicultura'] },
  { label: 'Empaque de alimentos', categories: ['empaque'] },
]

const questions = [
  ['¿Cómo puedo solicitar el precio de una máquina?', 'Selecciona el equipo de tu interés, indica la cantidad que necesitas y prepara una solicitud de cotización.'],
  ['¿Cómo puedo conocer la capacidad de producción?', 'La ficha técnica muestra la capacidad de producción cuando está documentada en el catálogo original.'],
  ['¿Existen equipos eléctricos y gasolineros?', 'Sí. El catálogo incluye modelos eléctricos y gasolineros. Usa el filtro de alimentación o revisa el motor en la ficha técnica.'],
  ['¿Cómo puedo saber si una máquina está disponible?', 'Confirma la disponibilidad directamente con Good Machines Perú. Los estados de las fichas provienen del catálogo.'],
  ['¿Puedo consultar varios equipos a la vez?', 'Sí. Agrega los equipos a Mi cotización para preparar un solo mensaje con tu selección.'],
]

const featured = products.filter(product => product.featured)
const pageSize = 8
const storageKey = 'good-machines-quote-v1'
type Selection = Record<string, number>
type Overlay = { type: 'product'; product: Product } | { type: 'quote' }
type CategoryFilter = { ids: readonly CategoryId[]; label: string }
const emptySelection: Selection = {}

function handleLink(event: MouseEvent<HTMLAnchorElement>, action: () => void) {
  if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  event.preventDefault()
  action()
}

function readSelection(): Selection {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
    if (!saved || typeof saved !== 'object') return {}
    return Object.fromEntries(Object.entries(saved).filter(([id, quantity]) =>
      products.some(product => product.id === id) && Number.isSafeInteger(quantity) && quantity > 0))
  } catch {
    return {}
  }
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="section-heading reveal">
    <p className="eyebrow">{eyebrow}</p>
    <h2>{title}</h2>
    {children && <p className="section-description">{children}</p>}
  </div>
}

function ContactAddress() {
  const { streetAddress, addressLocality, postalCode } = company.contact.address
  return <div className="contact-address">
    <p><strong>Encuéntranos en</strong><span>{postalCode}, {streetAddress}, {addressLocality} {postalCode}</span></p>
    <a href={whatsappLink('Hola, Good Machines Perú. Quisiera consultar por su ubicación.')}
      target="_blank" rel="noreferrer">Consultar ubicación por WhatsApp</a>
  </div>
}

function ProductCard({ product, selected, open, quote }: {
  product: Product; selected: boolean; open: () => void; quote: () => void
}) {
  const soldOut = product.availability === 'agotado'
  return <article className="product-card">
    <a className="product-image" href={productPath(product)} onClick={event => handleLink(event, open)} aria-label={`Ver detalles de ${productName(product)}`}>
      <img src={product.images[0]} alt={productName(product)} loading="lazy" decoding="async" />
      {product.model && <span className="model-tag">{product.model}</span>}
      {soldOut && <span className="stock-tag">Agotado según catálogo</span>}
    </a>
    <div className="product-content">
      <p className="product-category">{getCategory(product.category).name}</p>
      <h3>{product.name}</h3>
      <dl className="quick-specs">
        {product.specifications.slice(0, 2).map(([label, value]) => <div key={label}>
          <dt>{label}</dt><dd>{value}</dd>
        </div>)}
      </dl>
      <p className="price">Consultar precio</p>
      <div className="card-actions">
        <a className="button button-small button-outline" href={productPath(product)} onClick={event => handleLink(event, open)} aria-label={`Ver detalles de ${productName(product)}`}>Ver detalles</a>
        <button className="button button-small button-dark" onClick={quote} aria-label={`Cotizar ${productName(product)}`}>
          {selected ? <Check size={15} /> : <Plus size={15} />} Cotizar
        </button>
      </div>
    </div>
  </article>
}

function Modal({ overlay, close, children }: { overlay: Overlay | null; close: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const open = overlay !== null
  const type = overlay?.type

  useEffect(() => {
    const node = dialog.current
    if (open && node && !node.open) node.showModal()
    if (!open && node?.open) node.close()
  }, [open])

  useEffect(() => {
    if (type) {
      dialog.current?.scrollTo(0, 0)
      title.current?.focus()
    }
  }, [type])

  return <dialog
    ref={dialog}
    className={type === 'quote' ? 'dialog quote-dialog' : 'dialog'}
    aria-labelledby="dialog-title"
    onClose={() => { if (dialog.current && !dialog.current.open) close() }}
    onClick={event => { if (event.target === event.currentTarget) close() }}
  >
    {overlay && <div className="dialog-content">
      <div className="dialog-header">
        <h2 id="dialog-title" ref={title} tabIndex={-1}>{overlay.type === 'quote' ? 'Mi cotización' : 'Ficha técnica'}</h2>
        <button className="icon-button" aria-label="Cerrar" onClick={close}><X size={22} /></button>
      </div>
      {children}
    </div>}
  </dialog>
}

function ProductDetail({ product, selected, add, quote, fullPage = false }: {
  product: Product; selected: boolean; add: () => void; quote: () => void; fullPage?: boolean
}) {
  const [imageIndex, selectImage] = useState(0)
  const soldOut = product.availability === 'agotado'
  const Heading = fullPage ? 'h1' : 'h3'
  const ApplicationsHeading = fullPage ? 'h2' : 'h4'
  const quoteText = soldOut ? 'Consultar disponibilidad futura' : 'Solicitar cotización'
  const message = soldOut ? 'Quisiera consultar la disponibilidad futura de' : 'Quisiera solicitar una cotización de'
  return <div className="detail-grid">
    <div>
      <div className="detail-image">
        <img src={product.images[imageIndex]} alt={`${productName(product)}, vista ${imageIndex + 1}`} />
      </div>
      {product.images.length > 1 && <div className="gallery" aria-label="Galería del equipo">
        {product.images.map((image, index) => <button type="button" key={image} onClick={() => selectImage(index)}
          aria-pressed={imageIndex === index} aria-label={`Ver imagen ${index + 1}`}>
          <img src={image} alt="" />
        </button>)}
      </div>}
    </div>
    <div className="detail-body">
      <p className="product-category">{getCategory(product.category).name}</p>
      <Heading className="detail-title">{productName(product)}</Heading>
      <p>{product.description}</p>
      <p className={soldOut ? 'availability is-sold-out' : 'availability'}>{soldOut ? 'Agotado según catálogo' : 'Consultar disponibilidad'}</p>
      <table className="spec-table">
        <caption>Especificaciones técnicas</caption>
        <tbody>{product.specifications.map(([label, value]) => <tr key={label}>
          <th scope="row">{label}</th><td>{value}</td>
        </tr>)}</tbody>
      </table>
      {product.applications.length > 0 && <div className="applications"><ApplicationsHeading>Aplicaciones</ApplicationsHeading><ul>
        {product.applications.map(application => <li key={application}>{application}</li>)}
      </ul></div>}
      <p className="source-note">
        <a href={`${company.catalog.url}#page=${product.sourcePage}`} target="_blank" rel="noreferrer">Catálogo original, página {product.sourcePage}</a>
        {product.validationNotes && <span>{product.validationNotes}</span>}
        {!fullPage && <span><a href={productPath(product)}>Abrir ficha completa</a></span>}
      </p>
      <div className="detail-actions">
        {fullPage ? <a className="button button-dark" href={whatsappLink(`Hola, Good Machines Perú. ${message} ${productName(product)}.`)}
          onClick={event => handleLink(event, quote)}>{quoteText}</a> : <button className="button button-dark" onClick={quote}>{quoteText}</button>}
        <button className="button button-outline" onClick={() => { if (!selected) add() }} aria-disabled={selected}>
          {selected ? <Check size={17} /> : <Plus size={17} />}
          {selected ? 'En mi cotización' : 'Agregar a mi cotización'}
        </button>
      </div>
    </div>
  </div>
}

function Quote({ selection, setQuantity, close }: {
  selection: Selection; setQuantity: (id: string, quantity: number) => void; close: () => void
}) {
  const selected = products.filter(product => selection[product.id])
  const lines = selected.map((product, index) => {
    const note = product.availability === 'agotado' ? ' (consulta de disponibilidad futura)' : ''
    return `${index + 1}. ${productName(product)} · Cantidad: ${selection[product.id]}${note}.`
  })
  const message = ['Hola, Good Machines Perú. Estoy interesado en recibir información y cotización de los siguientes equipos:',
    ...lines, 'Agradecería información sobre precios y disponibilidad.'].join('\n\n')
  if (!selected.length) return <div className="quote-empty">
    <ClipboardList size={38} strokeWidth={1.45} />
    <h3>Elige los equipos que te interesan</h3>
    <p>Cuando agregues maquinaria podrás indicar cantidades y preparar un mensaje para Good Machines Perú.</p>
    <a className="button button-dark" href="/#catalogo" onClick={close}>Explorar catálogo</a>
  </div>

  return <div className="quote-body">
    <p>Revisa tu selección y ajusta las cantidades referenciales.</p>
    <ul className="quote-items">
      {selected.map(product => {
        const name = productName(product)
        const quantity = selection[product.id]
        return <li key={product.id}>
          <img src={product.images[0]} alt="" />
          <div className="quote-info">
            <strong>{name}</strong>
            {product.availability === 'agotado' && <small>Agotado según catálogo</small>}
            <div className="quantity" role="group" aria-label={`Cantidad de ${name}`}>
              <button aria-label={`Reducir cantidad de ${name}`} onClick={() => setQuantity(product.id, quantity - 1)} disabled={quantity <= 1}><Minus size={16} /></button>
              <span aria-live="polite">{quantity}</span>
              <button aria-label={`Aumentar cantidad de ${name}`} onClick={() => setQuantity(product.id, quantity + 1)} disabled={quantity >= Number.MAX_SAFE_INTEGER}><Plus size={16} /></button>
            </div>
          </div>
          <button className="icon-button" aria-label={`Quitar ${name}`} onClick={() => setQuantity(product.id, 0)}><Trash2 size={18} /></button>
        </li>
      })}
    </ul>
    <h3 className="message-label">Mensaje de cotización</h3>
    <p className="quote-message">{message}</p>
    <div className="quote-actions">
      <a className="button button-primary" href={whatsappLink(message)} target="_blank" rel="noreferrer">
        <MessageCircle size={18} aria-hidden="true" /> Abrir WhatsApp
      </a>
    </div>
  </div>
}

function App({ route }: { route: Route }) {
  const [activeAnchor, setActiveAnchor] = useState(route.type === 'home' ? 'inicio' : 'catalogo')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState<CategoryFilter | null>(null)
  const [query, setQuery] = useState('')
  const [equipmentType, setEquipmentType] = useState('')
  const [power, setPower] = useState<PowerSource | ''>('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [limit, setLimit] = useState(pageSize)
  const [useCase, setUseCase] = useState('')
  const [savedSelection, setSelection] = useState<Selection | null>(null)
  const [overlay, setOverlay] = useState<Overlay | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const track = useRef<HTMLDivElement>(null)
  const menuToggle = useRef<HTMLButtonElement>(null)
  const page = useRef<HTMLDivElement>(null)
  const selection = savedSelection ?? emptySelection
  const isHome = route.type === 'home'

  useEffect(() => {
    function updateAnchor() {
      const offset = window.innerHeight * 0.29
      const current = [...navigation].reverse().find(([id]) =>
        (document.getElementById(id === 'catalogo' ? 'lineas' : id)?.getBoundingClientRect().top ?? Infinity) < offset)
      setActiveAnchor(isHome ? current?.[0] ?? 'inicio' : 'catalogo')
      setScrolled(window.scrollY > 12)
    }
    updateAnchor()
    window.addEventListener('scroll', updateAnchor, { passive: true })
    window.addEventListener('resize', updateAnchor)
    return () => {
      window.removeEventListener('scroll', updateAnchor)
      window.removeEventListener('resize', updateAnchor)
    }
  }, [isHome])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      }
    }, { threshold: 0.12 })
    page.current?.querySelectorAll('.reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setSelection(current => current ?? readSelection())
  }, [])

  useEffect(() => {
    if (!savedSelection) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedSelection))
    } catch {
      // The current session's selection remains available if storage is blocked.
    }
  }, [savedSelection])

  function clearFilters() {
    setCategory(null)
    setQuery('')
    setEquipmentType('')
    setPower('')
    setLimit(pageSize)
  }

  function goToCatalog(ids: readonly CategoryId[], label: string) {
    clearFilters()
    setCategory({ ids, label })
  }

  function addToQuote(product: Product) {
    setSelection(current => {
      const updated = current ?? readSelection()
      return updated[product.id] ? updated : { ...updated, [product.id]: 1 }
    })
    setAnnouncement(`${productName(product)} agregado a Mi cotización.`)
  }

  function setQuantity(id: string, quantity: number) {
    setSelection(current => {
      const updated = { ...(current ?? readSelection()) }
      if (quantity > 0) updated[id] = quantity
      else delete updated[id]
      return updated
    })
  }

  function quoteProduct(product: Product) {
    if (!selection[product.id]) addToQuote(product)
    setOverlay({ type: 'quote' })
  }

  function slide(direction: number) {
    const carousel = track.current
    const card = carousel?.firstElementChild
    if (carousel && card) carousel.scrollBy({ left: direction * (card.getBoundingClientRect().width + 18) })
  }

  const categoryProducts = category ? products.filter(product => category.ids.includes(product.category)) : products
  const types = [...new Set(categoryProducts.map(product => product.subcategory))].sort((a, b) => a.localeCompare(b, 'es'))
  const powerSources = [...new Set(categoryProducts.flatMap(product => product.powerSources))]
  const search = normalize(query)
  const matches = categoryProducts.filter(product => {
    if (equipmentType && product.subcategory !== equipmentType) return false
    if (power && !product.powerSources.includes(power)) return false
    const model = normalize(product.model ?? '').replaceAll(' ', '')
    const searchable = normalize([product.name, product.model, model, product.subcategory, getCategory(product.category).name,
      product.description, ...product.powerSources, ...product.specifications.flat(), ...product.applications].join(' '))
    return !search || model.includes(search.replaceAll(' ', '')) || search.split(' ').every(word => searchable.includes(word))
  })
  const count = Object.keys(selection).length
  const filtersActive = !!(category || query || equipmentType || power)
  const related = useCase ? useCases[Number(useCase)]?.categories ?? [] : []
  const renderProduct = (product: Product) => <ProductCard key={product.id} product={product}
    selected={!!selection[product.id]} open={() => setOverlay({ type: 'product', product })} quote={() => quoteProduct(product)} />

  return <div ref={page}>
    <a className="skip-link" href="#main">Saltar al contenido</a>
    <header className={scrolled ? 'site-header scrolled' : 'site-header'} onKeyDown={event => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        menuToggle.current?.focus()
      }
    }}>
      <div className="shell header-inner">
        <a className="brand header-brand" href={isHome ? '#inicio' : '/'}>
          <img src={company.logo} alt="" width="53" height="53" />
          <span className="brand-copy">
            <span className="brand-name">Good Machines Perú</span>
            <span className="brand-tagline">Todo para tu granja</span>
          </span>
        </a>
        <nav id="main-navigation" aria-label="Navegación principal" className={menuOpen ? 'nav is-open' : 'nav'}>
          {navigation.map(([id, label]) => <a key={id} href={`${isHome ? '' : '/'}#${id}`} onClick={() => setMenuOpen(false)}
            aria-current={activeAnchor === id ? 'location' : undefined}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="button button-dark header-quote" onClick={() => { setMenuOpen(false); setOverlay({ type: 'quote' }) }}
            aria-label={count ? `Mi cotización, ${count} ${count === 1 ? 'equipo seleccionado' : 'equipos seleccionados'}` : 'Cotizar maquinaria'}>
            <ClipboardList size={18} /><span>{count ? 'Mi cotización' : 'Cotizar maquinaria'}</span>
            {count > 0 && <span className="count-badge">{count}</span>}
          </button>
          <button ref={menuToggle} className="icon-button menu-toggle" aria-expanded={menuOpen} aria-controls="main-navigation"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>

    <main id="main" tabIndex={-1}>
      {route.type === 'home' && <>
      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="shell hero-inner">
          <div className="hero-copy">
            <p className="hero-tagline">Todo para tu granja</p>
            <h1 id="hero-title">Maquinaria agroindustrial y equipos para granjas en Perú</h1>
            <p className="hero-description">Maquinaria agroindustrial y equipos para granjas en Perú. Compara peletizadoras, pisos para cerdos y peladoras de ajo, y cotiza por WhatsApp.</p>
            <div className="hero-actions">
              <a href="#catalogo" className="button button-primary">Explorar maquinaria<ArrowDown size={18} /></a>
              <button className="button button-on-dark" onClick={() => setOverlay({ type: 'quote' })}>Solicitar cotización</button>
            </div>
          </div>
          <figure className="hero-stage" aria-label="Fotografías del catálogo de Good Machines Perú">
            <div className="hero-orbit" aria-hidden="true" />
            <div className="hero-platform" aria-hidden="true" />
            <img className="hero-back" src={media('s-210')} alt="Peletizadora S-210" width={546} height={766} />
            <img className="hero-main" src={media('dgp-40')} alt="Extrusora DGP-40" width={790} height={736} fetchPriority="high" />
            <img className="hero-front" src={media('ss-06a')} alt="Deshidratador SS-06A" width={637} height={453} />
            <figcaption><span>EXTRUSORA PARA PECES</span><strong>DGP-40</strong></figcaption>
          </figure>
        </div>
      </section>

      <section className="section lines-section" id="lineas">
        <div className="shell">
          <SectionHeading eyebrow="Líneas de maquinaria" title="Líneas de maquinaria agroindustrial y equipos para granjas" />
          <div className="category-grid">
            {categories.map(item => <a href={categoryPath(item.id)} className="category-card" key={item.id}
              onClick={event => handleLink(event, () => { goToCatalog([item.id], item.name); window.location.hash = 'catalogo' })}>
              <div className="category-copy">
                <item.icon size={23} strokeWidth={1.7} aria-hidden="true" />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="category-action">Ver equipos <ChevronRight size={16} /></span>
              </div>
              <img src={media(item.image)} alt="" loading="lazy" decoding="async" />
            </a>)}
          </div>
          <nav className="catalog-links" aria-label="Búsquedas destacadas">
            {topicalCollections.map(collection => <a className="button button-outline" href={collection.path} key={collection.path}>{collection.name}</a>)}
          </nav>
        </div>
      </section>

      <section className="section featured-section" aria-labelledby="featured-title">
        <div className="shell">
          <div className="section-head-row">
            <div className="section-heading reveal">
              <p className="eyebrow">Selección del catálogo</p>
              <h2 id="featured-title">Equipos destacados.</h2>
            </div>
            <div className="slider-controls">
              <button className="icon-button" aria-label="Destacados anteriores" onClick={() => slide(-1)}><ChevronLeft size={22} /></button>
              <button className="icon-button" aria-label="Destacados siguientes" onClick={() => slide(1)}><ChevronRight size={22} /></button>
            </div>
          </div>
          <div className="featured-track" ref={track} tabIndex={0} aria-label="Lista desplazable de equipos destacados">
            {featured.map(renderProduct)}
          </div>
        </div>
      </section>

      <section className="section catalog-section" id="catalogo">
        <div className="shell">
          <SectionHeading eyebrow="Catálogo digital" title="Catálogo de maquinaria y equipos">
            Busca por nombre o modelo, o filtra por línea y tipo de equipo.
          </SectionHeading>
          <div className="catalog-toolbar">
            <label className="search-box">
              <Search size={21} />
              <span className="sr-only">Buscar maquinaria</span>
              <input type="search" placeholder="Ej. Peletizadora, S-150, aceites…" value={query}
                onChange={event => { setQuery(event.target.value); setLimit(pageSize) }} />
            </label>
            <button className="button button-outline filters-toggle" aria-expanded={filterOpen} aria-controls="catalog-filters"
              onClick={() => setFilterOpen(!filterOpen)}><SlidersHorizontal size={17} /> Filtros</button>
            <div id="catalog-filters" className={filterOpen ? 'filters is-open' : 'filters'}>
              <label><span>Categoría</span><select value={category?.ids.length === 1 ? category.ids[0] : category ? 'group' : ''}
                onChange={event => {
                  const chosen = categories.find(item => item.id === event.target.value)
                  setCategory(chosen ? { ids: [chosen.id], label: chosen.name } : null)
                  setEquipmentType('')
                  setPower('')
                  setLimit(pageSize)
                }}>
                <option value="">Todas las categorías</option>
                {category && category.ids.length > 1 && <option value="group" disabled>{category.label}</option>}
                {categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select></label>
              <label><span>Tipo de equipo</span><select value={equipmentType}
                onChange={event => { setEquipmentType(event.target.value); setLimit(pageSize) }}>
                <option value="">Todos los tipos</option>
                {types.map(type => <option key={type}>{type}</option>)}
              </select></label>
              {powerSources.length > 0 && <label><span>Alimentación</span><select value={power}
                onChange={event => { setPower(powerSources.find(source => source === event.target.value) ?? ''); setLimit(pageSize) }}>
                <option value="">Cualquier alimentación</option>
                {powerSources.map(source => <option key={source}>{source}</option>)}
              </select></label>}
            </div>
          </div>
          <div className="results-bar">
            <p role="status"><strong>{matches.length}</strong> {matches.length === 1 ? 'equipo' : 'equipos'}{category ? ` · ${category.label}` : ''}</p>
            {filtersActive && <button className="text-button" onClick={clearFilters}><X size={16} /> Limpiar filtros</button>}
          </div>
          {matches.length > 0 ? <div className="product-grid" key={`${search}|${category?.ids.join(',')}|${equipmentType}|${power}`}>
            {matches.slice(0, limit).map(renderProduct)}
          </div> : <div className="no-results">
            <Search size={34} strokeWidth={1.5} /><h3>No encontramos equipos</h3>
            <p>Prueba otro nombre o modelo, o limpia los filtros.</p>
            <button className="button button-outline" onClick={clearFilters}>Ver todos los equipos</button>
          </div>}
          {matches.length > limit && <div className="pagination">
            <button className="button button-outline" onClick={() => setLimit(limit + pageSize)}>Mostrar más equipos <Plus size={17} /></button>
            <p>Mostrando {limit} de {matches.length} equipos</p>
          </div>}
        </div>
      </section>

      <section className="section sectors-section" id="sectores">
        <div className="shell">
          <SectionHeading eyebrow="Soluciones por sector" title="Maquinaria para diferentes desafíos productivos." />
          <div className="sector-grid">
            {sectors.map(sector => <a key={sector.title} href="#catalogo" className="sector-card"
              onClick={() => goToCatalog(sector.categories, sector.title)}>
              <div className="sector-photo"><img src={media(sector.image)} alt="" loading="lazy" decoding="async" /></div>
              <div className="sector-copy">
                <h3>{sector.title}</h3><p>{sector.description}</p>
                <span className="category-action">Explorar equipos <ChevronRight size={16} /></span>
              </div>
            </a>)}
          </div>
        </div>
      </section>

      <section className="section about-section" id="nosotros">
        <div className="shell split">
          <div className="about-visual" aria-label="Equipos de Good Machines Perú">
            <img src={media('s-150-electrica')} alt="Peletizadora S-150 eléctrica" loading="lazy" />
            <img src={media('dgp-40-frontal')} alt="Extrusora DGP-40, vista frontal" loading="lazy" />
          </div>
          <div>
            <SectionHeading eyebrow="Good Machines Perú" title="Equipa tu granja para cada etapa de producción." />
            <p>Reunimos equipos para el manejo de granjas avícolas y porcinas, desde comederos y bebederos hasta molinos y peletizadoras para preparar alimento balanceado.</p>
            <p>Explora equipos de distintas capacidades y características técnicas para identificar alternativas acordes con las necesidades de tu negocio.</p>
            <a href="#lineas" className="button button-outline">Conocer las líneas</a>
          </div>
        </div>
      </section>

      <section className="section guidance-section">
        <div className="shell split">
          <div>
            <SectionHeading eyebrow="Asistencia para elegir" title="¿No sabes qué máquina necesitas?" />
            <ol className="steps">
              <li>Identifica qué producto deseas procesar.</li>
              <li>Define tu capacidad de producción requerida.</li>
              <li>Consulta las características y alternativas disponibles.</li>
            </ol>
          </div>
          <div className="guide-panel">
            <div className="guide-icon"><Factory size={27} strokeWidth={1.6} /></div>
            <label htmlFor="use-case">¿Qué deseas producir o procesar?</label>
            <select id="use-case" value={useCase} onChange={event => setUseCase(event.target.value)}>
              <option value="">Selecciona una opción</option>
              {useCases.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
            </select>
            {related.length > 0 && <div className="related" aria-live="polite">
              <p>Líneas relacionadas</p>
              {related.map(id => <a key={id} href="#catalogo" onClick={() => goToCatalog([id], getCategory(id).name)}>
                {getCategory(id).name}<ChevronRight size={17} />
              </a>)}
            </div>}
          </div>
        </div>
      </section>

      <section className="section faq-section" id="preguntas">
        <div className="shell split">
          <SectionHeading eyebrow="Antes de cotizar" title="Preguntas frecuentes." />
          <div className="faq-list">
            {questions.map(([question, answer]) => <details name="preguntas" key={question}>
              <summary>{question}<ChevronDown size={21} /></summary>
              <div className="faq-answer"><p>{answer}</p></div>
            </details>)}
          </div>
        </div>
      </section>

      <section className="download-section" id="descarga">
        <div className="shell download-inner">
          <img className="catalog-cover" src={company.catalog.cover} alt="Portada original del catálogo Good Machines Perú" width="200" height="283" loading="lazy" />
          <div>
            <SectionHeading eyebrow={`Catálogo original · ${company.catalog.pages} páginas`} title="Toda nuestra maquinaria en un solo catálogo.">
              Consulta las diferentes líneas de equipos y sus características técnicas.
            </SectionHeading>
            <a className="button button-dark" href={company.catalog.url} download><ArrowDownToLine size={19} /> Descargar catálogo PDF</a>
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contacto">
        <div className="shell">
          <SectionHeading eyebrow="Contacto y cotizaciones" title="Encuentra la maquinaria adecuada para tu próximo proyecto.">
            Explora las alternativas disponibles y prepara una consulta según tus necesidades de producción.
          </SectionHeading>
          <div className="hero-actions">
            <a className="button button-primary" href={whatsappLink()} target="_blank" rel="noreferrer">
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp {company.contact.whatsapp.label}
            </a>
            <button className="button button-on-dark" onClick={() => setOverlay({ type: 'quote' })}><ClipboardList size={18} /> Preparar cotización</button>
            <a href="#catalogo" className="button button-on-dark">Explorar catálogo</a>
          </div>
          <ContactAddress />
        </div>
      </section>
      </>}
      {route.type === 'collection' && <section className="section catalog-page shell">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <a href="/">Inicio</a><ChevronRight size={15} aria-hidden="true" />
          {route.path !== categoryPath(route.collection.category) && <>
            <a href={categoryPath(route.collection.category)}>{getCategory(route.collection.category).name}</a><ChevronRight size={15} aria-hidden="true" />
          </>}
          <span aria-current="page">{route.collection.name}</span>
        </nav>
        <h1>{route.collection.name}</h1>
        <p className="section-description">{route.collection.description}</p>
        {route.collection.guide && <p className="section-description">{route.collection.guide}</p>}
        {topicalCollections.some(collection => collection.category === route.collection.category && collection.path !== route.path) &&
          <nav className="catalog-links" aria-label="Colecciones relacionadas">
            {topicalCollections.filter(collection => collection.category === route.collection.category && collection.path !== route.path)
              .map(collection => <a className="button button-outline" href={collection.path} key={collection.path}>{collection.name}</a>)}
          </nav>}
        <div className="product-grid">{route.collection.products.map(renderProduct)}</div>
      </section>}
      {route.type === 'product' && <section className="section catalog-page shell">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <a href="/">Inicio</a><ChevronRight size={15} aria-hidden="true" />
          <a href={categoryPath(route.product.category)}>{getCategory(route.product.category).name}</a>
          <ChevronRight size={15} aria-hidden="true" /><span aria-current="page">{productName(route.product)}</span>
        </nav>
        <ProductDetail fullPage product={route.product} selected={!!selection[route.product.id]}
          add={() => addToQuote(route.product)} quote={() => quoteProduct(route.product)} />
        <section className="related-products">
          <h2>Equipos relacionados</h2>
          <div className="product-grid">{products.filter(product => product.category === route.product.category && product.id !== route.product.id)
            .sort((a, b) => Number(b.subcategory === route.product.subcategory) - Number(a.subcategory === route.product.subcategory))
            .slice(0, 4).map(renderProduct)}</div>
        </section>
      </section>}
      {route.type === 'not-found' && <section className="section catalog-page shell">
        <h1>Página no encontrada</h1>
        <a className="button button-dark" href="/#catalogo">Ver el catálogo</a>
      </section>}
    </main>

    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <a className="brand" href={isHome ? '#inicio' : '/'}>
              <img src={company.logo} alt="" width="53" height="53" />
              <span className="brand-name">Good Machines Perú</span>
            </a>
            <p>Maquinaria y equipamiento para actividades agroindustriales y productivas.</p>
            <nav className="footer-social" aria-label="Redes sociales">
              {company.contact.social.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}</a>)}
            </nav>
          </div>
          <div>
            <h2>Explorar</h2>
            {navigation.slice(1).map(([id, label]) => <a href={`${isHome ? '' : '/'}#${id}`} key={id}>{label}</a>)}
            <a href={company.catalog.url} download><FileText size={17} /> Descargar PDF</a>
            <a href="/#preguntas"><CircleHelp size={17} /> Preguntas frecuentes</a>
          </div>
          <div><h2>Líneas de maquinaria</h2>{categories.slice(0, 3).map(item =>
            <a key={item.id} href={categoryPath(item.id)}>{item.name}</a>)}</div>
          <div>
            <h2>Contacto</h2>
            <a href={whatsappLink()} target="_blank" rel="noreferrer">
              <MessageCircle size={17} aria-hidden="true" /> WhatsApp {company.contact.whatsapp.label}
            </a>
            <ContactAddress />
          </div>
        </div>
        <div className="footer-bottom"><span suppressHydrationWarning>© {new Date().getFullYear()} Good Machines Perú</span><span>Desarrollado por <strong>Kafka Tech</strong></span></div>
      </div>
    </footer>
    <div role="status" className="sr-only">{announcement}</div>
    <Modal overlay={overlay} close={() => setOverlay(null)}>
      {overlay?.type === 'product' && <ProductDetail key={overlay.product.id} product={overlay.product} selected={!!selection[overlay.product.id]}
        add={() => addToQuote(overlay.product)} quote={() => quoteProduct(overlay.product)} />}
      {overlay?.type === 'quote' && <Quote selection={selection} setQuantity={setQuantity} close={() => setOverlay(null)} />}
    </Modal>
  </div>
}

export default App
