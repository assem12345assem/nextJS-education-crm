import React from "react";
import SliderCertificate from "./slider/SliderCertificate";

const Certificates = () => {
  const certificates = [];

  const array = [
    {
      certificate:
        "https://marketplace.canva.com/EAFIEvneNCM/1/0/1600w/canva-golden-elegant-certificate-of-appreciation-0bN-aLORS9U.jpg",
      mentorName: "Lee San",
      course: "Psychology",
    },
    {
      certificate:
        "https://sertifier.com/blog/wp-content/uploads/2020/10/certificate-text-samples.jpg",
      mentorName: "Lee Chang",
      course: "Math",
    },
    {
      certificate:
        "https://m.media-amazon.com/images/I/81dTUagfByL._AC_UF1000,1000_QL80_.jpg",
      mentorName: "Lee San",
      course: "History",
    },
  ];

  return (
    <div>
      <h1>Certificates</h1>
      <SliderCertificate certificates={array} />
    </div>
  );
};

export default Certificates;
