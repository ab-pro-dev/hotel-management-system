import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import GuestHeader from "@/components/guest-header";
import RouteProgress from "@/components/route-progress";
import "nprogress/nprogress.css";

export default async function GuestLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(["en", "am"], locale)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <RouteProgress />
      <GuestHeader />
      <main>{children}</main>
    </NextIntlClientProvider>
  );
}
