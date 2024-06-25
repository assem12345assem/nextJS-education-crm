import { SignInResponseType, SignInType, SignUpType } from "./auth.interface";
import axios, { AxiosResponse } from "axios";
import { AUTH_SIGN_IN, AUTH_SIGN_UP } from "@/shared/consts/endpoints";

export class AuthService {
  static async signIn(
    payload: SignInType
  ): Promise<AxiosResponse<SignInResponseType>> {
    const { username, password } = payload;
    return axios.post(AUTH_SIGN_IN, { username, password });
  }
  static async signUp(
    payload: SignUpType
  ): Promise<AxiosResponse<SignInResponseType>> {
    const { username, password, role } = payload;
    return axios.post(AUTH_SIGN_UP, { username, password, role });
  }
}
