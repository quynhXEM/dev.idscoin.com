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
import { usdtContracts } from "@/libs/crypto";
import { useUserWallet } from "@/commons/UserWalletContext";

export default function IDSStakingPlatform() {
  const t = useTranslations("home");
  const [showVipModal, setShowVipModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [vipSelectedChain, setVipSelectedChain] = useState(1);
  const { connectWallet, getBalance, isConnected, wallet } = useUserWallet();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const connected = sessionStorage.getItem("idscoin_connected");
      if (connected) {
        connectWallet();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isConnected || !wallet) return;
    getBalance(
      wallet.address,
      vipSelectedChain,
      usdtContracts[vipSelectedChain as keyof typeof usdtContracts]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vipSelectedChain]);

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
            <StakingInterface t={t} />
            <ReferralSection
              t={t}
              onShowVipModal={() => setShowVipModal(true)}
              onShowCommissionModal={() => setShowCommissionModal(true)}
            />
          </div>
          <PortfolioOverview
            t={t}
            tooltips={tooltips}
            onShowRewardsModal={() => setShowRewardsModal(true)}
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
      />
      <InfoModal
        t={t}
        show={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </div>
  );
}
