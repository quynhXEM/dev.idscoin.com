import { useUserWallet } from "@/commons/UserWalletContext";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { VerifyEmailModal } from "./VerifyEmailModal";

export const VerifyEmail = () => {
    const t = useTranslations("home");
    const { account } = useUserWallet();
    const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
    

    if (account?.email_verified) {
        return null;
    }
    return (
        <div className="flex flex-row gap-2">
            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
            <div onClick={() => setShowVerifyEmailModal(true)} className="w-full p-1 px-5 rounded-sm bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 border-blue-500 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 hover:scale-101 transition-all duration-100">
                <div className="overflow-hidden whitespace-nowrap flex justify-center ">
                    <div className="animate-marquee inline-block text-white font-semibold text-sm text-center pt-1">
                        ✉️ {t("referral.verifyEmail", { amount: 1 })}
                    </div>
                </div>
            </div>
            <VerifyEmailModal show={showVerifyEmailModal} setShow={setShowVerifyEmailModal} />
        </div>
    );
};