import React from "react";
import CommonSlider from "../../Certificates/Certificates/slider/SliderCertificate";

const Letters = () => {
  const letters = [
    "https://cdn-images.resumelab.com/pages/motivation_letter_rl_us_cta.jpg",
    "https://lh4.googleusercontent.com/U8-n0qwwcGraT1ShyFOEO2NI9mzGBnyaLMccMbWwUnzBuIqOooMM2p3nGWLxFqxzGrMCcNvdW1NvczEBRfTxfX5jcIe6uoCku5jHuiXpyjIG0O0_jeb2cB-4M-pR87VGxrKIoD2n=s1600",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJhO9P55scnqX2rYhF89y7e0Ox_LGBKewhCGrSb6CIFA&s",
  ];
  return (
    <div>
      <h1>Recommendation letters</h1>
      <CommonSlider certificates={letters} />
    </div>
  );
};

export default Letters;
