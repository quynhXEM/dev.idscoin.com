"use client"
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { decryptObject } from "@/libs/secret";
import { useNotification } from "@/commons/NotificationContext";
import { CheckCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export const Verify = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true)
    const searchParams = useSearchParams();
    const { notify } = useNotification();
    const t = useTranslations("verify");

    useEffect(() => {
        const token = decodeURIComponent(searchParams.get("token") || "");
        if (!token) {
            router.replace("/home");
            return;
        }
        const data = decryptObject(token);
        verify(JSON.parse(data));
    }, []);

    async function verify(data: any) {
        if (!data) {
            setLoading(false)
            notify({
                title: t("error_title"),
                message: t("error_invalid_token"),
                type: false
            })
            return;
        };

        const getInfo = await fetch("/api/directus/request", {
            method: "POST",
            body: JSON.stringify({
                type: "readItems",
                collection: "member",
                params: {
                    filter: {
                        username: data.username,
                        email: data.email,
                        wallet_address: data.wallet,
                        app_id: process.env.NEXT_PUBLIC_APP_ID
                    },
                    limit: 1
                }
            })
        }).then(data => data.json())
            .then(data => data?.result?.[0])

        if (getInfo?.id && !getInfo?.email_verified) {
            const updateInfo = await fetch("/api/directus/request", {
                method: "POST",
                body: JSON.stringify({
                    type: "updateItem",
                    collection: "member",
                    id: getInfo?.id,
                    items: {
                        email_verified: true
                    }
                })
            }).then(data => data.json())

            if (updateInfo.ok) {
                const txn = await fetch("/api/send/coin", {
                    method: "POST",
                    body: JSON.stringify({
                        amount: 1,
                        to: getInfo?.wallet_address,
                    }),
                }).then((data) => data.json());
                setLoading(false)
                notify({
                    title: t("success_title"),
                    message: t("success_message"),
                    type: true
                })
            } else {
                setLoading(false)
                notify({
                    title: t("error_title"),
                    message: t("error_update"),
                    type: false
                })
            }

        } else {
            setLoading(false)
            notify({
                title: t("info_title"),
                message: t("info_already_verified"),
                type: "info"
            })
        }

    }
    return <div className="flex justify-center items-center h-screen flex-col gap-4 flex-col">
        {loading ? <Loader2 className="animate-spin text-primary" size={40} /> : <CheckCircle className="text-primary" size={40} />}
        <p className="text-lg font-bold">{loading ? t("verifying") : t("verify_done")}</p>
    </div>
}

export default Verify;