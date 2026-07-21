import LoadingScreen from "@/components/common/LoadingScreen";
import useAuth from "@/hooks/useAuth";
import React from "react";
import { useNavigate } from "react-router";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const { status } = useAuth();

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status == "unauthenticated") {
    navigate("/login");
  }

  return children;
};

export default AuthGuard;
