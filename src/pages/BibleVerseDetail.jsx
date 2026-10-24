import { useParams } from 'react-router-dom'
import imageSeoData from '../data/imageSeoData.js'
import SEO from '../components/SEO.jsx'
import './BibleVerses.css'

const BibleVerseDetail = () => {
  const { slug } = useParams()
  const verse = imageSeoData.find((item) => item.slug === slug)

  if (!verse) {
    return (
      <div className="bible-verses-page page-container">
        <h1>Verse Not Found</h1>
      </div>
    )
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `https://www.sathishpaul.net${verse.image}`,
    creator: {
      '@type': 'Person',
      name: 'Sathish Paul SDB'
    },
    description: verse.description,
    caption: verse.caption,
    license: 'https://www.sathishpaul.net'
  }

  return (
    <div className="bible-verse-detail page-container">
      <SEO
        title={verse.title}
        description={verse.description}
        keywords={verse.keywords}
        image={`https://www.sathishpaul.net${verse.image}`}
        canonical={`https://www.sathishpaul.net/bible-verses/${verse.slug}`}
        type="article"
        robots="index,follow,max-image-preview:large"
        schema={schema}
      />

      <article className="verse-detail-card verse-detail-image-only">
        <figure className="verse-figure">
          <img src={verse.image} alt={verse.alt} className="verse-detail-image" />
        </figure>
      </article>
    </div>
  )
}

export default BibleVerseDetail
