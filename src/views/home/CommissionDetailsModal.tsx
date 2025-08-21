import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, HandCoins, Loader2, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotification } from "@/commons/NotificationContext";
import { timeFormat, formatNumber, roundDownDecimal } from "@/libs/utils";
import { Separator } from "@/components/ui/separator";
import { useAppMetadata } from "@/commons/AppMetadataContext";
import { useUserWallet } from "@/commons/UserWalletContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface CommissionDetailsModalProps {
  t: (key: string) => string;
  show: boolean;
  onClose: () => void;
  setShowVipModal: (v: boolean) => void;
  onSelectChain?: (chainId: string) => void; // thêm prop callback khi chọn chain
}

const CommissionDetailsModal: React.FC<CommissionDetailsModalProps> = ({
  t,
  show,
  onClose,
  setShowVipModal,
  onSelectChain, // thêm prop callback khi chọn chain
}) => {
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const { account, setAccount } = useUserWallet();
  const {
    custom_fields: { usdt_payment_wallets } = {
      usdt_payment_wallets: {},
    },
  } = useAppMetadata();
  const [showChainModal, setShowChainModal] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [txnCommicsion, setTxnCommicsion] = useState<any[]>([]);

  const handleCommicsion = async () => {
    if (txnCommicsion.length === 0) return;
    setLoading(true);
    try {
      const amount =
        Number(account?.commission?.all) +
        Number(account?.commission?.withdraw) || 0;

      const clamCommission = await fetch("/api/directus/request", {
        method: "POST",
        body: JSON.stringify({
          type: "createItem",
          collection: "txn",
          items: {
            status: "completed",
            app_id: process.env.NEXT_PUBLIC_APP_ID || "7d503b72-7d20-44c4-a48f-321b031a17b5",
            member_id: account?.id,
            amount: -amount,
            currency: `USDT ${usdt_payment_wallets[selectedChain].name}`,
            type: "withdraw",
            affect_balance: true,
            description: `Withdraw ${amount} USDT ${usdt_payment_wallets[selectedChain].name} commission`,
          },
        }),
      }).then((data) => data.json());

      if (!clamCommission.ok) {
        notify({
          title: t("noti.error"),
          message: t("noti.withdrawUSDTError", { amount: amount }),
          type: false,
        });
        setLoading(false);
        return;
      }

      setAccount((prev) => ({
        ...prev,
        commission: {
          ...prev.commission,
          withdraw: Number(prev.commission.withdraw) - Number(amount),
        },
      }));
      notify({
        title: t("noti.success"),
        message: t("noti.withdrawConfirm"),
        type: true,
      });
      setLoading(false);
      onClose();
    } catch (error) {
      notify({
        title: t("noti.error"),
        message: t("noti.clamommicsionFailed", { error: error }),
        type: false,
      });
      setLoading(false);
      onClose();
    }
  };

  const getData = async () => {
    const [txn_commicsion] = await Promise.all([
      await fetch("/api/directus/request", {
        method: "POST",
        body: JSON.stringify({
          type: "readItems",
          collection: "txn",
          params: {
            filter: {
              member_id: account?.id,
              status: "completed",
              type: "referral_bonus",
            },
            fields: ["*", "parent_id.*"],
          },
        }),
      }).then((data) => data.json()),
    ]);
    setTxnCommicsion(txn_commicsion.result);
  };

  useEffect(() => {
    if (!account) return;
    getData();
  }, [account]);

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

  // Ngăn chặn cuộn và tương tác khi chain modal mở
  useEffect(() => {
    if (showChainModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showChainModal])

  if (!show) return;
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overscroll-contain"
      onClick={() => onClose()}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      style={{ touchAction: 'none' }}
    >
      <Card
        className="w-full max-w-lg mx-4 bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="flex items-center text-white text-xl justify-between">
            <div className="flex items-center">
              <Gift className="w-5 h-5 mr-2 text-cyan-400 " />
              {t("referral.details")}
            </div>
            <XIcon className="text-white cursor-pointer scale-90 hover:scale-105" onClick={onClose} />
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t("referral.detailsCommicsionDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">
                {t("referral.currentStatus")}
              </h3>
              <Badge
                variant={account?.isVip ? "default" : "secondary"}
                className={
                  account?.isVip
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200"
                }
              >
                {account?.isVip ? "VIP" : "Miễn phí"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {!account?.isVip ? "5%" : "50%"}
                </div>
                <div className="text-sm text-gray-400">
                  {t("referral.usdtRate")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {txnCommicsion.length}
                </div>
                <div className="text-sm text-gray-400">
                  {t("referral.vipUpgrades")}
                </div>
              </div>
            </div>
          </div>

          {/* Commission History */}
          <div>
            <h3 className="font-semibold text-white mb-3">
              {t("referral.commissionHistory")}
            </h3>
            <div className="space-y-3">
              {txnCommicsion.length != 0 ? (
                txnCommicsion.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {timeFormat(item.date_created)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {item.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        +${formatNumber(item.amount)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 p-1">
                  {t("referral.noCommissionHistory")}
                </div>
              )}
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="gap-2">
            <div className="flex justify-between">
              <span className="text-gray-400 text-md">
                {t("referral.totalCommicsion")}:
              </span>
              <span className="font-semibold text-white">
                {formatNumber(account?.commission?.all)} USDT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-md">
                {t("referral.withdrawCommicsion")}:
              </span>
              <span className="font-semibold text-blue-400">
                {-formatNumber(Number(account?.commission?.withdraw) * -1)} USDT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-md">
                {t("referral.activeCommission")}:
              </span>
              <span className="font-semibold text-white">
                {formatNumber(roundDownDecimal(
                  Number(account?.commission?.all) +
                  Number(account?.commission?.withdraw))
                )}{" "}
                USDT
              </span>
            </div>
          </div>

          {!account?.isVip && (
            <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
              <div className="text-center">
                <div className="text-blue-300 font-semibold mb-2">
                  {t("vip.tip")}
                </div>
                <div className="text-sm text-blue-200 mb-3">
                  {t("vip.upgrade50Tip")}
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                  onClick={() => {
                    onClose();
                    setShowVipModal(true);
                  }}
                >
                  {t("vip.upgradeVipNow")}
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              disabled={
                loading ||
                txnCommicsion.length === 0 ||
                Number(account?.commission?.all) +
                Number(account?.commission?.withdraw) ==
                0
              }
              className="flex-2 border-gray-700 text-gray-300 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:text-gray-200 cursor-pointer"
              onClick={() => setShowChainModal(true)}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <HandCoins className="w-4 h-4 mr-2" />
              )}
              {t("referral.clamCommicsion", {
                amount:
                  roundDownDecimal(
                    Number(account?.commission?.all) +
                    Number(account?.commission?.withdraw)
                  ) || 0,
              })}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Modal chọn chain */}
      {showChainModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overscroll-contain"
          onClick={() => setShowChainModal(false)}
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
          style={{ touchAction: 'none' }}
        >
          <Card
            className="w-full max-w-md mx-4 bg-gray-900 border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white text-xl justify-between">
                {t("vip.selectChain")}
                <XIcon className="text-white cursor-pointer scale-90 hover:scale-105" onClick={() => setShowChainModal(false)} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
                  <SelectTrigger className="w-full mt-2 bg-gray-800 border-gray-700 text-white focus:border-blue-500">
                    <SelectValue placeholder={t("vip.selectChain")} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {usdt_payment_wallets &&
                      Object.entries(usdt_payment_wallets).map(
                        ([key, value]) => {
                          const v = value as { name: string };
                          return (
                            <SelectItem
                              key={key}
                              value={key}
                              className="text-white hover:bg-gray-700 focus:bg-gray-700"
                            >
                              <div className="flex items-center gap-2">
                                <div className="font-semibold text-white">
                                  {v.name}
                                </div>
                              </div>
                            </SelectItem>
                          );
                        }
                      )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-3">
                <Button
                  disabled={!selectedChain}
                  className="flex-1 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                  onClick={() => {
                    if (onSelectChain && selectedChain)
                      onSelectChain(selectedChain);
                    setShowChainModal(false);
                    handleCommicsion();
                  }}
                >
                  {t("noti.continue")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CommissionDetailsModal;
