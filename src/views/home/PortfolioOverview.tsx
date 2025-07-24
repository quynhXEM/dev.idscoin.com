"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Wallet, Gift, Clock, Info, Loader2 } from "lucide-react";
import { useUserWallet } from "@/commons/UserWalletContext";
import { Tooltip } from "react-tooltip";
import { StakeHistory } from "./HistoryStake";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, roundDownDecimal } from "@/libs/utils";

interface PortfolioOverviewProps {
  t: (key: string) => string;
  tooltips: { [key: string]: string };
  onShowRewardsModal: () => void;
  setShowNotificationModal: (show: boolean) => void;
  setNotificationData: (data: any) => void;
}

export function PortfolioOverview({
  t,
  tooltips,
  onShowRewardsModal,
  setShowNotificationModal,
  setNotificationData,
}: PortfolioOverviewProps) {
  const { isConnected, connectWallet, balance, account, loading } = useUserWallet();
  const WalletConnectionPrompt = ({
    title,
    icon,
    description,
  }: {
    title: string;
    icon: React.ReactNode;
    description: string;
  }) => (
    <div className="text-center py-8">
      {icon}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <Button
        disabled={loading}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer disabled:cursor-not-allowed"
        onClick={() => connectWallet()}
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wallet className="w-4 h-4 mr-2" />}
        {t("staking.connectWalletBtn")}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Account Overview Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Wallet className="w-5 h-5 mr-2 text-blue-400" />
            <p className="text-2xl">{t("overview.totalAccount")}</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading || !isConnected ? (
            <WalletConnectionPrompt
              title={t("referral.connecttoshow")}
              icon={<Wallet className="w-12 h-12 mx-auto text-gray-500 mb-3" />}
              description={t("referral.connecttoshowinfo")}
            />
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t("overview.totalBalance")}:
                  </span>
                  <span className="font-semibold text-white">
                    {formatNumber(Number(balance.ids) + Number((account as any)?.stake?.stake_in))} IDS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("overview.staked")}:</span>
                  <span className="font-semibold text-blue-400">
                    {formatNumber((account as any)?.stake?.stake_in)} IDS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t("overview.available")}:
                  </span>
                  <span className="font-semibold text-white">
                    {formatNumber(balance.ids)} IDS
                  </span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t("overview.totalRewards")}:
                  </span>
                  <span className="font-semibold text-cyan-400">
                    {formatNumber((account as any)?.stake?.stake_reward)} IDS
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-300 inline-flex gap-1 items-center">
                      {t("overview.stakeProgress")}
                      <Info className="tooltips-progress w-3 h-3 text-gray-500 cursor-help hover:text-blue-400 transition-colors" />
                    </span>
                    <Tooltip
                      anchorSelect=".tooltips-progress"
                      place="top"
                      className="text-wrap outline-none"
                      style={{ maxWidth: 270, zIndex: 100 }}
                    >
                      {tooltips.stakeProgress}
                    </Tooltip>
                  </div>
                  <span className="text-gray-300">
                    {roundDownDecimal(
                      (Number((account as any)?.stake?.stake_in) /
                        Number(
                          Number(balance.ids) + Number((account as any)?.stake?.stake_in)
                        )) *
                      100
                    )}%
                  </span>
                </div>
                <Progress
                  value={
                    (Number((account as any)?.stake?.stake_in) /
                      Number(
                        Number(balance.ids) + Number((account as any)?.stake?.stake_in)
                      )) *
                    100
                  }
                  className="h-2 bg-gray-800"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rewards Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Gift className="w-5 h-5 mr-2 text-cyan-400" />
            <p className="text-2xl">{t("rewards.rewards")}</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading || !isConnected ? (
            <WalletConnectionPrompt
              title={t("referral.connecttoshow")}
              icon={<Gift className="w-12 h-12 mx-auto text-gray-500 mb-3" />}
              description={t("referral.connecttoshowreward")}
            />
          ) : (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-2xl font-bold text-blue-400">
                  {formatNumber((account as any)?.stake?.stake_dont_claw)} IDS
                </div>
                <div className="text-sm text-gray-400">
                  {t("rewards.pending")}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{t("rewards.today")}:</span>
                  <span className="text-blue-400">
                    +{formatNumber((account as any)?.stake?.stake_dont_claw_24h)} IDS
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {t("rewards.last7Days")}:
                  </span>
                  <span className="text-blue-400">
                    +{formatNumber((account as any)?.stake?.stake_dont_claw_week)} IDS
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {t("rewards.last30Days")}:
                  </span>
                  <span className="text-blue-400">
                    +{formatNumber((account as any)?.stake?.stake_dont_claw_month)} IDS
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                disabled={Number((account as any)?.stake?.stake_dont_claw) == 0}
                className="w-full border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-600 hover:text-blue-300 bg-transparent cursor-pointer"
                onClick={onShowRewardsModal}
              >
                <Gift className="w-4 h-4 mr-2" />
                {t("rewards.claimRewards")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stake History Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Clock className="w-5 h-5 mr-2 text-cyan-400" />
            <p className="text-2xl">{t("history.stakeHistory")}</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading || !isConnected ? (
            <WalletConnectionPrompt
              title={t("referral.connecttoshow")}
              icon={<Clock className="w-12 h-12 mx-auto text-gray-500 mb-3" />}
              description={t("referral.connecttoshowhistory")}
            />
          ) : (
            <StakeHistory />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
