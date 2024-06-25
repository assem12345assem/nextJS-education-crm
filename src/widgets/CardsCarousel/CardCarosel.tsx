import React from "react";
import { Carousel, Image } from "antd/lib";
import styles from "./cardCarousel.module.scss";

interface CourseCardProps {
  img: string;
}

interface CourseCard {
  imgprops: any;
}

const CardCarousel: React.FC<CourseCard> = ({ imgprops }) => {
  return (
    <Carousel autoplay autoplaySpeed={2500} className={styles.wrapper}>
      {imgprops?.map((image: any, index: any) => (
        <div key={index} className={styles.cardImage}>
          <Image
            src={image.img}
            style={{ height: "300px", width: "100%" }}
            className={styles.image}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default CardCarousel;
