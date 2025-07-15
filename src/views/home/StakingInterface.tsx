import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Lock, DollarSign, Zap } from "lucide-react";

interface StakingInterfaceProps {
  t: (key: string) => string;
  stakeAmount: string;
  setStakeAmount: (v: string) => void;
  lockPeriod: string;
  setLockPeriod: (v: string) => void;
  selectedChain: string;
  setSelectedChain: (v: string) => void;
  swapAmount: string;
  setSwapAmount: (v: string) => void;
  handleStake: () => void;
  handleSwap: () => void;
  balance: {
    ids: string;
    usdt: string;
  };
}

const StakingInterface: React.FC<StakingInterfaceProps> = ({
  t,
  stakeAmount,
  setStakeAmount,
  lockPeriod,
  setLockPeriod,
  selectedChain,
  setSelectedChain,
  swapAmount,
  setSwapAmount,
  handleStake,
  handleSwap,
  balance
}) => {
  return (
    <Card className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 border-orange-400 shadow-lg shadow-orange-500/30 ring-1 ring-orange-400/50">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900 font-bold text-lg">
          <Zap className="w-5 h-5 mr-2 text-gray-900" />
          {t("staking.stake")}
        </CardTitle>
        <CardDescription className="text-gray-800 font-medium">
          {t("staking.buy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-orange-800/80 border border-orange-700">
            <TabsTrigger
              value="stake"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:hover:bg-gray-900 data-[state=inactive]:bg-orange-700/60 data-[state=inactive]:text-orange-100 data-[state=inactive]:hover:bg-orange-600/70 data-[state=inactive]:hover:text-white"
            >
              {t("staking.stake")}
            </TabsTrigger>
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:hover:bg-gray-900 data-[state=inactive]:bg-orange-700/60 data-[state=inactive]:text-orange-100 data-[state=inactive]:hover:bg-orange-600/70 data-[state=inactive]:hover:text-white"
            >
              {t("staking.usdtToIds")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stake" className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount" className="text-gray-900 font-semibold">
                  {t("staking.amount")}
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    placeholder="0.00"
                    min={100}
                    max={balance.ids}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="pr-20 bg-white/90 border-gray-800 text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:bg-white font-medium"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-200 cursor-pointer"
                      onClick={() => setStakeAmount(balance.ids)}
                    >
                      Max
                    </Button>
                    <span className="text-sm text-gray-700 font-medium">
                      {t("staking.ids")}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <p className="text-gray-800 font-medium">
                    {t("staking.availableBalance")}: {balance.ids} {t("staking.ids")}
                  </p>
                  <p className="text-gray-800 font-medium">
                    {t("staking.min")}: 100 {t("staking.ids")}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-gray-900 font-semibold">
                  {t("staking.lockPeriod")}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {["30", "90", "180", "360"].map((days) => (
                    <Button
                      key={days}
                      variant={lockPeriod === days ? "default" : "outline"}
                      onClick={() => setLockPeriod(days)}
                      className={`h-12 cursor-pointer ${
                        lockPeriod === days
                          ? "bg-gray-900 hover:bg-gray-800 text-white font-bold border-gray-900"
                          : "border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 bg-white/80 font-semibold"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">
                          {days} {t("staking.days")}
                        </div>
                        <div className="text-xs opacity-80">
                          {days === "30"
                            ? "5%"
                            : days === "90"
                            ? "8%"
                            : days === "180"
                            ? "15%"
                            : "25%"}{" "}
                          {t("staking.apy")}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.estimatedReward")}:
                  </span>
                  <span className="font-bold text-gray-900">
                    {stakeAmount
                      ? (Number.parseFloat(stakeAmount) * 0.0007).toFixed(4)
                      : "0.0000"}{" "}
                    {t("staking.ids")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.apy")}:
                  </span>
                  <span className="font-bold text-gray-900">
                    {lockPeriod === "30"
                      ? "5%"
                      : lockPeriod === "90"
                      ? "8%"
                      : lockPeriod === "180"
                      ? "15%"
                      : "25%"}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleStake()}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg cursor-pointer"
                size="lg"
              >
                <Lock className="w-4 h-4 mr-2" />
                {t("staking.stake")}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="buy" className="space-y-6">
            <div className="space-y-4">
              {/* Chain Selection */}
              <div>
                <Label className="text-gray-900 font-semibold">
                  {t("staking.selectChain")}
                </Label>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
                  <SelectTrigger className="w-full mt-2 bg-white/90 border-gray-800 text-gray-900 focus:border-gray-900 font-medium">
                    <SelectValue placeholder={t("staking.selectChain")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-800">
                    <SelectItem value="1" className="flex items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⟠</span>
                        <div>
                          <div className="font-semibold">
                            {t("staking.ethereum")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t("staking.eth")}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="56" className="flex items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟡</span>
                        <div>
                          <div className="font-semibold">
                            {t("staking.bsc")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t("staking.bnb")}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="137" className="flex items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟣</span>
                        <div>
                          <div className="font-semibold">
                            {t("staking.polygon")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t("staking.matic")}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="42161" className="flex items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔵</span>
                        <div>
                          <div className="font-semibold">
                            {t("staking.arbitrum")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t("staking.arb")}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Amount */}
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="swapAmount"
                  className="text-gray-900 font-semibold"
                >
                  {t("staking.usdtAmount")}
                </Label>
                <div className="relative">
                  <Input
                    id="swapAmount"
                    placeholder="0.00"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="pr-20 bg-white/90 border-gray-800 text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:bg-white font-medium"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-200 cursor-pointer"
                      onClick={() => setSwapAmount(balance.usdt)}
                    >
                      Max
                    </Button>
                    <span className="text-sm text-gray-700 font-medium">
                      {t("staking.usdt")}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <p className="text-gray-800 font-medium">
                    {t("staking.availableBalance")}: {balance.usdt} {t("staking.usdt")}
                  </p>
                  <p className="text-gray-800 font-medium">
                    {t("staking.min")}: 10 {t("staking.usdt")}
                  </p>
                </div>
              </div>

              {/* Swap Details */}
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.exchangeRate")}:
                  </span>
                  <span className="font-bold text-gray-900">
                    1 {t("staking.usdt")} = 1.00 {t("staking.ids")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.transactionFee")}:
                  </span>
                  <span className="font-bold text-emerald-700">
                    {t("staking.free")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.receivedIds")}:
                  </span>
                  <span className="font-bold text-gray-900">
                    ~0.00 {t("staking.ids")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-gray-800 pt-2">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.processingTime")}:
                  </span>
                  <span className="font-bold text-gray-900">
                    5-10 {t("staking.seconds")}
                  </span>
                </div>
              </div>

              {/* Swap Instructions */}
              <div className="bg-blue-900/20 backdrop-blur-sm p-4 rounded-lg border border-blue-700/50">
                <div className="text-sm text-gray-900 space-y-2">
                  <div className="font-semibold text-blue-900 mb-2">
                    {t("staking.swapInstructions")}:
                  </div>
                  <div className="space-y-1 text-gray-800">
                    <div>{t("staking.step1")}</div>
                    <div>{t("staking.step2")}</div>
                    <div>{t("staking.step3")}</div>
                    <div>{t("staking.step4")}</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSwap()}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg cursor-pointer"
                size="lg"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                {t("staking.swap")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StakingInterface;
