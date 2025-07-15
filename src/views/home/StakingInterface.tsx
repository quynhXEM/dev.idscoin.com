"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Lock, DollarSign, Wallet } from "lucide-react";
import { useUserWallet } from "@/commons/UserWalletContext";
import { usdtContracts } from "@/lib/crypto";

interface StakingInterfaceProps {
  t: (key: string) => string;
}

export function StakingInterface({t}: StakingInterfaceProps) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [lockPeriod, setLockPeriod] = useState("30");
  const [selectedChain, setSelectedChain] = useState(1);
  const [swapAmount, setSwapAmount] = useState("");
  const {
    connectWallet,
    isConnected,
    sendTransaction,
    wallet,
    balance,
    getBalance,
  } = useUserWallet();

  useEffect(() => {
    if (!isConnected || !wallet) return;
    getBalance(
      wallet.address,
      selectedChain,
      usdtContracts[selectedChain as keyof typeof usdtContracts]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChain]);

  const handleStake = async () => {
    if (!stakeAmount) return;
    const txHash = await sendTransaction({
      to: "0xf59402F215FE30e09CC7AAC1551604A029AE381A",
      amount: stakeAmount,
      type: "coin",
      chainId: 97,
    });
    console.log(txHash);
  };

  const handleSwap = async () => {
    const txHash = await sendTransaction({
      to: "0xf59402F215FE30e09CC7AAC1551604A029AE381A",
      amount: swapAmount,
      type: "token",
      chainId: Number(selectedChain),
      tokenAddress: usdtContracts[selectedChain as keyof typeof usdtContracts],
    });
    console.log(txHash);
  };

  return (
    <Card className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 border-orange-400 shadow-lg shadow-orange-500/30 ring-1 ring-orange-400/50">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900 font-bold text-lg">
          <Zap className="w-5 h-5 mr-2 text-gray-900" />
          Stake IDS Coin
        </CardTitle>
        <CardDescription className="text-gray-800 font-medium">
          Mua và khóa IDS coin để nhận hoa hồng hàng ngày
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-orange-800/80 border border-orange-700">
            <TabsTrigger
              value="stake"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:hover:bg-gray-900 data-[state=inactive]:bg-orange-700/60 data-[state=inactive]:text-orange-100 data-[state=inactive]:hover:bg-orange-600/70 data-[state=inactive]:hover:text-white"
            >
              Stake IDS
            </TabsTrigger>
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:hover:bg-gray-900 data-[state=inactive]:bg-orange-700/60 data-[state=inactive]:text-orange-100 data-[state=inactive]:hover:bg-orange-600/70 data-[state=inactive]:hover:text-white"
            >
              USDT → IDS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stake" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-gray-900 font-semibold my-2">
                  Số lượng IDS
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value.toLowerCase().replace(/[^0-9.]/g, ""))}
                    className="pr-20 bg-white/90 border-gray-800 text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:bg-white font-medium"
                    disabled={!isConnected}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                      onClick={() => setStakeAmount(balance.ids.toString())}
                      disabled={!isConnected}
                    >
                      Max
                    </Button>
                    <span className="text-sm text-gray-700 font-medium">
                      IDS
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <p className="text-gray-800 font-medium">
                    Số dư khả dụng:{" "}
                    {isConnected ? `${balance.ids} IDS` : "--- IDS"}
                  </p>
                  <p className="text-gray-800 font-medium">Min: 100 IDS</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-900 font-semibold">
                  Thời gian khóa
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {["30", "90", "180", "360"].map((days) => (
                    <Button
                      key={days}
                      variant={lockPeriod === days ? "default" : "outline"}
                      onClick={() => setLockPeriod(days)}
                      className={`h-12 ${
                        lockPeriod === days
                          ? "bg-gray-900 hover:bg-gray-800 text-white font-bold border-gray-900"
                          : "border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 bg-white/80 font-semibold"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{days} ngày</div>
                        <div className="text-xs opacity-80">
                          {days === "30"
                            ? "5%"
                            : days === "90"
                            ? "8%"
                            : days === "180"
                            ? "15%"
                            : "25%"}{" "}
                          APY
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    Phần thưởng ước tính/ngày:
                  </span>
                  <span className="font-bold text-gray-900">
                    {stakeAmount && isConnected
                      ? (Number.parseFloat(stakeAmount) * 0.0007).toFixed(4)
                      : "0.0000"}{" "}
                    IDS
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-900 font-semibold">APY:</span>
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

              {!isConnected && (
                <div className="bg-yellow-900/20 backdrop-blur-sm p-4 rounded-lg border border-yellow-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-300 font-semibold">
                      Cần kết nối ví để stake
                    </span>
                  </div>
                  <p className="text-yellow-200 text-sm mb-3">
                    Kết nối ví để xem số dư thực tế và thực hiện giao dịch stake
                    IDS coin.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={connectWallet}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Kết nối ví ngay
                  </Button>
                </div>
              )}

              <Button
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg"
                size="lg"
                disabled={!isConnected}
                onClick={handleStake}
              >
                <Lock className="w-4 h-4 mr-2" />
                {isConnected ? "Stake IDS Coin" : "Cần kết nối ví"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="buy" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-900 font-semibold">
                  Chọn blockchain
                </Label>
                <Select value={selectedChain.toString()} onValueChange={(value) => setSelectedChain(Number(value))}>
                  <SelectTrigger className="w-full mt-2 bg-white/90 border-gray-800 text-gray-900 focus:border-gray-900 font-medium">
                    <SelectValue placeholder="Chọn blockchain" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-800">
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⟠</span>
                        <div>
                          <div className="font-semibold">Ethereum</div>
                          <div className="text-xs text-gray-500">ETH</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="56">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟡</span>
                        <div>
                          <div className="font-semibold">BSC</div>
                          <div className="text-xs text-gray-500">BNB</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="137">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟣</span>
                        <div>
                          <div className="font-semibold">Polygon</div>
                          <div className="text-xs text-gray-500">MATIC</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="42161">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔵</span>
                        <div>
                          <div className="font-semibold">Arbitrum</div>
                          <div className="text-xs text-gray-500">ARB</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="swapAmount"
                  className="text-gray-900 font-semibold mb-2"
                >
                  Số lượng USDT muốn swap
                </Label>
                <div className="relative">
                  <Input
                    id="swapAmount"
                    placeholder="0.00"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value.toLowerCase().replace(/[^0-9.]/g, ""))}
                    className="pr-20 bg-white/90 border-gray-800 text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:bg-white font-medium"
                    disabled={!isConnected}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                      onClick={() => setSwapAmount(balance.usdt)}
                      disabled={!isConnected}
                    >
                      Max
                    </Button>
                    <span className="text-sm text-gray-700 font-medium">
                      USDT
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <p className="text-gray-800 font-medium">
                    Số dư khả dụng:{" "}
                    {isConnected ? `${balance.usdt} USDT` : "--- USDT"}
                  </p>
                  <p className="text-gray-800 font-medium">Min: 10 USDT</p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    Tỷ giá IDS:
                  </span>
                  <span className="font-bold text-gray-900">
                    1 USDT = 1.00 IDS
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    Phí giao dịch:
                  </span>
                  <span className="font-bold text-emerald-700">Miễn phí</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    Số IDS nhận được:
                  </span>
                  <span className="font-bold text-gray-900">
                    ~
                    {swapAmount && isConnected
                      ? Number.parseFloat(swapAmount).toFixed(2)
                      : "0.00"}{" "}
                    IDS
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-gray-800 pt-2">
                  <span className="text-gray-900 font-semibold">
                    Thời gian xử lý:
                  </span>
                  <span className="font-bold text-gray-900">5-10 giây</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-900 font-medium">
                      {isConnected ? "Ví đã kết nối" : "Chưa kết nối ví"}
                    </span>
                  </div>
                  {!isConnected && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white bg-white/60"
                      onClick={connectWallet}
                    >
                      Kết nối ví
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-blue-900/20 backdrop-blur-sm p-4 rounded-lg border border-blue-700/50">
                <div className="text-sm text-gray-900 space-y-2">
                  <div className="font-semibold text-blue-900 mb-2">
                    📋 Hướng dẫn swap:
                  </div>
                  <div className="space-y-1 text-gray-800">
                    <div>1. Chọn blockchain và kết nối ví</div>
                    <div>2. Nhập số USDT muốn swap</div>
                    <div>3. Gửi USDT đến địa chỉ được cung cấp</div>
                    <div>4. Chờ 5-10 giây để nhận IDS về ví</div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg"
                size="lg"
                disabled={!isConnected}
                onClick={handleSwap}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                {isConnected ? "Swap USDT → IDS" : "Cần kết nối ví"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
