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
} from "lucide-react";
import { useUserStatus, useUserWallet } from "@/commons/UserWalletContext";

interface ReferralSectionProps {
  t: (key: string) => string;
  onShowVipModal: () => void;
  onShowCommissionModal: () => void;
}

export function ReferralSection({
  t,
  onShowVipModal,
  onShowCommissionModal,
}: ReferralSectionProps) {
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [registrationUsername, setRegistrationUsername] = useState("");
  const [copied, setCopied] = useState(false);
  const {
    connectWallet,
    isConnected,
    wallet,
  } = useUserWallet();
  const { isRegister, isVip, setIsRegister } = useUserStatus();

  const referralLink = `https://idscoin.com/ref/${
    registrationUsername || "USER123456"
  }`;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleRegistration = () => {
    if (registrationEmail && registrationUsername) {
      setIsRegister(true);
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Share2 className="w-5 h-5 mr-2 text-blue-400" />
            Giới thiệu bạn bè
          </CardTitle>
          <CardDescription className="text-gray-400">
            Kết nối ví để bắt đầu kiếm hoa hồng từ việc giới thiệu bạn bè
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-8 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
            <Wallet className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Cần kết nối ví
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Kết nối ví để tạo link giới thiệu và bắt đầu kiếm hoa hồng
            </p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={connectWallet}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Kết nối ví ngay
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-blue-400">5% - 50%</div>
              <div className="text-xs text-gray-400">Hoa hồng USDT</div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-emerald-400">$100</div>
              <div className="text-xs text-gray-400">Phí nâng cấp VIP</div>
            </div>
          </div>

          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
            <div className="text-sm text-blue-300 space-y-2">
              <div className="font-semibold text-blue-200 mb-2">
                💡 Cách thức hoạt động:
              </div>
              <div className="space-y-1 text-blue-200">
                <div>• Kết nối ví để tạo link giới thiệu cá nhân</div>
                <div>• Chia sẻ link với bạn bè</div>
                <div>• Nhận 5% hoa hồng khi F1 nâng cấp VIP ($5 từ $100)</div>
                <div>• Nâng cấp VIP để nhận 50% hoa hồng ($50 từ $100)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isRegister) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Share2 className="w-5 h-5 mr-2 text-blue-400" />
            Tạo link giới thiệu
          </CardTitle>
          <CardDescription className="text-gray-400">
            Tạo link giới thiệu cá nhân để bắt đầu kiếm hoa hồng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 bg-gray-800 rounded-lg border border-yellow-600/50">
            <div className="text-center mb-4">
              <UserPlus className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Tạo link giới thiệu
              </h3>
              <p className="text-gray-400 text-sm">
                Ví đã được kết nối. Vui lòng điền thông tin để tạo link giới
                thiệu cá nhân.
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
                <div className="relative">
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
                <div className="relative">
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
                  Link của bạn sẽ là: idscoin.com/ref/
                  {registrationUsername || "username"}
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                onClick={handleRegistration}
                disabled={!registrationEmail || !registrationUsername}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Tạo link giới thiệu
              </Button>
            </div>
          </div>

          <div className="p-4 bg-green-900/20 rounded-lg border border-green-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-300 font-medium">
                Ví đã kết nối
              </span>
            </div>
            <p className="text-xs text-green-200">Địa chỉ: {wallet?.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-blue-400">5% - 50%</div>
              <div className="text-xs text-gray-400">Hoa hồng USDT</div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-lg font-bold text-emerald-400">$100</div>
              <div className="text-xs text-gray-400">Phí nâng cấp VIP</div>
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
            Giới thiệu bạn bè
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
              {isVip ? "VIP" : "Miễn phí"}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-400">
          {!isVip
            ? "Nhận hoa hồng 5% USDT khi F1 nâng cấp VIP"
            : "Nhận hoa hồng 50% USDT khi F1 nâng cấp VIP"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isVip && (
          <div className="p-4 bg-gray-800 rounded-lg border border-blue-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-blue-300">Nâng cấp VIP</div>
                <div className="text-sm text-blue-400/80">
                  Nhận 50% hoa hồng thay vì 5%
                </div>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={onShowVipModal}
              >
                Nâng cấp $100
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-800 rounded-lg border-2 border-dashed border-blue-600/50">
          <div className="text-center mb-3">
            <UserPlus className="w-8 h-8 mx-auto text-blue-400 mb-2" />
            <div className="text-sm font-medium text-blue-300">
              Link giới thiệu của bạn
            </div>
            <div className="text-xs text-gray-400">
              Hoa hồng: {!isVip ? "5%" : "50%"} USDT
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              value={referralLink}
              readOnly
              className="text-xs bg-gray-700 border-gray-600 text-gray-300"
            />
            <Button
              size="sm"
              onClick={copyReferralLink}
              className={
                copied
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              {copied ? (
                <>
                  <Shield className="w-4 h-4 mr-1" />
                  Đã copy
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-lg font-bold text-blue-400">12</div>
            <div className="text-xs text-gray-400">Bạn bè đã tham gia</div>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-lg font-bold text-emerald-400">
              ${!isVip ? "22.84" : "228.35"}
            </div>
            <div className="text-xs text-gray-400">USDT hoa hồng</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Hoa hồng hôm nay:</span>
            <span className="text-emerald-400">
              +${!isVip ? "0.62" : "6.15"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Hoa hồng tháng này:</span>
            <span className="text-emerald-400">
              +${!isVip ? "14.23" : "142.25"}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-600 hover:text-blue-300 bg-transparent"
            size="sm"
            onClick={onShowCommissionModal}
          >
            <Gift className="w-4 h-4 mr-2" />
            Xem chi tiết hoa hồng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
