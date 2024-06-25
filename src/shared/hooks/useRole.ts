import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

interface UseUserRoleResult {
  userRole: string | null;
}

const useUserRole = (): UseUserRoleResult => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const decodeToken = (token: string): any | null => {
      try {
        const decodedToken = jwt.decode(token);
        return decodedToken;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    };

    const token = localStorage.getItem("access_token_private");
    if (token) {
      const decodedToken = decodeToken(token);
      const role = decodedToken?.role || null;
      setUserRole(role);

      if (typeof localStorage !== "undefined") {
        localStorage.setItem("user_role", role || "");
      }
    } else {
      setUserRole(null);
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("user_role");
      }
    }
  }, []);

  return { userRole };
};

export default useUserRole;
