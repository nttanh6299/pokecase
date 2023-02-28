import { AppProps } from "next/app";
import { NextPage } from "next";
import { Session } from "next-auth";
import Head from "next/head";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/contexts/AuthProvider";

type CustomNextPage = NextPage & {
  independent?: boolean;
};

type CustomAppProps = AppProps<{
  session: Session;
}> & {
  Component: CustomNextPage;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  return (
    <>
      <Head>
        <title>Pokecase</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SessionProvider
        session={session}
        refetchInterval={5 * 60}
        refetchOnWindowFocus={false}
      >
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </SessionProvider>
    </>
  );
}
