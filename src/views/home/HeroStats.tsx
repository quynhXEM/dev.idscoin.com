import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, BarChart3, Users, Lock, Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import useWindowSize from "@/hooks/useWindownSide";

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
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-gray-400 text-sm">{t("stats.totalTvl")}</p>
                <Tooltip >
                  <TooltipTrigger asChild>
                    <span className="p-1 -m-1 cursor-help transition-colors rounded">
                      <Info className="w-3 h-3 text-gray-500 hover:text-blue-400 transition-colors" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-wrap" style={{ maxWidth: width}}>
                    {tooltips.tvl}
                  </TooltipContent>
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
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-gray-400 text-sm">{t("stats.averageApy")}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="p-1 -m-1 cursor-help transition-colors rounded">
                      <Info className="w-3 h-3 text-gray-500 hover:text-blue-400 transition-colors" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-wrap" style={{ maxWidth: width}}>
                    {tooltips.apy}
                  </TooltipContent>
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
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-gray-400 text-sm">{t("stats.users")}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="p-1 -m-1 cursor-help transition-colors rounded">
                      <Info className="w-3 h-3 text-gray-500 hover:text-blue-400 transition-colors" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-wrap" style={{ maxWidth: width}}>
                    {tooltips.users}
                  </TooltipContent>
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
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-gray-400 text-sm">{t("stats.locked")}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="p-1 -m-1 cursor-help transition-colors rounded">
                      <Info className="w-3 h-3 text-gray-500 hover:text-blue-400 transition-colors" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-wrap" style={{ maxWidth: width}}>
                    {tooltips.locked}
                  </TooltipContent>
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
