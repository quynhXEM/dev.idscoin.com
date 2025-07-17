import React from "react"
import LocaleDropdown from "@/commons/LocaleDropdown"
import { useAppMetadata } from "@/commons/AppMetadataContext";

interface HeaderProps {
  t: (key: string) => string
}

const Header: React.FC<HeaderProps> = ({ t }) => {
  const { name, icon } = useAppMetadata();

  return (
    <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${icon}/ids-coin.svg`} alt={name} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {name}
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
}

export default Header 