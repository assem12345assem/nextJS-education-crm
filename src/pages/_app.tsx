import LayoutComponent from "@/shared/ui/layout/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import 'swiper/swiper-bundle.css';
// import 'antd/dist/antd.css'; unnessary imports
// import 'antd/dist/reset.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <LayoutComponent>
        <NextNProgress
          color="#069ef5"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />
        <Component {...pageProps} />
      </LayoutComponent>
    </>
  );
}
