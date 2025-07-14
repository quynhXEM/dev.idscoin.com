/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Header from "./home/Header";
import AnnouncementBanner from "./home/AnnouncementBanner";
import HeroStats from "./home/HeroStats";
import StakingInterface from "./home/StakingInterface";
import ReferralCard from "./home/ReferralCard";
import PortfolioOverview from "./home/PortfolioOverview";
import Footer from "./home/Footer";
import VipUpgradeModal from "./home/VipUpgradeModal";
import CommissionDetailsModal from "./home/CommissionDetailsModal";
import RewardsModal from "./home/RewardsModal";
import InfoModal from "./home/InfoModal";
import { useUserWallet } from "@/commons/UserWalletContext";
import { Button } from "@/components/ui/button";

export default function IDSStakingPlatform() {
  const t = useTranslations("home");
  <style jsx>{`
    @keyframes marquee {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
    .animate-marquee {
      animation: marquee 15s linear infinite;
    }
  `}</style>;
  const [stakeAmount, setStakeAmount] = useState("");
  const [lockPeriod, setLockPeriod] = useState("30");
  const [copied, setCopied] = useState(false);
  const [membershipType, setMembershipType] = useState<"free" | "vip">("free");
  const [showVipModal, setShowVipModal] = useState(false);
  const [selectedChain, setSelectedChain] = useState<any>("1");
  const [swapAmount, setSwapAmount] = useState("");
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [vipSelectedChain, setVipSelectedChain] = useState("ethereum");
  const { connectWallet, isConnected, sendTransaction } = useUserWallet();
  const referralLink = "https://ids-community.com/ref/USER123456";

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleStake = async () => {
    const txHash = await sendTransaction({
      to: "0xf59402F215FE30e09CC7AAC1551604A029AE381A",
      amount: stakeAmount,
      type: "coin",
      chainId: 97,
    });
    console.log(txHash);
  };

  const handleSwap = async () => {
    const usdtContracts = {
      1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",     // Ethereum Mainnet (ERC-20)
      56: "0x55d398326f99059ff775485246999027b3197955",    // BNB Smart Chain (BEP-20)
      137: "0xC2132D05D31c914A87C6611C10748AEb04B58E8F",    // Polygon Mainnet
      42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"   // Arbitrum One
    };
    const txHash = await sendTransaction({
      to: '0xf59402F215FE30e09CC7AAC1551604A029AE381A',
      amount: swapAmount,
      type: "token",
      chainId: Number(selectedChain),
      tokenAddress: usdtContracts[selectedChain as keyof typeof usdtContracts]
    });
    console.log(txHash);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const visited = sessionStorage.getItem("idscoin_visited");
      if (visited) {
        connectWallet();
      } else {
        sessionStorage.setItem("idscoin_visited", "1");
      }
    }
  }, []);

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
      <div className="container mx-auto px-4 py-8 min-h-[79vh] ">
        <AnnouncementBanner t={t} onClick={() => setShowInfoModal(true)} />
        {!isConnected && (
          <div className="flex justify-center items-center mb-3">
            <Button
              variant="default"
              className="w-full cursor-pointer max-w-[220px] bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 border-orange-400 shadow-lg shadow-orange-500/30 ring-1 ring-orange-400/50"
              onClick={() => connectWallet()}
            >
              Connect Wallet
            </Button>
          </div>
        )}
        <HeroStats t={t} tooltips={tooltips} />
        {isConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <StakingInterface
                t={t}
                stakeAmount={stakeAmount}
                setStakeAmount={setStakeAmount}
                lockPeriod={lockPeriod}
                setLockPeriod={setLockPeriod}
                selectedChain={selectedChain}
                setSelectedChain={setSelectedChain}
                swapAmount={swapAmount}
                setSwapAmount={setSwapAmount}
                handleStake={handleStake}
                handleSwap={handleSwap}
              />
              <ReferralCard
                t={t}
                membershipType={membershipType}
                setShowVipModal={setShowVipModal}
                referralLink={referralLink}
                copyReferralLink={copyReferralLink}
                copied={copied}
                setShowCommissionModal={setShowCommissionModal}
              />
            </div>
            <PortfolioOverview
              t={t}
              setShowRewardsModal={setShowRewardsModal}
            />
          </div>
        )}
      </div>
      <Footer t={t} />
      <VipUpgradeModal
        t={t}
        show={showVipModal}
        onClose={() => setShowVipModal(false)}
        membershipType={membershipType}
        setMembershipType={setMembershipType}
        vipSelectedChain={vipSelectedChain}
        setVipSelectedChain={setVipSelectedChain}
      />
      <CommissionDetailsModal
        t={t}
        show={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        membershipType={membershipType}
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
