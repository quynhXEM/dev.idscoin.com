"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, X, WandSparklesIcon, CircleAlert } from "lucide-react";
import { ReactNode } from "react";

interface NotificationModalProps {
  t: (key: string) => string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type: boolean; // true = success, false = error
  children?: ReactNode;
}

export function NotificationModal({
  t,
  isOpen,
  onClose,
  title,
  message,
  type,
  children
}: NotificationModalProps) {
  if (!isOpen) return null;
  const isSuccess = type;
  const iconColor = isSuccess ? "text-emerald-500" : "text-red-500";
  const titleColor = isSuccess ? "text-emerald-300" : "text-red-300";
  const borderColor = isSuccess ? "border-emerald-500/50" : "border-red-500/50";
  const bgGradient = isSuccess
    ? "bg-gradient-to-r from-emerald-900/20 to-green-900/20"
    : "bg-gradient-to-r from-red-900/20 to-orange-900/20";
  const buttonColor = isSuccess
    ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
    : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700";

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card onClick={(e) => e.stopPropagation()} 
        className={`w-full max-w-md mx-4 bg-gray-900 border-gray-800 ${borderColor} shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300`}
      >
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${bgGradient}`}
              >
                {isSuccess ? (
                  <CheckCircle className={`w-6 h-6 ${iconColor}`} />
                ) : (
                  <CircleAlert className={`w-6 h-6 ${iconColor}`} />
                )}
              </div>
              <div>
                <CardTitle className={`text-lg ${titleColor}`}>
                  {title}
                </CardTitle>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Message Content */}
          <div className={`p-4 rounded-lg overflow-hidden border ${borderColor} ${bgGradient}`}>
            <p className="text-gray-300 text-sm leading-relaxed text-wrap whitespace-pre-wrap">{message || children}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
