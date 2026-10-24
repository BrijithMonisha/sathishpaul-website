import './WhatsAppButton.css'

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/919655446908" 
      className="whatsapp-float" 
      target="_blank" 
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  )
}

export default WhatsAppButton

