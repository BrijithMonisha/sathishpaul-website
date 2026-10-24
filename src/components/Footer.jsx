import './Footer.css'
import { useLocation } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  const isSearchPage = location.pathname === '/search'

  return (
    <footer className={`footer ${isSearchPage ? 'footer-fixed' : ''}`}>
      <div className="footer-container">
        <div className="footer-left">
          <a href="https://www.sathishpaul.net" target="_blank" rel="noopener noreferrer" className="footer-url">
            www.sathishpaul.net
          </a>
        </div>
        <div className="footer-right">
          <a href="https://www.facebook.com/share/1PgmjRSQyd/" className="social-icon" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.instagram.com/sathishpaul1?igsh=dmFqNGQxaDVqZHVv" className="social-icon" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://youtube.com/@jsathishpaul?si=lzcAg-S8dRGTtszr" className="social-icon" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
