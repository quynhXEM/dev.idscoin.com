"use client"
import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DollarSign, Loader2 } from "lucide-react"
import { useUserStatus } from "@/commons/UserWalletContext"

interface VipUpgradeModalProps {
  t: (key: string) => string
  show: boolean
  onClose: () => void
  vipSelectedChain: string
  setVipSelectedChain: (v: string) => void
  setShowNotificationModal: (show: boolean) => void
  setNotificationData: (data: any) => void
}

const VipUpgradeModal: React.FC<VipUpgradeModalProps> = ({
  t, show, onClose, vipSelectedChain, setVipSelectedChain, setShowNotificationModal, setNotificationData
}) => {
  const { setIsVip } = useUserStatus();
  const [isloading, setIsLoading] = useState<boolean>(false);
  if (!show) return;
  const handleUpgradeVip = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsVip(true)
      onClose()
      setNotificationData({
        title: t('noti.success'),
        message: t('noti.upgradeVipSuccess'),
        type: true
      })
      setShowNotificationModal(true)
      setIsLoading(false)
    }, 1000)
  }
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card className="w-full max-w-md mx-4 bg-gray-900 border-gray-800" onClick={e => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center text-white text-2xl">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-2"></div>
            {t('vip.upgrade')}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t('vip.becomeVip')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-blue-700/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">{t('vip.upgradeCost')}</div>
              <div className="text-sm text-gray-400">{t('vip.upgradeOneTime')}</div>
            </div>
          </div>

          <div>
            <Label className="text-white font-semibold">{t('vip.selectChain')}</Label>
            <Select value={vipSelectedChain} onValueChange={setVipSelectedChain}>
              <SelectTrigger className="w-full mt-2 bg-gray-800 border-gray-700 text-white focus:border-blue-500">
                <SelectValue placeholder={t('vip.selectChain')} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="1" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⟠</span>
                    <div>
                      <div className="font-semibold text-white">{t('staking.ethereum')}</div>
                      <div className="text-xs text-gray-400">{t('staking.ethNetwork')}</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="56" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🟡</span>
                    <div>
                      <div className="font-semibold text-white">{t('staking.bsc')}</div>
                      <div className="text-xs text-gray-400">{t('staking.bnbNetwork')}</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="137" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🟣</span>
                    <div>
                      <div className="font-semibold text-white">{t('staking.polygon')}</div>
                      <div className="text-xs text-gray-400">{t('staking.maticNetwork')}</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="42161" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔵</span>
                    <div>
                      <div className="font-semibold text-white">{t('staking.arbitrum')}</div>
                      <div className="text-xs text-gray-400">{t('staking.arbNetwork')}</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
              <span className="text-sm text-gray-300">{t('vip.currentEarnings')}:</span>
              <span className="font-semibold text-red-400">5%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
              <span className="text-sm text-gray-300">{t('vip.vipEarnings')}:</span>
              <span className="font-semibold text-blue-400">50%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
              <span className="text-sm text-gray-300">{t('vip.increaseEarnings')}:</span>
              <span className="font-semibold text-cyan-400">10x</span>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center">{t('vip.upgradePayment')}</div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent cursor-pointer"
              onClick={onClose}
            >
              {t('vip.cancel')}
            </Button>
            <Button
              disabled={isloading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
              onClick={handleUpgradeVip}
            >
              {isloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <DollarSign className="w-4 h-4 mr-2" />}
              {t('vip.upgrade100')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VipUpgradeModal 