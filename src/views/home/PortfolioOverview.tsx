import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Gift, Clock, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useWindowSize from "@/hooks/useWindownSide";

interface PortfolioOverviewProps {
  t: (key: string) => string;
  tooltips: { [key: string]: string };
  setShowRewardsModal: (show: boolean) => void;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  t,
  tooltips,
  setShowRewardsModal,
}) => {
  const { width } = useWindowSize();
  
  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Wallet className="w-5 h-5 mr-2 text-blue-400" />
            {t("overview.totalAccount")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">
                {t("overview.totalBalance")}:
              </span>
              <span className="font-semibold text-white">
                1,250.00 {t("staking.ids")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t("overview.staked")}:</span>
              <span className="font-semibold text-blue-400">
                850.00 {t("staking.ids")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t("overview.available")}:</span>
              <span className="font-semibold text-white">
                400.00 {t("staking.ids")}
              </span>
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex justify-between">
              <span className="text-gray-400">
                {t("overview.totalRewards")}:
              </span>
              <span className="font-semibold text-cyan-400">
                127.45 {t("staking.ids")}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-sm mb-2">
              <div className="flex items-center gap-1">
                <span className="text-gray-300">
                  {t("overview.stakeProgress")}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="p-1 -m-1 cursor-help transition-colors rounded">
                      <Info className="w-3 h-3 text-gray-500 hover:text-blue-400 transition-colors" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="text-wrap"
                    style={{ maxWidth: width }}
                  >
                    {tooltips.stakeProgress}
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-gray-300">68%</span>
            </div>
            <Progress value={68} className="h-2 bg-gray-800" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Gift className="w-5 h-5 mr-2 text-cyan-400" />
            {t("rewards.rewards")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">
              12.34 {t("staking.ids")}
            </div>
            <div className="text-sm text-gray-400">{t("rewards.pending")}</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{t("rewards.today")}:</span>
              <span className="text-blue-400">+2.45 {t("staking.ids")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{t("rewards.last7Days")}:</span>
              <span className="text-blue-400">+17.23 {t("staking.ids")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{t("rewards.last30Days")}:</span>
              <span className="text-blue-400">+73.89 {t("staking.ids")}</span>
            </div>
          </div>

          <Button
            onClick={() => setShowRewardsModal(true)}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-600 hover:text-blue-300 bg-transparent cursor-pointer"
          >
            <Gift className="w-4 h-4 mr-2" />
            {t("rewards.claimRewards")}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Clock className="w-5 h-5 mr-2 text-cyan-400" />
            {t("history.stakeHistory")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div>
                <div className="font-medium text-white">
                  500 {t("staking.ids")}
                </div>
                <div className="text-sm text-gray-400">
                  {t("history.90DaysApy")}
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
              >
                <Shield className="w-3 h-3 mr-1" />
                {t("history.locked")}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div>
                <div className="font-medium text-white">
                  350 {t("staking.ids")}
                </div>
                <div className="text-sm text-gray-400">
                  {t("history.30DaysApy")}
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-blue-600 text-blue-400"
              >
                <Clock className="w-3 h-3 mr-1" />
                {t("history.5DaysLeft")}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;
