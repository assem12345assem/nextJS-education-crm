import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Layout from "@/shared/ui/layout/Layout";
import LayoutComponent from "@/shared/ui/layout/Layout";
import { CarouselComponent } from "@/widgets/MainPage/MainSlider/CarouselComponent";
import AboutsUs from "@/widgets/MainPage/AboutUs/AboutsUs";
import Container from "@/shared/ui/container/Container";
import { baseUrl } from "@/app/config/baseUrl";
import axios from "axios";
import { PartnersList } from "@/widgets/MainPage/PartnersList/PartnersList";

const inter = Inter({ subsets: ["latin"] });

const Home = ({main}:any)=> {
  return (
    <>
      <Head>
        <title>Chat Ivy</title>
        <meta name="description" content="Chat Ivy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <CarouselComponent swipers = {main.swiperImages}/>
          <Container>
            <AboutsUs aboutUs = {main.mainInfo}/>
          </Container>
            <PartnersList partners ={main.partnersSection}/>
        </div>
      </main>
    </>
  );
}
export default Home;


export const getServerSideProps = async () => {
    try {
        const res = await axios.get(`${baseUrl}main`);
        const main = res.data.mainContent
        return { props: { main } };
    } catch (e) {
        console.error("failed, e", e);
        return { props: { classes: [] } };
    }
};