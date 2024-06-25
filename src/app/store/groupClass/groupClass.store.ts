import { makeAutoObservable } from "mobx";
import axios from "axios";
import { message } from "antd/lib";
import { baseUrl } from "@/app/config/baseUrl";

class GroupClassStore {
  loading = false;
  classes: any = [];
  enrollResponse: any | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async enroll(groupClassId: string) {
    try {
      this.loading = true;
      const token = localStorage.getItem("access_token_private");
      console.log(token);
      const response = await axios.post(
        `${baseUrl}group-classes/${groupClassId}/enroll`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      message.success(response.data.message || "Enrollment was successful");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message || "Bad request";
        message.error(errorMessage);
      } else {
        console.error("Error enrolling:", error);
        message.error("Error enrolling. Please try again.");
      }
    } finally {
      this.loading = false;
    }
  }

  async getClasses() {
    try {
      this.loading = true;
      const response = await axios.get(`${baseUrl}group-classes`);
      const classesList = response.data.groupClasses;
      this.classes = classesList;
    } catch (error) {
      console.error("Error fetching classes:", error);
      message.error("Error fetching classes. Please try again.");
    } finally {
      this.loading = false;
    }
  }
  async getRequests(groupClassId: string) {
    try {
      this.loading = true;
      const token = localStorage.getItem("access_token_private");
      const response = await axios.get(
        `${baseUrl}group-classes/${groupClassId}/enroll`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const requestList = response.data.groupRequests;
      this.enrollResponse = requestList;
      console.log(requestList);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message || "Bad request";
        message.error(errorMessage);
      } else {
        console.error("Error enrolling:", error);
        message.error("Error enrolling. Please try again.");
      }
    } finally {
      this.loading = false;
    }
  }
}

export const groupClassStore = new GroupClassStore();
