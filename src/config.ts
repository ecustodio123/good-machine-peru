export const company = {
  name: 'Good Machines Perú',
  siteUrl: 'https://good-machine-peru.pages.dev',
  logo: '/media/good-machines.webp',
  catalog: {
    url: '/catalogo-good-machines-peru.pdf',
    cover: '/media/catalogo-portada.webp',
    pages: 38,
  },
  contact: {
    whatsapp: { number: '51993777340', label: '993 777 340' },
    address: 'Av. Javier Prado Mza. G1 Lote 27, Urb. Los Portales, Lima',
    social: [
      { label: 'Facebook', url: 'https://www.facebook.com/people/Good-Machines-Per%C3%BA/100067699182566/' },
      { label: 'Instagram', url: 'https://www.instagram.com/goodmachinesperu/' },
      { label: 'TikTok', url: 'https://www.tiktok.com/@goodmachinesperu' },
    ],
  },
}

export function whatsappLink(message?: string) {
  const url = `https://wa.me/${company.contact.whatsapp.number}`
  return message ? `${url}?text=${encodeURIComponent(message)}` : url
}
