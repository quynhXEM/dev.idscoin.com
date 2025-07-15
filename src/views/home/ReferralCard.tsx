import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Gift, Shield, Copy, UserPlus, Share2 } from "lucide-react"

interface ReferralCardProps {
  t: (key: string) => string
  membershipType: "free" | "vip"
  setShowVipModal: (v: boolean) => void
  referralLink: string
  copyReferralLink: () => void
  copied: boolean
  setShowCommissionModal: (v: boolean) => void
}

const ReferralCard: React.FC<ReferralCardProps> = ({
  t, membershipType, setShowVipModal, referralLink, copyReferralLink, copied, setShowCommissionModal
}) => (
  <Card className="bg-gray-900 border-gray-800">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center text-white">
          <Share2 className="w-5 h-5 mr-2 text-blue-400" />
          {t('referral.introduce')}
        </CardTitle>
        <Badge
          variant={membershipType === "vip" ? "default" : "secondary"}
          className={
            membershipType === "vip"
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-200"
          }
        >
          {membershipType === "vip" ? "VIP" : "Miễn phí"}
        </Badge>
      </div>
      <CardDescription className="text-gray-400">
        {membershipType === "free"
          ? t('referral.earn5')
          : t('referral.earn50')}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {membershipType === "free" && (
        <div className="p-4 bg-gray-800 rounded-lg border border-blue-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-blue-300">{t('vip.upgrade')}</div>
              <div className="text-sm text-blue-400/80">{t('vip.upgrade50')}</div>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
              onClick={() => setShowVipModal(true)}
            >
              {t('vip.upgrade100')}
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-800 rounded-lg border-2 border-dashed border-blue-600/50">
        <div className="text-center mb-3">
          <UserPlus className="w-8 h-8 mx-auto text-blue-400 mb-2" />
          <div className="text-sm font-medium text-blue-300">{t('referral.yourLink')}</div>
          <div className="text-xs text-gray-400">{t('referral.earn', { percent: membershipType === "free" ? "5%" : "50%" })}</div>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            value={referralLink}
            readOnly
            className="text-xs bg-gray-700 border-gray-600 text-gray-300"
          />
          <Button
            size="sm"
            onClick={copyReferralLink}
            className={copied ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}
          >
            {copied ? (
              <>
                <Shield className="w-4 h-4 mr-1" />
                {t('referral.copied')}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                {t('referral.copy')}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-lg font-bold text-blue-400">12</div>
          <div className="text-xs text-gray-400">{t('referral.friendsJoined')}</div>
        </div>
        <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-lg font-bold text-emerald-400">
            ${membershipType === "free" ? "22.84" : "228.35"}
          </div>
          <div className="text-xs text-gray-400">{t('referral.usdtEarnings')}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{t('referral.todayEarnings')}:</span>
          <span className="text-emerald-400">+${membershipType === "free" ? "0.62" : "6.15"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{t('referral.monthlyEarnings')}:</span>
          <span className="text-emerald-400">+${membershipType === "free" ? "14.23" : "142.25"}</span>
        </div>
      </div>

      <div className="pt-2">
        <Button
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-600 hover:text-blue-300 bg-transparent cursor-pointer"
          size="sm"
          onClick={() => setShowCommissionModal(true)}
        >
          <Gift className="w-4 h-4 mr-2" />
          {t('referral.viewDetails')}
        </Button>
      </div>
    </CardContent>
  </Card>
)

export default ReferralCard 