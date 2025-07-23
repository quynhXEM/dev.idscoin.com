import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InfoModalProps {
  t: (key: string) => string;
  show: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ t, show, onClose }) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={() => onClose()}
    >
      <Card
        className="w-full max-w-4xl mx-4 bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-white text-2xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">
                {t("header.ids")}
              </span>
            </div>
            {t("header.intelligentDecentralizedSolution")}
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            {t("header.nobodyChain")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Hero Section */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-700/50">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {t("header.nobodyChainEcosystem")}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t("header.teamDescription")}
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
                  <h3 className="text-xl font-bold text-white">
                    A-Scan Explorer
                  </h3>
                  <p className="text-blue-400 text-sm">
                    {t("products.aScanExplorer")}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {t("products.aScanExplorerDescription")}
              </p>
              <a
                href={`${process.env.NEXT_PUBLIC_SCAN_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
              >
                {t("products.exploreNow")} →
              </a>
            </div>

            {/* Chat System */}
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Nobody Connect</h3>
                  <p className="text-purple-400 text-sm">
                    {t("products.chatNetwork")}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {t("products.chatNetworkDescription")}
              </p>
              <a
                href={`${process.env.NEXT_PUBLIC_CHAT_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold"
              >
                {t("products.experienceNow")} →
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
                  <p className="text-cyan-400 text-sm">
                    {t("products.cryptoWallet")}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {t("products.cryptoWalletDescription")}
              </p>
              <div className="flex gap-3">
                <a
                  href={`${process.env.NEXT_PUBLIC_ANDROID_URL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
                >
                  {t("products.android")}
                </a>
                <a
                  href={`${process.env.NEXT_PUBLIC_IOS_URL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-semibold text-sm"
                >
                  {t("products.ios")}
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
                  <p className="text-orange-400 text-sm">
                    {t("products.investmentPlatform")}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {t("products.investmentPlatformDescription")}
              </p>
              <span className="inline-flex items-center text-orange-400 font-semibold">
                {t("products.using")}
              </span>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              {t("mission.mission")}
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-3">🛡️</div>
                <h4 className="font-semibold text-white mb-2">
                  {t("mission.privacyProtection")}
                </h4>
                <p className="text-gray-300 text-sm">
                  {t("mission.developPrivacySolutions")}
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">🌐</div>
                <h4 className="font-semibold text-white mb-2">
                  {t("mission.internetFreedom")}
                </h4>
                <p className="text-gray-300 text-sm">
                  {t("mission.createFreeInternet")}
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">🚀</div>
                <h4 className="font-semibold text-white mb-2">
                  {t("mission.innovation")}
                </h4>
                <p className="text-gray-300 text-sm">
                  {t("mission.leadingEdgeTechnology")}
                </p>
              </div>
            </div>
          </div>

          {/* Investment Call */}
          <div className="p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-700/50 text-center">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {t("investment.investInFuture")}
            </h3>
            <p className="text-gray-300 text-lg mb-4">
              {t("investment.ongoingFundraising")}
            </p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">50+</div>
                <div className="text-sm text-gray-400">
                  {t("investment.developers")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">4</div>
                <div className="text-sm text-gray-400">
                  {t("investment.liveProducts")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">100K+</div>
                <div className="text-sm text-gray-400">
                  {t("investment.users")}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-200 bg-transparent px-8 cursor-pointer"
              onClick={() => onClose()}
            >
              {t("referral.close")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoModal;
