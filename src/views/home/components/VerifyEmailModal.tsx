import { useNotification } from "@/commons/NotificationContext";
import { useUserWallet } from "@/commons/UserWalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailVerifyEmail } from "@/libs/email";
import { encryptObject } from "@/libs/secret";
import { Inbox, Info, Loader2, Send, Shield } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";

export const VerifyEmailModal = ({
    show, setShow
}: {
    show: boolean,
    setShow: (show: boolean) => void
}) => {
    const { account, refreshVerifyEmail } = useUserWallet();
    const t = useTranslations("home");
    const [email, setEmail] = useState<string>(account?.email || "");
    const { notify } = useNotification();
    const [loading, setLoading] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);
    const [showGuidance, setShowGuidance] = useState<boolean>(false);
    const locale = useLocale();

    // Xử lý đếm ngược
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [countdown]);

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
        if (loading || countdown > 0) return;
        setLoading(true);
        try {
            const is_verify = await refreshVerifyEmail()
            if (is_verify) return;
            if (email !== account?.email) {
                const updateEmail = await fetch("/api/directus/request", {
                    method: "POST",
                    body: JSON.stringify({
                        type: "updateItem",
                        collection: "member",
                        id: account?.id,
                        items: {
                            email: email
                        }
                    })
                }).then(data => data.json())
                if (!updateEmail?.ok) {
                    notify({
                        title: "Cập nhật email thất bại",
                        message: updateEmail?.error?.errors?.[0]?.message,
                        type: false
                    });
                    return;
                }
            }

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
                        "to": email,
                        "subject": t("referral.verifyEmail", { amount: 1 }),
                        "email_template_id": null,
                        "body": EmailVerifyEmail(locale, account?.username || "#", base64, email)
                    }
                })
            })
            if (emailreq.ok) {
                notify({
                    title: t("referral.verifyEmail", { amount: 1 }),
                    message: t("verifyEmail.sent_success"),
                    type: "info"
                });
                // Bắt đầu đếm ngược 120 giây
                setCountdown(120);
                // Hiển thị thông báo hướng dẫn
                setShowGuidance(true);
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

    if (!show) return null;

    return <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        onClick={() => setShow(false)}
    >
        <Card
            className="w-full max-w-lg mx-4 bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <CardHeader>
                <CardTitle className="flex items-center text-white text-xl">
                    <Inbox className="w-5 h-5 mr-2 text-cyan-400 " />
                    Xác minh email
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Xác minh email để đảm bảo bạn nhận được các thông tin quan trọng.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col justify-center gap-3s text-white">
                    <p>👉 Xác minh email giúp chúng tôi luôn giữ liên kết với bạn.</p>
                    <p>👉 Email của bạn sẽ không được tiết lộ với bất kì bên thứ ba.</p>
                </div>
                <div className="flex flex-col gap-2 text-white">
                    <Label>Email:<Info className="tooltips-email w-3 h-3" />
                    </Label>
                    <Tooltip
                        anchorSelect=".tooltips-email"
                        place="top"
                        className="text-wrap outline-none"
                        style={{ maxWidth: 270, zIndex: 100 }}
                    >
                        Giữ nguyên nếu email chính xác hoặc bạn có thể nhập email mới để cập nhật và xác thực.
                    </Tooltip>
                    <Input
                        value={email}
                        disabled={loading}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Thông báo hướng dẫn sau khi gửi email */}
                {showGuidance && (
                    <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Inbox className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-300 font-semibold text-sm">{t("verifyEmail.check_email_title")}</span>
                        </div>
                        <div className="text-sm text-blue-200 space-y-1">
                            <p dangerouslySetInnerHTML={{
                                __html: t("verifyEmail.email_sent_to", { email: `<strong>${email}</strong>` })
                            }} />
                            <p>{t("verifyEmail.follow_instructions")}</p>
                            <p>{t("verifyEmail.check_spam")}</p>
                            <p>👇️ Xác minh thành công rồi nhấn vào nút bên dưới để cập nhật trạng thái tài khoản</p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-gray-700 text-gray-300 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:text-gray-200 cursor-pointer"
                            onClick={refreshVerifyEmail}
                        >
                            Tôi đã xác minh email
                        </Button>
                    </div>
                )}

                <div className="flex justify-center gap-3">
                    <Button
                        variant="outline"
                        disabled={loading || countdown > 0 || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
                        className="flex-2 border-gray-700 text-gray-300 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:text-gray-200 cursor-pointer"
                        onClick={handleVerify}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4 mr-2" />
                        )}
                        {loading
                            ? t("verifyEmail.sending")
                            : countdown > 0
                                ? t("verifyEmail.resend_after", { seconds: countdown })
                                : t("verifyEmail.send_verification")
                        }
                    </Button>
                    <Button
                        variant="outline"
                        disabled={loading}
                        className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent cursor-pointer"
                        onClick={() => setShow(false)}
                    >
                        {t("referral.close")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
}