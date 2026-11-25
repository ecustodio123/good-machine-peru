import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { createServer } from 'vite'

const server = await createServer({ appType: 'custom', server: { middlewareMode: true, watch: null, ws: false } })

try {
  const { renderSite } = await server.ssrLoadModule('/src/prerender.tsx')
  const { pages, sitemap, robots } = renderSite(await readFile('dist/index.html', 'utf8'))
  await Promise.all([
    ...pages.map(async ({ path, html }) => {
      const file = join('dist', path, path.endsWith('/') ? 'index.html' : '')
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, html)
    }),
    writeFile('dist/sitemap.xml', sitemap),
    writeFile('dist/robots.txt', robots),
  ])
  console.log(`Rendered ${pages.length - 1} indexable pages and a 404 page.`)
} finally {
  await server.close()
}
