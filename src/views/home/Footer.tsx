import React from "react"

interface FooterProps {
  t: (key: string) => string
}

const Footer: React.FC<FooterProps> = ({ t }) => (
  <footer className="border-t border-gray-800 bg-gray-900/50 mt-16">
    <div className="container mx-auto px-4 py-6">
      <div className="text-center text-gray-400 text-sm">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://www.nobody.network"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline transition-colors"
        >
          {t('footer.nobodyNetwork')}
        </a>
        . {t('footer.allRightsReserved')}
      </div>
    </div>
  </footer>
)

export default Footer 