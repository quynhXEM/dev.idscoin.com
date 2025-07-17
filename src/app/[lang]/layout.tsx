import { UserWalletProvider, UserStatusProvider } from "@/commons/UserWalletContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { NotificationProvider } from "@/commons/NotificationContext";
import { AppMetadataProvider } from "@/commons/AppMetadataContext";
import { fetchAppMetadata } from "@/libs/utils";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const metadata = await fetchAppMetadata();
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AppMetadataProvider initialMetadata={metadata}>
          <NotificationProvider>
            <UserWalletProvider>
              <UserStatusProvider>
                {children}
              </UserStatusProvider>
            </UserWalletProvider>
          </NotificationProvider>
        </AppMetadataProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
