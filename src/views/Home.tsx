"use client"

import type React from "react"

import { useState, useRef } from "react"
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
import ThemeToggle from "@/commons/ThemeToggle"

export default function IDSStakingPlatform() {
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
    tvl: "Tổng giá trị USD của tất cả IDS coin đang được khóa trong hệ thống. TVL cao thể hiện độ tin cậy của platform.",
    apy: "Lợi suất trung bình hàng năm khi bạn stake IDS coin. Ví dụ: stake 100 IDS sẽ nhận thêm 13.5 IDS sau 1 năm.",
    users: "Tổng số người dùng đã tham gia vào platform. Số lượng lớn cho thấy cộng đồng tin tưởng và sử dụng.",
    locked:
      "Tổng số IDS coin đang được stake/khóa bởi tất cả người dùng. Càng nhiều coin bị khóa càng thể hiện niềm tin dài hạn.",
    stakeProgress:
      "Tỷ lệ phần trăm IDS coin đã được stake so với tổng số dư. Tính bằng: (IDS đã stake / Tổng số dư) × 100%",
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
    const isMobile = window.innerWidth < 768

    // Mobile overlay positioning
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IDS</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                IDS Coin
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
                    🌟 Khám phá IDS - Intelligent Decentralized Solution | Nobody Chain Ecosystem 🌟
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
                    <p className="text-gray-400 text-sm">Tổng TVL</p>
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
                    <p className="text-gray-400 text-sm">APY Trung bình</p>
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
                    <p className="text-gray-400 text-sm">Người dùng</p>
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
                    <p className="text-gray-400 text-sm">IDS đã khóa</p>
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
                  Stake IDS Coin
                </CardTitle>
                <CardDescription className="text-gray-800 font-medium">
                  Mua và khóa IDS coin để nhận hoa hồng hàng ngày
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="stake" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-orange-800/80 border border-orange-700">
                    <TabsTrigger
                      value="stake"
                      className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:hover:bg-gray-900 data-[state=inactive]:bg-orange-700/60 data-[state=inactive]:text-orange-100 data-[state=inactive]:hover:bg-orange-600/70 data-[state=inactive]:hover:text-white"
                    >
                      Stake IDS
                    </TabsTrigger>
                    <TabsTrigger
                      value="buy"
                      className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:hover:bg-gray-900 data-[state=inactive]:bg-orange-700/60 data-[state=inactive]:text-orange-100 data-[state=inactive]:hover:bg-orange-600/70 data-[state=inactive]:hover:text-white"
                    >
                      USDT → IDS
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="stake" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount" className="text-gray-900 font-semibold">
                          Số lượng IDS
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
                            <span className="text-sm text-gray-700 font-medium">IDS</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <p className="text-gray-800 font-medium">Số dư khả dụng: 1,250.00 IDS</p>
                          <p className="text-gray-800 font-medium">Min: 100 IDS</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-900 font-semibold">Thời gian khóa</Label>
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
                                <div className="font-semibold">{days} ngày</div>
                                <div className="text-xs opacity-80">
                                  {days === "30" ? "5%" : days === "90" ? "8%" : days === "180" ? "15%" : "25%"} APY
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 font-semibold">Phần thưởng ước tính/ngày:</span>
                          <span className="font-bold text-gray-900">
                            {stakeAmount ? (Number.parseFloat(stakeAmount) * 0.0007).toFixed(4) : "0.0000"} IDS
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-900 font-semibold">APY:</span>
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
                        Stake IDS Coin
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="buy" className="space-y-6">
                    <div className="space-y-4">
                      {/* Chain Selection */}
                      <div>
                        <Label className="text-gray-900 font-semibold">Chọn blockchain</Label>
                        <Select value={selectedChain} onValueChange={setSelectedChain}>
                          <SelectTrigger className="w-full mt-2 bg-white/90 border-gray-800 text-gray-900 focus:border-gray-900 font-medium">
                            <SelectValue placeholder="Chọn blockchain" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-800">
                            <SelectItem value="ethereum" className="flex items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">⟠</span>
                                <div>
                                  <div className="font-semibold">Ethereum</div>
                                  <div className="text-xs text-gray-500">ETH</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="bsc" className="flex items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🟡</span>
                                <div>
                                  <div className="font-semibold">BSC</div>
                                  <div className="text-xs text-gray-500">BNB</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="polygon" className="flex items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🟣</span>
                                <div>
                                  <div className="font-semibold">Polygon</div>
                                  <div className="text-xs text-gray-500">MATIC</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="arbitrum" className="flex items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🔵</span>
                                <div>
                                  <div className="font-semibold">Arbitrum</div>
                                  <div className="text-xs text-gray-500">ARB</div>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Swap Amount */}
                      <div>
                        <Label htmlFor="swapAmount" className="text-gray-900 font-semibold">
                          Số lượng USDT muốn swap
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
                            <span className="text-sm text-gray-700 font-medium">USDT</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <p className="text-gray-800 font-medium">Số dư khả dụng: 500.00 USDT</p>
                          <p className="text-gray-800 font-medium">Min: 10 USDT</p>
                        </div>
                      </div>

                      {/* Swap Details */}
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-gray-800 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 font-semibold">Tỷ giá IDS:</span>
                          <span className="font-bold text-gray-900">1 USDT = 1.00 IDS</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 font-semibold">Phí giao dịch:</span>
                          <span className="font-bold text-emerald-700">Miễn phí</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 font-semibold">Số IDS nhận được:</span>
                          <span className="font-bold text-gray-900">~0.00 IDS</span>
                        </div>
                        <div className="flex items-center justify-between text-sm border-t border-gray-800 pt-2">
                          <span className="text-gray-900 font-semibold">Thời gian xử lý:</span>
                          <span className="font-bold text-gray-900">5-10 giây</span>
                        </div>
                      </div>

                      {/* Wallet Connection Status */}
                      <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-gray-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-900 font-medium">Chưa kết nối ví</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white bg-white/60"
                          >
                            Kết nối ví
                          </Button>
                        </div>
                      </div>

                      {/* Swap Instructions */}
                      <div className="bg-blue-900/20 backdrop-blur-sm p-4 rounded-lg border border-blue-700/50">
                        <div className="text-sm text-gray-900 space-y-2">
                          <div className="font-semibold text-blue-900 mb-2">📋 Hướng dẫn swap:</div>
                          <div className="space-y-1 text-gray-800">
                            <div>1. Chọn blockchain và kết nối ví</div>
                            <div>2. Nhập số USDT muốn swap</div>
                            <div>3. Gửi USDT đến địa chỉ được cung cấp</div>
                            <div>4. Chờ 5-10 giây để nhận IDS về ví</div>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg" size="lg">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Swap USDT → IDS
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
                    Giới thiệu bạn bè
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
                    ? "Nhận hoa hồng 5% USDT khi F1 nâng cấp VIP"
                    : "Nhận hoa hồng 50% USDT khi F1 nâng cấp VIP"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {membershipType === "free" && (
                  <div className="p-4 bg-gray-800 rounded-lg border border-blue-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-blue-300">Nâng cấp VIP</div>
                        <div className="text-sm text-blue-400/80">Nhận 50% hoa hồng thay vì 5%</div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => setShowVipModal(true)}
                      >
                        Nâng cấp $100
                      </Button>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-gray-800 rounded-lg border-2 border-dashed border-blue-600/50">
                  <div className="text-center mb-3">
                    <UserPlus className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                    <div className="text-sm font-medium text-blue-300">Link giới thiệu của bạn</div>
                    <div className="text-xs text-gray-400">
                      Hoa hồng: {membershipType === "free" ? "5%" : "50%"} USDT
                    </div>
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
                          Đã copy
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="text-lg font-bold text-blue-400">12</div>
                    <div className="text-xs text-gray-400">Bạn bè đã tham gia</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="text-lg font-bold text-emerald-400">
                      ${membershipType === "free" ? "22.84" : "228.35"}
                    </div>
                    <div className="text-xs text-gray-400">USDT hoa hồng</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Hoa hồng hôm nay:</span>
                    <span className="text-emerald-400">+${membershipType === "free" ? "0.62" : "6.15"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Hoa hồng tháng này:</span>
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
                    Xem chi tiết hoa hồng
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
                  Tổng quan tài khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tổng số dư:</span>
                    <span className="font-semibold text-white">1,250.00 IDS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Đã stake:</span>
                    <span className="font-semibold text-blue-400">850.00 IDS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Khả dụng:</span>
                    <span className="font-semibold text-white">400.00 IDS</span>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tổng phần thưởng:</span>
                    <span className="font-semibold text-cyan-400">127.45 IDS</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-300">Tiến độ stake</span>
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
                            Tỷ lệ phần trăm IDS coin đã được stake so với tổng số dư. Tính bằng: (IDS đã stake / Tổng số
                            dư) × 100%
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
                  Phần thưởng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-blue-400">12.34 IDS</div>
                  <div className="text-sm text-gray-400">Phần thưởng chờ nhận</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Hôm nay:</span>
                    <span className="text-blue-400">+2.45 IDS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">7 ngày qua:</span>
                    <span className="text-blue-400">+17.23 IDS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">30 ngày qua:</span>
                    <span className="text-blue-400">+73.89 IDS</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-600 hover:text-blue-300 bg-transparent"
                  onClick={() => setShowRewardsModal(true)}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Nhận phần thưởng
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Clock className="w-5 h-5 mr-2 text-cyan-400" />
                  Lịch sử Stake
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">500 IDS</div>
                      <div className="text-sm text-gray-400">90 ngày - 25% APY</div>
                    </div>
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Đã khóa
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">350 IDS</div>
                      <div className="text-sm text-gray-400">30 ngày - 15% APY</div>
                    </div>
                    <Badge variant="outline" className="border-blue-600 text-blue-400">
                      <Clock className="w-3 h-3 mr-1" />5 ngày còn lại
                    </Badge>
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
              Nobody Network
            </a>
            . All rights reserved.
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
                Nâng cấp VIP
              </CardTitle>
              <CardDescription className="text-gray-400">
                Trở thành thành viên VIP để nhận hoa hồng cao hơn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-blue-700/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">$100</div>
                  <div className="text-sm text-gray-400">Phí nâng cấp một lần</div>
                </div>
              </div>

              <div>
                <Label className="text-white font-semibold">Chọn blockchain để thanh toán</Label>
                <Select value={vipSelectedChain} onValueChange={setVipSelectedChain}>
                  <SelectTrigger className="w-full mt-2 bg-gray-800 border-gray-700 text-white focus:border-blue-500">
                    <SelectValue placeholder="Chọn blockchain" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="ethereum" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⟠</span>
                        <div>
                          <div className="font-semibold text-white">Ethereum</div>
                          <div className="text-xs text-gray-400">ETH Network</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="bsc" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟡</span>
                        <div>
                          <div className="font-semibold text-white">BSC</div>
                          <div className="text-xs text-gray-400">BNB Network</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="polygon" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🟣</span>
                        <div>
                          <div className="font-semibold text-white">Polygon</div>
                          <div className="text-xs text-gray-400">MATIC Network</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="arbitrum" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔵</span>
                        <div>
                          <div className="font-semibold text-white">Arbitrum</div>
                          <div className="text-xs text-gray-400">ARB Network</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-300">Hoa hồng hiện tại:</span>
                  <span className="font-semibold text-red-400">5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-300">Hoa hồng VIP:</span>
                  <span className="font-semibold text-blue-400">50%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-300">Tăng thu nhập:</span>
                  <span className="font-semibold text-cyan-400">10x</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-center">* Phí nâng cấp sẽ được thanh toán bằng USDT</div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent"
                  onClick={() => setShowVipModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    setMembershipType("vip")
                    setShowVipModal(false)
                  }}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Thanh toán $100
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
                Chi tiết hoa hồng giới thiệu
              </CardTitle>
              <CardDescription className="text-gray-400">
                Thống kê chi tiết về hoa hồng USDT từ việc F1 nâng cấp VIP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Status */}
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Trạng thái hiện tại</h3>
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
                    <div className="text-sm text-gray-400">Tỷ lệ hoa hồng USDT</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">12</div>
                    <div className="text-sm text-gray-400">F1 đã nâng cấp VIP</div>
                  </div>
                </div>
              </div>

              {/* Commission History */}
              <div>
                <h3 className="font-semibold text-white mb-3">Lịch sử hoa hồng USDT</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">Hôm nay</div>
                      <div className="text-sm text-gray-400">1 F1 nâng cấp VIP</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">+${membershipType === "free" ? "5.00" : "50.00"}</div>
                      <div className="text-xs text-gray-500">Từ phí nâng cấp $100</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">7 ngày qua</div>
                      <div className="text-sm text-gray-400">3 F1 nâng cấp VIP</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        +${membershipType === "free" ? "15.00" : "150.00"}
                      </div>
                      <div className="text-xs text-gray-500">Từ phí nâng cấp $300</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">30 ngày qua</div>
                      <div className="text-sm text-gray-400">8 F1 nâng cấp VIP</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        +${membershipType === "free" ? "40.00" : "400.00"}
                      </div>
                      <div className="text-xs text-gray-500">Từ phí nâng cấp $800</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">Tổng cộng</div>
                      <div className="text-sm text-gray-400">12 F1 nâng cấp VIP</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">
                        +${membershipType === "free" ? "60.00" : "600.00"}
                      </div>
                      <div className="text-xs text-gray-500">Từ phí nâng cấp $1,200</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Referrals */}
              <div>
                <h3 className="font-semibold text-white mb-3">Top F1 đóng góp hoa hồng</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-medium text-white">User***123</div>
                        <div className="text-sm text-gray-400">5 lần nâng cấp VIP</div>
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
                        <div className="text-sm text-gray-400">4 lần nâng cấp VIP</div>
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
                        <div className="text-sm text-gray-400">3 lần nâng cấp VIP</div>
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
                    <div className="text-blue-300 font-semibold mb-2">💡 Mẹo tăng thu nhập</div>
                    <div className="text-sm text-blue-200 mb-3">
                      Nâng cấp VIP để nhận 50% hoa hồng USDT thay vì 5%. Thu nhập sẽ tăng gấp 10 lần!
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => {
                        setShowCommissionModal(false)
                        setShowVipModal(true)
                      }}
                    >
                      Nâng cấp VIP ngay
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
                  Đóng
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
                Chi tiết phần thưởng Stake
              </CardTitle>
              <CardDescription className="text-gray-400">
                Thống kê chi tiết về phần thưởng IDS từ việc stake coin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Rewards Status */}
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Phần thưởng hiện tại</h3>
                  <Badge
                    variant="secondary"
                    className="bg-cyan-700 text-cyan-300 hover:bg-cyan-600 hover:text-cyan-200"
                  >
                    Đang tích lũy
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">12.34 IDS</div>
                    <div className="text-sm text-gray-400">Chờ nhận</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">850.00 IDS</div>
                    <div className="text-sm text-gray-400">Đang stake</div>
                  </div>
                </div>
              </div>

              {/* Rewards History */}
              <div>
                <h3 className="font-semibold text-white mb-3">Lịch sử phần thưởng</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">Hôm nay</div>
                      <div className="text-sm text-gray-400">Từ 850 IDS stake</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+2.45 IDS</div>
                      <div className="text-xs text-gray-500">~$2.45</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">7 ngày qua</div>
                      <div className="text-sm text-gray-400">Phần thưởng tích lũy</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+17.23 IDS</div>
                      <div className="text-xs text-gray-500">~$17.23</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">30 ngày qua</div>
                      <div className="text-sm text-gray-400">Phần thưởng tích lũy</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+73.89 IDS</div>
                      <div className="text-xs text-gray-500">~$73.89</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div>
                      <div className="font-medium text-white">Tổng cộng</div>
                      <div className="text-sm text-gray-400">Từ khi bắt đầu stake</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+127.45 IDS</div>
                      <div className="text-xs text-gray-500">~$127.45</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stake Positions */}
              <div>
                <h3 className="font-semibold text-white mb-3">Vị thế stake hiện tại</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-medium text-white">500 IDS</div>
                        <div className="text-sm text-gray-400">90 ngày - 8% APY</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+1.10 IDS/ngày</div>
                      <div className="text-xs text-gray-500">Còn 65 ngày</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <div>
                        <div className="font-medium text-white">350 IDS</div>
                        <div className="text-sm text-gray-400">30 ngày - 5% APY</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">+0.48 IDS/ngày</div>
                      <div className="text-xs text-gray-500">Còn 5 ngày</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Claim Information */}
              <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
                <div className="text-center">
                  <div className="text-blue-300 font-semibold mb-2">💡 Thông tin nhận thưởng</div>
                  <div className="text-sm text-blue-200 mb-3 space-y-1">
                    <div>• Phần thưởng được tích lũy hàng ngày</div>
                    <div>• Có thể nhận bất kỳ lúc nào</div>
                    <div>• Không có phí giao dịch khi nhận</div>
                    <div>• Phần thưởng sẽ được chuyển vào số dư khả dụng</div>
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
                  Nhận 12.34 IDS
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent"
                  onClick={() => setShowRewardsModal(false)}
                >
                  Đóng
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
                  <span className="text-white font-bold text-lg">IDS</span>
                </div>
                Intelligent Decentralized Solution
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Hệ sinh thái Nobody Chain - Bảo mật thông tin, Tự do Internet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Hero Section */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-700/50">
                <div className="text-4xl mb-4">🚀</div>
                <h2 className="text-2xl font-bold text-white mb-3">Nobody Chain Ecosystem</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Chúng tôi là đội ngũ lập trình viên tài năng đến từ khắp nơi trên thế giới, tập trung phát triển các
                  sản phẩm công nghệ blockchain tiên tiến nhằm bảo vệ quyền riêng tư và mang lại tự do cho môi trường
                  Internet.
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
                      <p className="text-blue-400 text-sm">Blockchain Explorer</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Trình khám phá blockchain hoàn chỉnh với đầy đủ thông tin về IDS và Nobody Chain.
                  </p>
                  <a
                    href="https://a-scan.nobody.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Khám phá ngay →
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
                      <p className="text-purple-400 text-sm">Decentralized Communication</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Hệ thống giao tiếp phi tập trung bảo mật cao, sản phẩm chủ lực đang hoạt động ổn định.
                  </p>
                  <a
                    href="https://chat.nobody.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    Trải nghiệm ngay →
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
                      <p className="text-cyan-400 text-sm">Crypto Wallet</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Ví tiền mã hóa an toàn, đã có mặt trên App Store và Google Play Store.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.walletair"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
                    >
                      📱 Android
                    </a>
                    <a
                      href="https://apps.apple.com/app/walletair/id123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
                    >
                      🍎 iOS
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
                      <p className="text-orange-400 text-sm">Investment Platform</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Platform đầu tư IDS coin với lợi suất hấp dẫn và hệ thống giới thiệu bạn bè.
                  </p>
                  <span className="inline-flex items-center text-orange-400 font-semibold">Đang sử dụng ✓</span>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600">
                <h3 className="text-xl font-bold text-white mb-4 text-center">🎯 Sứ mệnh của chúng tôi</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl mb-3">🛡️</div>
                    <h4 className="font-semibold text-white mb-2">Bảo mật thông tin</h4>
                    <p className="text-gray-300 text-sm">
                      Phát triển các giải pháp bảo vệ quyền riêng tư và dữ liệu cá nhân
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl mb-3">🌐</div>
                    <h4 className="font-semibold text-white mb-2">Tự do Internet</h4>
                    <p className="text-gray-300 text-sm">
                      Tạo ra môi trường Internet tự do, không bị kiểm duyệt và giám sát
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl mb-3">🚀</div>
                    <h4 className="font-semibold text-white mb-2">Đổi mới công nghệ</h4>
                    <p className="text-gray-300 text-sm">
                      Tiên phong trong việc ứng dụng blockchain và công nghệ phi tập trung
                    </p>
                  </div>
                </div>
              </div>

              {/* Investment Call */}
              <div className="p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-700/50 text-center">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-white mb-3">Đầu tư vào tương lai</h3>
                <p className="text-gray-300 text-lg mb-4">
                  Chúng tôi đang tiếp tục huy động vốn để phát triển thêm nhiều sản phẩm công nghệ tiên tiến khác phục
                  vụ cộng đồng toàn cầu.
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">50+</div>
                    <div className="text-sm text-gray-400">Developers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">4</div>
                    <div className="text-sm text-gray-400">Live Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">100K+</div>
                    <div className="text-sm text-gray-400">Users</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent px-8"
                  onClick={() => setShowInfoModal(false)}
                >
                  Đóng
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
