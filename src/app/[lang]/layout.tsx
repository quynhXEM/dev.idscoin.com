import { UserWalletProvider } from "@/commons/UserWalletContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";

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
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <UserWalletProvider>
        {children}
        </UserWalletProvider>
        
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
