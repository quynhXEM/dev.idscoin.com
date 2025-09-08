"use client";
import React, { useState, useEffect } from "react";
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
import { DollarSign, Loader2, XIcon } from "lucide-react";
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
  const { sendTransaction, account, getVipStatus, setAccount, getChain } = useUserWallet();
  const {
    custom_fields: { usdt_address, master_wallet }, chains,
    icon,
  } = useAppMetadata();
  const [isloading, setIsLoading] = useState<boolean>(false);

  const renderTextWithLinks = (text: string): React.ReactNode => {
    const linkify = (input: string, phrase: string, href: string) => {
      const parts = input.split(phrase);
      const nodes: React.ReactNode[] = [];
      parts.forEach((part, index) => {
        nodes.push(part);
        if (index < parts.length - 1) {
          nodes.push(
            <a
              key={`${phrase}-${index}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-400"
            >
              {phrase}
            </a>
          );
        }
      });
      return nodes;
    };

    // Thay SOC Connect
    let nodes: React.ReactNode[] = linkify(text, "SOC Connect", "https://chat.nobody.network");
    // Với các phần là string, tiếp tục thay Deep Zone
    const finalNodes: React.ReactNode[] = [];
    nodes.forEach((node, idx) => {
      if (typeof node === "string") {
        linkify(node, "Deep Zone", "https://deepzone.nobody.network/profile/nobody.network").forEach((n) => finalNodes.push(n));
      } else {
        finalNodes.push(node);
      }
    });
    return finalNodes;
  };

  // Ngăn chặn cuộn và tương tác khi modal mở
  useEffect(() => {
    if (show) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [show])

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
        message: t("noti.web3ChainNotFound"),
        type: false,
      });
    } else if (code == "2330") {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.web3ChainDifferent"),
        type: false,
      });
    } else {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.upgradeVipError"),
        type: false,
      });
    }
    setShowNotificationModal(true);
    setIsLoading(false);
  };
  const handleUpgradeVip = async () => {
    setIsLoading(true);
    const txn = await sendTransaction({
      to: master_wallet.address,
      amount: "100",
      type: "token",
      tokenAddress: usdt_address[vipSelectedChain],
      chainId: Number(vipSelectedChain),
    }).then((txHash) => txHash ? ({ ok: true, result: txHash }) : ({ ok: false, result: { code: 2330 } }))
      .catch((error) => ({ ok: false, result: error }));

    if (!txn.ok) {
      errorNotiTransaction(txn.result);
      setIsLoading(false);
      return;
    }

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
          currency: `USDT ${getChain(vipSelectedChain).name}`,
          type: "vip_upgrade",
          affect_balance: false,
          description: "Upgrade VIP Account via Web3",
          external_ref: `${getChain(vipSelectedChain).explorer_url}/tx/${txn.result}`,
        },
      }),
    })
      .then((data) => data.json())
      .then((data) => (data.ok ? data?.result : data?.error))
      .catch((err) => err);
    if (!response?.id) {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.upgradeVipError"),
        type: false,
      });
      setShowNotificationModal(true);
    }

    // Hoa hồng đăng kí vip cho F0
    if (account?.referrer_id) {
      const isVip = await getVipStatus(account?.referrer_id);

      const commission = await fetch(`/api/directus/request`, {
        method: "POST",
        body: JSON.stringify({
          type: "createItem",
          collection: "txn",
          items: {
            status: "completed",
            app_id: process.env.NEXT_PUBLIC_APP_ID,
            member_id: account?.referrer_id,
            amount: !isVip ? "5" : "50",
            currency: `USDT ${getChain(vipSelectedChain).name}`,
            type: "referral_bonus",
            affect_balance: true,
            description: `${account.username} Upgraded to VIP`,
            parent_id: response?.id
          },
        }),
      }).then((data) => data.json());
      if (process.env.NODE_ENV === "development") {
        console.log("Commission VIP Upgrade F1", commission);
      }
    }

    onClose();
    setAccount({ ...account, isVip: true });
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
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overscroll-contain"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-lg max-h-[82vh] mx-4 bg-gray-900 border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="flex items-center text-white text-xl justify-between">
            <div className="flex items-center">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/assets/${icon}/ids-coin.svg`}
                alt="logo"
                className="w-6 h-6 rounded-full mr-2"
              />
              {t("vip.upgrade")}
            </div>
            <XIcon className="text-white cursor-pointer scale-90 hover:scale-105" onClick={onClose} />
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t("vip.becomeVip")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
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
          <div className="flex flex-col justify-center gap-3s text-white">
            <h3 className="font-semibold text-white ">
              {t("referral.privilege")}:
            </h3>
            <p>- {renderTextWithLinks(t("referral.privilege_note_1"))}</p>
            <p>- {renderTextWithLinks(t("referral.privilege_note_2"))}</p>
            <p>- {renderTextWithLinks(t("referral.privilege_note_3"))}</p>
            <p>- {renderTextWithLinks(t("referral.privilege_note_4"))}</p>
            <p>- {renderTextWithLinks(t("referral.privilege_note_5"))}</p>
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
                {chains.map((item: any) => {
                  return (
                    <SelectItem
                      key={item.chain_id.id}
                      value={item.chain_id.id}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-white">
                          {item.chain_id.name}
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
              disabled={isloading}
              className="flex-1 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
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
