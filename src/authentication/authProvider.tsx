import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ReactNode } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const email = useSelector(
    (state: { user: { email: string } }) => state.user?.email
  );
  //FIX AUTH
  // useEffect(() => {
  //   if (!email) {
  //     navigate("/Login");
  //   }
  // }, [email, navigate]);

  return <>{children}</>;
};

export default AuthProvider;
