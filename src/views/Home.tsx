"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Header from "./home/Header";
import AnnouncementBanner from "./home/AnnouncementBanner";
import HeroStats from "./home/HeroStats";
import Footer from "./home/Footer";
import VipUpgradeModal from "./home/VipUpgradeModal";
import CommissionDetailsModal from "./home/CommissionDetailsModal";
import RewardsModal from "./home/RewardsModal";
import InfoModal from "./home/InfoModal";
import { StakingInterface } from "./home/StakingInterface";
import { ReferralSection } from "./home/ReferralCard";
import { PortfolioOverview } from "./home/PortfolioOverview";
import { useUserWallet } from "@/commons/UserWalletContext";
import { NotificationModal } from "./home/NotificationModal";
import { useAppMetadata } from "@/commons/AppMetadataContext";
import { getBalance } from "@/libs/token";

export default function IDSStakingPlatform() {
  const t = useTranslations("home");
  const {
    custom_fields: { usdt_payment_wallets },
  } = useAppMetadata();
  const [showVipModal, setShowVipModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [vipSelectedChain, setVipSelectedChain] = useState("56");
  const { connectWallet, isConnected, wallet, disconnect, setLoading, balance, setBalance } =
    useUserWallet();

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: true,
  });

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      const connected = sessionStorage.getItem("idscoin_connected");
      if (connected) {
        connectWallet();
      } else {
        setLoading(false)
      }

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          connectWallet();
        }
      });

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  useEffect(() => {
    if (!isConnected || !wallet || !vipSelectedChain) return;
    const getBalanceSelectChain = async () => {
      const usdt = await getBalance({
        address: wallet.address,
        chainId: Number(vipSelectedChain),
        tokenAddress: usdt_payment_wallets[
          vipSelectedChain as keyof typeof usdt_payment_wallets
        ].token_address,
        rpc: usdt_payment_wallets[
          vipSelectedChain as keyof typeof usdt_payment_wallets
        ].rpc_url
      });
      setBalance({usdt: usdt })
    }
    getBalanceSelectChain()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vipSelectedChain, wallet]);

  const tooltips = {
    tvl: t("tooltips.tvl"),
    apy: t("tooltips.apy"),
    users: t("tooltips.users"),
    locked: t("tooltips.locked"),
    stakeProgress: t("tooltips.stakeProgress"),
  };

  return (
    <div className="min-h-screen bg-black text-white ">
      <Header t={t} />
      <div className="mx-auto px-4 py-8 min-h-[79vh] ">
        <AnnouncementBanner t={t} onClick={() => setShowInfoModal(true)} />
        <HeroStats t={t} tooltips={tooltips} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StakingInterface
              t={t}
              setShowNotificationModal={setShowNotificationModal}
              setNotificationData={setNotificationData}
            />
            <ReferralSection
              t={t}
              onShowVipModal={() => setShowVipModal(true)}
              onShowCommissionModal={() => setShowCommissionModal(true)}
              setShowNotificationModal={setShowNotificationModal}
              setNotificationData={setNotificationData}
            />
          </div>
          <PortfolioOverview
            t={t}
            tooltips={tooltips}
            onShowRewardsModal={() => setShowRewardsModal(true)}
            setShowNotificationModal={setShowNotificationModal}
            setNotificationData={setNotificationData}
          />
        </div>
      </div>
      <Footer t={t} />
      <VipUpgradeModal
        t={t}
        show={showVipModal}
        onClose={() => setShowVipModal(false)}
        vipSelectedChain={vipSelectedChain.toString()}
        setVipSelectedChain={(v) => setVipSelectedChain(Number(v))}
        setShowNotificationModal={setShowNotificationModal}
        setNotificationData={setNotificationData}
      />
      <CommissionDetailsModal
        t={t}
        show={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        setShowVipModal={setShowVipModal}
      />
      <RewardsModal
        t={t}
        show={showRewardsModal}
        onClose={() => setShowRewardsModal(false)}
        setShowNotificationModal={setShowNotificationModal}
        setNotificationData={setNotificationData}
      />
      <InfoModal
        t={t}
        show={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
      <NotificationModal
        t={t}
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title={notificationData.title}
        message={notificationData.message}
        type={notificationData.type}
      />
    </div>
  );
}
