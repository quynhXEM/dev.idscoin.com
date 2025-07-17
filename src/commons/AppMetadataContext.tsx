"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppMetadata {
  logo?: string;
  icon?: string;
  [key: string]: any;
}

const AppMetadataContext = createContext<AppMetadata>({});

export function AppMetadataProvider({ initialMetadata, children }: { initialMetadata: AppMetadata, children: ReactNode }) {
  const [metadata, setMetadata] = useState<AppMetadata>(initialMetadata);
  // {
  //   id: 'db2a722c-59e2-445c-b89e-7b692307119a',
  //   status: 'active',
  //   name: 'IDS Coin',
  //   type: 'web',
  //   icon: '1ba9f8dd-818f-46c5-b07e-afd715fd20ad',
  //   url: 'https://www.idscoin.com',
  //   app_store_url: null,
  //   play_store_url: null,
  //   version: null,
  //   user_id: '05a9bfe2-575c-4080-badf-456f2b09ad6f',
  //   date_created: '2025-07-11T10:34:05.991Z',
  //   date_updated: '2025-07-16T10:12:58.135Z',
  //   user_created: '7f00c4b0-ab6e-474b-beb4-c21cbf026474',
  //   user_updated: '7f00c4b0-ab6e-474b-beb4-c21cbf026474',
  //   short_name: 'IDS Coin',
  //   package_name: null,
  //   smtp_host: 'smtp.sendgrid.net',
  //   smtp_port: '587',
  //   smtp_secure: 'tls',
  //   google_service_account: null,
  //   smtp_reply_to: 'zero@nobody.network',
  //   smtp_from_email: 'zero@nobody.network',
  //   smtp_from_name: 'Nobody',
  //   background_color: null,
  //   theme_color: null,
  //   custom_fields: {
  //     usdt_payment_wallets: [Object],
  //     ids_distribution_wallet: [Object]
  //   },
  //   device_token: []
  // }
  
  // Có thể fetch lại nếu muốn cập nhật động
  return (
    <AppMetadataContext.Provider value={metadata}>
      {children}
    </AppMetadataContext.Provider>
  );
}

export function useAppMetadata() {
  return useContext(AppMetadataContext);
} 