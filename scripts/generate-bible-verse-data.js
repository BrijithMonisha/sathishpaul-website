import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sourceDir = path.resolve(__dirname, '../public/images/web/scripture')
const outputFile = path.resolve(__dirname, '../src/data/imageSeoData.js')

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

function getFiles(directory) {
  const files = []
  const entries = fs.readdirSync(directory, { withFileTypes: true })
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...getFiles(entryPath))
    } else if (allowedExtensions.includes(path.extname(entry.name).toLowerCase())) {
      files.push(entryPath)
    }
  }
  return files
}

const files = getFiles(sourceDir)

if (!files.length) {
  console.error('No scripture images found in', sourceDir)
  process.exit(1)
}

const data = files.map((filePath) => {
  const relativeImagePath = filePath.replace(path.resolve(__dirname, '../public'), '').replace(/\\/g, '/')
  const rawName = path.basename(filePath, path.extname(filePath)).replace(/\s+/g, ' ').trim()
  const slug = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const title = rawName
  const description = `${rawName} scripture image with Bible verse text.`
  const verseText = rawName
  const reference = ''
  const shortReference = ''
  const image = relativeImagePath
  const alt = rawName
  const caption = rawName
  const keywords = `${rawName}, Bible verse image, scripture art`

  return {
    slug,
    title,
    verseText,
    reference,
    shortReference,
    image,
    alt,
    description,
    caption,
    keywords
  }
})

const output = `const imageSeoData = ${JSON.stringify(data, null, 2)}\n\nexport default imageSeoData;\n`
fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, output, 'utf8')
console.log(`Generated ${data.length} image SEO entries in ${outputFile}`)
