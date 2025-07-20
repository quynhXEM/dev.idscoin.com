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

  useEffect(() => {
    if (!metadata) return;
    const fetchData = async () => {
      const [balance, apy, users] = await Promise.all([
        await fetch("/api/balance/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: metadata.custom_fields.ids_stake_wallet.address,
            chainId: metadata.custom_fields.ids_stake_wallet.chain_id,
            tokenAddress: metadata.custom_fields.ids_stake_wallet.token_address_temp,
          }),
        }).then(res => res.json()),
        await fetch("/api/stats/apy", {
          method: "GET",
        }).then((data) => data.json()),
        await fetch("/api/stats/users", {
          method: "GET",
        }).then((data) => data.json()),
      ]);
      setMetadata(prev => ({
        ...prev,
        tvl: Number(balance.balance),
        apy: Number(apy?.result?.stake_apy) || 0,
        users: users?.result || 0,
        locked: Number(balance.balance)
      }));
    };
    fetchData();
  }, []);

  
  // Có thể fetch lại nếu muốn cập nhật động
  return (
    <AppMetadataContext.Provider value={metadata} >
      {children}
    </AppMetadataContext.Provider>
  );
}

export function useAppMetadata() {
  return useContext(AppMetadataContext);
} 