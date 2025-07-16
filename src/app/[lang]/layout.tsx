import { UserWalletProvider, UserStatusProvider } from "@/commons/UserWalletContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { NotificationProvider } from "@/commons/NotificationContext";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <NotificationProvider>
          <UserWalletProvider>
            <UserStatusProvider>
              {children}
            </UserStatusProvider>
          </UserWalletProvider>
        </NotificationProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
