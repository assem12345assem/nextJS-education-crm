import jwt from "jsonwebtoken";

interface UseTokenResult {
  saveToken: (token: string) => void;
  getToken: () => string | null;
  removeToken: () => void;
}
export const isRole = () => localStorage.getItem("user_role");

export const useToken = (): UseTokenResult => {
  const saveToken = (token: string) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("access_token_private", token);

      try {
        const decodedToken = jwt.decode(token) as { role?: string };
        if (decodedToken && decodedToken.role) {
          localStorage.setItem("user_role", decodedToken.role);
        }
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
  };

  const removeToken = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("access_token_private");
      localStorage.removeItem("user_role");
    }
  };

  const getToken = () => {
    if (typeof localStorage !== "undefined") {
      const token = localStorage.getItem("access_token_private");
      return token ? token : null;
    } else {
      return null;
    }
  };

  return {
    saveToken,
    getToken,
    removeToken,
  };
};
