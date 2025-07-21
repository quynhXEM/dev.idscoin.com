import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, HandCoins, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotification } from "@/commons/NotificationContext";
import { timeFormat } from "@/libs/utils";
import { Separator } from "@/components/ui/separator";
import { useAppMetadata } from "@/commons/AppMetadataContext";
import { useUserWallet } from "@/commons/UserWalletContext";

interface CommissionDetailsModalProps {
  t: (key: string) => string;
  show: boolean;
  onClose: () => void;
  setShowVipModal: (v: boolean) => void;
}

const CommissionDetailsModal: React.FC<CommissionDetailsModalProps> = ({
  t,
  show,
  onClose,
  setShowVipModal,
}) => {
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const { account, isVip } = useUserWallet();
  // const { custom_fields: {ids_distribution_wallet}} = useAppMetadata()
  const [txnCommicsion, setTxnCommicsion] = useState<any[]>([]);
  const handleCommicsion = async () => {
    if (txnCommicsion.length === 0) return;
    setLoading(true);
    try {
      const total_amount = txnCommicsion.reduce(
        (acc, item) => acc + Number(item.amount),
        0
      );
      setTimeout(() => {
        setLoading(false);
        notify({
          title: t("noti.success"),
          message: t("noti.clamommicsionSuccess", {amount: total_amount}),
          type: true,
        });
        onClose()
      }, 2000);
      // const txn = await fetch("/api/send/token", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     amount: total_amount,
      //     rpc: ,
      //     token_address: "0x0000000000000000000000000000000000000000",
      //     to: account?.id,
      //     chain_id: 100,
      //   }),
      // });
    } catch (error) {
      notify({
        title: t("noti.error"),
        message: t("noti.clamommicsionFailed"),
        type: false,
      });
      setLoading(false);
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
            fields: ["*", "parent_txn_id.*"],
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

  if (!show) return;
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={() => onClose()}
    >
      <Card
        className="w-full max-w-lg mx-4 bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="flex items-center text-white text-xl">
            <Gift className="w-5 h-5 mr-2 text-cyan-400 " />
            {t("referral.details")}
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
                variant={isVip ? "default" : "secondary"}
                className={
                  isVip
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200"
                }
              >
                {isVip ? "VIP" : "Miễn phí"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {!isVip ? "5%" : "50%"}
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
              {txnCommicsion.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div>
                    <div className="font-medium text-white">
                      {timeFormat(item.date_created)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.description.slice(0, 15)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">
                      +${item.amount}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t("referral.fromUpgrade100")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator className="bg-gray-700" />
          <div className="flex justify-between">
            <span className="text-gray-400 text-md">
              {t("referral.totalCommicsion")}:
            </span>
            <span className="font-semibold text-white">
              {txnCommicsion.reduce(
                (acc, item) => acc + Number(item.amount),
                0
              )}{" "}
              USDT
            </span>
          </div>

          {/* Top Referrals */}
          {/* <div>
            <h3 className="font-semibold text-white mb-3">
              {t("referral.topReferrals")}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-white">User***123</div>
                    <div className="text-sm text-gray-400">
                      {t("referral.5VipUpgrades")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">
                    +${!isVip ? "25.00" : "250.00"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-white">User***456</div>
                    <div className="text-sm text-gray-400">
                      {t("referral.4VipUpgrades")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">
                    +${!isVip ? "20.00" : "200.00"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-white">User***789</div>
                    <div className="text-sm text-gray-400">
                      {t("referral.3VipUpgrades")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">
                    +${!isVip ? "15.00" : "150.00"}
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {!isVip && (
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
              disabled={loading || txnCommicsion.length === 0}
              className="flex-2 border-gray-700 text-gray-300 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:text-gray-200 cursor-pointer"
              onClick={() => handleCommicsion()}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <HandCoins className="w-4 h-4 mr-2" />
              )}
              {t("referral.clamCommicsion")}
            </Button>
            <Button
              variant="outline"
              disabled={loading}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent cursor-pointer"
              onClick={() => onClose()}
            >
              {t("referral.close")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionDetailsModal;
