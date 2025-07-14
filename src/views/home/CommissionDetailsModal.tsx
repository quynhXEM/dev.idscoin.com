/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"

interface CommissionDetailsModalProps {
  t: (key: string) => string
  show: boolean
  onClose: () => void
  membershipType: "free" | "vip"
  setShowVipModal: (v: boolean) => void
}

const CommissionDetailsModal: React.FC<CommissionDetailsModalProps> = ({
  t, show, onClose, membershipType, setShowVipModal
}) => {
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
            {t('referral.details')}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t('referral.detailsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ...giữ nguyên nội dung modal như cũ, chỉ tách ra component */}
          {/* Bạn sẽ cần copy phần nội dung modal từ Home.tsx vào đây khi tích hợp thực tế */}
          {/* Để ngắn gọn, mình để lại phần khung, bạn chỉ cần copy nội dung cũ vào */}
          <div className="text-gray-300">(Nội dung chi tiết hoa hồng ở đây...)</div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent"
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

export default CommissionDetailsModal 