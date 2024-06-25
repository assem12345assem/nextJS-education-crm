import React from "react";
import {Carousel, Image} from "antd/lib";
import styles from "./carouselComponent.module.scss";

type Props = {
    swipers: string[];
};

export const CarouselComponent: React.FC<Props> = ({swipers}) => {
    return (
        <Carousel autoplay autoplaySpeed={2500} className={styles.centeredCarousel}>
                {
                    swipers.map((swiper, index) => (
                        <div>
                            <Image
                                key={index} src={swiper}
                                style={{height: "400px", width: "100vw", objectFit: "contain"}}
                                className={styles.carouselImage}
                                alt="carousel-img"
                            />
                        </div>
                    ))
                }

        </Carousel>
    );
};
