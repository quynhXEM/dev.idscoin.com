import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, BarChart3, Users, Lock, Info } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { useAppMetadata } from "@/commons/AppMetadataContext";

interface HeroStatsProps {
  t: (key: string) => string;
  tooltips: { [key: string]: string };
}

// Custom hook để animate số tăng dần
function useAnimatedNumber(target: number, duration: number = 500) {
  const [value, setValue] = useState(Number(target) || 0);
  useEffect(() => {
    let start: number | null = null;
    let frame: number;
    const initial = value;
    const change = Number(target) - initial;
    if (change === 0) return;
    function animate(timestamp: number) {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(initial + change * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setValue(Number(target));
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);
  return value;
}

const HeroStats: React.FC<HeroStatsProps> = ({ t, tooltips }) => {
  const { tvl, apy, users, locked } = useAppMetadata();

  // Animated values
  const animatedTvl = useAnimatedNumber(tvl || 0);
  const animatedApy = useAnimatedNumber(apy || 0);
  const animatedUsers = useAnimatedNumber(users || 0);
  const animatedLocked = useAnimatedNumber(locked || 0);

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
                  style={{ maxWidth: 270, zIndex: 100 }}
                >
                  {tooltips.tvl}
                </Tooltip>
              </div>
              <p className="text-2xl font-bold">${animatedTvl.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
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
                  style={{ maxWidth: 270, zIndex: 100 }}
                >
                  {tooltips.apy}
                </Tooltip>
              </div>
              <p className="text-2xl font-bold">{animatedApy.toFixed(2)}%</p>
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
                  style={{ maxWidth: 270, zIndex: 100 }}
                >
                  {tooltips.users}
                </Tooltip>
              </div>
              <p className="text-2xl font-bold">{animatedUsers.toLocaleString()}</p>
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
                  style={{ maxWidth: 270, zIndex: 100 }}
                >
                  {tooltips.locked}
                </Tooltip>
              </div>
              <p className="text-2xl font-bold">{animatedLocked.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
            </div>
            <Lock className="w-8 h-8 text-cyan-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroStats;
