import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AnnouncementBannerProps {
  t: (key: string) => string;
  onClick: () => void;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  t,
  onClick,
}) => {
  return (
    <div className="mb-8">
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
      `}</style>

      <Card
        className="p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 border-blue-500 cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="flex items-center justify-center">
            <div className="animate-bounce mr-3">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap">
              <div className="animate-marquee inline-block text-white font-bold text-lg">
                {t("announcement.discovery")}
              </div>
            </div>
            <div className="animate-bounce ml-3">
              <span className="text-2xl">💎</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementBanner;
