"use client"

import type React from "react"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Header from "./home/Header"
import AnnouncementBanner from "./home/AnnouncementBanner"
import HeroStats from "./home/HeroStats"
import StakingInterface from "./home/StakingInterface"
import ReferralCard from "./home/ReferralCard"
import PortfolioOverview from "./home/PortfolioOverview"
import Footer from "./home/Footer"
import VipUpgradeModal from "./home/VipUpgradeModal"
import CommissionDetailsModal from "./home/CommissionDetailsModal"
import RewardsModal from "./home/RewardsModal"
import InfoModal from "./home/InfoModal"

export default function IDSStakingPlatform() {
  const t = useTranslations("home")
  ;<style jsx>{`
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  .animate-marquee {
    animation: marquee 15s linear infinite;
  }
`}</style>
  const [stakeAmount, setStakeAmount] = useState("")
  const [lockPeriod, setLockPeriod] = useState("30")
  const [copied, setCopied] = useState(false)
  const [membershipType, setMembershipType] = useState<"free" | "vip">("free")
  const [showVipModal, setShowVipModal] = useState(false)
  const [selectedChain, setSelectedChain] = useState("ethereum")
  const [swapAmount, setSwapAmount] = useState("")
  const [showCommissionModal, setShowCommissionModal] = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [vipSelectedChain, setVipSelectedChain] = useState("ethereum")

  const referralLink = "https://ids-community.com/ref/USER123456"

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const tooltips = {
    tvl: t('tooltips.tvl'),
    apy: t('tooltips.apy'),
    users: t('tooltips.users'),
    locked: t('tooltips.locked'),
    stakeProgress: t('tooltips.stakeProgress'),
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header t={t} />
      <div className="container mx-auto px-4 py-8">
        <AnnouncementBanner t={t} onClick={() => setShowInfoModal(true)} />
        <HeroStats t={t} tooltips={tooltips} />
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
          <PortfolioOverview t={t} setShowRewardsModal={setShowRewardsModal} />
        </div>
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
  )
}
