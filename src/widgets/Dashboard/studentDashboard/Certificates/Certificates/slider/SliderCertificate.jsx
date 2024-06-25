import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./certificate.scss";
import { Pagination, Navigation } from "swiper/modules";
import { Card } from "antd/lib";
import Title from "antd/lib/typography/Title";

const CommonSlider = ({ certificates }) => {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="mySwiper"
      style={{
        maxWidth: "1000px",
      }}
    >
      {certificates.map((certificate, index) => (
        <SwiperSlide key={index}>
          <img
            src={certificate.certificate}
            alt={`Slide ${index}`}
            style={{ width: "100%", objectFit: "contain" }}
          />
          <Card className="bottomBlock">
            <Title style={{ fontSize: "20px" }}>
              Mentor:
              {certificate.mentorName}
            </Title>{" "}
            <Title style={{ fontSize: "20px" }}>
              Course:
              {certificate.course}
            </Title>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CommonSlider;
