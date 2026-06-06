const PRODUCT_IMAGES: Record<string, string> = {
  Laptop: '/products/laptop.svg',
  Monitor: '/products/monitor.svg',
  Chair: '/products/chair.svg',
  Desk: '/products/desk.svg',
  Printer: '/products/printer.svg',
  Server: '/products/server.svg',
  Switch: '/products/switch.svg',
  Cable: '/products/cable.svg',
  Paper: '/products/paper.svg',
  Toner: '/products/toner.svg',
  Cabinet: '/products/cabinet.svg',
  Whiteboard: '/products/whiteboard.svg',
  default: '/products/default.svg',
}

export const PRODUCT_TYPES = Object.keys(PRODUCT_IMAGES).filter((k) => k !== 'default')

export function getProductImage(nameOrCategory: string): string {
  const key = Object.keys(PRODUCT_IMAGES).find(
    (k) => k !== 'default' && nameOrCategory.toLowerCase().includes(k.toLowerCase()),
  )
  return PRODUCT_IMAGES[key || 'default']
}

export function resolveProductImage(images?: string[], nameOrCategory = ''): string {
  const src = images?.[0]
  if (src && !src.startsWith('http')) return src
  return getProductImage(nameOrCategory || src || '')
}
