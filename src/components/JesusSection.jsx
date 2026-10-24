import { useState, useEffect } from 'react'
import './JesusSection.css'

const categories = [
  { id: 'common', icon: 'fa-star', title: 'Common', desc: 'Shared Faith' },
  { id: 'jesus', icon: 'fa-cross', title: 'Jesus', desc: 'Son of God' },
  { id: 'mary', icon: 'fa-crown', title: 'Mary', desc: 'Mother of God' },
  { id: 'saints', icon: 'fa-hands-praying', title: 'Saints', desc: 'Holy Witnesses' },
  { id: 'eucharist', icon: 'fa-bread-slice', title: 'Eucharist', desc: 'Body of Christ' },
  { id: 'church', icon: 'fa-church', title: 'Church', desc: 'House of God' },
  { id: 'scripture', icon: 'fa-scroll', title: 'Scripture', desc: 'Word of God' }
]

const JesusSection = ({ openLightbox }) => {
  const [activeCategory, setActiveCategory] = useState(null)
  const [categoryImages, setCategoryImages] = useState([])

  // Load images json
  const loadCategoryImages = async (categoryId) => {
    try {
      const res = await fetch('/galleryImages.json')
      const data = await res.json()
      setCategoryImages(data[categoryId] || [])
    } catch (err) {
      console.error("Error loading images:", err)
    }
  }

  const handleCategoryClick = async (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    setActiveCategory(category)
    await loadCategoryImages(categoryId)
  }

  const closeCategoryGallery = () => {
    setActiveCategory(null)
    setCategoryImages([])
  }

  return (
    <section className="jesus-section" id="jesus">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon"><i className="fas fa-praying-hands"></i></span>
          Sacred Gallery
          <span className="title-underline"></span>
        </h2>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-icon-wrapper">
              <i className={`fas ${category.icon}`}></i>
              <div className="icon-glow"></div>
            </div>
            <h3 className="category-title">{category.title}</h3>
            <p className="category-desc">{category.desc}</p>
          </div>
        ))}
      </div>

      {activeCategory && (
        <div className={`category-gallery active`}>
          <button className="gallery-close" onClick={closeCategoryGallery}>
            <i className="fas fa-times"></i>
          </button>
          <h3 className="gallery-category-title">{activeCategory.title} - {activeCategory.desc}</h3>

          <div className="category-images">
            {categoryImages.map((image, index) => (
              <div
                key={index}
                className="gallery-item"
                onClick={() => openLightbox(image.src, image.title, categoryImages, index)}
              >
                <img src={image.src} alt={image.title} loading="lazy" />
                <div className="gallery-overlay">
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default JesusSection