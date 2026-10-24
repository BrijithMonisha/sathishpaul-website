import { useEffect, useRef } from 'react'
import './HeroSection.css'

const HeroSection = () => {
  const textRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
          }
        })
      },
      { threshold: 0.1 }
    )

    textRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const descriptions = [
    "A Salesian priest combining professional art and graphic design with pastoral ministry to make the Gospel accessible to all.",
    "Sathish Paul SDB serves the Salesian Province of Chennai, bringing a unique approach to evangelization through visual storytelling.",
    "His flagship project, Gospeltoons, transforms daily Gospel readings into engaging illustrations in both English and Tamil.",
    "Recognized internationally in 2023 as one of only four designers worldwide selected by the Rector Major to create poster proposals for the Strenna message.",
    "His work shows how art and aesthetics can powerfully engage and inspire young people.",
    "Through digital presence and creative ministry, Sathish Paul makes timeless truths newly visible to contemporary eyes — meeting young people where they are and speaking their native visual language."
  ]

  return (
    <section className="hero-section" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-image-container">
          <div className="hero-image-frame">
            <img 
              src="/images/Profile1.jpeg" 
              alt="Sathish Paul SDB" 
              className="hero-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x500/4A90E2/ffffff?text=Rev.+Fr.+Sathish+Paul+SDB'
              }}
            />
            <div className="image-glow"></div>
          </div>
        </div>
        <div className="hero-text">
          <h2 className="hero-title">
            <span className="title-line">A Voice of</span>
            <span className="title-line highlight">Faith & Creativity</span>
          </h2>
          <div className="hero-description">
            {descriptions.map((text, index) => (
              <p
                key={index}
                ref={(el) => (textRefs.current[index] = el)}
                className={`fade-in-up delay-${index}`}
              >
                {text.includes('Gospeltoons') ? (
                  <>
                    {text.split('Gospeltoons')[0]}
                    <strong>Gospeltoons</strong>
                    {text.split('Gospeltoons')[1]}
                  </>
                ) : text.includes('four designers worldwide') ? (
                  <>
                    {text.split('four designers worldwide')[0]}
                    <strong>four designers worldwide</strong>
                    {text.split('four designers worldwide')[1]}
                  </>
                ) : (
                  text
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <span>Scroll Down</span>
        <i className="fas fa-chevron-down"></i>
      </div>
    </section>
  )
}

export default HeroSection

