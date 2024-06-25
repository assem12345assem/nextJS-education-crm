import React from "react";
import { Button, Card, Image, Tag } from "antd/lib";

import styles from "./class.module.scss";
import Link from "next/link";
const GroupClassCard: React.FC<{ groupClass: any }> = ({ groupClass }) => {
  return (
    <Card className={styles.groupCard} bodyStyle={{ padding: 0 }}>
      <div className={styles.cardImageWrapper}>
        <Image src={groupClass.groupCourse.gallery[0]} preview={false} />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>
          {`${groupClass.groupCourse.academicArea} - ${groupClass.groupCourse.topic}`}
        </h3>
        <div className={styles.cardDetails}>
          <p>
            Status:{" "}
            <Tag color={groupClass.status === "Approved" ? "green" : "default"}>
              {groupClass.status}
            </Tag>
          </p>
          <p>Starting Date: {groupClass.starting_date}</p>
          <p>Finish Date: {groupClass.finish_date}</p>
          {/* <p>Students: {groupClass?.students[0]}</p> */}
          <p>Price: ${groupClass.price}</p>
          <p>Receipt: {groupClass.receipt}</p>
        </div>
        <Link href={`/group-classes/${groupClass._id}`}>
          <Button>Go to Group Class Page</Button>
        </Link>
      </div>
    </Card>
  );
};

export default GroupClassCard;
