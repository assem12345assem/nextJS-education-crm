import { INews } from "../interfaces/news/news";

export type Main = {
  swiperImages: [string];
  mainInfo: {
    title: string;
    text: string;
  };
  classLinkSection: {
    title: string;
    image: string;
    link: string;
  };
  schoolSection: {
    title: string;
    image: string;
    text: string;
  };
  researchSection: {
    title: string;
    image: string;
    text: string;
  };
  newsSection: [INews];
  partnersSection: [string];
  contactQR: string;
  aboutUs: [
    {
      contactType: string;
      contactValue: string;
    }
  ];
  iconLinks: [
    {
      icon: string;
      link: string;
    }
  ];
  footerSection: [
    {
      text: string;
      link: string;
    }
  ];
};
