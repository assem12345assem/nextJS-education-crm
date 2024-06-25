import ForgotPassword from "@/widgets/LoginPage/LoginComponent/forgotPassword";
import React, { useEffect } from "react";
import { authStore } from "@/app/store/auth/auth.store";
import { useRouter } from "next/router";

const ForgotPage = () => {
    const router = useRouter();

    return (
        <div>
            <ForgotPassword />
        </div>
    );
};

export default ForgotPage;

