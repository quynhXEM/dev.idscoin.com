"use client";

import { usePathname } from "@/i18n/navigation";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useContext,
  useState,
  ReactNode,
  createContext,
  useEffect,
} from "react";
import { useNotification } from "@/commons/NotificationContext";
import { useTranslations } from "next-intl";
import { useAppMetadata } from "./AppMetadataContext";

export type SendTxParams = {
  chainId?: number;
  to: string;
  amount: string;
  type: "coin" | "token";
  tokenAddress?: string;
};

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
  connectWallet: () => void;
  sendTransaction: (params: SendTxParams) => Promise<any>;
  getBalance: (
    address: string,
    chainId?: number,
    tokenAddress?: string
  ) => Promise<string>;
  balance: { ids: string; usdt: string };
  account: {
    id: string;
    status: string;
    app_id: string;
    email: string;
    password: unknown;
    username: string;
    country_code: string | null;
    email_verified: boolean;
    wallet_address: string;
    referrer_id: string | null;
    avatar: string | null;
  } | null;
};

const UserWalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export function UserWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo>(null);
  const {custom_fields: {usdt_payment_wallets, usdt_payment_wallets_testnet, ids_distribution_wallet}} = useAppMetadata();
  const t = useTranslations("home");
  const [balance, setBalance] = useState<{ ids: string; usdt: string }>({
    ids: "0",
    usdt: "0",
  });
  const [account, setAccount] = useState<{
    id: string;
    status: string;
    app_id: string;
    email: string;
    password: unknown;
    username: string;
    country_code: string | null;
    email_verified: boolean;
    wallet_address: string;
    referrer_id: string | null;
    avatar: string | null;
  } | null>(null);
  const isConnected = !!wallet;
  const path = usePathname();
  const { notify } = useNotification();

  useEffect(() => {
    if (!wallet) return;
    getBalance(wallet.address, ids_distribution_wallet.chain_id);
  }, [wallet]);

  const disconnect = () => setWallet(null);

  const addNewMember = async (wallet: WalletInfo) => {
    // Check user is exist
    const exist = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "readItems",
        collection: "member",
        params: {
          filter: {
            wallet_address: wallet?.address?.toLocaleLowerCase(),
            status: "active",
            app_id:
              process.env.NEXT_PUBLIC_APP_ID ??
              "db2a722c-59e2-445c-b89e-7b692307119a",
          },
        },
      }),
    })
      .then((data) => data.json())
      .then((data) => data.result[0])
      .catch(() => null);

    if (exist) {
      setAccount(exist);
      return;
    }

    let ref = null;
    if (!path.includes("/home")) {
      ref = await fetch("/api/directus/request", {
        method: "POST",
        body: JSON.stringify({
          type: "readItems",
          collection: "member",
          params: {
            filter: {
              username: path.split("/")[1],
              status: "active",
              app_id:
                process.env.NEXT_PUBLIC_APP_ID ??
                "db2a722c-59e2-445c-b89e-7b692307119a",
            },
            fields: ["id"],
          },
        }),
      })
        .then((data) => data.json())
        .then((data) => data.result[0]?.id)
        .catch(() => null);
    }

    await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "createItem",
        collection: "member",
        items: {
          status: "active",
          app_id:
            process.env.NEXT_PUBLIC_APP_ID ??
            "db2a722c-59e2-445c-b89e-7b692307119a",
          wallet_address: wallet?.address?.toLocaleLowerCase(),
          referrer_id: ref,
        },
      }),
    });
  };

  const connectWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      notify({
        title: t("noti.web3Error"),
        message: t("noti.web3ErrorSub"),
        type: false,
      });
      return;
    }
    try {
      const provider = (window as any).ethereum;
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const chainId = await provider.request({ method: "eth_chainId" });
      setWallet({ address: accounts[0], chainId: parseInt(chainId, 16) });
      addNewMember({ address: accounts[0], chainId: parseInt(chainId, 16) });
      sessionStorage.setItem("idscoin_connected", "true");
    } catch (err) {
      console.error("Kết nối ví thất bại", err);
      setWallet(null);
    }
  };

  const sendTransaction = async (params: SendTxParams) => {
    if (!wallet) return;
    const { chainId, to, amount, type, tokenAddress } = params;
    try {
      const provider = (window as any).ethereum;
      // Chuyển mạng nếu cần
      if (chainId) {
        const currentChain = await provider.request({ method: "eth_chainId" });
        if (parseInt(currentChain, 16) !== chainId) {
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId:
                    usdt_payment_wallets_testnet[chainId as keyof typeof usdt_payment_wallets_testnet]?.chainId || "0x" + chainId.toString(16),
                },
              ],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902 && usdt_payment_wallets_testnet[chainId as keyof typeof usdt_payment_wallets_testnet]) {
              // Nếu chưa có mạng, thêm mạng vào MetaMask
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [usdt_payment_wallets_testnet[chainId as keyof typeof usdt_payment_wallets_testnet]],
              });
              // Sau khi thêm, thử lại chuyển mạng
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: usdt_payment_wallets_testnet[chainId as keyof typeof usdt_payment_wallets_testnet]?.chainId }],
              });
            } else {
              throw switchError;
            }
          }
        }
      }
      if (type === "coin") {
        // Gửi native coin
        const tx = {
          from: wallet.address,
          to,
          value: BigInt(Math.floor(Number(amount) * 1e18)).toString(16),
        };
        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [tx],
        });
        return txHash;
      } else if (type === "token" && tokenAddress) {
        // Lấy số decimal thực tế của token
        const decimalsData = "0x313ce567"; // keccak256("decimals()").slice(0,10)
        const decimals = await provider.request({
          method: "eth_call",
          params: [
            {
              to: tokenAddress,
              data: decimalsData,
            },
            "latest",
          ],
        });
        
        const decimalsNum = parseInt(decimals, 16);
        const amountNumber = Number(amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
          throw new Error("Số lượng không hợp lệ");
        }
        if (isNaN(decimalsNum)) {
          throw new Error("Không lấy được số thập phân của token");
        }
        // Chuẩn bị data cho hàm transfer(address,uint256)
        const methodId = "0xa9059cbb"; // keccak256("transfer(address,uint256)").slice(0,10)
        const toPadded = to.replace("0x", "").padStart(64, "0");
        const amountBN = BigInt(Math.floor(amountNumber * 10 ** decimalsNum));
        const amountHex = amountBN.toString(16).padStart(64, "0");
        const data = methodId + toPadded + amountHex;
        const tx = {
          from: wallet.address,
          to: tokenAddress,
          data,
        };
        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [tx],
        });
        return txHash;
      } else {
        // throw new Error("Thiếu thông tin gửi token hoặc type không hợp lệ");
      }
    } catch (err) {
      throw err;
    }
  };

  // Hàm lấy số dư coin hoặc token
  const getBalance = async (
    address: string,
    chainId?: number,
    tokenAddress?: string
  ): Promise<string> => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      throw new Error("Không tìm thấy provider");
    }
    try {
      const provider = (window as any).ethereum;

      // Chuyển chain nếu cần
      if (chainId) {
        const currentChain = await provider.request({ method: "eth_chainId" });
        if (parseInt(currentChain, 16) !== chainId) {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId:
                usdt_payment_wallets_testnet[chainId as keyof typeof usdt_payment_wallets_testnet]?.chainId || "0x" + chainId.toString(16),
              },
            ],
          });
        }
      }

      if (!tokenAddress) {
        // Lấy số dư coin
        const balanceHex = await provider.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });
        if (!balanceHex || balanceHex === "0x") {
          setBalance((prev) => ({
            ...prev,
            ids: "0.00",
          }));
          return "0.00";
        }
        setBalance((prev) => ({
          ...prev,
          ids: (Number(BigInt(balanceHex)) / 1e18).toFixed(2).toString(),
        }));
        return (Number(BigInt(balanceHex)) / 1e18).toFixed(2).toString();
      } else {
        // Lấy số dư token ERC20
        const methodId = "0x70a08231"; // balanceOf(address)
        const addressPadded = address.replace("0x", "").padStart(64, "0");
        const data = methodId + addressPadded;

        const balanceHex = await provider.request({
          method: "eth_call",
          params: [
            {
              to: tokenAddress,
              data,
            },
            "latest",
          ],
        });
        if (!balanceHex || balanceHex === "0x") {
          setBalance((prev) => ({
            ...prev,
            usdt: "0.00",
          }));
          return "0.00";
        }
        // Lấy số thập phân của token
        const decimalsData = "0x313ce567"; // decimals()
        const decimalsHex = await provider.request({
          method: "eth_call",
          params: [
            {
              to: tokenAddress,
              data: decimalsData,
            },
            "latest",
          ],
        });
        const decimals = parseInt(decimalsHex, 16);
        setBalance((prev) => ({
          ...prev,
          usdt: (Number(BigInt(balanceHex)) / 10 ** decimals)
            .toFixed(2)
            .toString(),
        }));
        return (Number(BigInt(balanceHex)) / 10 ** decimals)
          .toFixed(2)
          .toString();
      }
    } catch (error) {
      if (error?.code == "4902") {
        notify({
          title: t("noti.web3Error"),
          message: t("noti.web3ChainNotFound", {chain: usdt_payment_wallets_testnet[chainId as keyof typeof usdt_payment_wallets_testnet]?.name}),
          type: false,
        });
      } else {
        notify({
          title: t("noti.web3Error"),
          message: t("noti.web3BalanceError"),
          type: false,
        });
      }
      return "0";
    }
  };

  return (
    <UserWalletContext.Provider
      value={{
        wallet,
        isConnected,
        setWallet,
        disconnect,
        connectWallet,
        sendTransaction,
        getBalance,
        balance,
        account,
      }}
    >
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

// Provider lưu trạng thái isRegister và isVip
export type UserStatusContextType = {
  isRegister: boolean;
  isVip: boolean;
  setIsRegister: (value: boolean) => void;
  setIsVip: (value: boolean) => void;
  toggleRegister: () => void;
  toggleVip: () => void;
};

const UserStatusContext = createContext<UserStatusContextType | undefined>(
  undefined
);

export function UserStatusProvider({ children }: { children: ReactNode }) {
  const { account } = useUserWallet();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [isVip, setIsVip] = useState<boolean>(false);
  const toggleRegister = () => setIsRegister((prev) => !prev);
  const toggleVip = () => setIsVip((prev) => !prev);

  useEffect(() => {
    setIsRegister(account?.username != null);
  }, [account]);
  return (
    <UserStatusContext.Provider
      value={{
        isRegister,
        isVip,
        setIsRegister,
        setIsVip,
        toggleRegister,
        toggleVip,
      }}
    >
      {children}
    </UserStatusContext.Provider>
  );
}

export function useUserStatus() {
  const context = useContext(UserStatusContext);
  if (!context) {
    throw new Error("useUserStatus must be used within a UserStatusProvider");
  }
  return context;
}
