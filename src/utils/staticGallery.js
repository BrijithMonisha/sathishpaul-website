const MANIFEST_BASE = '/gallery-manifests'

const manifestCache = new Map()

export async function fetchGalleryManifest(manifestName) {
  if (manifestCache.has(manifestName)) {
    return manifestCache.get(manifestName)
  }

  const response = await fetch(`${MANIFEST_BASE}/${manifestName}.json`)

  if (!response.ok) {
    throw new Error(`Gallery manifest "${manifestName}" could not be loaded.`)
  }

  const data = await response.json()
  manifestCache.set(manifestName, data)
  return data
}

export async function getCatholicCategoryImages(category) {
  const manifest = await fetchGalleryManifest('catholic-designs')
  return Array.isArray(manifest[category]) ? manifest[category] : []
}

export async function getStrokesImages() {
  const manifest = await fetchGalleryManifest('strokes')
  return Array.isArray(manifest) ? manifest : []
}

export async function getMonthlyGalleryImages(manifestName, monthKey) {
  const manifest = await fetchGalleryManifest(manifestName)
  return Array.isArray(manifest[monthKey]) ? manifest[monthKey] : []
}

/** Map static list items to gospel gallery card shape. */
export function toGospelGalleryImages(items, options = {}) {
  const { monthName = '', labelPrefix = 'Gospeltoon', dateLabel } = options

  const date =
    dateLabel ??
    (monthName ? `${monthName.toUpperCase()}, 2026` : '')

  return items.map((item, index) => {
    const src = item.src || ''
    const name = item.name || `${labelPrefix} ${index + 1}`

    return {
      id: item.id || `${name}-${index}`,
      name,
      alt: name,
      description: name,
      date,
      src,
      candidates: src ? [src] : [],
      loaded: false,
      failed: !src,
      successfulSrc: ''
    }
  })
}
