"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, FileText, Calendar, CreditCard, Camera, User, Info } from "lucide-react"
import { ImageUpload } from "../ImageUpload"
import { useUserWallet } from "@/commons/UserWalletContext"
import { useNotification } from "@/commons/NotificationContext"
import { UploadImage } from "@/libs/upload"
import { useTranslations } from "next-intl"
import { Tooltip } from "react-tooltip"
import { KYCImage } from "@/res/KYCImage"
import { BackCardImage } from "@/res/BackCardImage"
import { FontCardImage } from "@/res/FontCardImage"

interface KYCFormProps {
    isOpen: boolean
    onClose: (value: boolean) => void
}

export function KYCForm({ isOpen, onClose }: KYCFormProps) {
    const [formData, setFormData] = useState({
        cardType: "NID",
        cardNumber: "",
        expiryDate: "",
        frontImage: null as File | null,
        backImage: null as File | null,
        selfieImage: null as File | null,
    })
    const { account, loadKYCStatus } = useUserWallet()
    const { notify } = useNotification()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const t = useTranslations("home.kyc_form")

    // Ngăn chặn cuộn và tương tác khi modal mở
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen])

    if (!isOpen) return null

    const upImage = async (formData: any) => {
        const [font, back, selfie] = await Promise.all([
            UploadImage([formData.frontImage]),
            UploadImage([formData.backImage]),
            UploadImage([formData.selfieImage])
        ])
        if (!font.ok || !back.ok || !selfie.ok) {
            throw new Error("Upload Image Failed")
        }
        return { font: font.results.id, back: back.results.id, selfie: selfie.results.id }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // setIsSubmitting(true)
        try {
            if (!formData.frontImage || !formData.backImage || !formData.selfieImage) return;
            setIsSubmitting(true)
            // Upload Image
            const uploadImage = await upImage({
                frontImage: formData.frontImage,
                backImage: formData.backImage,
                selfieImage: formData.selfieImage
            })

            const KYC_submit = await fetch("/api/directus/request", {
                method: "POST",
                body: JSON.stringify({
                    type: "createItem",
                    collection: "member_kyc",
                    items: {
                        status: "pending",
                        member_id: account?.id,
                        type: formData.cardType.toUpperCase(),
                        expiry_date: formData.expiryDate,
                        number: formData.cardNumber,
                        doc_front: uploadImage.font,
                        doc_back: uploadImage.back,
                        selfie: uploadImage.selfie
                    }
                })
            }).then(data => data.json())
            if (KYC_submit.ok) {
                notify({
                    title: t("success_title"),
                    message: t("success_message"),
                    type: true
                })
                loadKYCStatus()
                onClose(false)
                setIsSubmitting(false)
                return;
            }
            throw new Error(t("error_message"))
        } catch (error: any) {
            notify({
                title: t("error_title"),
                message: error.message,
                type: false
            })
            setIsSubmitting(false)

        }
    }

    const isFormValid = () => {
        return (
            formData.cardType &&
            formData.cardNumber &&
            formData.expiryDate &&
            formData.frontImage &&
            formData.backImage &&
            formData.selfieImage
        )
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overscroll-contain" onClick={() => onClose(false)} onWheel={(e) => e.preventDefault()} onTouchMove={(e) => e.preventDefault()} style={{ touchAction: 'none' }}>
            <Card
                className="w-full max-w-4xl bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-white text-xl">{t("title")}</CardTitle>
                            <CardDescription className="text-gray-400">
                                {t("description")}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Card Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" />
                                {t("document_info")}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Card Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="cardType" className="text-white font-semibold">
                                        {t("document_type")}
                                    </Label>
                                    <Select
                                        value={formData.cardType}
                                        onValueChange={(value) => setFormData({ ...formData, cardType: value })}
                                    >
                                        <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white focus:border-blue-500">
                                            <SelectValue placeholder={t("document_type_placeholder")} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                            <SelectItem value="NID" className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer focus:text-white">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4" />
                                                    <span>{t("nid_document")}</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Card Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber" className="text-white font-semibold">
                                        {t("document_number")}
                                    </Label>
                                    <Input
                                        id="cardNumber"
                                        placeholder={t("document_number_placeholder")}
                                        value={formData.cardNumber}
                                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Expiry Date */}
                            <div className="space-y-2">
                                <Label htmlFor="expiryDate" className="text-white font-semibold flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-400" />
                                    {t("expiry_date")}
                                </Label>
                                <Input
                                    id="expiryDate"
                                    value={formData.expiryDate}
                                    placeholder={t("expiry_date_placeholder")}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 max-w-xs"
                                />
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Camera className="w-5 h-5 text-blue-400" />
                                {t("image_verification")}
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Front Image */}
                                <ImageUpload
                                    label={t("front_image")}
                                    description={t("front_image_description")}
                                    onImageChange={(file) => setFormData({ ...formData, frontImage: file })}
                                    children={<FontCardImage />}
                                />

                                {/* Back Image */}
                                <ImageUpload
                                    label={t("back_image")}
                                    description={t("back_image_description")}
                                    onImageChange={(file) => setFormData({ ...formData, backImage: file })}
                                    children={<BackCardImage />}
                                />

                                {/* Selfie Image */}
                                <ImageUpload
                                    label={t("selfie_image")}
                                    description={t("selfie_image_description")}
                                    onImageChange={(file) => setFormData({ ...formData, selfieImage: file })}
                                    children={<KYCImage />}
                                />
                            </div>
                        </div>

                        {/* Guidelines */}
                        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
                            <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                {t("photo_guidelines")}
                            </h4>
                            <div className="text-sm text-blue-200 space-y-1">
                                <div>{t("guideline_clear")}</div>
                                <div>{t("guideline_corners")}</div>
                                <div>{t("guideline_selfie")}</div>
                                <div>{t("guideline_format")}</div>
                                <div>{t("guideline_match")}</div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent"
                                onClick={() => onClose(false)}
                                disabled={isSubmitting}
                            >
                                {t("cancel")}
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                                disabled={!isFormValid() || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {t("processing")}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {t("submit")}
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
