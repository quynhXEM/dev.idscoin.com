"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Wallet, Gift, Clock, Shield, Info } from "lucide-react";
import { useUserWallet } from "@/commons/UserWalletContext";
import useWindowSize from "@/hooks/useWindownSide";
import { Tooltip } from "react-tooltip";

interface PortfolioOverviewProps {
  t: (key: string) => string;
  tooltips: { [key: string]: string };
  onShowRewardsModal: () => void;
}

export function PortfolioOverview({
  t,
  tooltips,
  onShowRewardsModal,
}: PortfolioOverviewProps) {
  const { isConnected, connectWallet, balance } = useUserWallet();
  const { width } = useWindowSize();
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
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        onClick={connectWallet}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Kết nối ví
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
            Tổng quan tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tổng số dư:</span>
                  <span className="font-semibold text-white">
                    {balance.ids} IDS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Đã stake:</span>
                  <span className="font-semibold text-blue-400">
                    850.00 IDS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Khả dụng:</span>
                  <span className="font-semibold text-white">400.00 IDS</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between">
                  <span className="text-gray-400">Tổng phần thưởng:</span>
                  <span className="font-semibold text-cyan-400">
                    127.45 IDS
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-300 inline-flex gap-1 items-center">
                      Tiến độ stake
                      <Info className="tooltips-progress w-3 h-3 text-gray-500 cursor-help hover:text-blue-400 transition-colors" />
                    </span>
                    <Tooltip
                      anchorSelect=".tooltips-progress"
                      place="top"
                      className="text-wrap outline-none"
                      style={{ maxWidth: width }}
                    >
                      {tooltips.stakeProgress}
                    </Tooltip>
                  </div>
                  <span className="text-gray-300">68%</span>
                </div>
                <Progress value={68} className="h-2 bg-gray-800" />
              </div>
            </div>
          ) : (
            <WalletConnectionPrompt
              title="Kết nối ví để xem"
              icon={<Wallet className="w-12 h-12 mx-auto text-gray-500 mb-3" />}
              description="Cần kết nối ví để hiển thị thông tin tài khoản"
            />
          )}
        </CardContent>
      </Card>

      {/* Rewards Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Gift className="w-5 h-5 mr-2 text-cyan-400" />
            Phần thưởng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="text-2xl font-bold text-blue-400">
                  12.34 IDS
                </div>
                <div className="text-sm text-gray-400">
                  Phần thưởng chờ nhận
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Hôm nay:</span>
                  <span className="text-blue-400">+2.45 IDS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">7 ngày qua:</span>
                  <span className="text-blue-400">+17.23 IDS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">30 ngày qua:</span>
                  <span className="text-blue-400">+73.89 IDS</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-600 hover:text-blue-300 bg-transparent"
                onClick={onShowRewardsModal}
              >
                <Gift className="w-4 h-4 mr-2" />
                Nhận phần thưởng
              </Button>
            </div>
          ) : (
            <WalletConnectionPrompt
              title="Kết nối ví để xem"
              icon={<Gift className="w-12 h-12 mx-auto text-gray-500 mb-3" />}
              description="Cần kết nối ví để hiển thị phần thưởng"
            />
          )}
        </CardContent>
      </Card>

      {/* Stake History Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Clock className="w-5 h-5 mr-2 text-cyan-400" />
            Lịch sử Stake
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <div className="font-medium text-white">500 IDS</div>
                  <div className="text-sm text-gray-400">90 ngày - 25% APY</div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Đã khóa
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <div className="font-medium text-white">350 IDS</div>
                  <div className="text-sm text-gray-400">30 ngày - 15% APY</div>
                </div>
                <Badge
                  variant="outline"
                  className="border-blue-600 text-blue-400"
                >
                  <Clock className="w-3 h-3 mr-1" />5 ngày còn lại
                </Badge>
              </div>
            </div>
          ) : (
            <WalletConnectionPrompt
              title="Kết nối ví để xem"
              icon={<Clock className="w-12 h-12 mx-auto text-gray-500 mb-3" />}
              description="Cần kết nối ví để hiển thị lịch sử stake"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
