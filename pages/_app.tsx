import "../styles/globals.css";
import type { AppProps } from "next/app";
import { insertFixtures } from "../utils/insert-fixtures";

function MyApp({ Component, pageProps }: AppProps) {
  process.env.NODE_ENV !== "production" &&
    process.env.INSERT_FIXTURES === "true" &&
    insertFixtures();
  return <Component {...pageProps} />;
}

export default MyApp;
