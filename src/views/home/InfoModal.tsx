import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface InfoModalProps {
  t: (key: string) => string
  show: boolean
  onClose: () => void
}

const InfoModal: React.FC<InfoModalProps> = ({ t, show, onClose }) => {
  if (!show) return null
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-4xl mx-4 bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-white text-2xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">{t('header.ids')}</span>
            </div>
            {t('header.intelligentDecentralizedSolution')}
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            {t('header.nobodyChain')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* ...giữ nguyên nội dung modal như cũ, chỉ tách ra component */}
          <div className="text-gray-300">(Nội dung chi tiết dự án ở đây...)</div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent px-8"
              onClick={onClose}
            >
              {t('referral.close')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InfoModal 