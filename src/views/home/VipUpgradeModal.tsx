"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DollarSign, Loader2 } from "lucide-react";
import { useUserWallet } from "@/commons/UserWalletContext";
import { useAppMetadata } from "@/commons/AppMetadataContext";

interface VipUpgradeModalProps {
  t: (key: string) => string;
  show: boolean;
  onClose: () => void;
  vipSelectedChain: string;
  setVipSelectedChain: (v: string) => void;
  setShowNotificationModal: (show: boolean) => void;
  setNotificationData: (data: any) => void;
}

const VipUpgradeModal: React.FC<VipUpgradeModalProps> = ({
  t,
  show,
  onClose,
  vipSelectedChain,
  setVipSelectedChain,
  setShowNotificationModal,
  setNotificationData,
}) => {
  const { sendTransaction, account, getVipStatus, setIsVip } = useUserWallet();
  const {
    custom_fields: { usdt_payment_wallets, usdt_payment_wallets_testnet },
    icon,
  } = useAppMetadata();
  const [isloading, setIsLoading] = useState<boolean>(false);
  if (!show) return;

  const errorNotiTransaction = (error: any) => {
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
              vipSelectedChain as keyof typeof usdt_payment_wallets_testnet
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
    setIsLoading(false);
  };
  const handleUpgradeVip = async () => {
    setIsLoading(true);
    const txn = await sendTransaction({
      to: usdt_payment_wallets_testnet[vipSelectedChain].address,
      amount: "100",
      type: "token",
      tokenAddress:
        usdt_payment_wallets_testnet[vipSelectedChain].token_address,
      chainId: Number(vipSelectedChain),
    }).catch((err) => {
      errorNotiTransaction(err);
      return null;
    });

    if (!txn) return;

    const response = await fetch(`/api/directus/request`, {
      method: "POST",
      body: JSON.stringify({
        type: "createItem",
        collection: "txn",
        items: {
          status: "completed",
          app_id: process.env.NEXT_PUBLIC_APP_ID,
          member_id: account?.id,
          amount: "100",
          currency: `USDT ${usdt_payment_wallets_testnet[vipSelectedChain].name}`,
          type: "vip_upgrade",
          affect_balance: false,
          description: "Upgrade VIP Account via Web3",
          external_ref: `${usdt_payment_wallets_testnet[vipSelectedChain].explorer_url}/tx/${txn}`,
        },
      }),
    })
      .then((data) => data.json())
      .then((data) => (data.ok ? data?.result : data?.error))
      .catch((err) => err);
    if (!response?.id) {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.upgradeVipError", { error: response.toString() }),
        type: false,
      });
      setShowNotificationModal(true);
    }

    // Hoa hồng đăng kí vip cho F0
    if (account?.referrer_id) {
      const isVip = await getVipStatus(account?.referrer_id);

      const commicsion = await fetch(`/api/directus/request`, {
        method: "POST",
        body: JSON.stringify({
          type: "createItem",
          collection: "txn",
          items: {
            status: "completed",
            app_id: process.env.NEXT_PUBLIC_APP_ID,
            member_id: account?.referrer_id,
            amount: !isVip ? "5" : "50",
            currency: `USDT ${usdt_payment_wallets_testnet[vipSelectedChain].name}`,
            type: "referral_bonus",
            affect_balance: true,
            description: `Commicsion VIP Upgrade F1 ${account.username}`,
            parent_txn_id: response?.id
          },
        }),
      }).then((data) => data.json());
      if (process.env.NODE_ENV === "development") {
        console.log("Commicsion VIP Upgrade F1", commicsion);
      }
    }

    onClose();
    setIsVip(true);
    setNotificationData({
      title: t("noti.success"),
      message: t("noti.upgradeVipSuccess"),
      type: true,
    });
    setShowNotificationModal(true);
    setIsLoading(false);
  };
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md mx-4 bg-gray-900 border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="flex items-center text-white text-2xl">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${icon}/ids-coin.svg`}
              alt="logo"
              className="w-6 h-6 rounded-full mr-2"
            />
            {t("vip.upgrade")}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t("vip.becomeVip")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-blue-700/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {t("vip.upgradeCost")}
              </div>
              <div className="text-sm text-gray-400">
                {t("vip.upgradeOneTime")}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-white font-semibold">
              {t("vip.selectChain")}
            </Label>
            <Select
              value={vipSelectedChain}
              onValueChange={setVipSelectedChain}
            >
              <SelectTrigger className="w-full mt-2 bg-gray-800 border-gray-700 text-white focus:border-blue-500">
                <SelectValue placeholder={t("vip.selectChain")} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {Object.entries(usdt_payment_wallets_testnet).map(
                  ([key, value]) => {
                    return (
                      <SelectItem
                        key={key}
                        value={key}
                        className="text-white hover:bg-gray-700 focus:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-white">
                            {value.name}
                          </div>
                        </div>
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
              <span className="text-sm text-gray-300">
                {t("vip.currentEarnings")}:
              </span>
              <span className="font-semibold text-red-400">5%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
              <span className="text-sm text-gray-300">
                {t("vip.vipEarnings")}:
              </span>
              <span className="font-semibold text-blue-400">50%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
              <span className="text-sm text-gray-300">
                {t("vip.increaseEarnings")}:
              </span>
              <span className="font-semibold text-cyan-400">10x</span>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            {t("vip.upgradePayment")}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              disabled={isloading}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent cursor-pointer"
              onClick={onClose}
            >
              {t("vip.cancel")}
            </Button>
            <Button
              disabled={isloading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
              onClick={handleUpgradeVip}
            >
              {isloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <DollarSign className="w-4 h-4 mr-2" />
              )}
              {t("vip.upgrade100")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VipUpgradeModal;
