/**
 * Copies WEBSITE SP gallery folders into public/website-sp and writes JSON manifests.
 *
 * Usage:
 *   node scripts/sync-website-sp-static.js
 *   WEBSITE_SP_ROOT="D:\\path\\WEBSITE SP" node scripts/sync-website-sp-static.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

const DEFAULT_SOURCE = path.join(
  process.env.USERPROFILE || '',
  'Downloads',
  'WEBSITE SP-20261006T091223Z-1-001',
  'WEBSITE SP'
)

const SOURCE_ROOT = process.env.WEBSITE_SP_ROOT || DEFAULT_SOURCE
const PUBLIC_GALLERY = path.join(projectRoot, 'public', 'website-sp')
const MANIFEST_DIR = path.join(projectRoot, 'public', 'gallery-manifests')

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])

/** Filenames to skip when syncing Strokes (removed from the live gallery). */
const STROKES_EXCLUDED_FILES = new Set(['str0.jpg'])

const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
]

const STANDARD_MONTH_FOLDERS = {
  jan: '1 Jan',
  feb: '2 Feb',
  mar: '3 Mar',
  apr: '4 Apr',
  may: '5 May',
  jun: '6 Jun',
  jul: '7 Jul',
  aug: '8 Aug',
  sep: '9 Sep',
  oct: '10 Oct',
  nov: '11 Nov',
  dec: '12 Dec'
}

const TAMIL_MONTH_FOLDERS = Object.fromEntries(
  Object.entries(STANDARD_MONTH_FOLDERS).map(([key, name]) => [key, `${name} Tamil`])
)

const CATHOLIC_CATEGORIES = [
  'common',
  'jesus',
  'mary',
  'saints',
  'eucharist',
  'church',
  'scripture'
]

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

function toPublicSrc(relativePosix) {
  const encoded = relativePosix
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
  return `/website-sp/${encoded}`
}

function listImages(dir) {
  if (!fs.existsSync(dir)) {
    return []
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
    .sort(naturalSort)
}

function copyFileEnsureDir(srcFile, destFile) {
  fs.mkdirSync(path.dirname(destFile), { recursive: true })
  fs.copyFileSync(srcFile, destFile)
}

function buildEntries(publicRelativeDir, sourceDir, options = {}) {
  const { excludeFileNames = null } = options
  const files = listImages(sourceDir).filter(
    (fileName) => !excludeFileNames?.has(fileName)
  )
  const entries = []

  for (const fileName of files) {
    const srcFile = path.join(sourceDir, fileName)
    const destFile = path.join(PUBLIC_GALLERY, publicRelativeDir, fileName)
    copyFileEnsureDir(srcFile, destFile)

    const relativePosix = `${publicRelativeDir.replace(/\\/g, '/')}/${fileName}`
    entries.push({
      id: relativePosix,
      name: fileName,
      src: toPublicSrc(relativePosix)
    })
  }

  return entries
}

function syncCatholicDesigns() {
  const baseSrc = path.join(SOURCE_ROOT, 'Catholic Designs', 'Catholic Designs')
  const manifest = {}

  for (const category of CATHOLIC_CATEGORIES) {
    const sourceDir = path.join(baseSrc, category)
    const publicDir = path.join('catholic-designs', category)
    manifest[category] = buildEntries(publicDir, sourceDir)
  }

  return manifest
}

function syncStrokes() {
  const sourceDir = path.join(SOURCE_ROOT, 'Strokes1', 'Strokes1', 'Strokes')
  return buildEntries('strokes', sourceDir, {
    excludeFileNames: STROKES_EXCLUDED_FILES
  })
}

function syncMonthlyGallery(sourceRelative, publicPrefix, monthMap) {
  const baseSrc = path.join(SOURCE_ROOT, ...sourceRelative.split('/'))
  const manifest = {}

  for (const monthKey of MONTH_KEYS) {
    const folderName = monthMap[monthKey]
    const sourceDir = path.join(baseSrc, folderName)
    const publicDir = path.join(publicPrefix, folderName)
    manifest[monthKey] = buildEntries(publicDir, sourceDir)
  }

  return manifest
}

function syncGtTamilLegacy() {
  const baseSrc = path.join(SOURCE_ROOT, 'GT Tamil')
  const manifest = {}

  for (const monthKey of MONTH_KEYS) {
    const folderName = TAMIL_MONTH_FOLDERS[monthKey]
    const sourceDir = path.join(baseSrc, folderName)
    const publicDir = path.join('gt-tamil', folderName)
    manifest[monthKey] = buildEntries(publicDir, sourceDir)
  }

  return manifest
}

function writeManifest(name, data) {
  fs.mkdirSync(MANIFEST_DIR, { recursive: true })
  const outPath = path.join(MANIFEST_DIR, `${name}.json`)
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8')
  console.log(`Wrote ${outPath}`)
}

function countManifestEntries(data) {
  if (Array.isArray(data)) {
    return data.length
  }

  return Object.values(data).reduce(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0
  )
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.error(`WEBSITE SP folder not found:\n  ${SOURCE_ROOT}`)
    console.error('Set WEBSITE_SP_ROOT to your extracted "WEBSITE SP" folder path.')
    process.exit(1)
  }

  console.log(`Source: ${SOURCE_ROOT}`)
  console.log(`Output: ${PUBLIC_GALLERY}`)

  if (fs.existsSync(PUBLIC_GALLERY)) {
    fs.rmSync(PUBLIC_GALLERY, { recursive: true, force: true })
  }

  fs.mkdirSync(PUBLIC_GALLERY, { recursive: true })

  const catholic = syncCatholicDesigns()
  const strokes = syncStrokes()
  const gtEnglish = syncMonthlyGallery(
    'GT English/GT English',
    'gt-english',
    STANDARD_MONTH_FOLDERS
  )
  const gtEnglishNew = syncMonthlyGallery(
    'GT English New/GT English New',
    'gt-english-new',
    STANDARD_MONTH_FOLDERS
  )
  const gtTamilNew = syncMonthlyGallery(
    'GT Tamil New/GT Tamil New',
    'gt-tamil-new',
    TAMIL_MONTH_FOLDERS
  )
  const gtTamil = syncGtTamilLegacy()

  writeManifest('catholic-designs', catholic)
  writeManifest('strokes', strokes)
  writeManifest('gt-english', gtEnglish)
  writeManifest('gt-english-new', gtEnglishNew)
  writeManifest('gt-tamil', gtTamil)
  writeManifest('gt-tamil-new', gtTamilNew)

  const total =
    countManifestEntries(catholic) +
    countManifestEntries(strokes) +
    countManifestEntries(gtEnglish) +
    countManifestEntries(gtEnglishNew) +
    countManifestEntries(gtTamil) +
    countManifestEntries(gtTamilNew)

  console.log(`Done. ${total} images synced to public/website-sp`)
}

main()
