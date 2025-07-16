import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RewardsModalProps {
  t: (key: string) => string;
  show: boolean;
  onClose: () => void;
  setShowNotificationModal: (show: boolean) => void;
  setNotificationData: (data: any) => void;
}

const RewardsModal: React.FC<RewardsModalProps> = ({ t, show, onClose, setShowNotificationModal, setNotificationData }) => {
  if (!show) return null;
  const [isloading, setIsLoading] = useState<boolean>(false);
  const handleClaimRewards = () => {
    setIsLoading(true);
    setTimeout(() => {
      onClose()
      setNotificationData({
        title: t('noti.success'),
        message: t('noti.claimRewardsSuccess', { amount: 12.34 }),
        type: true
      })
      setShowNotificationModal(true)
      setIsLoading(false)
    }, 1000)
  }
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={() => onClose()}
    >
      <Card
        className="w-full max-w-lg mx-4 bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Gift className="w-5 h-5 mr-2 text-cyan-400" />
            {t("rewards.rewardsDetails")}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t("rewards.rewardsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Rewards Status */}
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">
                {t("rewards.currentRewards")}
              </h3>
              <Badge
                variant="secondary"
                className="bg-cyan-700 text-cyan-300 hover:bg-cyan-600 hover:text-cyan-200"
              >
                {t("rewards.earning")}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  12.34 {t("staking.ids")}
                </div>
                <div className="text-sm text-gray-400">
                  {t("rewards.pending")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  850.00 {t("staking.ids")}
                </div>
                <div className="text-sm text-gray-400">
                  {t("rewards.staking")}
                </div>
              </div>
            </div>
          </div>

          {/* Rewards History */}
          <div>
            <h3 className="font-semibold text-white mb-3">
              {t("rewards.rewardsHistory")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <div className="font-medium text-white">
                    {t("rewards.today")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("rewards.from850Ids")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">
                    +2.45 {t("staking.ids")}
                  </div>
                  <div className="text-xs text-gray-500">~$2.45</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <div className="font-medium text-white">
                    {t("rewards.last7Days")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("rewards.earned")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">
                    +17.23 {t("staking.ids")}
                  </div>
                  <div className="text-xs text-gray-500">~$17.23</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <div className="font-medium text-white">
                    {t("rewards.last30Days")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("rewards.earned")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">
                    +73.89 {t("staking.ids")}
                  </div>
                  <div className="text-xs text-gray-500">~$73.89</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <div className="font-medium text-white">
                    {t("rewards.total")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("rewards.fromStart")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">
                    +127.45 {t("staking.ids")}
                  </div>
                  <div className="text-xs text-gray-500">~$127.45</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stake Positions */}
          <div>
            <h3 className="font-semibold text-white mb-3">
              {t("rewards.currentPositions")}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      500 {t("staking.ids")}
                    </div>
                    <div className="text-sm text-gray-400">
                      {t("history.90DaysApy")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">
                    +1.10 {t("staking.ids")}/day
                  </div>
                  <div className="text-xs text-gray-500">
                    {t("rewards.65DaysLeft")}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      350 {t("staking.ids")}
                    </div>
                    <div className="text-sm text-gray-400">
                      {t("history.30DaysApy")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">
                    +0.48 {t("staking.ids")}/day
                  </div>
                  <div className="text-xs text-gray-500">
                    {t("rewards.5DaysLeft")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Information */}
          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
            <div className="text-center">
              <div className="text-blue-300 font-semibold mb-2">
                {t("rewards.claimInformation")}
              </div>
              <div className="text-sm text-blue-200 mb-3 space-y-1">
                <div>{t("rewards.dailyEarnings")}</div>
                <div>{t("rewards.canClaimAnytime")}</div>
                <div>{t("rewards.noTransactionFee")}</div>
                <div>{t("rewards.rewardsWillBeAdded")}</div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              disabled={isloading}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 cursor-pointer"
              onClick={handleClaimRewards}
            >
              {isloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Gift className="w-4 h-4 mr-2" />}
              {t("rewards.claim12Ids")}
            </Button>
            <Button
              variant="outline"
              disabled={isloading}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent cursor-pointer"
              onClick={() => onClose()}
            >
              {t("rewards.close")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsModal;
