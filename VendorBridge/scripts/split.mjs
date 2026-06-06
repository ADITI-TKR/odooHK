import { cpSync, existsSync, mkdirSync, copyFileSync } from 'fs'
import { join } from 'path'

const root = 'C:/Users/Admin/Projects/vendorbridge'

function copyDir(src, dest) {
  cpSync(join(root, src), join(root, dest), { recursive: true, force: true })
}

copyDir('server/config', 'backend/config')
copyDir('server/middleware', 'backend/middleware')
copyDir('server/models', 'backend/models')
copyDir('server/routes', 'backend/routes')
copyFileSync(join(root, 'server/seed.js'), join(root, 'backend/seed.js'))

copyDir('src', 'frontend/src')
copyDir('public', 'frontend/public')
for (const f of ['index.html', 'vite.config.ts', 'tsconfig.json']) {
  copyFileSync(join(root, f), join(root, 'frontend', f))
}

const productsDir = join(root, 'frontend/public/products')
mkdirSync(productsDir, { recursive: true })
const assets = 'C:/Users/Admin/.cursor/projects/empty-window/assets'
for (const name of ['laptop', 'monitor', 'chair']) {
  const src = join(assets, `${name}.jpg`)
  if (existsSync(src)) copyFileSync(src, join(productsDir, `${name}.jpg`))
}
for (const name of ['desk', 'printer', 'server', 'switch', 'cable', 'paper', 'toner', 'cabinet', 'whiteboard', 'default']) {
  const base = join(productsDir, 'laptop.jpg')
  if (existsSync(base)) copyFileSync(base, join(productsDir, `${name}.jpg`))
}

console.log('Copy complete')
console.log('Backend files:', existsSync(join(root, 'backend/routes/auth.js')))
console.log('Frontend App:', existsSync(join(root, 'frontend/src/App.tsx')))
