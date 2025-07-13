"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUp,
  Wallet,
  Lock,
  Gift,
  DollarSign,
  BarChart3,
  Clock,
  Users,
  Shield,
  Zap,
  Copy,
  Share2,
  UserPlus,
  Info,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LocaleDropdown from "@/commons/LocaleDropdown"
import { useTranslations } from "next-intl"

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
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ [key: string]: string }>({})
  const [selectedChain, setSelectedChain] = useState("ethereum")
  const [swapAmount, setSwapAmount] = useState("")
  const [showCommissionModal, setShowCommissionModal] = useState(false)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [vipSelectedChain, setVipSelectedChain] = useState("ethereum")
  const [isMobile, setIsMobile] = useState(false)

  const tooltipRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

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

  const calculateTooltipPosition = (tooltipId: string, iconElement: HTMLElement) => {
    const tooltip = tooltipRefs.current[tooltipId]
    if (!tooltip) return "bottom"

    const iconRect = iconElement.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const headerHeight = 80
    const isMobile = viewportWidth < 768

    if (isMobile) {
      // Get tooltip dimensions
      const tooltipRect = tooltip.getBoundingClientRect()
      const tooltipWidth = 240 // w-60 = 240px
      const tooltipHeight = tooltipRect.height || 120 // estimated height

      // Calculate available space in each direction
      const spaceLeft = iconRect.left
      const spaceRight = viewportWidth - iconRect.right
      const spaceTop = iconRect.top - headerHeight
      const spaceBottom = viewportHeight - iconRect.bottom

      // Determine best position based on available space
      if (spaceRight >= tooltipWidth) {
        return "right" // Show to the right if there's enough space
      } else if (spaceLeft >= tooltipWidth) {
        return "left" // Show to the left if right doesn't fit
      } else if (spaceBottom >= tooltipHeight) {
        return "bottom-center" // Show below, centered within viewport
      } else if (spaceTop >= tooltipHeight) {
        return "top-center" // Show above, centered within viewport
      } else {
        return "mobile-overlay" // Use overlay if nothing fits
      }
    }

    // Desktop positioning logic (existing)
    const tooltipRect = tooltip.getBoundingClientRect()
    const wouldOverflowRight = iconRect.left + tooltipRect.width / 2 > viewportWidth - 20
    const wouldOverflowLeft = iconRect.left - tooltipRect.width / 2 < 20
    const wouldHitHeader = iconRect.top - tooltipRect.height < headerHeight + 20
    const wouldOverflowBottom = iconRect.bottom + tooltipRect.height > viewportHeight - 20

    if (wouldHitHeader && !wouldOverflowBottom) {
      return "bottom"
    } else if (wouldOverflowBottom && !wouldHitHeader) {
      return "top"
    } else if (wouldOverflowRight && !wouldOverflowLeft) {
      return "left"
    } else if (wouldOverflowLeft && !wouldOverflowRight) {
      return "right"
    } else {
      return "top"
    }
  }

  const handleTooltipShow = (tooltipId: string, event: React.MouseEvent<HTMLElement>) => {
    const iconElement = event.currentTarget
    const position = calculateTooltipPosition(tooltipId, iconElement)

    setTooltipPosition((prev) => ({ ...prev, [tooltipId]: position }))
    setActiveTooltip(tooltipId)
  }

  const getTooltipClasses = (tooltipId: string) => {
    const position = tooltipPosition[tooltipId] || "top"
    // Sử dụng biến isMobile đã được xác định ở client
    if (position === "mobile-overlay") {
      return "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 max-w-[85vw] p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl text-sm text-gray-300 z-[70]"
    }
    const baseClasses = isMobile
      ? "absolute w-60 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-xs text-gray-300"
      : "absolute w-64 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-xs text-gray-300"
    switch (position) {
      case "top":
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
      case "bottom":
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`
      case "left":
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`
      case "right":
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`
      case "bottom-center":
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2 max-w-[90vw]`
      case "top-center":
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2 max-w-[90vw]`
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
    }
  }

  const getArrowClasses = (tooltipId: string) => {
    const position = tooltipPosition[tooltipId] || "top"

    // No arrow for mobile overlay
    if (position === "mobile-overlay") {
      return "hidden"
    }

    switch (position) {
      case "top":
      case "top-center":
        return "absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"
      case "bottom":
      case "bottom-center":
        return "absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"
      case "left":
        return "absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"
      case "right":
        return "absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"
      default:
        return "absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"
    }
  }

  useEffect(() => {
    setIsMobile(typeof window !== "undefined" && window.innerWidth < 768)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{t('header.ids')}</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('header.idsCoin')}
              </h1>
            </div>
            <div className="flex items-right space-x-4">
              <LocaleDropdown />
              {/* <ThemeToggle /> */}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Announcement Banner */}
        <div className="mb-8">
          <Card
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 border-blue-500 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            onClick={() => setShowInfoModal(true)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <div className="animate-bounce mr-3">
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="overflow-hidden whitespace-nowrap">
                  <div className="animate-marquee inline-block text-white font-bold text-lg">
                    {t('announcement.discovery')}
                  </div>
                </div>
                <div className="animate-bounce ml-3">
                  <span className="text-2xl">💎</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <p className="text-gray-400 text-sm">{t('stats.totalTvl')}</p>
                    <div className="relative">
                      <div
                        className="p-1 -m-1 cursor-help transition-colors rounded"
                        onMouseEnter={(e) => handleTooltipShow("tvl", e)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTooltip(activeTooltip === "tvl" ? null : "tvl")
                          if (activeTooltip !== "tvl") {
                            handleTooltipShow("tvl", e)
                          }
                        }}
                      >
                        <Info className="w-3 h-3 text-gray-500 hover:text-blue-400 transition-colors" />
                      </div>
                      {activeTooltip === "tvl" && (
                        <div
                          ref={(el) => (tooltipRefs.current.tvl = el)}
                          className={`${getTooltipClasses("tvl")} z-[60]`}
                        >
                          {tooltips.tvl}
                          <div className={getArrowClasses("tvl")}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold">$2.4M</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <p className="text-gray-400 text-sm">{t('stats.averageApy')}</p>
                    <div className="relative">
                      <div
                        className="p-1 -m-1 cursor-help transition-colors rounded"
                        onMouseEnter={(e) => handleTooltipShow("apy", e)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTooltip(activeTooltip === "apy" ? null : "apy")
                          if (activeTooltip !== "apy") {
                            handleTooltipShow("apy", e)
                          }
                        }}
                      >
                        <Info className="w-3 h-3 text-gray-500 hover:text-blue-400 transition-colors" />
                      </div>
                      {activeTooltip === "apy" && (
                        <div
                          ref={(el) => (tooltipRefs.current.apy = el)}
                          className={`${getTooltipClasses("apy")} z-[60]`}
                        >
                          {tooltips.apy}
                          <div className={getArrowClasses("apy")}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold">13.5%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <p className="text-gray-400 text-sm">{t('stats.users')}</p>
                    <div className="relative">
                      <div
                        className="p-1 -m-1 cursor-help transition-colors rounded"
                        onMouseEnter={(e) => handleTooltipShow("users", e)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTooltip(activeTooltip === "users" ? null : "users")
                          if (activeTooltip !== "users") {
                            handleTooltipShow("users", e)
                          }
                        }}
                      >
                        <Info className="w-3 h-3 text-gray-500 hover:text-blue-400 transition-colors" />
                      </div>
                      {activeTooltip === "users" && (
                        <div
                          ref={(el) => (tooltipRefs.current.users = el)}
                          className={`${getTooltipClasses("users")} z-[60]`}
                        >
                          {tooltips.users}
                          <div className={getArrowClasses("users")}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold">12,847</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <p className="text-gray-400 text-sm">{t('stats.locked')}</p>
                    <div className="relative">
                      <div
                        className="p-1 -m-1 cursor-help transition-colors rounded"
                        onMouseEnter={(e) => handleTooltipShow("locked", e)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTooltip(activeTooltip === "locked" ? null : "locked")
                          if (activeTooltip !== "locked") {
                            handleTooltipShow("locked", e)
                          }
                        }}
                      >
                        <Info className="w-3 h-3 text-gray-500 hover:text-blue-400 transition-colors" />
                      </div>
                      {activeTooltip === "locked" && (
                        <div
                          ref={(el) => (tooltipRefs.current.locked = el)}
                          className={`${getTooltipClasses("locked")} z-[60]`}
                        >
                          {tooltips.locked}
                          <div className={getArrowClasses("locked")}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold">8.2M</p>
                </div>
                <Lock className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staking Interface */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 border-orange-400 shadow-lg shadow-orange-500/30 ring-1 ring-orange-400/50">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 font-bold text-lg">
                  <Zap className="w-5 h-5 mr-2 text-gray-900" />
                  {t('staking.stake')}
                </CardTitle>
                <CardDescription className="text-gray-800 font-medium">
                  {t('staking.buy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="stake" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-orange-800/80 border border-orange-700">
                    <TabsTrigger
                      value="stake"
                      className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:hover:bg-gray-900 data-[state=inactive]:bg-orange-700/60 data-[state=inactive]:text-orange-100 data-[state=inactive]:hover:bg-orange-600/70 data-[state=inactive]:hover:text-white"
                    >
                      {t('staking.stake')}
                    </TabsTrigger>
                    <TabsTrigger
                      value="buy"
                      className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:hover:bg-gray-900 data-[state=inactive]:bg-orange-700/60 data-[state=inactive]:text-orange-100 data-[state=inactive]:hover:bg-orange-600/70 data-[state=inactive]:hover:text-white"
                    >
                      {t('staking.usdtToIds')}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="stake" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount" className="text-gray-900 font-semibold">
                          {t('staking.amount')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="amount"
                            placeholder="0.00"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className="pr-20 bg-white/90 border-gray-800 text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:bg-white font-medium"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                              onClick={() => setStakeAmount("1250.00")}
                            >
                              Max
                            </Button>
                            <span className="text-sm text-gray-700 font-medium">{t('staking.ids')}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <p className="text-gray-800 font-medium">{t('staking.availableBalance')}: 1,250.00 {t('staking.ids')}</p>
                          <p className="text-gray-800 font-medium">{t('staking.min')}: 100 {t('staking.ids')}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-900 font-semibold">{t('staking.lockPeriod')}</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          {["30", "90", "180", "360"].map((days) => (
                            <Button
                              key={days}
                              variant={lockPeriod === days ? "default" : "outline"}
                              onClick={() => setLockPeriod(days)}
                              className={`h-12 ${
                                lockPeriod === days
                                  ? "bg-gray-900 hover:bg-gray-800 text-white font-bold border-gray-900"
                                  : "border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 bg-white/80 font-semibold"
                              }`}
                            >
                              <div className="text-center">
                                <div className="font-semibold">{days} {t('staking.days')}</div>
                                <div className="text-xs opacity-80">
                                  {days === "30" ? "5%" : days === "90" ? "8%" : days === "180" ? "15%" : "25%"} {t('staking.apy')}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 font-semibold">{t('staking.estimatedReward')}:</span>
                          <span className="font-bold text-gray-900">
                            {stakeAmount ? (Number.parseFloat(stakeAmount) * 0.0007).toFixed(4) : "0.0000"} {t('staking.ids')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-900 font-semibold">{t('staking.apy')}:</span>
                          <span className="font-bold text-gray-900">
                            {lockPeriod === "30"
                              ? "5%"
                              : lockPeriod === "90"
                                ? "8%"
                                : lockPeriod === "180"
                                  ? "15%"
                                  : "25%"}
                          </span>
                        </div>
                      </div>

                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg" size="lg">
                        <Lock className="w-4 h-4 mr-2" />
                        {t('staking.stake')}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="buy" className="space-y-6">
                    <div className="space-y-4">
                      {/* Chain Selection */}
                      <div>
                        <Label className="text-gray-900 font-semibold">{t('staking.selectChain')}</Label>
                        <Select value={selectedChain} onValueChange={setSelectedChain}>
                          <SelectTrigger className="w-full mt-2 bg-white/90 border-gray-800 text-gray-900 focus:border-gray-900 font-medium">
                            <SelectValue placeholder={t('staking.selectChain')} />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-800">
                            <SelectItem value="ethereum" className="flex items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">⟠</span>
                                <div>
                                  <div className="font-semibold">{t('staking.ethereum')}</div>
                                  <div className="text-xs text-gray-500">{t('staking.eth')}</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="bsc" className="flex items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🟡</span>
                                <div>
                                  <div className="font-semibold">{t('staking.bsc')}</div>
                                  <div className="text-xs text-gray-500">{t('staking.bnb')}</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="polygon" className="flex items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🟣</span>
                                <div>
                                  <div className="font-semibold">{t('staking.polygon')}</div>
                                  <div className="text-xs text-gray-500">{t('staking.matic')}</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="arbitrum" className="flex items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🔵</span>
                                <div>
                                  <div className="font-semibold">{t('staking.arbitrum')}</div>
                                  <div className="text-xs text-gray-500">{t('staking.arb')}</div>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Swap Amount */}
                      <div>
                        <Label htmlFor="swapAmount" className="text-gray-900 font-semibold">
                          {t('staking.usdtAmount')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="swapAmount"
                            placeholder="0.00"
                            value={swapAmount}
                            onChange={(e) => setSwapAmount(e.target.value)}
                            className="pr-20 bg-white/90 border-gray-800 text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:bg-white font-medium"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                              onClick={() => setSwapAmount("500.00")}
                            >
                              Max
                            </Button>
                            <span className="text-sm text-gray-700 font-medium">{t('staking.usdt')}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <p className="text-gray-800 font-medium">{t('staking.availableBalance')}: 500.00 {t('staking.usdt')}</p>
                          <p className="text-gray-800 font-medium">{t('staking.min')}: 10 {t('staking.usdt')}</p>
                        </div>
                      </div>

                      {/* Swap Details */}
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-gray-800 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 font-semibold">{t('staking.exchangeRate')}:</span>
                          <span className="font-bold text-gray-900">1 {t('staking.usdt')} = 1.00 {t('staking.ids')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 font-semibold">{t('staking.transactionFee')}:</span>
                          <span className="font-bold text-emerald-700">{t('staking.free')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 font-semibold">{t('staking.receivedIds')}:</span>
                          <span className="font-bold text-gray-900">~0.00 {t('staking.ids')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm border-t border-gray-800 pt-2">
                          <span className="text-gray-900 font-semibold">{t('staking.processingTime')}:</span>
                          <span className="font-bold text-gray-900">5-10 {t('staking.seconds')}</span>
                        </div>
                      </div>

                      {/* Wallet Connection Status */}
                      <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-900 font-medium">{t('staking.notConnected')}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white bg-white/60"
                          >
                            {t('staking.connectWallet')}
                          </Button>
                        </div>
                      </div>

                      {/* Swap Instructions */}
                      <div className="bg-blue-900/20 backdrop-blur-sm p-4 rounded-lg border border-blue-700/50">
                        <div className="text-sm text-gray-900 space-y-2">
                          <div className="font-semibold text-blue-900 mb-2">{t('staking.swapInstructions')}:</div>
                          <div className="space-y-1 text-gray-800">
                            <div>{t('staking.step1')}</div>
                            <div>{t('staking.step2')}</div>
                            <div>{t('staking.step3')}</div>
                            <div>{t('staking.step4')}</div>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg" size="lg">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {t('staking.swap')}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-white">
                    <Share2 className="w-5 h-5 mr-2 text-blue-400" />
                    {t('referral.introduce')}
                  </CardTitle>
                  <Badge
                    variant={membershipType === "vip" ? "default" : "secondary"}
                    className={
                      membershipType === "vip"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-200"
                    }
                  >
                    {membershipType === "vip" ? "VIP" : "Miễn phí"}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  {membershipType === "free"
                    ? t('referral.earn5')
                    : t('referral.earn50')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {membershipType === "free" && (
                  <div className="p-4 bg-gray-800 rounded-lg border border-blue-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-blue-300">{t('vip.upgrade')}</div>
                        <div className="text-sm text-blue-400/80">{t('vip.upgrade50')}</div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => setShowVipModal(true)}
                      >
                        {t('vip.upgrade100')}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-gray-800 rounded-lg border-2 border-dashed border-blue-600/50">
                  <div className="text-center mb-3">
                    <UserPlus className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                    <div className="text-sm font-medium text-blue-300">{t('referral.yourLink')}</div>
                    <div className="text-xs text-gray-400">{t('referral.earn', { percent: membershipType === "free" ? "5%" : "50%" })}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="text-xs bg-gray-700 border-gray-600 text-gray-300"
                    />
                    <Button
                      size="sm"
                      onClick={copyReferralLink}
                      className={copied ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}
                    >
                      {copied ? (
                        <>
                          <Shield className="w-4 h-4 mr-1" />
                          {t('referral.copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          {t('referral.copy')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="text-lg font-bold text-blue-400">12</div>
                    <div className="text-xs text-gray-400">{t('referral.friendsJoined')}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="text-lg font-bold text-emerald-400">
                      ${membershipType === "free" ? "22.84" : "228.35"}
                    </div>
                    <div className="text-xs text-gray-400">{t('referral.usdtEarnings')}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{t('referral.todayEarnings')}:</span>
                    <span className="text-emerald-400">+${membershipType === "free" ? "0.62" : "6.15"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{t('referral.monthlyEarnings')}:</span>
                    <span className="text-emerald-400">+${membershipType === "free" ? "14.23" : "142.25"}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-600 hover:text-blue-300 bg-transparent"
                    size="sm"
                    onClick={() => setShowCommissionModal(true)}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {t('referral.viewDetails')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Overview */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Wallet className="w-5 h-5 mr-2 text-blue-400" />
                  {t('overview.totalAccount')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('overview.totalBalance')}:</span>
                    <span className="font-semibold text-white">1,250.00 {t('staking.ids')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('overview.staked')}:</span>
                    <span className="font-semibold text-blue-400">850.00 {t('staking.ids')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('overview.available')}:</span>
                    <span className="font-semibold text-white">400.00 {t('staking.ids')}</span>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('overview.totalRewards')}:</span>
                    <span className="font-semibold text-cyan-400">127.45 {t('staking.ids')}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-300">{t('overview.stakeProgress')}:</span>
                      <div className="relative">
                        <div
                          className="p-1 -m-1 cursor-help transition-colors rounded"
                          onMouseEnter={(e) => handleTooltipShow("stakeProgress", e)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          onClick={(e) => {
                            e.preventDefault()
                            setActiveTooltip(activeTooltip === "stakeProgress" ? null : "stakeProgress")
                            if (activeTooltip !== "stakeProgress") {
                              handleTooltipShow("stakeProgress", e)
                            }
                          }}
                        >
                          <Info className="w-3 h-3 text-gray-500 hover:text-blue-400 transition-colors" />
                        </div>
                        {activeTooltip === "stakeProgress" && (
                          <div
                            ref={(el) => (tooltipRefs.current.stakeProgress = el)}
                            className={`${getTooltipClasses("stakeProgress")} z-[60]`}
                          >
                            {t('overview.stakeProgressDescription')}
                            <div className={getArrowClasses("stakeProgress")}></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-300">68%</span>
                  </div>
                  <Progress value={68} className="h-2 bg-gray-800" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Gift className="w-5 h-5 mr-2 text-cyan-400" />
                  {t('rewards.rewards')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-blue-400">12.34 {t('staking.ids')}</div>
                  <div className="text-sm text-gray-400">{t('rewards.pending')}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{t('rewards.today')}:</span>
                    <span className="text-blue-400">+2.45 {t('staking.ids')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{t('rewards.last7Days')}:</span>
                    <span className="text-blue-400">+17.23 {t('staking.ids')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{t('rewards.last30Days')}:</span>
                    <span className="text-blue-400">+73.89 {t('staking.ids')}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-600 hover:text-blue-300 bg-transparent"
                  onClick={() => setShowRewardsModal(true)}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {t('rewards.claimRewards')}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Clock className="w-5 h-5 mr-2 text-cyan-400" />
                  {t('history.stakeHistory')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">500 {t('staking.ids')}</div>
                      <div className="text-sm text-gray-400">{t('history.90DaysApy')}</div>
                    </div>
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      {t('history.locked')}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">350 {t('staking.ids')}</div>
                      <div className="text-sm text-gray-400">{t('history.30DaysApy')}</div>
                    </div>
                    <Badge variant="outline" className="border-blue-600 text-blue-400">
                      <Clock className="w-3 h-3 mr-1" />{t('history.5DaysLeft')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            © 2024{" "}
            <a
              href="https://www.nobody.network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              {t('footer.nobodyNetwork')}
            </a>
            . {t('footer.allRightsReserved')}
          </div>
        </div>
      </footer>

      {/* VIP Upgrade Modal */}
      {showVipModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowVipModal(false)}
        >
          <Card className="w-full max-w-md mx-4 bg-gray-900 border-gray-800" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-2"></div>
                {t('vip.upgrade')}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {t('vip.becomeVip')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-blue-700/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">{t('vip.upgradeCost')}</div>
                  <div className="text-sm text-gray-400">{t('vip.upgradeOneTime')}</div>
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold">{t('vip.selectChain')}</Label>
                <Select value={vipSelectedChain} onValueChange={setVipSelectedChain}>
                  <SelectTrigger className="w-full mt-2 bg-gray-800 border-gray-700 text-white focus:border-blue-500">
                    <SelectValue placeholder={t('vip.selectChain')} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="ethereum" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⟠</span>
                        <div>
                          <div className="font-semibold text-white">{t('staking.ethereum')}</div>
                          <div className="text-xs text-gray-400">{t('staking.ethNetwork')}</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="bsc" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟡</span>
                        <div>
                          <div className="font-semibold text-white">{t('staking.bsc')}</div>
                          <div className="text-xs text-gray-400">{t('staking.bnbNetwork')}</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="polygon" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟣</span>
                        <div>
                          <div className="font-semibold text-white">{t('staking.polygon')}</div>
                          <div className="text-xs text-gray-400">{t('staking.maticNetwork')}</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="arbitrum" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔵</span>
                        <div>
                          <div className="font-semibold text-white">{t('staking.arbitrum')}</div>
                          <div className="text-xs text-gray-400">{t('staking.arbNetwork')}</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-300">{t('vip.currentEarnings')}:</span>
                  <span className="font-semibold text-red-400">5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-300">{t('vip.vipEarnings')}:</span>
                  <span className="font-semibold text-blue-400">50%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-300">{t('vip.increaseEarnings')}:</span>
                  <span className="font-semibold text-cyan-400">10x</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-center">{t('vip.upgradePayment')}</div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent"
                  onClick={() => setShowVipModal(false)}
                >
                  {t('vip.cancel')}
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    setMembershipType("vip")
                    setShowVipModal(false)
                  }}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  {t('vip.upgrade100')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Commission Details Modal */}
      {showCommissionModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowCommissionModal(false)}
        >
          <Card
            className="w-full max-w-lg mx-4 bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Gift className="w-5 h-5 mr-2 text-cyan-400" />
                {t('referral.details')}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {t('referral.detailsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Status */}
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{t('referral.currentStatus')}</h3>
                  <Badge
                    variant={membershipType === "vip" ? "default" : "secondary"}
                    className={
                      membershipType === "vip"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200"
                    }
                  >
                    {membershipType === "vip" ? "VIP" : "Miễn phí"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {membershipType === "free" ? "5%" : "50%"}
                    </div>
                    <div className="text-sm text-gray-400">{t('referral.usdtRate')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">12</div>
                    <div className="text-sm text-gray-400">{t('referral.vipUpgrades')}</div>
                  </div>
                </div>
              </div>

              {/* Commission History */}
              <div>
                <h3 className="font-semibold text-white mb-3">{t('referral.commissionHistory')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">{t('referral.today')}</div>
                      <div className="text-sm text-gray-400">{t('referral.1F1Upgrade')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">+${membershipType === "free" ? "5.00" : "50.00"}</div>
                      <div className="text-xs text-gray-500">{t('referral.fromUpgrade100')}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">{t('referral.last7Days')}</div>
                      <div className="text-sm text-gray-400">{t('referral.3F1Upgrade')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        +${membershipType === "free" ? "15.00" : "150.00"}
                      </div>
                      <div className="text-xs text-gray-500">{t('referral.fromUpgrade300')}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">{t('referral.last30Days')}</div>
                      <div className="text-sm text-gray-400">{t('referral.8F1Upgrade')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        +${membershipType === "free" ? "40.00" : "400.00"}
                      </div>
                      <div className="text-xs text-gray-500">{t('referral.fromUpgrade800')}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">{t('referral.total')}</div>
                      <div className="text-sm text-gray-400">{t('referral.12F1Upgrade')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        +${membershipType === "free" ? "60.00" : "600.00"}
                      </div>
                      <div className="text-xs text-gray-500">{t('referral.fromUpgrade1200')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Referrals */}
              <div>
                <h3 className="font-semibold text-white mb-3">{t('referral.topReferrals')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-medium text-white">User***123</div>
                        <div className="text-sm text-gray-400">{t('referral.5VipUpgrades')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        +${membershipType === "free" ? "25.00" : "250.00"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <div>
                        <div className="font-medium text-white">User***456</div>
                        <div className="text-sm text-gray-400">{t('referral.4VipUpgrades')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        +${membershipType === "free" ? "20.00" : "200.00"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        3
                      </div>
                      <div>
                        <div className="font-medium text-white">User***789</div>
                        <div className="text-sm text-gray-400">{t('referral.3VipUpgrades')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        +${membershipType === "free" ? "15.00" : "150.00"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {membershipType === "free" && (
                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
                  <div className="text-center">
                    <div className="text-blue-300 font-semibold mb-2">{t('vip.tip')}</div>
                    <div className="text-sm text-blue-200 mb-3">
                      {t('vip.upgrade50Tip')}
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => {
                        setShowCommissionModal(false)
                        setShowVipModal(true)
                      }}
                    >
                      {t('vip.upgradeVipNow')}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent"
                  onClick={() => setShowCommissionModal(false)}
                >
                  {t('referral.close')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rewards Modal */}
      {showRewardsModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowRewardsModal(false)}
        >
          <Card
            className="w-full max-w-lg mx-4 bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Gift className="w-5 h-5 mr-2 text-cyan-400" />
                {t('rewards.rewardsDetails')}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {t('rewards.rewardsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Rewards Status */}
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{t('rewards.currentRewards')}</h3>
                  <Badge
                    variant="secondary"
                    className="bg-cyan-700 text-cyan-300 hover:bg-cyan-600 hover:text-cyan-200"
                  >
                    {t('rewards.earning')}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">12.34 {t('staking.ids')}</div>
                    <div className="text-sm text-gray-400">{t('rewards.pending')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">850.00 {t('staking.ids')}</div>
                    <div className="text-sm text-gray-400">{t('rewards.staking')}</div>
                  </div>
                </div>
              </div>

              {/* Rewards History */}
              <div>
                <h3 className="font-semibold text-white mb-3">{t('rewards.rewardsHistory')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">{t('rewards.today')}</div>
                      <div className="text-sm text-gray-400">{t('rewards.from850Ids')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+2.45 {t('staking.ids')}</div>
                      <div className="text-xs text-gray-500">~$2.45</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">{t('rewards.last7Days')}</div>
                      <div className="text-sm text-gray-400">{t('rewards.earned')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+17.23 {t('staking.ids')}</div>
                      <div className="text-xs text-gray-500">~$17.23</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">{t('rewards.last30Days')}</div>
                      <div className="text-sm text-gray-400">{t('rewards.earned')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+73.89 {t('staking.ids')}</div>
                      <div className="text-xs text-gray-500">~$73.89</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">{t('rewards.total')}</div>
                      <div className="text-sm text-gray-400">{t('rewards.fromStart')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+127.45 {t('staking.ids')}</div>
                      <div className="text-xs text-gray-500">~$127.45</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stake Positions */}
              <div>
                <h3 className="font-semibold text-white mb-3">{t('rewards.currentPositions')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-medium text-white">500 {t('staking.ids')}</div>
                        <div className="text-sm text-gray-400">{t('history.90DaysApy')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+1.10 {t('staking.ids')}/day</div>
                      <div className="text-xs text-gray-500">{t('rewards.65DaysLeft')}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <div>
                        <div className="font-medium text-white">350 {t('staking.ids')}</div>
                        <div className="text-sm text-gray-400">{t('history.30DaysApy')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+0.48 {t('staking.ids')}/day</div>
                      <div className="text-xs text-gray-500">{t('rewards.5DaysLeft')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Claim Information */}
              <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
                <div className="text-center">
                  <div className="text-blue-300 font-semibold mb-2">{t('rewards.claimInformation')}</div>
                  <div className="text-sm text-blue-200 mb-3 space-y-1">
                    <div>{t('rewards.dailyEarnings')}</div>
                    <div>{t('rewards.canClaimAnytime')}</div>
                    <div>{t('rewards.noTransactionFee')}</div>
                    <div>{t('rewards.rewardsWillBeAdded')}</div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  onClick={() => {
                    // Handle claim rewards logic here
                    setShowRewardsModal(false)
                  }}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {t('rewards.claim12Ids')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent"
                  onClick={() => setShowRewardsModal(false)}
                >
                  {t('rewards.close')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* IDS Info Modal */}
      {showInfoModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowInfoModal(false)}
        >
          <Card
            className="w-full max-w-4xl mx-4 bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-white text-2xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">{t('header.ids')}</span>
                </div>
                {t('header.intelligentDecentralizedSolution')}
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                {t('header.nobodyChain')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Hero Section */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-700/50">
                <div className="text-4xl mb-4">🚀</div>
                <h2 className="text-2xl font-bold text-white mb-3">{t('header.nobodyChainEcosystem')}</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t('header.teamDescription')}
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Blockchain Explorer */}
                <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">A-Scan Explorer</h3>
                      <p className="text-blue-400 text-sm">{t('products.aScanExplorer')}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {t('products.aScanExplorerDescription')}
                  </p>
                  <a
                    href="https://a-scan.nobody.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    {t('products.exploreNow')} →
                  </a>
                </div>

                {/* Chat System */}
                <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Chat Network</h3>
                      <p className="text-purple-400 text-sm">{t('products.chatNetwork')}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {t('products.chatNetworkDescription')}
                  </p>
                  <a
                    href="https://chat.nobody.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    {t('products.experienceNow')} →
                  </a>
                </div>

                {/* Wallet */}
                <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">💳</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Wallet Air</h3>
                      <p className="text-cyan-400 text-sm">{t('products.cryptoWallet')}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {t('products.cryptoWalletDescription')}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.walletair"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
                    >
                      {t('products.android')}
                    </a>
                    <a
                      href="https://apps.apple.com/app/walletair/id123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
                    >
                      {t('products.ios')}
                    </a>
                  </div>
                </div>

                {/* IDS Staking */}
                <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">IDS Staking</h3>
                      <p className="text-orange-400 text-sm">{t('products.investmentPlatform')}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {t('products.investmentPlatformDescription')}
                  </p>
                  <span className="inline-flex items-center text-orange-400 font-semibold">{t('products.using')}</span>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600">
                <h3 className="text-xl font-bold text-white mb-4 text-center">{t('mission.mission')}</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl mb-3">🛡️</div>
                    <h4 className="font-semibold text-white mb-2">{t('mission.privacyProtection')}</h4>
                    <p className="text-gray-300 text-sm">
                      {t('mission.developPrivacySolutions')}
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl mb-3">🌐</div>
                    <h4 className="font-semibold text-white mb-2">{t('mission.internetFreedom')}</h4>
                    <p className="text-gray-300 text-sm">
                      {t('mission.createFreeInternet')}
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl mb-3">🚀</div>
                    <h4 className="font-semibold text-white mb-2">{t('mission.innovation')}</h4>
                    <p className="text-gray-300 text-sm">
                      {t('mission.leadingEdgeTechnology')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Investment Call */}
              <div className="p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-700/50 text-center">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-white mb-3">{t('investment.investInFuture')}</h3>
                <p className="text-gray-300 text-lg mb-4">
                  {t('investment.ongoingFundraising')}
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">50+</div>
                    <div className="text-sm text-gray-400">{t('investment.developers')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">4</div>
                    <div className="text-sm text-gray-400">{t('investment.liveProducts')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">100K+</div>
                    <div className="text-sm text-gray-400">{t('investment.users')}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent px-8"
                  onClick={() => setShowInfoModal(false)}
                >
                  {t('referral.close')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Tooltip Backdrop */}
      {activeTooltip && tooltipPosition[activeTooltip] === "mobile-overlay" && (
        <div className="fixed inset-0 bg-black/60 z-[65] md:hidden" onClick={() => setActiveTooltip(null)} />
      )}
    </div>
  )
}
