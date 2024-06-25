import axios from "axios";
import {
  Card,
  Image,
  Tag,
  Descriptions,
  Avatar,
  Divider,
  Button,
  Spin,
} from "antd/lib";
import { baseUrl } from "@/app/config/baseUrl";
import CardCarosel from "@/widgets/CardsCarousel/CardCarosel";
import { authStore } from "@/app/store/auth/auth.store";
import Title from "antd/lib/typography/Title";
import { groupClassStore } from "@/app/store/groupClass/groupClass.store";

const GroupClassDetails = ({ groupClass }: any) => {
  const userRole = () => localStorage?.getItem("user_role") || "";
  const isAuth = authStore.isAuth;
  const { status, starting_date, finish_date, price, receipt, students, _id } =
    groupClass;

  return (
    <div style={{ padding: "20px", maxWidth: "1300px", margin: "0 auto" }}>
      {_id}
      <Card
        title={`${groupClass?.groupCourse.academicArea} - ${groupClass?.groupCourse.topic}`}
        extra={
          <Tag color={status === "not started" ? "default" : "green"}>
            {status}
          </Tag>
        }
      >
        <CardCarosel imgprops={groupClass.groupCourse.gallery} />
        <Divider />
        <Descriptions title="Course Details" bordered>
          <Descriptions.Item label="Starting Date">
            {starting_date}
          </Descriptions.Item>
          <Descriptions.Item label="Finish Date">
            {finish_date}
          </Descriptions.Item>
          <Descriptions.Item label="Price">${price}</Descriptions.Item>
          <Descriptions.Item label="Receipt">{receipt}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <h2>Students</h2>
        {students.map((student: any) => (
          <Card key={student._id} style={{ marginBottom: "16px" }}>
            <Card.Meta
              avatar={<Avatar src={student.profilePhoto} />}
              title={`${student.chineseName} (${student.englishName})`}
              description={
                <>
                  <p>
                    Email:{" "}
                    {
                      student.studentContacts.find(
                        (contact: any) => contact.contactType === "email"
                      )?.contactValue
                    }
                  </p>
                  <p>
                    Phone:{" "}
                    {
                      student.studentContacts.find(
                        (contact: any) => contact.contactType === "phone"
                      )?.contactValue
                    }
                  </p>
                  <Divider />
                  <p>
                    Parent Email:{" "}
                    {
                      student.parentContacts.find(
                        (contact: any) => contact.contactType === "email"
                      )?.contactValue
                    }
                  </p>
                  <p>
                    Parent Phone:{" "}
                    {
                      student.parentContacts.find(
                        (contact: any) => contact.contactType === "phone"
                      )?.contactValue
                    }
                  </p>
                  <Divider />
                  <p>
                    School Background:{" "}
                    {
                      student.background.find(
                        (bg: any) => bg.backgroundType === "school"
                      )?.backgroundValue
                    }
                  </p>
                  <p>
                    Interest Background:{" "}
                    {
                      student.background.find(
                        (bg: any) => bg.backgroundType === "interest"
                      )?.backgroundValue
                    }
                  </p>
                </>
              }
            />
          </Card>
        ))}
        {!isAuth && (
          <div>
            <Title>To enroll to group class you need to log in</Title>
          </div>
        )}
        {userRole() === "student" && (
          <>
            <Button
              type="primary"
              onClick={() => groupClassStore.enroll(groupClass._id)}
              loading={groupClassStore.loading}
            >
              Enroll
            </Button>
          </>
        )}
        <Spin spinning={groupClassStore.loading} />
      </Card>
    </div>
  );
};

export default GroupClassDetails;

export async function getServerSideProps(context: any) {
  const { id } = context.params;

  try {
    const response = await axios.get(`${baseUrl}/group-classes/${id}`);
    const groupClass = response.data.groupClass;
    return { props: { groupClass } };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { groupClass: null } };
  }
}
