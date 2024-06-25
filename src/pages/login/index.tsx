import Login from "@/widgets/LoginPage/LoginComponent/Login";
import React, { useEffect } from "react";
import { authStore } from "@/app/store/auth/auth.store";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (authStore.isAuth) {
      router.push("/dashboard");
    }
  }, [authStore.isAuth, router]);
  return (
    <div>
      <Login />
    </div>
  );
};

export default LoginPage;

