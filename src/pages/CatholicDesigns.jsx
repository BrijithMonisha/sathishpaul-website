import { useState } from 'react'
import CategorySidebar from '../components/CategorySidebar'
import CatholicDesignsGallery from '../components/CatholicDesignsGallery'
import ImageSEO from '../components/ImageSEO'
import SEO from '../components/SEO'
import './CatholicDesignsPage.css'

const categories = [
  { id: 'common', title: 'Common' },
  { id: 'jesus', title: 'Jesus' },
  { id: 'mary', title: 'Mary' },
  { id: 'saints', title: 'Saints' },
  { id: 'eucharist', title: 'Eucharist' },
  { id: 'church', title: 'Church' },
  { id: 'scripture', title: 'Scripture' }
]

const CatholicDesigns = () => {
  const [activeCategory, setActiveCategory] = useState('common')
  const [categoryImages, setCategoryImages] = useState([])

  const allImages = categoryImages.map((image, index) => ({
    src: image?.src || '',
    name: image?.name || `Catholic Design ${index + 1}`,
    date: '',
    description: image?.name || `Catholic Design image in ${activeCategory}`,
    textContent: image?.name || ''
  }))

  const handleImagesLoaded = (images) => {
    setCategoryImages(images)
  }

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId)
  }

  const categoryTitle = categories.find(c => c.id === activeCategory)?.title || 'Catholic Designs'
  const pageTitle = `Catholic Design Images in English & Tamil - ${categoryTitle} | Free Downloads by Sathish Paul SDB`
  const pageDescription = `Free Catholic design images and Christian art downloads in English & Tamil. ${categoryTitle} category featuring high-quality Catholic designs, Bible verse illustrations, and faith-based visuals by Sathish Paul SDB.`
  
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `Catholic Designs - ${categoryTitle}`,
    "description": `Catholic designs and Catholic Design images in ${categoryTitle} category`,
    "url": typeof window !== 'undefined' ? window.location.href : 'https://www.sathishpaul.net/catholic-designs',
    "inLanguage": ["en", "ta"],
    "creator": {
      "@type": "Person",
      "name": "Sathish Paul SDB"
    },
    "about": {
      "@type": "Thing",
      "name": "Catholic Designs"
    }
  }

  return (
    <div className="catholic-designs-page">
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`Catholic Design, Catholic Designs, Catholic Art, Christian Art, ${categoryTitle} Catholic Art, Bible Verse Art, Catholic Graphics, Christian Graphics, Catholic Visuals, Sathish Paul SDB, Catholic Art Downloads, Christian Art Downloads, Catholic Design Images`}
        image="https://www.sathishpaul.net/images/Logo 3.png"
        schema={pageSchema}
      />
      <ImageSEO
        images={allImages}
        pageUrl={typeof window !== 'undefined' ? window.location.href : 'https://www.sathishpaul.net/catholic-designs'}
        pageTitle={`Catholic Designs - ${categoryTitle}`}
      />
      <div className="page-content">
        <CategorySidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />

        <CatholicDesignsGallery
          category={activeCategory}
          onImagesLoaded={handleImagesLoaded}
        />
      </div>
    </div>
  )
}

export default CatholicDesigns

