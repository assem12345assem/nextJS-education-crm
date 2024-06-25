import { Typography } from "antd/lib";
import React from "react";

type Props = {
    aboutUs: any;
};
const { Title } = Typography;

const AboutsUs : React.FC<Props> = ({ aboutUs }) => {
  return (
    <div>
      <Title>{aboutUs.title}</Title>
        <p>{aboutUs.text}</p>
    </div>
  );
};

export default AboutsUs;
