"use client"
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { decryptObject } from "@/libs/secret";
import { useNotification } from "@/commons/NotificationContext";
import { CheckCircle, Loader2, XCircle, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface VerificationStep {
    id: number;
    message: string;
    completed: boolean;
    hash?: string;
    error?: boolean;
}

type VerificationStatus = 'loading' | 'success' | 'error' | 'info' | 'already_verified';

export const Verify = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true)
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [steps, setSteps] = useState<VerificationStep[]>([]);
    const [status, setStatus] = useState<VerificationStatus>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const searchParams = useSearchParams();
    const { notify } = useNotification();
    const t = useTranslations("verify");

    useEffect(() => {
        // Khởi tạo các bước
        const initialSteps: VerificationStep[] = [
            { id: 1, message: t("step_1"), completed: false },
            { id: 2, message: t("step_2"), completed: false }
        ];
        setSteps(initialSteps);

        const token = decodeURIComponent(searchParams.get("token") || "");
        if (!token) {
            router.replace("/home");
            return;
        }
        const data = decryptObject(token);
        verify(JSON.parse(data));
    }, []);

    const updateStepCompleted = (stepId: number, hash?: string) => {
        setSteps(prevSteps => 
            prevSteps.map(step => 
                step.id === stepId 
                    ? { ...step, completed: true, hash }
                    : step
            )
        );
    };

    async function verify(data: any) {
        if (!data) {
            setLoading(false)
            setStatus('error')
            setErrorMessage(t("error_invalid_token"))
            return;
        };

        try {
            // Bước 1: Xác minh email
            setCurrentStep(1);
            
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
                    // Hoàn thành bước 1
                    updateStepCompleted(1);
                    
                    // Bước 2: Gửi coin
                    setCurrentStep(2);
                    
                    const txn = await fetch("/api/send/coin", {
                        method: "POST",
                        body: JSON.stringify({
                            amount: 1,
                            to: getInfo?.wallet_address,
                        }),
                    }).then((data) => data.json());
                    
                    // Hoàn thành bước 2 - luôn đánh dấu hoàn thành khi gọi API thành công
                    const txnHash = txn?.hash || txn?.transactionHash || txn?.txHash || 'Transaction completed';
                    updateStepCompleted(2, txnHash);
                    
                    setLoading(false)
                    setCurrentStep(0);
                    setStatus('success')
                } else {
                    setLoading(false)
                    setStatus('error')
                    setErrorMessage(t("error_update"))
                }

            } else {
                setLoading(false)
                setStatus('already_verified')
            }
        } catch (error) {
            setLoading(false)
            setStatus('error')
            setErrorMessage(t("error_update"))
        }
    }
    // Render cho trường hợp lỗi
    if (status === 'error') {
        return (
            <div className="flex justify-center items-center h-screen flex-col gap-6 p-8 max-w-md mx-auto">
                <div className="text-center">
                    <XCircle className="text-red-500 mx-auto mb-4" size={60} />
                    <h1 className="text-2xl font-bold text-red-600 mb-2">
                        {t("error_title")}
                    </h1>
                    <p className="text-gray-600">
                        {errorMessage}
                    </p>
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    {t("retry_button")}
                </button>
            </div>
        );
    }

    // Render cho trường hợp đã được xác minh
    if (status === 'already_verified') {
        return (
            <div className="flex justify-center items-center h-screen flex-col gap-6 p-8 max-w-md mx-auto">
                <div className="text-center">
                    <AlertCircle className="text-blue-500 mx-auto mb-4" size={60} />
                    <h1 className="text-2xl font-bold text-blue-600 mb-2">
                        {t("info_title")}
                    </h1>
                    <p className="text-gray-600">
                        {t("info_already_verified")}
                    </p>
                </div>
                <button 
                    onClick={() => window.close()} 
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                    {t("close_window")}
                </button>
            </div>
        );
    }

    // Render bình thường cho quá trình xác minh
    return (
        <div className="flex justify-center items-center h-screen flex-col gap-6 p-8 max-w-md mx-auto">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {t("verify_done")}
                </h1>
                {loading && (
                    <p className="text-sm text-gray-600">
                        {t("please_wait")}
                    </p>
                )}
            </div>

            <div className="w-full space-y-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                            {step.completed ? (
                                <CheckCircle className="text-green-500" size={20} />
                            ) : currentStep === step.id ? (
                                <Loader2 className="animate-spin text-primary" size={20} />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className={`font-medium ${step.completed ? 'text-green-600' : currentStep === step.id ? 'text-primary' : 'text-gray-500'}`}>
                                {step.message}
                            </p>
                            {step.hash && (
                                <a href={`https://a-scan.nobody.network/tx/${step.hash}`} target="_blank" className="text-xs text-blue-500 mt-1 break-all font-bold">
                                    {t("view_detail")}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {currentStep === 2 && (
                <div className="text-center">
                    <p className="text-sm text-orange-600 font-medium">
                        {t("sending_coin")}
                    </p>
                </div>
            )}

            {status === 'success' && steps.every(step => step.completed) && (
                <div className="text-center">
                    <CheckCircle className="text-green-500 mx-auto mb-2" size={40} />
                    <p className="text-lg font-bold text-green-600">
                        {t("process_complete")}
                    </p>
                </div>
            )}
        </div>
    )
}

export default Verify;