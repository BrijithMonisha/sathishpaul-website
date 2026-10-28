/**
 * Blocks unexpected off-site redirects / popups from injected or compromised scripts.
 * Allowed external domains: social links used by this site only.
 */

const OWN_HOSTS = new Set([
  'sathishpaul.net',
  'www.sathishpaul.net',
  'localhost',
  '127.0.0.1'
])

const ALLOWED_EXTERNAL_HOSTS = new Set([
  'www.facebook.com',
  'facebook.com',
  'www.instagram.com',
  'instagram.com',
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'wa.me',
  'api.whatsapp.com',
  'www.whatsapp.com',
  'drive.google.com',
  'docs.google.com'
])

function getHostname(url) {
  try {
    return new URL(url, window.location.origin).hostname.toLowerCase()
  } catch {
    return null
  }
}

function isAllowedNavigation(url) {
  const host = getHostname(url)
  if (!host) return false
  if (OWN_HOSTS.has(host)) return true
  return ALLOWED_EXTERNAL_HOSTS.has(host)
}

function block(reason, url) {
  console.warn('[Security] Blocked unwanted navigation:', reason, url)
  return null
}

export function installNavigationGuard() {
  if (typeof window === 'undefined' || window.__navGuardInstalled) return
  window.__navGuardInstalled = true

  try {
    const originalOpen = window.open.bind(window)
    window.open = function guardedOpen(url, ...rest) {
      if (url == null || url === '' || url === 'about:blank') {
        return originalOpen(url, ...rest)
      }
      if (!isAllowedNavigation(String(url))) {
        return block('window.open', url)
      }
      return originalOpen(url, ...rest)
    }
  } catch {
    // ignore if browser blocks override
  }

  try {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'location')
      || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'location')

    // Prefer wrapping assign/replace when possible
    const loc = window.location
    if (typeof loc.assign === 'function') {
      const originalAssign = loc.assign.bind(loc)
      loc.assign = (url) => {
        if (!isAllowedNavigation(String(url))) return block('location.assign', url)
        return originalAssign(url)
      }
    }
    if (typeof loc.replace === 'function') {
      const originalReplace = loc.replace.bind(loc)
      loc.replace = (url) => {
        if (!isAllowedNavigation(String(url))) return block('location.replace', url)
        return originalReplace(url)
      }
    }
    void descriptor
  } catch {
    // Some browsers make Location methods non-writable
  }

  // Catch <a> clicks that point to unknown external sites (injected links)
  document.addEventListener(
    'click',
    (event) => {
      const anchor = event.target?.closest?.('a[href]')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return
      }

      // Internal React Router / relative links are fine
      if (href.startsWith('/') && !href.startsWith('//')) return

      if (!isAllowedNavigation(href)) {
        event.preventDefault()
        event.stopPropagation()
        block('anchor click', href)
      }
    },
    true
  )
}
