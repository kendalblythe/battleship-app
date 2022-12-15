import "sanitize.css";
import "sanitize.css/forms.css";
import "sanitize.css/typography.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
