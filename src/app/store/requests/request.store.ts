import { baseUrl } from "@/app/config/baseUrl";
import { message } from "antd/lib";
import axios from "axios";
import { makeAutoObservable } from "mobx";

class StudentRequestStore {
  loading = false;
  requests = [];
  constructor() {
    makeAutoObservable(this);
  }

  async declineStudentRequest(groupClassRequestId: string, requestId: string) {
    try {
      this.loading = true;
      const authToken = localStorage.getItem("access_token_private");
      const response = await axios.post(
        `${baseUrl}group-classes/${groupClassRequestId}/enroll/${requestId}/decline`,
        null,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("Response:", response.data);
      message.success("request was declined");
    } catch (error: any) {
      console.error("Error:", error.message);
    } finally {
      this.loading = false;
    }
  }

  async acceptStudentRequest(groupClassRequestId: string, requestId: string) {
    try {
      this.loading = true;
      const authToken = localStorage.getItem("access_token_private");
      const response = await axios.post(
        `${baseUrl}group-classes/${groupClassRequestId}/enroll/${requestId}/accept`,
        null,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("Response:", response.data);
      message.success("Request was succesfully accepted");
    } catch (error: any) {
      console.error("Error:", error.message);
    } finally {
      this.loading = false;
    }
  }
  async getGroupClassesRequestsStudents() {
    try {
      this.loading = true;
      const authToken = localStorage.getItem("access_token_private");

      const response = await axios.get(
        `${baseUrl}group-classes/enroll-requests`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const allRequests = response.data.groupRequests;
      this.requests = allRequests;
      console.log("Response:", response.data);
      message.success("All requests from group classes  ");
    } catch (error: any) {
      console.error("Error:", error.message);
    } finally {
      this.loading = false;
    }
  }
}

export const studentRequestStore = new StudentRequestStore();
