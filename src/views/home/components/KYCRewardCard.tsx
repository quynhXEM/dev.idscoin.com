"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, XCircle, Gift } from "lucide-react"
import { useUserWallet } from "@/commons/UserWalletContext"
import { KYCForm } from "./KYCForm"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select"
import { useAppMetadata } from "@/commons/AppMetadataContext"
import { useNotification } from "@/commons/NotificationContext"


export function KYCRewardCard() {
  const [showKYCForm, setShowKYCForm] = useState<boolean>(false);
  const [kycreward, setKYCReward] = useState<any>(null);
  const [showChainModal, setShowChainModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedChain, setSelectedChain] = useState<string>("");
  const t = useTranslations("home");
  const tKyc = useTranslations("home.kyc_card");
  const { notify } = useNotification()
  const { account } = useUserWallet()
  const {
    custom_fields: { usdt_payment_wallets } = {
      usdt_payment_wallets: {},
    },
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
    setLoading(true);
    try {
      const amount = kycreward?.sum;

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
            type: "referral_kyc_bonus",
            affect_balance: true,
            description: `Withdraw ${amount} USDT ${usdt_payment_wallets[selectedChain].name} referral kyc bonus`,
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
      setLoading(false);
      setShowChainModal(false);
    } catch (error) {
      notify({
        title: t("noti.error"),
        message: t("noti.clamommicsionFailed", { error: error }),
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

  if (!account?.email_verified) return;
  return (
    <>
      <KYCForm isOpen={showKYCForm} onClose={setShowKYCForm} />
      <Card className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-emerald-700/50 shadow-lg shadow-emerald-500/20">
        <CardContent className="space-y-4">
          {/* Reward Information */}
          <div className="text-center p-4 bg-emerald-800/20 rounded-lg border border-emerald-600/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-bold text-emerald-400">{account?.kyc_status == "verified" ? kycreward?.sum : 1} USDT</span>
            </div>
            <p className="text-emerald-200 text-sm font-medium">{account?.kyc_status == "verified" ? tKyc("reward_description_verified") : tKyc("reward_description_unverified")}</p>
          </div>

          {/* Stats */}
          {account?.kyc_status == "verified" && (
            <>
              <Button
                variant="outline"
                disabled={loading || kycreward?.sum <= 0}
                className="w-full border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-600 hover:text-blue-300 bg-transparent cursor-pointer"
                size="sm"
                onClick={() => { setShowChainModal(true) }}
              >
                <Gift className="w-4 h-4 mr-2" />
                {tKyc("claim_reward", { amount: kycreward?.sum })}
              </Button>
            </>
          )}


          {!account?.kyc_status && (
            <div className="space-y-3">
              <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-300 font-medium text-sm">{tKyc("kyc_required")}</span>
                </div>
                <p className="text-yellow-200 text-xs">
                  {tKyc("kyc_required_description")}
                </p>
              </div>
              <Button
                onClick={() => setShowKYCForm(true)}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold"
              >
                <Shield className="w-4 h-4 mr-2" />
                {tKyc("start_kyc")}
              </Button>
            </div>
          )}
          {account?.kyc_status == "pending" && (
            <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-300 font-medium text-sm">{tKyc("pending_status")}</span>
              </div>
              <p className="text-yellow-200 text-xs">
                {tKyc("pending_description")}
              </p>
            </div>
          )}
          {account?.kyc_status == "rejected" && (<>
            <div className="p-3 bg-red-900/20 rounded-lg border border-red-700/50">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-300 font-medium text-sm">{tKyc("rejected_status")}</span>
              </div>
              <p className="text-red-200 text-xs">
                {account?.kyc_status_reason}
              </p>

            </div>
            <Button
              onClick={() => setShowKYCForm(true)}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold"
            >
              <Shield className="w-4 h-4 mr-2" />
              {tKyc("resubmit_request")}
            </Button>
          </>
          )}
        </CardContent>
      </Card>
      {showChainModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowChainModal(false)}
        >
          <Card
            className="w-full max-w-md mx-4 bg-gray-900 border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-white text-xl">
                {t("vip.selectChain")}
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
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent cursor-pointer"
                  onClick={() => setShowChainModal(false)}
                >
                  {t("vip.cancel")}
                </Button>
                <Button
                  disabled={!selectedChain}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                  onClick={() => {
                    handleClaimRewards();
                  }}
                >
                  {t("noti.continue")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
