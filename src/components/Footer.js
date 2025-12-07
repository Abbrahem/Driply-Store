import { FaTiktok, FaWhatsapp } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-white py-8 mt-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-black mb-4">DRIPLY</h3>
        <div className="flex justify-center gap-6">
          <a 
            href="https://www.tiktok.com/@driply_store.1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl text-black hover:text-gray-600 transition-colors"
          >
            <FaTiktok />
          </a>
          <a 
            href="https://wa.me/201102871570" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl text-black hover:text-gray-600 transition-colors"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
