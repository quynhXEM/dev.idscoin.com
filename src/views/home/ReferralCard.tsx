"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Wallet,
  UserPlus,
  Copy,
  Shield,
  Gift,
  Mail,
  User,
  Loader2,
} from "lucide-react";
import { useUserWallet } from "@/commons/UserWalletContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ReferralSectionProps {
  t: (key: string, params?: Record<string, string>) => string;
  onShowVipModal: () => void;
  onShowCommissionModal: () => void;
  setShowNotificationModal: (show: boolean) => void;
  setNotificationData: (data: any) => void;
}

export function ReferralSection({
  t,
  onShowVipModal,
  onShowCommissionModal,
  setShowNotificationModal,
  setNotificationData,
}: ReferralSectionProps) {
  const { connectWallet, isConnected, wallet, account, loading } =
    useUserWallet();
  const [registrationEmail, setRegistrationEmail] = useState(
    account?.email || ""
  );
  const [registrationUsername, setRegistrationUsername] = useState(
    account?.username || ""
  );
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const { isRegister, isVip, setIsRegister } = useUserWallet();

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_WEB_URL}${
          registrationUsername || account?.username
        }`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleRegistration = async () => {
    if (!registrationEmail || !registrationUsername) return;
    setIsLoading(true);
    const update_info = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "updateItem",
        collection: "member",
        id: account?.id,
        items: {
          email: registrationEmail,
          username: registrationUsername,
        },
      }),
    }).then((data) => data.json());
    if (update_info.ok) {
      setIsRegister(true);
      connectWallet();
    } else {
      setNotificationData({
        title: t("noti.error"),
        message: update_info.error.errors[0].message,
        type: false,
      });
      setShowNotificationModal(true);
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <div className="w-8 h-8 mr-2">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-8 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center">
            <Skeleton className="w-16 h-16 mb-4 rounded-full" />
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!isConnected && !isRegister) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Share2 className="w-5 h-5 mr-2 text-blue-400" />
            <p className="text-2xl">{t("referral.introduce")}</p>
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t("referral.connectWallettoRef")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-8 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
            <Wallet className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {t("referral.connectWallet")}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {t("referral.connectWalletSub")}
            </p>
            <Button
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
              onClick={() => connectWallet()}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {t("staking.connectWalletBtn")}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-blue-400">5% - 50%</div>
              <div className="text-xs text-gray-400">
                {t("referral.commicsionusdt")}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-emerald-400">$100</div>
              <div className="text-xs text-gray-400">
                {t("referral.vipfee")}
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
            <div className="text-sm text-blue-300 space-y-2">
              <div className="font-semibold text-blue-200 mb-2">
                💡 {t("referral.howtowork")}
              </div>
              <div className="space-y-1 text-blue-200">
                <div>• {t("referral.wallettolink")}</div>
                <div>• {t("referral.sharelink")}</div>
                <div>• {t("referral.commicsion")}</div>
                <div>• {t("referral.vipcommicsion")}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  

  if (!isRegister && !loading && !isVip) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Share2 className="w-5 h-5 mr-2 text-blue-400" />
            <p className="text-2xl">{t("referral.createlink")}</p>
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t("referral.createlinkcommicsion")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 bg-gray-800 rounded-lg border border-yellow-600/50">
            <div className="text-center mb-4">
              <UserPlus className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("referral.createlink")}
              </h3>
              <p className="text-gray-400 text-sm">
                {t("referral.detailsDescription")}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="registration-email"
                  className="text-white font-semibold"
                >
                  Email
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="registration-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registrationEmail}
                    onChange={(e) => setRegistrationEmail(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-500"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="registration-username"
                  className="text-white font-semibold"
                >
                  Username (Mã giới thiệu)
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="registration-username"
                    placeholder="username123"
                    value={registrationUsername}
                    onChange={(e) =>
                      setRegistrationUsername(
                        e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")
                      )
                    }
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-500"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {t("referral.yourLink")}: {process.env.NEXT_PUBLIC_WEB_URL}
                  {registrationUsername || "username"}
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 cursor-pointer"
                onClick={handleRegistration}
                disabled={
                  !registrationEmail || !registrationUsername || isloading
                }
              >
                {isloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {t("referral.createlink")}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-green-900/20 rounded-lg border border-green-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-300 font-medium">
                {t("referral.walletconnected")}
              </span>
            </div>
            <p className="text-xs text-green-200">Địa chỉ: {wallet?.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-blue-400">5% - 50%</div>
              <div className="text-xs text-gray-400">
                {t("referral.earn5").replace(/\d+%/, "USDT")}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-emerald-400">$100</div>
              <div className="text-xs text-gray-400">
                {t("vip.upgradeCost")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-white">
            <Share2 className="w-5 h-5 mr-2 text-blue-400" />
            <p className="text-2xl">{t("referral.introduce")}</p>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={isVip ? "default" : "secondary"}
              className={
                isVip
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-200"
              }
            >
              {isVip ? "VIP" : t("referral.free")}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-400">
          {!isVip ? t("referral.earn5") : t("referral.earn50")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isVip && (
          <div className="p-4 bg-gray-800 rounded-lg border border-blue-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-blue-300">
                  {t("vip.upgrade")}
                </div>
                <div className="text-sm text-blue-400/80">
                  {t("vip.upgrade50")}
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                onClick={onShowVipModal}
              >
                {t("vip.upgrade100")}
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-800 rounded-lg border-2 border-dashed border-blue-600/50">
          <div className="text-center mb-3">
            <UserPlus className="w-8 h-8 mx-auto text-blue-400 mb-2" />
            <div className="text-sm font-medium text-blue-300">
              {t("referral.yourLink")}
            </div>
            <div className="text-xs text-gray-400">
              {t("referral.earn", { percent: !isVip ? "5%" : "50%" })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              value={`${process.env.NEXT_PUBLIC_WEB_URL}${account?.username}`}
              readOnly
              className="text-xs bg-gray-700 border-gray-600 text-gray-300"
            />
            <Button
              size="sm"
              onClick={copyReferralLink}
              className={`cursor-pointer ${
                copied
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {copied ? (
                <>
                  <Shield className="w-4 h-4 mr-1" />
                  {t("referral.copied")}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  {t("referral.copy")}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-lg font-bold text-blue-400">{account?.f1}</div>
            <div className="text-xs text-gray-400">
              {t("referral.friendsJoined")}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-lg font-bold text-emerald-400">
              ${account?.commission?.all || 0}
            </div>
            <div className="text-xs text-gray-400">
              {t("referral.usdtEarnings")}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{t("referral.todayEarnings")}</span>
            <span className="text-emerald-400">
              +${account?.commission?.day || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">
              {t("referral.monthlyEarnings")}
            </span>
            <span className="text-emerald-400">
              +${account?.commission?.month || 0}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-600 hover:text-blue-300 bg-transparent cursor-pointer"
            size="sm"
            onClick={onShowCommissionModal}
          >
            <Gift className="w-4 h-4 mr-2" />
            {t("referral.viewDetails")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
