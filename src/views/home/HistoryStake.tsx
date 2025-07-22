import { useAppMetadata } from "@/commons/AppMetadataContext";
import { useNotification } from "@/commons/NotificationContext";
import { useUserWallet } from "@/commons/UserWalletContext";
import { Badge } from "@/components/ui/badge";
import { Clock, Gift, HandCoins, Loader2, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { formatNumber } from "@/libs/utils";

export const StakeHistory = () => {
  const t = useTranslations("home");
  const {
    custom_fields: { ids_distribution_wallet },
  } = useAppMetadata();
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [itemLoading, setItemLoading] = useState<any>(null);
  const { notify } = useNotification();
  const { wallet, getBalance, loading, setAccount, account } =
    useUserWallet();

  const handleColectIDS = async (item: any) => {
    if (loadingAction) return;
    setLoadingAction(true);
    // Update
    const updateTxn = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "updateItems",
        collection: "txn",
        params: {
          filter: {
            id: item.id,
            status: "completed",
          },
        },
        items: {
          status: "canceled",
        },
      }),
    }).then((data) => data.json());

    if (!updateTxn.ok || updateTxn.result?.length == 0) {
      notify({
        title: t("noti.error"),
        message: t("noti.cancelStakeTransacrtionError"),
        type: false,
      });
      setLoadingAction(false);
      return;
    }

    // Lưu giao dịch stake out
    const txn = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "createItem",
        collection: "txn",
        items: {
          status: "completed",
          type: "stake_out",
          app_id: process.env.NEXT_PUBLIC_APP_ID,
          member_id: item.member_id,
          amount: item.amount,
          currency: "IDS",
          affect_balance: true,
          stake_lock_days: item.stake_lock_days,
          stake_apy: item.stake_apy,
          description: `Staked out ${item.amount} IDS `,
          parent_txn_id: item.id,
        },
      }),
    }).then((data) => data.json());

    if (!txn.ok) {
      notify({
        title: t("noti.error"),
        message: t("noti.addTransactionError", {
          hash: txn.txHash,
        }),
        type: false,
      });
      setLoadingAction(false);
    }

    // Tạo giao dịch trả tiền IDS về ví người dùng. (fix) Send coin
    const res = await fetch("/api/send/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: item.amount,
        rpc: ids_distribution_wallet.rpc_url,
        token_address: ids_distribution_wallet.token_address_temp,
        to: wallet?.address || "",
        chain_id: ids_distribution_wallet.chain_id,
      }),
    });
    const data = await res.json();
    const txnReturn = data.success
      ? { ok: true, result: data.txHash }
      : { ok: false, result: data.error };
    if (!txnReturn.ok) {
      notify({
        title: t("noti.error"),
        message: t("noti.returnStakeIDSError"),
        type: false,
      });
      setLoadingAction(false);
      return;
    }
    
    // Lưu giao dịch stake out
    const txn_update = await fetch("/api/directus/request", {
      method: "POST",
      body: JSON.stringify({
        type: "updateItem",
        collection: "txn",
        id: txn.result.id,
        items: {
          affect_balance: false,
          external_ref: `${ids_distribution_wallet.explorer_url}/tx/${txnReturn.result}`,
        },
      }),
    }).then((data) => data.json());

    if (txn_update.ok) {
      notify({
        title: t("noti.success"),
        children: (
          <Link
            href={`${ids_distribution_wallet.explorer_url}/tx/${txnReturn.result}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("noti.withdrawIDSsuccess", {
              amount: item.stakeAmount,
              hash: "",
            })}
            <span className="text-blue-400 underline">
              {txnReturn.result.slice(0, 13)}
            </span>
          </Link>
        ),
        type: true,
      });
      setAccount(prev => ({
        ...prev,
        stake_history: prev.stake_history.filter((his: any) => his.id != item.id)
      }));
    } else {
      notify({
        title: t("noti.error"),
        message: t("noti.withdrawIDSError", {
          amount: item.stakeAmount,
        }),
        type: false,
      });
    }

    setLoadingAction(false);
    // (fix) lấy coin xóa token address
    await getBalance(
      wallet?.address || "",
      ids_distribution_wallet.chain_id,
      ids_distribution_wallet.token_address_temp
    );
  };

  if (!loading && account?.stake_history?.length == 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center p-3 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400">{t("history.noHistory")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {account?.stake_history?.map((item, key) => {
        const date =
          new Date().getDate() <
          new Date(item?.date_created).getDate() + item?.stake_lock_days;
        if (date)
          return (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div>
                <div className="font-medium text-white">{formatNumber(item.amount)} IDS</div>
                <div className="text-sm text-gray-400">
                  {t("history.DaysApy", {
                    day: item.stake_lock_days,
                    apy: Number(item.stake_apy).toFixed(0),
                  })}
                </div>
              </div>
              <button
                disabled={loadingAction}
                onClick={() => {
                  setItemLoading(item);
                  handleColectIDS(item);
                }}
                className="text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white cursor-pointer flex flex-row justify-center items-center px-3 py-1 rounded-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingAction && itemLoading?.id == item.id ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <HandCoins className="w-3 h-3 mr-1" />
                )}
                {t("history.collectIDS", { amount: formatNumber(item.amount) })}
              </button>
            </div>
          );
        else
          return (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div>
                <div className="font-medium text-white">{item.amount} IDS</div>
                <div className="text-sm text-gray-400">
                  {t("history.DaysApy", {
                    day: item.stake_lock_days,
                    apy: Number(item.stake_apy).toFixed(0),
                  })}
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-blue-600 text-blue-400"
              >
                <Clock className="w-3 h-3 mr-1" />
                {t("history.DaysLeft", { day: item.stake_lock_days - date })}
              </Badge>
            </div>
          );
      })}
    </div>
  );
};
