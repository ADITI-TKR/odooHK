const productImages = {
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

export function getProductImage(name = '') {
  const key = Object.keys(productImages).find((k) => k !== 'default' && name.includes(k))
  return productImages[key] || productImages.default
}
