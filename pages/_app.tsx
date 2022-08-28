import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import "devextreme/dist/css/dx.light.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import type { AppProps } from "next/app";
import { locale, loadMessages } from "devextreme/localization";
import frMessages from "devextreme/localization/messages/fr.json";
import { RecoilRoot } from "recoil";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function ZoalApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap"!);
  }, []);

  //dx en francais
  loadMessages(frMessages);
  locale("fr-FR");

  return (
    <RecoilRoot>
      <Head>
        <title>Zoal - Boutique en ligne</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Container Component={Component} {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default ZoalApp;
