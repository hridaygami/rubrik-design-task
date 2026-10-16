import { readFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ogImage()],
})

// The Open Graph card: the brand logo centred on white. It's rendered to PNG at
// build time (and served on the fly in dev) so no raster image lives in the
// repo. Crawlers need an absolute image URL, so set SITE_URL when deploying.
function ogImage(): Plugin {
  const fileName = 'og-image.png'
  const [width, height, scale] = [1200, 630, 3]
  let png: Buffer | undefined

  const render = () => {
    const logo = readFileSync('src/assets/rubrik-logo-colour.svg', 'utf8')
    const paths = logo.replace(/^\s*<svg[^>]*>|<\/svg>\s*$/g, '')
    const [x, y] = [(width - 168 * scale) / 2, (height - 48 * scale) / 2]
    const card = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="#fff"/>
      <g transform="translate(${x} ${y}) scale(${scale})">${paths}</g>
    </svg>`
    return (png ??= new Resvg(card).render().asPng())
  }

  return {
    name: 'og-image',
    configureServer(server) {
      server.middlewares.use(`/${fileName}`, (_req, res) => {
        res.setHeader('Content-Type', 'image/png')
        res.end(render())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName, source: render() })
    },
    transformIndexHtml: () => [
      ['og:image', `${process.env.SITE_URL ?? ''}/${fileName}`],
      ['og:image:width', `${width}`],
      ['og:image:height', `${height}`],
      ['og:image:alt', 'Rubrik'],
    ].map(([property, content]) => ({
      tag: 'meta',
      attrs: { property, content },
      injectTo: 'head' as const,
    })),
  }
}
