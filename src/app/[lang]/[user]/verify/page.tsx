

import Verify from "@/views/Verify";
import { getTranslations } from "next-intl/server";


export const generateMetadata = async () => {
  const t = await getTranslations();

  return {
    title: t("title"),
  };
};

export default function VerifyPage() {
  return <Verify />
}