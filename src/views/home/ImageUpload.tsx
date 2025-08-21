"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
import { useTranslations } from "next-intl"

interface ImageUploadProps {
  label: string
  description: string
  onImageChange: (file: File | null) => void
  accept?: string
  children?: React.ReactNode
}

export function ImageUpload({ label, description, onImageChange, accept = "image/*", children }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations("drag_drop")

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        const file = files[0]
        if (file.type.startsWith("image/")) {
          setSelectedImage(file)
          onImageChange(file)

          // Create preview URL
          const url = URL.createObjectURL(file)
          setPreviewUrl(url)
        }
      }
    },
    [onImageChange],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const removeImage = useCallback(() => {
    setSelectedImage(null)
    setPreviewUrl(null)
    onImageChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [onImageChange])

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <label className="text-white font-semibold text-sm">{label}</label>
      <p className="text-gray-400 text-xs mb-3">{description}</p>

      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${dragActive
          ? "border-blue-500 bg-blue-900/20"
          : selectedImage
            ? "border-green-500 bg-green-900/20"
            : "border-gray-600 bg-gray-800 hover:border-gray-500"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-6">
          {selectedImage && previewUrl ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage()
                  }}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 p-0"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-center">
                <p className="text-green-400 font-medium text-sm">{selectedImage.name}</p>
                <p className="text-gray-400 text-xs">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {children ? children :
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${dragActive ? "bg-blue-600" : "bg-gray-700"
                      }`}
                  >
                    {dragActive ? (
                      <Upload className="w-8 h-8 text-white" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                }
              </div>


              <div>
                <p className="text-white font-medium mb-1">{dragActive ? t("drop_here") : t("drag_drop_here")}</p>
                <p className="text-gray-400 text-sm mb-3">{t("or_click_to_select")}</p>
                <p className="text-gray-500 text-xs">{t("supported_formats")}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </div>
  )
}
