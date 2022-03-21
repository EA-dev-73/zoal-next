import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import { insertFixtures } from "../utils/insert-fixtures";
import { Layout } from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  process.env.NODE_ENV !== "production" &&
    process.env.INSERT_FIXTURES === "true" &&
    insertFixtures();
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
