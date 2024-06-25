import { makeAutoObservable } from "mobx";
import axios from "axios";
import { message } from "antd/lib";
import { baseUrl } from "@/app/config/baseUrl";

class IndividualClass {
  loading = false;
  individualRequests: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async accept(individualClassId: string) {
    try {
      this.loading = true;
      const token = localStorage.getItem("access_token_private");
      console.log(token);
      const response = await axios.post(
        `${baseUrl}individual-classes/enroll/${individualClassId}/accept`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      message.success(
        response.data.message || "Accept on individual request was successful"
      );
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
  async decline(individualClassId: string) {
    try {
      this.loading = true;
      const token = localStorage.getItem("access_token_private");
      console.log(token);
      const response = await axios.post(
        `${baseUrl}individual-classes/enroll/${individualClassId}/decline`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      message.success(
        response.data.message || "Accept on individual request was successful"
      );
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
  async createRequestIndividualClass(values: any) {
    try {
      const token = localStorage.getItem("access_token_private");
      const response = await axios.post(
        `${baseUrl}individual-classes/enroll`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      message.success('Individual Class request was created! ')
    } catch (error) {
      console.error("Error fetching classes:", error);
      message.error("Error fetching classes. Please try again.");
    }
  }
  // async getSentRequestsForIndividualClass() {
  //   try {
  //     this.loading = true; // Set loading to true before making the request
  //     const response = await axios.get(`${baseUrl}individual-classes/enroll`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `${localStorage.getItem("access_token_private")}`,
  //       },
  //     });
  //     this.individualRequests = response.data.individualRequests; // Assign response directly to individualRequests
  //     console.log("ura");
  //   } catch (error) {
  //     console.error("Error fetching individual requests:", error);
  //     message.error("Error fetching individual requests. Please try again.");
  //   } finally {
  //     this.loading = false; // Set loading to false after the request completes (whether it succeeded or failed)
  //   }
  // }
}

export const individualClassStore = new IndividualClass();
