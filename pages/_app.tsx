import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import "devextreme/dist/css/dx.light.css";
import type { AppProps } from "next/app";
import { insertFixtures } from "../utils/insert-fixtures";
import { Layout } from "../components/Layout";
import { locale, loadMessages } from "devextreme/localization";
import frMessages from "devextreme/localization/messages/fr.json";

function MyApp({ Component, pageProps }: AppProps) {
  process.env.NODE_ENV !== "production" &&
    process.env.INSERT_FIXTURES === "true" &&
    insertFixtures();
  loadMessages(frMessages);
  locale("fr-FR");
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
