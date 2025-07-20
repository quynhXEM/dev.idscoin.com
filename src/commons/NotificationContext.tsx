"use client"
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { NotificationModal } from "@/views/home/NotificationModal";
import { useTranslations } from "next-intl";

interface NotificationData {
  title: string;
  message?: string;
  type: boolean; // true = success, false = error
  children?: ReactNode;
}

interface NotificationContextType {
  notify: (data: NotificationData) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState<NotificationData>({ title: "", message: "", type: true });

  const notify = useCallback((data: NotificationData) => {
    setData(data);
    setShow(true);
  }, []);

  const handleClose = () => setShow(false);

  const t = useTranslations("home");

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationModal
        t={t}
        isOpen={show}
        onClose={handleClose}
        title={data.title}
        message={data?.message}
        children={data?.children}
        type={data.type}
      />
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within a NotificationProvider");
  return context;
} 