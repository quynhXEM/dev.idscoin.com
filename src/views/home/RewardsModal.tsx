import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Loader2, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserWallet } from "@/commons/UserWalletContext";
import { roundToFirstSignificantDecimal, formatNumber } from "@/libs/utils";
import { useAppMetadata } from "@/commons/AppMetadataContext";
import Link from "next/link";
import { useNotification } from "@/commons/NotificationContext";

interface RewardsModalProps {
  t: (key: string) => string;
  show: boolean;
  onClose: () => void;
  setShowNotificationModal: (show: boolean) => void;
  setNotificationData: (data: any) => void;
}

const RewardsModal: React.FC<RewardsModalProps> = ({
  t,
  show,
  onClose,
  setShowNotificationModal,
  setNotificationData,
}) => {
  if (!show) return null;
  const [isloading, setIsLoading] = useState<boolean>(false);

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
  const { account, addNewMember, wallet } = useUserWallet();
  const { notify } = useNotification();
  const {
    custom_fields: { ids_stake_wallet },
  } = useAppMetadata();

  const handleClaimRewards = async () => {
    setIsLoading(true);

    try {
      const transaction = await fetch("/api/directus/request", {
        method: "POST",
        body: JSON.stringify({
          type: "createItem",
          collection: "txn",
          items: {
            status: "completed",
            app_id: process.env.NEXT_PUBLIC_APP_ID,
            member_id: account?.id,
            amount: -account?.stake?.stake_dont_claw,
            currency: `IDS`,
            type: "stake_reward",
            affect_balance: true,
            description: `Claim: Received ${account?.stake?.stake_dont_claw} IDS`,
          },
        }),
      }).then((data) => data.json());

      if (!transaction.ok) {
        setNotificationData({
          title: t("noti.error"),
          message: t("noti.addTransactionError", {
            hash: txn.txHash,
          }),
          type: true,
        });
        setShowNotificationModal(true);
        return;
      }

      const txn = await fetch("/api/send/coin", {
        method: "POST",
        body: JSON.stringify({
          amount: account?.stake?.stake_dont_claw,
          to: account?.wallet_address,
        }),
      }).then((data) => data.json());

      if (!txn.success) {
        setNotificationData({
          title: t("noti.error"),
          message: t("noti.withdrawIDSError", {
            amount: account?.stake?.stake_dont_claw,
          }),
          type: false,
        });
        setShowNotificationModal(true);
        setIsLoading(false);
        return;
      }

      const transaction_update = await fetch("/api/directus/request", {
        method: "POST",
        body: JSON.stringify({
          type: "updateItem",
          collection: "txn",
          id: transaction.result.id,
          items: {
            affect_balance: false,
            external_ref: `${ids_stake_wallet.explorer_url}/tx/${txn.txHash}`,
          },
        }),
      }).then((data) => data.json());

      if (!transaction_update.ok) {
        setNotificationData({
          title: t("noti.error"),
          message: t("noti.addTransactionError", {
            hash: txn.txHash,
          }),
          type: true,
        });
        setShowNotificationModal(true);
        return;
      }

      await addNewMember(wallet);
      notify({
        title: t("noti.success"),
        children: (
          <Link
            href={`${ids_stake_wallet.explorer_url}/tx/${txn.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("noti.withdrawIDSsuccess", {
              amount: account?.stake?.stake_dont_claw,
              hash: "",
            })}
            <span className="text-blue-400 underline">
              {txn.txHash.slice(0, 13)}
            </span>
          </Link>
        ),
        type: true,
      });
      onClose();
    } catch (error) {
      setNotificationData({
        title: t("noti.error"),
        message: t("noti.withdrawIDSError", {
          amount: account?.stake?.stake_dont_claw,
        }),
        type: true,
      });
      setShowNotificationModal(true);
    } finally {
      setIsLoading(false);
    }
  };
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
          <CardTitle className="flex items-center text-white justify-between">
            <div className="flex items-center">
              <Gift className="w-5 h-5 mr-2 text-cyan-400" />
              {t("rewards.rewardsDetails")}
            </div>
            <XIcon className="text-white cursor-pointer scale-90 hover:scale-105" onClick={onClose} />
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t("rewards.rewardsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Rewards Status */}
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">
                {t("rewards.currentRewards")}
              </h3>
              <Badge
                variant="secondary"
                className="bg-cyan-700 text-cyan-300 hover:bg-cyan-600 hover:text-cyan-200"
              >
                {t("rewards.earning")}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {roundToFirstSignificantDecimal(account?.stake?.stake_dont_claw)} {t("staking.ids")}
                </div>
                <div className="text-sm text-gray-400">
                  {t("rewards.pending")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {formatNumber(account?.stake?.stake_in)} {t("staking.ids")}
                </div>
                <div className="text-sm text-gray-400">
                  {t("rewards.staking")}
                </div>
              </div>
            </div>
          </div>

          {/* Rewards History */}
          <div>
            <h3 className="font-semibold text-white mb-3">
              {t("rewards.rewardsHistory")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <div className="font-medium text-white">
                    {t("rewards.today")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("rewards.reward24h")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">
                    +{roundToFirstSignificantDecimal(account?.stake?.stake_dont_claw_24h)} {t("staking.ids")}
                  </div>
                  <div className="text-xs text-gray-500">
                    ~${roundToFirstSignificantDecimal(account?.stake?.stake_dont_claw_24h)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <div className="font-medium text-white">
                    {t("rewards.last7Days")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("rewards.earned")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">
                    +{roundToFirstSignificantDecimal(account?.stake?.stake_dont_claw_week)} {t("staking.ids")}
                  </div>
                  <div className="text-xs text-gray-500">
                    ~${roundToFirstSignificantDecimal(account?.stake?.stake_dont_claw_week)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <div className="font-medium text-white">
                    {t("rewards.last30Days")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("rewards.earned")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">
                    +{roundToFirstSignificantDecimal(account?.stake?.stake_dont_claw_month)}{t("staking.ids")}
                  </div>
                  <div className="text-xs text-gray-500">
                    ~${roundToFirstSignificantDecimal(account?.stake?.stake_dont_claw_month)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div>
                  <div className="font-medium text-white">
                    {t("rewards.total")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("rewards.fromStart")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400">
                    +{roundToFirstSignificantDecimal(account?.stake?.stake_dont_claw)} {t("staking.ids")}
                  </div>
                  <div className="text-xs text-gray-500">
                    ~${roundToFirstSignificantDecimal(account?.stake?.stake_dont_claw)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stake Positions */}
          <div>
            <h3 className="font-semibold text-white mb-3">
              {t("rewards.currentPositions")}
            </h3>
            <div className="space-y-2">
              {account?.stake_history?.lenght != 0 &&
                account?.stake_history.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {formatNumber(item.amount)} {t("staking.ids")}
                        </div>
                        <div className="text-sm text-gray-400">
                          {item?.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">
                        +
                        {roundToFirstSignificantDecimal(
                          Number(item.amount) *
                          Number(item.stake_apy) /
                          100 /
                          365
                        )}{" "}
                        {t("staking.ids")}/day
                      </div>
                      <div className="text-xs text-gray-500"></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Claim Information */}
          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
            <div className="text-center">
              <div className="text-blue-300 font-semibold mb-2">
                {t("rewards.claimInformation")}
              </div>
              <div className="text-sm text-blue-200 mb-3 space-y-1">
                <div>{t("rewards.dailyEarnings")}</div>
                <div>{t("rewards.canClaimAnytime")}</div>
                <div>{t("rewards.noTransactionFee")}</div>
                <div>{t("rewards.rewardsWillBeAdded")}</div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              disabled={isloading}
              className="flex-1 w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 cursor-pointer"
              onClick={handleClaimRewards}
            >
              {isloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Gift className="w-4 h-4 mr-2" />
              )}
              {t("rewards.claimIds", {
                amount: account?.stake?.stake_dont_claw,
              })}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsModal;
