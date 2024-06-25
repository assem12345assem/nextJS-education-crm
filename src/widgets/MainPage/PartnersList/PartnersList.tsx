import React from 'react';
import styles from "./partnersList.module.scss";
import { Typography } from "antd/lib";

type Props = {
    partners: string[];
};
const { Title } = Typography;

export const PartnersList: React.FC<Props> = ({ partners }) => {
    return (

        <div>
            <Title>Our Partners</Title>
            <div className={styles.partners}>
                {partners.map((partner, index) => (
                    <img key={index} src={partner} alt="partner-img" />
                ))}
            </div>
        </div>
    );
};
