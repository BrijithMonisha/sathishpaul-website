import { useEffect } from 'react'
import './ParticlesBackground.css'

const PARTICLES_SRC = '/particles.js'

function loadParticlesScript() {
  if (window.particlesJS) return Promise.resolve()

  const existing = document.querySelector(`script[src="${PARTICLES_SRC}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', reject, { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = PARTICLES_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = reject
    document.body.appendChild(script)
  })
}

const ParticlesBackground = () => {
  useEffect(() => {
    let cancelled = false

    loadParticlesScript()
      .then(() => {
        if (cancelled || !window.particlesJS) return

        window.particlesJS('particles-js', {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: '#4A90E2'
            },
            shape: {
              type: 'circle'
            },
            opacity: {
              value: 0.5,
              random: false
            },
            size: {
              value: 3,
              random: true
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#4A90E2',
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'repulse'
              },
              onclick: {
                enable: true,
                mode: 'push'
              },
              resize: true
            }
          },
          retina_detect: true
        })
      })
      .catch((error) => {
        console.warn('Particles failed to load:', error)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return <div id="particles-js"></div>
}

export default ParticlesBackground
