import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import "devextreme/dist/css/dx.light.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import type { AppProps } from "next/app";
import { locale, loadMessages } from "devextreme/localization";
import frMessages from "devextreme/localization/messages/fr.json";
import { RecoilRoot } from "recoil";
import Head from "next/head";
import { useEffect } from "react";
import { Container } from "../components/Container";

function ZoalApp({ Component, pageProps }: AppProps) {
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
      <Container Component={Component} {...pageProps} />
    </RecoilRoot>
  );
}

export default ZoalApp;
