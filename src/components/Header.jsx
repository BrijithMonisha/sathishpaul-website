import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'

const STROKES_INSTAGRAM = 'https://www.instagram.com/strokes.sp/'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Gt English New', to: '/gospeltoons-eng-new' },
  { label: 'Gt Tamil New', to: '/gospeltoons-tamil-new' },
  { label: 'Catholic Designs', to: '/catholic-designs' },
  { label: 'Strokes', href: STROKES_INSTAGRAM },
  { label: 'Gt English', to: '/gospeltoons-eng' },
  { label: 'Gt Tamil', to: '/gospeltoons-tamil' },
]

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const handleSearch = (event) => {
    event.preventDefault()
    if (!searchQuery.trim()) {
      setSearchOpen((current) => !current)
      return
    }
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { state: { from: location.pathname } })
    setSearchOpen(false)
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-section" onClick={() => setMobileMenuOpen(false)}>
          <img src="/images/frnewicon.png" alt="Sathish Paul SDB" className="logo-img" />
          <span className="logo-text">Sathish Paul SDB</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) =>
            link.href ? (
              <a
                className="nav-link"
                href={link.href}
                key={link.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ) : (
              <Link className={`nav-link ${isActive(link.to) ? 'active' : ''}`} to={link.to} key={link.to}>
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="header-actions">
          <button className="search-toggle" onClick={() => setSearchOpen((current) => !current)} aria-label="Open search">
            <i className="fas fa-search" />
          </button>
          <button
            className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <form className={`header-search ${searchOpen ? 'active' : ''}`} onSubmit={handleSearch}>
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search Gospeltoons and Catholic Designs"
          aria-label="Search"
        />
        <button type="submit">Search</button>
      </form>

      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <nav className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`} aria-label="Mobile navigation">
        <div className="mobile-menu-heading">
          <img src="/images/frnewicon.png" alt="" />
          <strong>Sathish Paul SDB</strong>
          <button onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation">X</button>
        </div>
        {links.map((link) =>
          link.href ? (
            <a
              className="mobile-nav-link"
              href={link.href}
              key={link.label}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}<span aria-hidden="true">-&gt;</span>
            </a>
          ) : (
            <Link
              className={`mobile-nav-link ${isActive(link.to) ? 'active' : ''}`}
              to={link.to}
              key={link.to}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}<span aria-hidden="true">-&gt;</span>
            </Link>
          )
        )}
      </nav>
    </header>
  )
}

export default Header
