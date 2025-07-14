"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState, ReactNode, createContext } from "react";

export type WalletInfo = {
  address: string;
  chainId?: number;
  [key: string]: any;
} | null;

export type WalletContextType = {
  wallet: WalletInfo;
  isConnected: boolean;
  setWallet: (wallet: WalletInfo) => void;
  disconnect: () => void;
};

const UserWalletContext = createContext<WalletContextType | undefined>(undefined);

export function UserWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo>(null);
  const isConnected = !!wallet;

  const disconnect = () => setWallet(null);

  return (
    <UserWalletContext.Provider value={{ wallet, isConnected, setWallet, disconnect }}>
      {children}
    </UserWalletContext.Provider>
  );
}

export function useUserWallet() {
  const context = useContext(UserWalletContext);
  if (!context) {
    throw new Error("useUserWallet must be used within a UserWalletProvider");
  }
  return context;
} 