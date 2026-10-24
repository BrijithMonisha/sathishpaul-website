import { Link } from 'react-router-dom'
import imageSeoData from '../data/imageSeoData.js'
import SEO from '../components/SEO.jsx'
import './BibleVerses.css'

const BibleVerses = () => {
  return (
    <div className="bible-verses-page page-container">
      <SEO
        title="Bible Verse Images | Sathish Paul"
        description="Browse Bible verse images and scripture artwork by Sathish Paul. Each image detail page includes clear alt text, captions, and structured data for better image SEO."
        keywords="Bible verse images, scripture artwork, Christian illustrations, Bible verse gallery"
        canonical="https://www.sathishpaul.net/bible-verses"
        image="https://www.sathishpaul.net/images/mini.png"
      />

      <section className="bible-verses-header">
        <h1>Bible Verse Image Gallery</h1>
        <p>
          Discover scripture images created by Sathish Paul. Each page is optimized for search engines with descriptive text, captions, and image metadata.
        </p>
      </section>

      <div className="verse-grid">
        {imageSeoData.map((item) => (
          <article key={item.slug} className="verse-card">
            <Link to={`/bible-verses/${item.slug}`} className="verse-link">
              <div className="verse-card-image-wrap">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="verse-card-image"
                />
              </div>
              <div className="verse-card-content">
                <h2>{item.title}</h2>
                <p>{item.shortReference}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}

export default BibleVerses
