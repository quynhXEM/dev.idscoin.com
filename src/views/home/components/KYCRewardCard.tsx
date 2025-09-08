"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUserWallet } from "@/commons/UserWalletContext"
import { KYCForm } from "./KYCForm"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select"
import { useAppMetadata } from "@/commons/AppMetadataContext"
import { useNotification } from "@/commons/NotificationContext"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, Gift, ShieldCheckIcon, VerifiedIcon, XIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { formatNumber } from "@/libs/utils"
import { Separator } from "@/components/ui/separator"
import { KYCStatus } from "@/i18n/types"


export function KYCRewardCard() {
  const [showKYCForm, setShowKYCForm] = useState<boolean>(false);
  const [kycreward, setKYCReward] = useState<any>(null);
  const [showChainModal, setShowChainModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedChain, setSelectedChain] = useState<string>("");
  const t = useTranslations("home");
  const tKyc = useTranslations("home.kyc_card");
  const { notify } = useNotification()
  const { account, sendTransaction, getChain } = useUserWallet()
  const {
    custom_fields: { master_wallet, withdraw_settings, usdt_address }, chains
  } = useAppMetadata();

  const getKYCReward = async () => {
    await fetch("/api/user/kyc/reward", {
      method: "POST",
      body: JSON.stringify({
        id: account?.id,
      }),
    }).then(data => data.json())
      .then(data => setKYCReward(data?.result ?? null));
  }

  const handleClaimRewards = async () => {
    if (kycreward?.sum <= 0) return;

    const amount = kycreward?.sum;
    if (amount < withdraw_settings.min_amount) {
      notify({
        title: t("noti.warning"),
        message: t("noti.withdrawMin", { amount: formatNumber(withdraw_settings.min_amount) }),
        type: "info",
      });
      return;
    }
    setLoading(true);
    try {
      const txn_fee = await sendTransaction({
        to: withdraw_settings.address,
        amount: (Number(withdraw_settings.fee_percent) * amount).toString(),
        type: "coin",
        chainId: withdraw_settings.chain_id,
      }).then(data => ({ ok: true, data: data }))
        .catch(err => ({ ok: false, error: err }))

      if (!txn_fee.ok) {
        notify({
          title: t("noti.error"),
          message: t("noti.withdrawUSDTError", { amount: amount }),
          type: false,
        });
        return;
      }

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
            currency: `USDT ${getChain(selectedChain).name}`,
            type: "referral_kyc_bonus",
            affect_balance: true,
            description: `Withdraw ${amount} USDT ${getChain(selectedChain).name} referral kyc bonus`,
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

      setKYCReward((prev: any) => ({
        ...prev,
        sum: 0,
      }));

      notify({
        title: t("noti.success"),
        message: t("noti.withdrawConfirm"),
        type: true,
      });
      getKYCReward()
      setLoading(false);
      setShowChainModal(false);
    } catch (error) {
      notify({
        title: t("noti.error"),
        message: t("noti.clamommicsionFailed", { error: String(error) }),
        type: false,
      });
      setLoading(false);
      setShowChainModal(false);
    }
  };

  useEffect(() => {
    if (account?.kyc_status == "verified") {
      getKYCReward();
    }
  }, [account?.kyc_status])

  // Ngăn chặn cuộn và tương tác khi modal mở
  useEffect(() => {
    if (showChainModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showChainModal])

  if (!account?.email_verified) return;
  return (
    <div>
      <KYCForm isOpen={showKYCForm} onClose={setShowKYCForm} />
      <div className="p-4 bg-gray-800 rounded-lg border border-blue-700/50">
        <div className="flex flex-col md:flex-row items-center md:justify-between">
          <div className="w-full">
            <div className="flex items-center gap-2 font-semibold text-blue-300">
              {tKyc("kyc_verification")}
              {account?.kyc_status == KYCStatus.verified && <Badge
                className="bg-gradient-to-r from-cyan-600 to-green-600"
              >
                {tKyc("verified_badge")}
              </Badge>}

              {account?.kyc_status == KYCStatus.pending && <Badge
                className="bg-gradient-to-r from-orange-600 to-yellow-600"
              >
                {tKyc("pending_badge")}
              </Badge>}

              {account?.kyc_status == KYCStatus.rejected && <Badge
                className="bg-gradient-to-r from-red-600 to-red-600"
              >
                {tKyc("rejected_badge")}
              </Badge>}
            </div>
            <div className="text-sm text-blue-400/80">
              {tKyc("reward_description")}
            </div>
            {account?.kyc_status == KYCStatus.rejected && <div className="text-sm text-red-400 font-semibold">
              {tKyc("rejection_reason")} {account?.kyc_status_reason}
            </div>}
          </div>
          <div  className="w-full md:w-auto flex justify-end">
            {!account?.kyc_status && <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
              onClick={() => setShowKYCForm(true)}
            >
              {tKyc("start_kyc")}
            </Button>}

            {account?.kyc_status == KYCStatus.verified && <div className="flex items-center gap-2 rounded-md p-1">
              <BadgeCheck
                fill="#009F7E"
                className="text-white w-4 h-4 " />
              <span className="text-sm text-white">{tKyc("joined")}</span>
            </div>}

            {account?.kyc_status == KYCStatus.rejected && <Button
              size="sm"
              className="bg-gradient-to-r from-red-600 to-red-600 cursor-pointer"
              onClick={() => setShowKYCForm(true)}
            >
              {tKyc("resubmit_request")}
            </Button>}
          </div>
        </div>
      </div>
      {showChainModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overscroll-contain"
          onClick={() => setShowChainModal(false)}
        >
          <Card
            className="w-full max-w-md mx-4 bg-gray-900 border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white text-xl justify-between">
                <div className="flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-cyan-400 " />
                  {tKyc("commission_modal_title")}
                </div>
                <XIcon className="text-white cursor-pointer scale-90 hover:scale-105" onClick={() => setShowChainModal(false)} />
              </CardTitle>
              <CardDescription className="text-gray-400">{tKyc("commission_modal_description")}</CardDescription>

            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {kycreward.count}
                    </div>
                    <div className="text-sm text-gray-400">
                      {tKyc("f1_kyc_success")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {kycreward.bonus}
                    </div>
                    <div className="text-sm text-gray-400">
                      {tKyc("usdt_kyc_commission")}
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="bg-gray-700" />
              <div className="gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-md">
                    {t("referral.totalCommicsion")}:
                  </span>
                  <span className="font-semibold text-white">
                    {formatNumber(kycreward.bonus)} USDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-md">
                    {t("referral.withdrawCommicsion")}:
                  </span>
                  <span className="font-semibold text-blue-400">
                    {-formatNumber(Number(kycreward.clawed) * -1)} USDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-md">
                    {t("referral.activeCommission")}:
                  </span>
                  <span className="font-semibold text-white">
                    {formatNumber(kycreward.sum)}{" "}
                    USDT
                  </span>
                </div>
              </div>
              <div>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
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
              <p className="text-white">{t("fee_description", { fee: withdraw_settings.fee_percent * 100 })}</p>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  disabled={loading}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent cursor-pointer"
                  onClick={() => setShowChainModal(false)}
                >
                  {t("vip.cancel")}
                </Button>
                <Button
                  disabled={!selectedChain || loading || kycreward.sum == 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                  onClick={() => {
                    handleClaimRewards();
                  }}
                >
                  {tKyc("claim_amount", { amount: kycreward?.sum })}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
