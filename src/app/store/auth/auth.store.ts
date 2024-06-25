import { makeAutoObservable } from "mobx";
import { isRole, useToken } from "@/shared/hooks/useToken";
import { SignInType, SignUpType } from "./auth.interface";
import { AuthService } from "./auth.service";
const { saveToken, getToken, removeToken } = useToken();

class AuthStore {
  isAuth = !!getToken();
  authService = new AuthService();
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsAuth() {
    this.isAuth = !!getToken();
  }

  signIn = async (payload: SignInType) => {
    try {
      this.loading = true;
      const { data } = await AuthService.signIn(payload);
      saveToken(data.token);
      this.setIsAuth();
      console.log(isRole());
    } catch (err) {
      throw new Error(err as string);
    } finally {
      this.loading = false;
    }
  };
  signUp = async (payload: SignUpType) => {
    try {
      this.loading = true;
      const { data } = await AuthService.signUp(payload);
      saveToken(data.token);
      this.setIsAuth();
    } catch (err) {
      throw new Error(err as string);
    } finally {
      this.loading = false;
    }
  };
  signOut = () => {
    removeToken();
    this.setIsAuth();
  };
}

export const authStore = new AuthStore();
