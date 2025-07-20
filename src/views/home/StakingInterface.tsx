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
import { Zap, Lock, DollarSign, Wallet, Loader2 } from "lucide-react";
import { useUserStatus, useUserWallet } from "@/commons/UserWalletContext";
import { useAppMetadata } from "@/commons/AppMetadataContext";

interface StakingInterfaceProps {
  t: (key: string) => string;
  setShowNotificationModal: (show: boolean) => void;
  setNotificationData: (data: any) => void;
}

// Định nghĩa object chứa các lựa chọn số ngày và apy
const stakingOptions: Record<string, string> = {
  "30": "5",
  "90": "8",
  "180": "15",
  "360": "25",
};

export function StakingInterface({
  t,
  setShowNotificationModal,
  setNotificationData,
}: StakingInterfaceProps) {
  const [isloadding, setIsloadding] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [lockPeriod, setLockPeriod] = useState("360");
  const [selectedChain, setSelectedChain] = useState("97");
  const [swapAmount, setSwapAmount] = useState("");
  const {
    custom_fields: {
      usdt_payment_wallets,
      usdt_payment_wallets_testnet,
      ids_distribution_wallet,
      ids_stake_wallet,
    },
  } = useAppMetadata();
  const {
    connectWallet,
    isConnected,
    sendTransaction,
    wallet,
    balance,
    getBalance,
    account,
  } = useUserWallet();
  const { setStakeHistory } = useUserStatus();

  useEffect(() => {
    if (!isConnected || !wallet || !selectedChain) return;
    getBalance(
      wallet.address,
      Number(selectedChain),
      usdt_payment_wallets_testnet[
        selectedChain as keyof typeof usdt_payment_wallets_testnet
      ].token_address
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChain, wallet]);

  const errorNotiTransaction = ({
    error,
    type,
  }: {
    error: any;
    type: boolean;
  }) => {
    const code = error.code;
    if (code == "4001") {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.transactioncancel"),
        type: false,
      });
    } else if (code == "4902" || code == "-32602") {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.web3ChainNotFound", {
          chain:
            usdt_payment_wallets_testnet[
              selectedChain as keyof typeof usdt_payment_wallets_testnet
            ].name,
        }),
        type: false,
      });
    } else {
      setNotificationData({
        title: t("noti.error"),
        message: type
          ? t("noti.stakeError", {
              amount: stakeAmount,
              days: lockPeriod,
            })
          : t("noti.swapError", { amount: swapAmount, ids: swapAmount }),
        type: false,
      });
    }
    setShowNotificationModal(true);
  };
  const handleStake = async () => {
    if (
      !stakeAmount ||
      Number(stakeAmount) < 100 ||
      Number(stakeAmount) > Number(balance.ids)
    ) {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.validate", {
          action: "stake",
          min: 100,
          max: Number(balance.ids),
        }),
        type: false,
      });
      setShowNotificationModal(true);
      return;
    }
    setIsloadding(true);

    const transaction = await sendTransaction({
      to: ids_stake_wallet.address,
      amount: stakeAmount,
      type: "token", // (fix) chuyển thành coin
      chainId: ids_stake_wallet.chain_id,
      tokenAddress: ids_stake_wallet.token_address_temp,
    })
      .then((txHash) => ({ ok: true, result: txHash }))
      .catch((error) => ({ ok: false, result: error }));

    if (!transaction.ok) {
      errorNotiTransaction({ error: transaction.result, type: true });
      setIsloadding(false);
      return;
    }

    const txn = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "createItem",
        collection: "txn",
        items: {
          status: "completed",
          type: "stake_in",
          app_id: process.env.NEXT_PUBLIC_APP_ID,
          member_id: account?.id,
          amount: stakeAmount,
          currency: "IDS",
          affect_balance: false,
          stake_lock_days: lockPeriod,
          stake_apy: stakingOptions[lockPeriod],
          external_ref: `${ids_stake_wallet.explorer_url}/tx/${transaction.result}`,
          description: `Staked ${stakeAmount} IDS for ${lockPeriod} days at ${stakingOptions[lockPeriod]}% APY`,
        },
      }),
    }).then((data) => data.json());
    if (txn.ok) {
      setNotificationData({
        title: t("noti.success"),
        message: t("noti.stakeSuccess", {
          amount: stakeAmount,
          days: lockPeriod,
        }),
        type: true,
      });
      setShowNotificationModal(true);
      setIsloadding(false);
      setStakeHistory((prev: any) => [...prev, txn.result]);
    } else {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.addTransactionError", {
          txHash: transaction.result.toString(),
        }),
      });
      setShowNotificationModal(true);
      setIsloadding(false);
    }

    // (fix) lấy coin xóa token address
    const inisiaSate = await getBalance(
      account?.wallet_address || "",
      ids_distribution_wallet.chain_id,
      ids_distribution_wallet.token_address_temp
    );
  };

  const handleSwap = async () => {
    if (
      !swapAmount ||
      Number(swapAmount) <= 10 ||
      Number(swapAmount) > Number(balance.usdt)
    ) {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.validate", {
          action: "swap",
          min: 10,
          max: Number(balance.usdt),
        }),
        type: false,
      });
      setShowNotificationModal(true);
      return;
    }

    setIsloadding(true);
    // Yêu cầu gửi token
    const txHash = await sendTransaction({
      to: usdt_payment_wallets_testnet[
        selectedChain as keyof typeof usdt_payment_wallets_testnet
      ].address,
      amount: swapAmount,
      type: "token",
      chainId: Number(selectedChain),
      tokenAddress:
        usdt_payment_wallets_testnet[
          selectedChain as keyof typeof usdt_payment_wallets_testnet
        ].token_address,
    })
      .then((txHash) => ({ ok: true, result: txHash }))
      .catch((error) => ({ ok: false, result: error }));
    if (!txHash.ok) {
      errorNotiTransaction({ error: txHash.result, type: false });
      setIsloadding(false);
      return;
    }
    // Giao dich gủi
    const SendTXN = await fetch(`/api/directus/request`, {
      method: "POST",
      body: JSON.stringify({
        type: "createItem",
        collection: "txn",
        items: {
          status: "completed",
          app_id: process.env.NEXT_PUBLIC_APP_ID,
          member_id: account?.id,
          amount: swapAmount,
          currency: `USDT ${usdt_payment_wallets_testnet[selectedChain].name}`,
          type: "swap_in",
          affect_balance: false,
          description: `Swap: Sent ${swapAmount} USDT`,
          external_ref: `${usdt_payment_wallets_testnet[selectedChain].explorer_url}/tx/${txHash.result}`,
        },
      }),
    }).then((data) => data.json());
    if (!SendTXN.ok) {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.addTransactionError", {
          txHash: txHash.result.toString(),
        }),
        type: false,
      });
      setShowNotificationModal(true);
      setIsloadding(false);
      return;
    }
    // Yêu cầu nhận token
    const res = await fetch("/api/send/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: swapAmount,
        rpc: ids_distribution_wallet.rpc_url,
        token_address: ids_distribution_wallet.token_address_temp,
        to: wallet?.address || account?.wallet_address || "",
        chain_id: ids_distribution_wallet.chain_id,
      }),
    });
    const data = await res.json();
    const txHashReceive = data.success ? data.txHash : null;

    if (!txHashReceive) {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.poolIDSError"),
        type: false,
      });
      setShowNotificationModal(true);
      setIsloadding(false);
      return;
    }
    // Giao dich nhận
    const RewardTXN = await fetch(`/api/directus/request`, {
      method: "POST",
      body: JSON.stringify({
        type: "createItem",
        collection: "txn",
        items: {
          status: "completed",
          app_id: process.env.NEXT_PUBLIC_APP_ID,
          member_id: account?.id,
          amount: swapAmount,
          currency: `IDS`,
          type: "swap_out",
          affect_balance: false,
          description: `Swap: Received ${swapAmount} IDS`,
          external_ref: `${ids_distribution_wallet.explorer_url}/tx/${txHashReceive}`,
          parent_txn_id: SendTXN.result.id,
        },
      }),
    }).then((data) => data.json());

    if (!RewardTXN.ok) {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.addTransactionError", {
          txHash: txHashReceive,
        }),
      });
      setShowNotificationModal(true);
      setIsloadding(false);
      return;
    }
    // Thành công
    setNotificationData({
      title: t("noti.success"),
      message: t("noti.swapSuccess", {
        amount: swapAmount,
        ids: swapAmount,
      }),
      type: true,
    });
    setShowNotificationModal(true);
    setIsloadding(false);
    await getBalance(
      wallet?.address || account?.wallet_address || "",
      Number(selectedChain),
      usdt_payment_wallets_testnet[
        selectedChain as keyof typeof usdt_payment_wallets_testnet
      ].token_address
    );
    const inisiaSate = await getBalance(
      account?.wallet_address || "",
      ids_distribution_wallet.chain_id,
      ids_distribution_wallet.token_address_temp
    );
    // (fix) lấy coin xóa token address
    const intervalIDS = setInterval(async () => {
      const a = await getBalance(
        account?.wallet_address || "",
        ids_distribution_wallet.chain_id,
        ids_distribution_wallet.token_address_temp
      );
      if (a > inisiaSate) {
        clearInterval(intervalIDS);
      }
    }, 1000);
  };

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
              <div>
                <Label
                  htmlFor="amount"
                  className="text-gray-900 font-semibold my-2"
                >
                  {t("staking.amount")}
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) =>
                      setStakeAmount(
                        e.target.value.toLowerCase().replace(/[^0-9.]/g, "")
                      )
                    }
                    className="pr-20 bg-white/90 border-gray-800 text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:bg-white font-medium"
                    disabled={!isConnected || isloadding}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-200 cursor-pointer"
                      onClick={() => setStakeAmount(balance.ids.toString())}
                      disabled={!isConnected || isloadding}
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
                    {t("staking.availableBalance")}:{" "}
                    {isConnected ? `${balance.ids} IDS` : "--- IDS"}
                  </p>
                  <p className="text-gray-800 font-medium">
                    {t("staking.min")}: 100 IDS
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-gray-900 font-semibold">
                  {t("staking.lockPeriod")}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {Object.entries(stakingOptions).map(([days, apy]) => (
                    <Button
                      key={days}
                      disabled={isloadding}
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
                          {apy}% {t("staking.apy")}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.estimatedReward")}
                  </span>
                  <span className="font-bold text-gray-900">
                    {stakeAmount && isConnected
                      ? (
                          (Number.parseFloat(stakeAmount) *
                            Number(stakingOptions[lockPeriod])) /
                          36500
                        ).toFixed(2)
                      : "0.0000"}{" "}
                    IDS
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.apy")}
                  </span>
                  <span className="font-bold text-gray-900">
                    {stakingOptions[lockPeriod] || "--"}%
                  </span>
                </div>
              </div>

              {isConnected ? (
                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg cursor-pointer"
                  size="lg"
                  disabled={!isConnected || isloadding}
                  onClick={handleStake}
                >
                  {isloadding ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  {t("staking.stake")}
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                  onClick={() => connectWallet()}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {t("staking.connectWalletBtn")}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="buy" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-900 font-semibold">
                  {t("staking.selectChain")}
                </Label>
                <Select
                  value={selectedChain.toString()}
                  onValueChange={(value) => {
                    setSelectedChain(value);
                  }}
                >
                  <SelectTrigger
                    disabled={isloadding}
                    className="w-full mt-2 bg-white/90 border-gray-800 text-gray-900 focus:border-gray-900 font-medium"
                  >
                    <SelectValue placeholder={t("staking.selectChain")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-800">
                    {Object.entries(usdt_payment_wallets_testnet).map(
                      ([key, value]) => (
                        <SelectItem disabled={isloadding} key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">
                              {value?.name || "--"}
                            </div>
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="swapAmount"
                  className="text-gray-900 font-semibold mb-2"
                >
                  {t("staking.usdtAmount")}
                </Label>
                <div className="relative">
                  <Input
                    id="swapAmount"
                    placeholder="0.00"
                    value={swapAmount}
                    onChange={(e) =>
                      setSwapAmount(
                        e.target.value.toLowerCase().replace(/[^0-9.]/g, "")
                      )
                    }
                    className="pr-20 bg-white/90 border-gray-800 text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:bg-white font-medium"
                    disabled={!isConnected || isloadding}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-200 cursor-pointer"
                      onClick={() => setSwapAmount(balance.usdt)}
                      disabled={!isConnected}
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
                    {t("staking.availableBalance")}:{" "}
                    {isConnected ? `${balance.usdt} USDT` : "--- USDT"}
                  </p>
                  <p className="text-gray-800 font-medium">
                    {t("staking.min")}: 10 USDT
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.exchangeRate")}
                  </span>
                  <span className="font-bold text-gray-900">
                    1 USDT = 1.00 IDS
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.transactionFee")}
                  </span>
                  <span className="font-bold text-emerald-700">
                    {t("staking.free")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-semibold">
                    {t("staking.receivedIds")}
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
                    {t("staking.processingTime")}
                  </span>
                  <span className="font-bold text-gray-900">
                    5-10 {t("staking.seconds")}
                  </span>
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
                      {isConnected
                        ? t("staking.walletconnected")
                        : t("staking.walletnotconnected")}{" "}
                      {isConnected && (
                        <span className="text-xs text-green-700">
                          {wallet?.address.slice(0, 6)}...
                          {wallet?.address.slice(-4)}
                        </span>
                      )}
                    </span>
                  </div>
                  {!isConnected && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white bg-white/60 cursor-pointer"
                      onClick={() => connectWallet()}
                    >
                      {t("staking.connectwallet")}
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-blue-900/20 backdrop-blur-sm p-4 rounded-lg border border-blue-700/50">
                <div className="text-sm text-gray-900 space-y-2">
                  <div className="font-semibold text-blue-900 mb-2">
                    {t("staking.swapInstructions")}
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
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg cursor-pointer"
                size="lg"
                disabled={!isConnected || isloadding}
                onClick={handleSwap}
              >
                {isloadding ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <DollarSign className="w-4 h-4 mr-2" />
                )}
                {isConnected ? t("staking.swap") : t("staking.notConnected")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
