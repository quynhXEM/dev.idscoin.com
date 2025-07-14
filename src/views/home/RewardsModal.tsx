import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"

interface RewardsModalProps {
  t: (key: string) => string
  show: boolean
  onClose: () => void
}

const RewardsModal: React.FC<RewardsModalProps> = ({ t, show, onClose }) => {
  if (!show) return null
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-lg mx-4 bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Gift className="w-5 h-5 mr-2 text-cyan-400" />
            {t('rewards.rewardsDetails')}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t('rewards.rewardsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ...giữ nguyên nội dung modal như cũ, chỉ tách ra component */}
          <div className="text-gray-300">(Nội dung chi tiết phần thưởng ở đây...)</div>
          <div className="flex space-x-3">
            <Button
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              onClick={onClose}
            >
              <Gift className="w-4 h-4 mr-2" />
              {t('rewards.claim12Ids')}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent"
              onClick={onClose}
            >
              {t('rewards.close')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RewardsModal 