import { useNotification } from "@/commons/NotificationContext";
import { useUserWallet } from "@/commons/UserWalletContext";
import { Button } from "@/components/ui/button";
import { EmailVerifyEmail } from "@/libs/email";
import { decryptObject, encryptObject } from "@/libs/secret";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export const VerifyEmail = () => {
    const t = useTranslations("home");
    const { account, refreshVerifyEmail } = useUserWallet();
    const [isSend, setIsSend] = useState(false);
    const { notify } = useNotification();
    const [loading, setLoading] = useState<boolean>(false)
    const locale = useLocale()

    const checktTimeOut = (getPriEmail: any) => {
        if (getPriEmail.result.length > 0) {
            const emailpre = getPriEmail.result[0];
            if (emailpre.date_created) {
                const sentTime = new Date(emailpre.date_created).getTime();
                const now = Date.now();
                // Nếu chưa quá 1 phút thì không cho gửi lại
                if (now - sentTime < 60 * 1000) {
                    notify({
                        title: t("referral.verifyEmail", { amount: 1 }),
                        message: t("verifyEmail.wait_1_minute"),
                        type: "warning"
                    })
                    return false;
                }
            }
        }
        return true
    }

    const handleVerify = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const getPriEmail = await fetch("/api/directus/request", {
                method: "POST",
                body: JSON.stringify({
                    type: "readItems",
                    collection: "email_outbox",
                    params: {
                        filter: {
                            to: {
                                _contains: account?.email
                            }
                        },
                        fields: ["status", "date_created"],
                        sort: "-date_created",
                        limit: 1
                    }
                })
            }).then(data => data.json())

            if (!checktTimeOut(getPriEmail)) return;

            const base64 = encodeURIComponent(encryptObject({
                username: account?.username,
                email: account?.email,
                wallet: account?.wallet_address
            }))
            

            const emailreq = await fetch("/api/directus/request", {
                method: "POST",
                body: JSON.stringify({
                    type: "createItem",
                    collection: "email_outbox",
                    items: {
                        "status": "scheduled",
                        "app_id": process.env.NEXT_PUBLIC_APP_ID,
                        "to": account?.email,
                        "subject": t("referral.verifyEmail", { amount: 1 }),
                        "email_template_id": null,
                        "body": EmailVerifyEmail(locale, account?.username || "#", base64)
                    }
                })
            })
            if (emailreq.ok) {
                setIsSend(true);
                notify({
                    title: t("referral.verifyEmail", { amount: 1 }),
                    message: t("verifyEmail.sent_success"),
                    type: "info"
                })
            }
        } catch (error) {
            notify({
                title: t("referral.verifyEmail", { amount: 1 }),
                message: t("verifyEmail.send_fail"),
                type: false
            })
        } finally {
            setLoading(false);
        }
    }

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
            <div onClick={handleVerify} className="w-full p-1 px-5 rounded-sm bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 border-blue-500 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 hover:scale-101 transition-all duration-100">
                <div className="overflow-hidden whitespace-nowrap flex justify-center ">
                    <div className="animate-marquee inline-block text-white font-semibold text-sm text-center pt-1">
                        ✉️ {t("referral.verifyEmail", { amount: 1 })}. {isSend && t("verifyEmail.resend_hint")}
                    </div>
                </div>
            </div>
            {isSend && <Button disabled={loading} variant="default" onClick={async () => {
                setLoading(true);
                await refreshVerifyEmail();
                setLoading(false);
            }} className="bg-gray-300 text-nowrap text-center text-black hover:bg-white text-sm cursor-pointer">
                {loading ? <Loader2 className="animate-spin" /> : t("verifyEmail.check_btn")}
                </Button>}
        </div>
    );
};