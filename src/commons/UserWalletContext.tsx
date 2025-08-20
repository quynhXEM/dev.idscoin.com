"use client";

import { usePathname } from "@/i18n/navigation";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useContext,
  useState,
  ReactNode,
  createContext,
  useEffect,
  useRef,
} from "react";
import { useNotification } from "@/commons/NotificationContext";
import { useTranslations } from "next-intl";
import { useAppMetadata } from "./AppMetadataContext";
import { getBalance } from "@/libs/token";
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
  balance: { ids: string; usdt: string };
  setBalance: (balance: { [key: string]: any }) => void;
  account: {
    kyc_status_reason: ReactNode;
    id: string;
    status: string;
    kyc_status: string | false;
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
  getVipStatus: (user_id: string) => Promise<any>;
  checkChainExists: (chainId: string) => Promise<boolean>;
  loading: boolean;
  setAccount: (account: any) => void;
  addNewMember: (wallet: WalletInfo) => Promise<void>;
  setLoading: (loading: boolean) => void;
  refreshVerifyEmail: () => Promise<boolean>;
  loadKYCStatus: () => Promise<void>;
};

const UserWalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export function UserWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    custom_fields: {
      usdt_payment_wallets,
      ids_distribution_wallet,
    },
  } = useAppMetadata();
  const t = useTranslations("home");
  const [balance, setBalanceState] = useState<{ ids: string; usdt: string }>({
    ids: "0",
    usdt: "0",
  });
  const [account, setAccount] = useState<{
    id: string;
    status: string;
    kyc_status: string | false;
    app_id: string;
    email: string;
    password: unknown;
    username: string;
    country_code: string | null;
    email_verified: boolean;
    wallet_address: string;
    referrer_id: string | null;
    avatar: string | null;
    isVip: boolean;
    stake_history: any[];
  } | null>(null);
  const isConnected = !!wallet;
  const path = usePathname();
  const { notify } = useNotification();
  const isCreatingMemberRef = useRef(false);

  const setBalance = (value: any) => {
    setBalanceState(prev => ({ ...prev, ...value }));
  }

  useEffect(() => {
    if (!wallet) return;

    const getWalletInfo = async () => {
      const balanceids = await getBalance({ address: wallet.address, chainId: ids_distribution_wallet.chain_id, rpc: ids_distribution_wallet.rpc_url });
      setBalance({ ids: balanceids });
    };
    getWalletInfo();
  }, [wallet]);

  useEffect(() => {
    console.log(balance);
  }, [balance]);

  const disconnect = () => setWallet(null);

  // Lỗi thêm 2 ví cùng lúc ( khôgn có ví, co người giới thiệu)
  const addNewMember = async (wallet: WalletInfo) => {
    if (isCreatingMemberRef.current) return; // Ngăn gọi lặp
    isCreatingMemberRef.current = true;
    try {
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
                process.env.NEXT_PUBLIC_APP_ID ||
                "7d503b72-7d20-44c4-a48f-321b031a17b5",
            },
          },
        }),
      })
        .then((data) => data.json())
        .then((data) => data.result[0])
        .catch(() => null);
      if (exist) {
        const [vipReponse, stakeHistory, f1, commission, stake, kyc_status] =
          await Promise.all([
            await getVipStatus(exist.id),
            await getStakeHistory(exist.id),
            await fetch("/api/user/f1", {
              method: "POST",
              body: JSON.stringify({
                id: exist.id,
              }),
            }).then((data) => data.json()),
            await fetch("/api/user/commission", {
              method: "POST",
              body: JSON.stringify({
                id: exist.id,
              }),
            }).then((data) => data.json()),
            await fetch("/api/user/stake", {
              method: "POST",
              body: JSON.stringify({
                id: exist.id,
              }),
            }).then((data) => data.json()),
            await fetch("/api/directus/request", {
              method: "POST",
              body: JSON.stringify({
                type: "readItems",
                collection: "member_kyc",
                params: {
                  filter: {
                    member_id: exist.id,
                  },
                  fields: ["status", "reject_reason"],
                  sort: "-date_created"
                },
              }),
            }).then((data) => data.json())
              .then(data => ({
                kyc_status: data?.result?.[0]?.status ?? false,
                kyc_status_reason: data?.result?.[0]?.reject_reason ?? null
              })),
          ]);
        setAccount({
          ...exist,
          f1: f1?.result || 0,
          ...kyc_status,
          isVip: vipReponse ? true : false,
          commission: commission?.result || {
            all: 0,
            day: 0,
            month: 0,
            withdraw: 0,
          },
          stake_history: stakeHistory,
          stake: stake?.result || {
            stake_dont_claw: 0,
            stake_dont_claw_24h: 0,
            stake_dont_claw_week: 0,
            stake_dont_claw_month: 0,
            stake_in: 0,
            stake_out: 0,
            stake_reward: 0,
          },
        });
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
                  process.env.NEXT_PUBLIC_APP_ID ||
                  "7d503b72-7d20-44c4-a48f-321b031a17b5",
              },
              fields: ["id"],
            },
          }),
        })
          .then((data) => data.json())
          .then((data) => data.result[0]?.id)
          .catch(() => null);
      }
      const newusser = await fetch("/api/directus/request", {
        method: "POST",
        body: JSON.stringify({
          type: "createItem",
          collection: "member",
          ct_code: true,
          items: {
            status: "active",
            app_id:
              process.env.NEXT_PUBLIC_APP_ID ||
              "7d503b72-7d20-44c4-a48f-321b031a17b5",
            wallet_address: wallet?.address?.toLocaleLowerCase(),
            referrer_id: ref,
          },
          fields: ["*"],
        }),
      }).then((data) => data.json());
      setAccount({
        ...newusser.result,
        f1: 0,
        isVip: false,
        kyc_status: false,
        commission: {
          all: 0,
          day: 0,
          month: 0,
          withdraw: 0,
        },
        stake_history: [],
        stake: {
          stake_dont_claw: 0,
          stake_dont_claw_24h: 0,
          stake_dont_claw_week: 0,
          stake_dont_claw_month: 0,
          stake_in: 0,
          stake_out: 0,
          stake_reward: 0,
        },
      });
    } finally {
      isCreatingMemberRef.current = false;
      setLoading(false);
    }
  };

  const refreshVerifyEmail = async () => {
    const response = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "readItems",
        collection: "member",
        params: {
          filter: {
            wallet_address: wallet?.address?.toLocaleLowerCase(),
            status: "active",
            app_id:
              process.env.NEXT_PUBLIC_APP_ID ||
              "7d503b72-7d20-44c4-a48f-321b031a17b5",
          },
          fields: ["email_verified"],
          sort: "-date_created"
        },
      }),
    }).then(data => data.json())
      .then(data => data.result[0])
      .catch(err => null);

    setAccount(prev => prev ? {
      ...prev,
      email_verified: response?.email_verified == true,
    } : null);

    return response?.email_verified == true
  }

  const loadKYCStatus = async () => {
    if (!account?.id) return;
    const response = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "readItems",
        collection: "member_kyc",
        params: {
          filter: {
            member_id: account?.id,
          },
          fields: ["status", "reject_reason"],
          sort: "-date_created"
        },
      }),
    }).then((data) => data.json())
      .then(data => ({
        kyc_status: data?.result?.[0]?.status ?? false,
        kyc_status_reason: data?.result?.[0]?.reject_reason ?? null
      }));

    setAccount(prev => prev ? {
      ...prev,
      kyc_status: response?.kyc_status ?? false,
      kyc_status_reason: response?.kyc_status_reason ?? null
    } : null);
  }

  const getVipStatus = async (user_id: string) => {
    const response = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "readItems",
        collection: "txn",
        params: {
          filter: {
            member_id: user_id,
            app_id: process.env.NEXT_PUBLIC_APP_ID,
            type: "vip_upgrade",
            status: "completed",
          },
          limit: 1,
          fields: ["id", "date_created"],
        },
      }),
    })
      .then((data) => data.json())
      .then((data) => (data.ok ? data.result[0] : null))
      .catch((err) => {
        return null;
      });

    return response;
  };

  const getStakeHistory = async (user_id: string) => {
    const response = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "readItems",
        collection: "txn",
        params: {
          filter: {
            member_id: user_id,
            app_id: process.env.NEXT_PUBLIC_APP_ID,
            type: "stake_in",
            status: "completed",
          },
          sort: "date_created",
          limit: 1000,
          fields: ["id", "date_created", "amount", "type", "member_id", "stake_apy", "stake_lock_days", "description", "children.id"],
        },
      }),
    })
      .then((data) => data.json())
      .then((data) => (data.ok ? data.result : null))
      .catch((err) => {
        return null;
      });

    return response;
  };

  // Hàm thêm mạng 123999 vào ví
  const addNetwork123999 = async (provider: any) => {
    const chainId = 123999;
    const hexChainId = "0x" + chainId.toString(16);
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hexChainId, // 123999
            chainName: "Nobody Chain",
            nativeCurrency: {
              name: "IDS",
              symbol: "IDS",
              decimals: 18,
            },
            rpcUrls: ["https://a-rpc.nobody.network"],
            blockExplorerUrls: ["https://a-scan.nobody.network"],
          },
        ],
      });
      return true;
    } catch (err) {
      return true;
    }
  };

  const connectWallet = async () => {
    // if (typeof window === "undefined" || !(window as any).ethereum) {
    //   notify({
    //     title: t("noti.web3Error"),
    //     message: t("noti.web3ErrorSub"),
    //     type: false,
    //   });
    //   return;
    // }
    setLoading(true);
    try {
      const provider = (window as any).ethereum;
      // Ép buộc mạng chainId 123999
      const targetChainId = 123999;
      const targetChainIdHex = "0x" + targetChainId.toString(16);
      let currentChainId = await provider.request({ method: "eth_chainId" });
      if (currentChainId !== targetChainIdHex) {
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: targetChainIdHex }],
          });
        } catch (switchError: any) {
          if (switchError?.code === 4902) {
            // Nếu chưa có mạng, tự động thêm mạng 123999
            const added = await addNetwork123999(provider);
            if (added) {
              // Sau khi thêm, thử chuyển lại
              try {
                await provider.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: targetChainIdHex }],
                });
              } catch (err) {
                notify({
                  title: t("noti.web3Error"),
                  message: "Không thể chuyển sang mạng 123999 sau khi thêm!",
                  type: false,
                });
                setLoading(false);
                return;
              }
            } else {
              notify({
                title: t("noti.web3Error"),
                message: "Không thể thêm mạng 123999 vào ví!",
                type: false,
              });
              setLoading(false);
              return;
            }
          } else {
            notify({
              title: t("noti.web3Error"),
              message: "Vui lòng thêm mạng 123999 vào ví của bạn!", // Có thể custom lại message
              type: false,
            });
            setLoading(false);
            return;
          }
        }
        // Sau khi chuyển mạng, lấy lại chainId
        currentChainId = await provider.request({ method: "eth_chainId" });
        if (currentChainId !== targetChainIdHex) {
          notify({
            title: t("noti.web3Error"),
            message: "Không thể chuyển sang mạng 123999!",
            type: false,
          });
          setLoading(false);
          return;
        }
      }
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const chainId = await provider.request({ method: "eth_chainId" });
      await addNewMember({
        address: accounts[0],
        chainId: parseInt(chainId, 16),
      });
      setWallet({ address: accounts[0], chainId: parseInt(chainId, 16) });
      sessionStorage.setItem("idscoin_connected", "true");
    } catch (err) {
      console.error("Kết nối ví thất bại", err);
      setWallet(null);
      setLoading(false);
    }
  };

  // Thêm hàm chờ xác nhận giao dịch
  async function waitForTransactionReceipt(
    provider: any,
    txHash: string,
    interval = 2000,
    maxTries = 60
  ) {
    let tries = 0;
    while (tries < maxTries) {
      const receipt = await provider.request({
        method: "eth_getTransactionReceipt",
        params: [txHash],
      });
      if (receipt && receipt.blockNumber) {
        return receipt.transactionHash; // Đã xác nhận
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      tries++;
    }
    throw new Error("Giao dịch chưa được xác nhận sau thời gian chờ.");
  }

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
                    usdt_payment_wallets[
                      chainId as keyof typeof usdt_payment_wallets
                    ]?.chainId || "0x" + chainId.toString(16),
                },
              ],
            });
          } catch (switchError: any) {
            if (
              switchError.code === 4902 &&
              usdt_payment_wallets[
              chainId as keyof typeof usdt_payment_wallets
              ]
            ) {
              // Nếu chưa có mạng, thêm mạng vào MetaMask
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  usdt_payment_wallets[
                  chainId as keyof typeof usdt_payment_wallets
                  ],
                ],
              });
              // Sau khi thêm, thử lại chuyển mạng
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [
                  {
                    chainId:
                      usdt_payment_wallets[
                        chainId as keyof typeof usdt_payment_wallets
                      ]?.chainId,
                  },
                ],
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
        // Chờ xác nhận giao dịch
        const receipt = await waitForTransactionReceipt(provider, txHash);
        return receipt;
      } else if (type === "token" && tokenAddress) {
        // gọi đến api/token/decimals
        const decimals = await fetch("/api/token/decimals", {
          method: "POST",
          body: JSON.stringify({
            chainId,
            tokenAddress,
          }),
        }).then(data => data.json())
          .then(data => data.decimals)
          .catch(err => 18)

        const decimalsNum = decimals;
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
        // Chờ xác nhận giao dịch
        const receipt = await waitForTransactionReceipt(provider, txHash);
        return receipt;
      } else {
        // throw new Error("Thiếu thông tin gửi token hoặc type không hợp lệ");
      }
    } catch (err) {
      throw err;
    }
  };

  const checkChainExists = async (chainId: string): Promise<boolean> => {
    if (typeof window === "undefined" || !(window as any).ethereum)
      return false;
    const provider = (window as any).ethereum;
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
      return true; // Nếu switch thành công, chain đã tồn tại
    } catch (error: any) {
      if (error.code === 4902) {
        return false;
      }
      throw error; // Lỗi khác thì throw ra ngoài
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
        balance,
        setBalance,
        account,
        checkChainExists,
        getVipStatus,
        loading,
        setAccount,
        addNewMember,
        setLoading,
        refreshVerifyEmail,
        loadKYCStatus
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
