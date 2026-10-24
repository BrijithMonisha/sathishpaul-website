import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import './Home.css'

const slides = [
  {
    image: '/images/home web band copy 2.jpg.jpeg',
    alt: 'Bringing the Gospel alive through art & design',
  },
  {
    image: '/images/GT web band copy.jpg.jpeg',
    mobileImage: '/images/GT web band for mobile.jpg.jpeg',
    alt: 'Gospeltoons Bible story illustrations',
  },
  {
    image: '/images/CD web band copy.jpg.jpeg',
    mobileImage: '/images/CD web band for mobile.jpg.jpeg',
    alt: 'Catholic Designs artwork collection',
  },
]

const categories = [
  { title: 'Gospeltoons English New', image: '/images/gt eng.png', to: '/gospeltoons-eng-new' },
  { title: 'Gospeltoons Tamil New', image: '/images/gt tam.png', to: '/gospeltoons-tamil-new' },
  { title: 'Catholic Designs', image: '/images/Logo 3.png', to: '/catholic-designs' },
  { title: 'Strokes', image: '/images/Strokes.png', to: '/strokes' },
  { title: 'Gospeltoons English', image: '/images/Logo 1.png', to: '/gospeltoons-eng' },
  { title: 'Gospeltoons Tamil', image: '/images/Logo 2.png', to: '/gospeltoons-tamil' },
]

const downloads = [
  {
    title: 'Gospeltoons English New',
    href: '/gospeltoons-eng-new',
  },
  {
    title: 'Gospeltoons Tamil New',
    href: '/gospeltoons-tamil-new',
  },
]

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isBiographyOpen, setIsBiographyOpen] = useState(false)
  const touchStart = useRef(null)

  useEffect(() => {
    if (isBiographyOpen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [isBiographyOpen])

  const changeSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length)
  }

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return
    const distance = touchStart.current - event.changedTouches[0].clientX
    if (Math.abs(distance) > 45) changeSlide(distance > 0 ? 1 : -1)
    touchStart.current = null
  }

  const toggleBiography = () => {
    setActiveSlide(0)
    setIsBiographyOpen((current) => !current)
  }

  return (
    <main className="home-page">
      <SEO
        title="Gospeltoons & Catholic Designs by Sathish Paul SDB | Free Downloads"
        description="Free Catholic Gospeltoons and Christian art downloads in English and Tamil."
        image="https://www.sathishpaul.net/images/mini.png"
      />

      <section
        className={`hero-carousel ${activeSlide === 0 ? 'intro-active' : 'image-active'}`}
        aria-label="Featured artwork"
        onTouchStart={(event) => { touchStart.current = event.touches[0].clientX }}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`hero-slides ${isBiographyOpen ? 'biography-open' : ''}`}>
          {slides.map((slide, index) => (
            <article
              key={slide.image}
              className={`hero-slide ${index === 0 ? 'intro-slide' : 'image-slide'} ${index === activeSlide ? 'active' : ''}`}
              aria-hidden={index !== activeSlide}
            >
              {index === 0 ? (
                <div className={`intro-hero ${isBiographyOpen ? 'expanded' : ''}`}>
                  <div className={`intro-hero-copy ${isBiographyOpen ? 'expanded' : ''}`}>
                    {isBiographyOpen ? (
                      <div className="inline-biography">
                        <h2>Hi, I&apos;m Sathish Paul</h2>
                        <p>
                          I&apos;m a Salesian priest who loves people, stories, colours, and the simple beauty of the Gospel.
                          I believe that faith becomes more powerful when it is expressed with joy and creativity, and that
                          is why I create art, designs, and Gospeltoons - using simple drawings and visuals to make Scripture
                          and Christian content come alive for every heart.
                        </p>
                        <p>
                          Through my ministry, I meet young people, religious, and families whose dreams, struggles, and
                          laughter inspire me every day. I try to respond with art, words, and hope. I enjoy graphic designing
                          and creating creative Catholic visuals that support parishes and youth groups, helping them
                          communicate faith in a beautiful and meaningful way.
                        </p>
                        <p>
                          My mission is to animate, inspire, and communicate the Lord Jesus and His Gospel in ways that feel
                          close, warm, and alive. I believe that even one small drawing, one simple design, or a short message
                          can touch someone deeply and brighten their day. If you love faith, creativity, spirituality, or
                          simply need a moment of positivity and renewal, you&apos;re in the right place. Welcome - let&apos;s
                          grow, reflect, dream, and draw hope together.
                        </p>
                      </div>
                    ) : (
                      <>
                        <span className="welcome-label">Welcome</span>
                        <h1>
                          <span className="mobile-title-line">Bringing</span>{' '}
                          <span className="mobile-title-line">the Gospel</span>{' '}
                          <span className="mobile-title-line">alive through</span>{' '}
                          <strong>Art &amp; Design</strong>
                        </h1>
                        <p>
                          Hi, I&apos;m Sathish Paul - a Salesian priest who loves people, stories,
                          colours, and the simple beauty of the Gospel.
                        </p>
                      </>
                    )}
                    <button className="read-more-hero" onClick={toggleBiography}>
                      {isBiographyOpen ? 'Read less' : 'Read more'} <span aria-hidden="true">-&gt;</span>
                    </button>
                  </div>
                  <div className="intro-hero-art">
                    <img
                      src="/images/sp face vector website copy (1).png"
                      alt="Portrait illustration of Sathish Paul SDB"
                    />
                  </div>
                </div>
              ) : (
                <div className="banner-picture">
                  <img className="banner-image banner-image-desktop" src={slide.image} alt={slide.alt} />
                  <img className="banner-image banner-image-mobile" src={slide.mobileImage} alt="" aria-hidden="true" />
                </div>
              )}
            </article>
          ))}
        </div>

        <button className="carousel-arrow previous" onClick={() => changeSlide(-1)} aria-label="Previous slide">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 4l8 8-8 8" />
          </svg>
        </button>
        <button className="carousel-arrow next" onClick={() => changeSlide(1)} aria-label="Next slide">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 4l8 8-8 8" />
          </svg>
        </button>
        <div className="carousel-dots" aria-label="Choose a slide">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              className={index === activeSlide ? 'active' : ''}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeSlide}
            />
          ))}
        </div>
      </section>

      <section className="home-content" id="categories">
        <div className="category-grid">
          {categories.map((category) => (
            <Link className="category-card" to={category.to} key={category.title}>
              <img src={category.image} alt={`${category.title} logo`} />
              <div className="category-card-footer">
                <span>{category.title}</span>
                <span className="card-arrow" aria-hidden="true">-&gt;</span>
              </div>
            </Link>
          ))}
        </div>

        <section className="download-panel">
          <div className="download-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img">
              <path d="M24 7v23m0 0 9-9m-9 9-9-9M9 31v8h30v-8" />
            </svg>
          </div>
          <div className="download-copy">
            <h2>Download & Share</h2>
            <p>Explore and download Gospeltoons and other resources to inspire faith and spread joy.</p>
          </div>
          <div className="download-list">
            {downloads.map((download) => (
              <Link to={download.href} key={download.title}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 15v5h14v-5" />
                </svg>
                {download.title}
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default Home
