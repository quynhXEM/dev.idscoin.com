import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, BarChart3, Users, Lock, Info } from "lucide-react";
import useWindowSize from "@/hooks/useWindownSide";
import { Button } from "@/components/ui/button";
import { Tooltip } from "react-tooltip";

interface HeroStatsProps {
  t: (key: string) => string;
  tooltips: { [key: string]: string };
}

const HeroStats: React.FC<HeroStatsProps> = ({ t, tooltips }) => {
  const { width } = useWindowSize();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 mt-8">
      {/* TVL */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardContent className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-gray-400 text-sm inline-flex flex-wrap text-wrap items-center gap-1">
                  {t("stats.totalTvl")}
                  <Info className="tooltips-tvl w-3 h-3 text-gray-500 cursor-help hover:text-blue-400 transition-colors" />
                </p>
                <Tooltip
                  anchorSelect=".tooltips-tvl"
                  place="top"
                  className="text-wrap outline-none"
                  style={{ maxWidth: width }}
                >
                  {tooltips.tvl}
                </Tooltip>
              </div>
              <p className="text-2xl font-bold">$2.4M</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>
      {/* APY */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardContent className="px-6">
          <div className="flex items-center justify-between">
            <div className="">
              <div className="items-center inline-flex gap-1 mb-1">
                <p className="text-gray-400 text-sm inline-flex flex-wrap text-wrap items-center gap-1">
                  {t("stats.averageApy")}
                  <Info className="tooltips-apy w-3 h-3 text-gray-500 cursor-help hover:text-blue-400 transition-colors" />
                </p>
                <Tooltip
                  anchorSelect=".tooltips-apy"
                  place="top"
                  className="text-wrap outline-none"
                  style={{ maxWidth: width }}
                >
                  {tooltips.apy}
                </Tooltip>
              </div>
              <p className="text-2xl font-bold">13.5%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-cyan-400" />
          </div>
        </CardContent>
      </Card>
      {/* Users */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardContent className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
              <p className="text-gray-400 text-sm inline-flex flex-wrap text-wrap items-center gap-1">
                  {t("stats.users")}
                  <Info className="tooltips-users w-3 h-3 text-gray-500 cursor-help hover:text-blue-400 transition-colors" />
                </p>
                <Tooltip
                  anchorSelect=".tooltips-users"
                  place="top"
                  className="text-wrap outline-none"
                  style={{ maxWidth: width }}
                >
                  {tooltips.users}
                </Tooltip>
              </div>
              <p className="text-2xl font-bold">12,847</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      {/* Locked */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardContent className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-gray-400 text-sm inline-flex flex-wrap text-wrap items-center gap-1">
                  {t("stats.locked")}
                  <Info className="tooltips-locked w-3 h-3 text-gray-500 cursor-help hover:text-blue-400 transition-colors" />
                </p>
                <Tooltip
                  anchorSelect=".tooltips-locked"
                  place="top"
                  className="text-wrap outline-none"
                  style={{ maxWidth: width }}
                >
                  {tooltips.locked}
                </Tooltip>
              </div>
              <p className="text-2xl font-bold">8.2M</p>
            </div>
            <Lock className="w-8 h-8 text-cyan-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroStats;
