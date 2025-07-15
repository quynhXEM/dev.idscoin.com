import React from "react"
import LocaleDropdown from "@/commons/LocaleDropdown"

interface HeaderProps {
  t: (key: string) => string
}

const Header: React.FC<HeaderProps> = ({ t }) => (
  <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
    <div className="mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">{t('header.ids')}</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {t('header.idsCoin')}
          </h1>
        </div>
        <div className="flex items-right space-x-4">
          <LocaleDropdown />
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </div>
  </header>
)

export default Header 