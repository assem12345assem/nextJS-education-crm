// ProfileStore.ts
import { makeAutoObservable } from "mobx";
import axios from "axios";
import { message } from "antd/lib";
import { baseUrl } from "@/app/config/baseUrl";

class ProfileStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async createProfile(values: any) {
    try {
      const response = await axios.post(`${baseUrl}my-profile`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("access_token_private")}`,
        },
      });

      console.log(response.data);
      message.success("Profile created successfully");
    } catch (error) {
      console.error("Error making POST request:", error);
      message.error("Error creating profile. Please try again.");
    }
  }
}

export const profileStore = new ProfileStore();
