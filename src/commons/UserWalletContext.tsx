"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useContext,
  useState,
  ReactNode,
  createContext,
  useEffect,
} from "react";

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
  getBalance: (address: string, chainId?: number, tokenAddress?: string) => Promise<string>;
  balance: string;
};

const UserWalletContext = createContext<WalletContextType | undefined>(
  undefined
);

const NETWORKS: Record<number, {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: { name: string; symbol: string; decimals: number };
  blockExplorerUrls: string[];
}> = {
  1: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    rpcUrls: ["https://rpc.ankr.com/eth"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://etherscan.io"],
  },
  56: {
    chainId: "0x38",
    chainName: "BNB Smart Chain Mainnet",
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    blockExplorerUrls: ["https://bscscan.com"],
  },
  137: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com/"],
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  42161: {
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://arbiscan.io"],
  },
};

export function UserWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo>(null);
  const [balance, setBalance] = useState<{ids: string, usdt: string}>({ids: "0", usdt: "0"});
  const isConnected = !!wallet;

  useEffect(() => {
    if (!wallet) return;
    getBalance(wallet.address, 97)
  }, [wallet]);

  const disconnect = () => setWallet(null);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("Vui lòng cài đặt MetaMask hoặc ví Web3 khác!");
      return;
    }
    try {
      const provider = (window as any).ethereum;
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const chainId = await provider.request({ method: "eth_chainId" });
      setWallet({ address: accounts[0], chainId: parseInt(chainId, 16) });
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
              params: [{ chainId: NETWORKS[chainId]?.chainId || "0x" + chainId.toString(16) }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902 && NETWORKS[chainId]) {
              // Nếu chưa có mạng, thêm mạng vào MetaMask
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [NETWORKS[chainId]],
              });
              // Sau khi thêm, thử lại chuyển mạng
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: NETWORKS[chainId].chainId }],
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
          value: (BigInt(Math.floor(Number(amount) * 1e18))).toString(16),
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
        // Chuẩn bị data cho hàm transfer(address,uint256)
        const methodId = "0xa9059cbb"; // keccak256("transfer(address,uint256)").slice(0,10)
        const toPadded = to.replace("0x", "").padStart(64, "0");
        const amountBN = BigInt(Math.floor(Number(amount) * 10 ** decimalsNum));
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
    const provider = (window as any).ethereum;

    // Chuyển chain nếu cần
    if (chainId) {
      const currentChain = await provider.request({ method: "eth_chainId" });
      if (parseInt(currentChain, 16) !== chainId) {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: NETWORKS[chainId]?.chainId || "0x" + chainId.toString(16) }],
        });
      }
    }

    if (!tokenAddress) {
      // Lấy số dư coin
      const balanceHex = await provider.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      setBalance(prev => ({...prev, ids: (Number(BigInt(balanceHex)) / 1e18).toFixed(2).toString()}));
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
      setBalance(prev => ({...prev, usdt: (Number(BigInt(balanceHex)) / 10 ** decimals).toFixed(2).toString()}));
      return (Number(BigInt(balanceHex)) / 10 ** decimals).toFixed(2).toString();
    }
  };

  return (
    <UserWalletContext.Provider
      value={{ wallet, isConnected, setWallet, disconnect, connectWallet, sendTransaction, getBalance, balance }}
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

const UserStatusContext = createContext<UserStatusContextType | undefined>(undefined);

export function UserStatusProvider({ children }: { children: ReactNode }) {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [isVip, setIsVip] = useState<boolean>(false);

  const toggleRegister = () => setIsRegister((prev) => !prev);
  const toggleVip = () => setIsVip((prev) => !prev);

  return (
    <UserStatusContext.Provider value={{ isRegister, isVip, setIsRegister, setIsVip, toggleRegister, toggleVip }}>
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
