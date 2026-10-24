import fs from 'fs'
import path from 'path'
import { create } from 'xmlbuilder2'
import imageSeoData from '../src/data/imageSeoData.js'

const baseUrl = 'https://www.sathishpaul.net'
const publicDir = path.resolve('public')
const sitemapFile = path.join(publicDir, 'sitemap.xml')
const imageSitemapFile = path.join(publicDir, 'sitemap-images.xml')

const pageRoutes = [
  '/',
  '/gospeltoons-eng',
  '/gospeltoons-tamil',
  '/gospeltoons-eng-new',
  '/gospeltoons-tamil-new',
  '/catholic-designs',
  '/strokes'
]

const readJson = (filename) =>
  JSON.parse(fs.readFileSync(path.join(publicDir, filename), 'utf8'))

const normalizePath = (value = '') =>
  value.startsWith('/') ? value : `/${value}`

const absoluteUrl = (value = '') =>
  value.startsWith('http') ? value : `${baseUrl}${normalizePath(value)}`

const addImage = (images, item, fallbackTitle = '') => {
  const imagePath = item.src || item.path
  if (!imagePath) return

  const title = item.title || item.name || item.alt || item.altText || fallbackTitle
  images.push({
    loc: absoluteUrl(imagePath),
    title,
    caption: item.caption || item.description || item.textContent || title
  })
}

const galleryImages = readJson('galleryImages.json')
const gospelData = readJson('gospel-data.json')

const pageUrls = [
  ...pageRoutes.map((route) => ({
    loc: `${baseUrl}${route}`,
    changefreq: 'weekly',
    priority: route === '/' ? '1.0' : '0.8'
  })),
  ...imageSeoData.map((item) => ({
    loc: `${baseUrl}/bible-verses/${item.slug}`,
    changefreq: 'monthly',
    priority: '0.6'
  }))
]

const pageSitemap = create({ version: '1.0', encoding: 'UTF-8' })
  .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' })

for (const page of pageUrls) {
  const url = pageSitemap.ele('url')
  url.ele('loc').txt(page.loc)
  url.ele('changefreq').txt(page.changefreq)
  url.ele('priority').txt(page.priority)
}

fs.writeFileSync(sitemapFile, pageSitemap.end({ prettyPrint: true }), 'utf8')

const imageGroups = new Map()
const addImageGroup = (route, images) => {
  if (!images.length) return
  imageGroups.set(route, images)
}

const catholicDesignImages = []
for (const [category, items] of Object.entries(galleryImages)) {
  for (const item of items || []) {
    addImage(catholicDesignImages, item, `Catholic Designs - ${category}`)
  }
}
addImageGroup('/catholic-designs', catholicDesignImages)
addImageGroup('/strokes', [
  {
    loc: absoluteUrl('/images/Strokes/str1.jpg'),
    title: 'Strokes by Sathish Paul SDB',
    caption: 'Strokes artwork by Sathish Paul SDB with orange and green brush strokes'
  },
  {
    loc: absoluteUrl('/images/Strokes.png'),
    title: 'Strokes',
    caption: 'Strokes by Sathish Paul SDB'
  },
  ...Array.from({ length: 26 }, (_, index) => ({
    loc: absoluteUrl(`/images/Strokes/str${index + 2}.jpg`),
    title: `Strokes ${index + 2}`,
    caption: `Strokes artwork ${index + 2} by Sathish Paul SDB`
  }))
])

for (const [language, routes] of [
  ['english', ['/gospeltoons-eng', '/gospeltoons-eng-new']],
  ['tamil', ['/gospeltoons-tamil', '/gospeltoons-tamil-new']]
]) {
  const images = []
  for (const items of Object.values(gospelData[language] || {})) {
    for (const item of items || []) addImage(images, item)
  }
  for (const route of routes) addImageGroup(route, images)
}

for (const item of imageSeoData) {
  addImageGroup(`/bible-verses/${item.slug}`, [{
    loc: absoluteUrl(item.image),
    title: item.title,
    caption: item.caption || item.description || item.title
  }])
}

const imageSitemap = create({ version: '1.0', encoding: 'UTF-8' })
  .ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
    'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1'
  })

let totalImages = 0
for (const [route, images] of imageGroups) {
  const url = imageSitemap.ele('url')
  url.ele('loc').txt(`${baseUrl}${route}`)

  for (const image of images) {
    totalImages += 1
    const imageElement = url.ele('image:image')
    imageElement.ele('image:loc').txt(image.loc)
    if (image.title) imageElement.ele('image:title').txt(image.title)
    if (image.caption) imageElement.ele('image:caption').txt(image.caption)
  }
}

fs.writeFileSync(imageSitemapFile, imageSitemap.end({ prettyPrint: true }), 'utf8')

console.log(`Generated ${pageUrls.length} page URLs in ${sitemapFile}`)
console.log(`Generated ${totalImages} image entries in ${imageSitemapFile}`)
